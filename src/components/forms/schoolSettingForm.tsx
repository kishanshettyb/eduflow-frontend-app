import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useCreateSchoolSetting,
  useUpdateSchoolSetting
} from '@/services/mutation/configeration/configeration';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import FileUpload from '../uploadFiles/uploadFiles';
import { Modal } from '../modals/modal';
import { UploadIcon } from '@radix-ui/react-icons';
import { useGetSchoolSetting } from '@/services/queries/superadmin/schools';
import { useViewAttachment } from '@/services/queries/attachment/attachment';
import { toast } from '../ui/use-toast';

const formSchema = z.object({
  webUrl: z.string().url({
    message: 'Must be a valid URL'
  }),
  loginAttempt: z.string().refine((val) => !isNaN(parseInt(val, 10)), {
    message: 'Login attempt must be a number'
  }),
  language: z.string(),
  theme: z.string()
});

const ViewAttachmentComponent = ({ schoolId, attachmentId, attachmentName }) => {
  const { data: attachmentUrl, isLoading, isSuccess } = useViewAttachment(schoolId, attachmentId);

  return isLoading ? (
    <div>Loading...</div>
  ) : isSuccess ? (
    <img src={attachmentUrl} alt={attachmentName} className="h-20 w-20 object-cover" />
  ) : (
    <div>No File</div>
  );
};

function SchoolSettingForm() {
  const createSchoolSettingMutation = useCreateSchoolSetting();
  const updateSchoolSettingMutation = useUpdateSchoolSetting();
  const { schoolId } = useSchoolContext();
  const { data: schoolSettings } = useGetSchoolSetting(schoolId);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      webUrl: '',
      loginAttempt: '3',
      language: 'English',
      theme: 'light'
    }
  });

  useEffect(() => {
    if (schoolSettings) {
      form.reset({
        webUrl: schoolSettings.data?.schoolSettingDto?.webUrl,
        loginAttempt: schoolSettings.data?.schoolSettingDto?.loginAttempt.toString(),
        language: schoolSettings.data?.schoolSettingDto?.language,
        theme: schoolSettings.data?.schoolSettingDto?.theme
      });
    }
  }, [schoolSettings, form]);

  const [banner, setBanner] = useState<File | null>(null);
  const [logo, setLogo] = useState<File | null>(null);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // State for edit mode

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    const schoolSetting = {
      schoolId: schoolId,
      webUrl: values.webUrl,
      loginAttempt: values.loginAttempt,
      authentication: true,
      language: values.language,
      theme: values.theme,
      ...(schoolSettings?.data?.schoolSettingDto?.schoolSettingId && {
        schoolSettingId: schoolSettings.data?.schoolSettingDto.schoolSettingId
      })
    };

    formData.append(
      'schoolSettingDto',
      new Blob([JSON.stringify(schoolSetting)], {
        type: 'application/json'
      })
    );

    if (banner) {
      formData.append('banner', banner);
    }

    if (logo) {
      formData.append('logo', logo);
    }

    if (schoolSettings?.data?.schoolSettingDto?.schoolSettingId) {
      updateSchoolSettingMutation.mutate(formData, {
        onSuccess: () => {
          toast({
            variant: 'default',
            title: 'School Setting updated successfully'
          });
          setIsEditing(false); // Disable edit mode after successful update
        },
        onError: (error) => {
          toast({
            variant: 'destructive',
            title: 'Failed to update school setting',
            description: error.response?.data?.message || 'An error occurred'
          });
        }
      });
    } else {
      createSchoolSettingMutation.mutate(formData, {
        onSuccess: () => {
          toast({
            variant: 'default',
            title: 'School Setting added successfully'
          });
          setIsEditing(false); // Disable edit mode after successful creation
        },
        onError: (error) => {
          toast({
            variant: 'destructive',
            title: 'Failed to add school setting',
            description: error.response?.data?.message || 'An error occurred'
          });
        }
      });
    }
  };

  const handleBannerUpload = (file: File) => {
    setBanner(file);
    setIsBannerModalOpen(false);
  };

  const handleLogoUpload = (file: File) => {
    setLogo(file);
    setIsLogoModalOpen(false);
  };

  const hasSchoolSettingId = !!schoolSettings?.data?.schoolSettingDto?.schoolSettingId;

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mb-5 flex flex-row gap-4">
            <div className="flex items-center gap-4">
              {hasSchoolSettingId && (
                <>
                  {!isEditing && (
                    <Button variant="outline" type="button" onClick={() => setIsEditing(true)}>
                      Edit
                    </Button>
                  )}
                  {isEditing && (
                    <Button variant="outline" type="button" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  )}
                </>
              )}
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsBannerModalOpen(true)}
                disabled={hasSchoolSettingId && !isEditing}
              >
                <UploadIcon className="w-6 h-6 mr-2" /> Upload Banner
              </Button>
              {banner ? (
                <img
                  src={URL.createObjectURL(banner)}
                  alt="Banner Preview"
                  className="h-20 w-20 object-cover"
                />
              ) : schoolSettings?.data?.schoolSettingDto?.banner?.attachmentId ? (
                <ViewAttachmentComponent
                  schoolId={schoolId}
                  attachmentId={schoolSettings.data.schoolSettingDto.banner.attachmentId}
                  attachmentName={schoolSettings.data.schoolSettingDto.banner.attachmentName}
                />
              ) : (
                <div>No File</div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsLogoModalOpen(true)}
                disabled={hasSchoolSettingId && !isEditing}
              >
                <UploadIcon className="w-6 h-6 mr-2" /> Upload Logo
              </Button>
              {logo ? (
                <img
                  src={URL.createObjectURL(logo)}
                  alt="Logo Preview"
                  className="h-20 w-20 object-cover"
                />
              ) : schoolSettings?.data?.schoolSettingDto?.logo?.attachmentId ? (
                <ViewAttachmentComponent
                  schoolId={schoolId}
                  attachmentId={schoolSettings.data.schoolSettingDto.logo.attachmentId}
                  attachmentName={schoolSettings.data.schoolSettingDto.logo.attachmentName}
                />
              ) : (
                <div>No File</div>
              )}
            </div>
          </div>
          <div className="mb-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1 md:col-span-3">
              <FormField
                control={form.control}
                name="webUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Web URL<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Web URL"
                        {...field}
                        disabled={hasSchoolSettingId && !isEditing}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="loginAttempt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Login Attempt<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Login Attempt"
                        {...field}
                        disabled={hasSchoolSettingId && !isEditing}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Language<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={hasSchoolSettingId && !isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Hindi">Hindi</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="theme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Theme<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={hasSchoolSettingId && !isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex items-center justify-end space-x-2">
            {isEditing || !schoolSettings?.data?.schoolSettingDto?.schoolSettingId ? (
              <Button type="submit">Save</Button>
            ) : null}
          </div>
        </form>
      </Form>

      <Modal
        title="Upload Banner"
        description="Upload your banner image here."
        modalSize="medium"
        open={isBannerModalOpen}
        onOpenChange={setIsBannerModalOpen}
      >
        <FileUpload
          onFileSelected={handleBannerUpload}
          initialFileUrl={null}
          title="Banner Image"
          description="Please upload an image file for the banner."
        />
      </Modal>

      <Modal
        title="Upload Logo"
        description="Upload your logo image here."
        modalSize="medium"
        open={isLogoModalOpen}
        onOpenChange={setIsLogoModalOpen}
      >
        <FileUpload
          onFileSelected={handleLogoUpload}
          initialFileUrl={null}
          title="Logo Image"
          description="Please upload an image file for the logo."
        />
      </Modal>
    </>
  );
}

export default SchoolSettingForm;

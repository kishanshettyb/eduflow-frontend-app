'use client';

import { useState, useEffect } from 'react';
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
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { announcementSchema } from './schema/announcementSchema';
import { Textarea } from '../ui/textarea';
import {
  useCreateAnnouncement,
  useUpdateAnnouncement
} from '@/services/mutation/admin/announcement';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useGetAnnouncementbyID } from '@/services/queries/admin/announcement';
import { useGetAllStandard } from '@/services/queries/admin/standard';
import ReactSelect from 'react-select';
import { ReloadIcon } from '@radix-ui/react-icons';
import GeneralFileUpload from '../uploadFiles/generalUploadFiles';

const formSchema = announcementSchema;

type CreateAnnouncementFormProps = {
  announcementId?: number | null;
  onClose: () => void;
};

export const CreateAnnouncementForm: React.FC<CreateAnnouncementFormProps> = ({
  announcementId,
  onClose
}) => {
  const { schoolId, academicYearId } = useSchoolContext();
  const { data: standards } = useGetAllStandard(schoolId, academicYearId);
  const createAnnouncementMutation = useCreateAnnouncement();
  const updateAnnouncementMutation = useUpdateAnnouncement();
  const { data: announcementData, error: singleannouncementError } = useGetAnnouncementbyID(
    schoolId,
    announcementId
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      announcementTitle: '',
      description: '',
      targetType: '',
      standardIds: []
    }
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [initialStandardIds, setInitialStandardIds] = useState<string[]>([]);

  const targetType = form.watch('targetType');

  useEffect(() => {
    if (announcementData) {
      const initialIds = announcementData?.data.standardIds || [];
      setInitialStandardIds(initialIds.map((id) => id.toString()));
      form.reset({
        announcementTitle: announcementData.data.announcementTitle,
        description: announcementData.data.description,
        targetType: announcementData.data.targetType,
        standardIds: initialIds.map((id) => id.toString())
      });
    }
  }, [announcementData, form]);

  useEffect(() => {
    if (targetType !== 'STUDENT') {
      form.setValue('standardIds', []);
    }
  }, [targetType, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    const currentStandardIds = values.standardIds;
    const deleteStandardIdFromMapping = initialStandardIds.filter(
      (id) => !currentStandardIds.includes(id)
    );

    const announcement = {
      announcementId: announcementId,
      schoolId: schoolId,
      academicYearId: academicYearId,
      announcementTitle: values.announcementTitle,
      description: values.description,
      targetType: values.targetType,
      standardIds: currentStandardIds,
      deleteStandardIdFromMapping: deleteStandardIdFromMapping,
      announcementStatus: 'ADDED',
      academicYearDto: { academicYearId: academicYearId }
    };

    formData.append(
      'announcementDto',
      new Blob([JSON.stringify(announcement)], {
        type: 'application/json'
      })
    );

    if (selectedFile) {
      formData.append('file', selectedFile);
    }

    const mutation =
      announcementId && !singleannouncementError
        ? updateAnnouncementMutation
        : createAnnouncementMutation;

    mutation.mutate(formData, {
      onSuccess: () => {
        onClose(); // Close the dialog on success
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col md:flex-row gap-5 mb-10">
          <div className="basis-2/5">
            <FormField
              control={form.control}
              name="file"
              render={() => (
                <FormItem>
                  <FormLabel>Upload File</FormLabel>
                  <GeneralFileUpload
                    onFileSelected={(file) => setSelectedFile(file)}
                    initialFileUrl={selectedFile ? URL.createObjectURL(selectedFile) : undefined}
                    title=""
                    description=""
                  />
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>
          <div className="rounded-2xl basis-3/5 bg-white dark:bg-slate-900 p-5 border shadow-3xl">
            <div className="md:col-span-3">
              <FormField
                className="w-full"
                control={form.control}
                name="announcementTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Announcement Title<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Announcement Title" {...field} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <div className="md:col-span-3">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Description <span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea placeholder="Description" {...field} rows={3} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="targetType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      User Type<span className="text-red-600">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="STUDENT">Student</SelectItem>
                        <SelectItem value="GENERAL">General</SelectItem>
                        <SelectItem value="STAFF">Staff</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
            {targetType === 'STUDENT' && (
              <div>
                <FormField
                  control={form.control}
                  name="standardIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Standard</FormLabel>
                      <ReactSelect
                        options={
                          standards?.data?.length
                            ? standards.data.map((item) => ({
                                value: item.standardId?.toString(),
                                label: item.title
                              }))
                            : [{ value: '', label: 'No standard available' }]
                        }
                        isMulti
                        onChange={(selectedOptions) => {
                          field.onChange(selectedOptions.map((option) => option.value));
                        }}
                        value={field.value.map((value) => ({
                          value,
                          label:
                            standards?.data?.find(
                              (standard) => standard.standardId?.toString() === value
                            )?.title || value
                        }))}
                        isDisabled={!standards?.data?.length}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end space-x-2">
          <Button type="submit">
            {(createAnnouncementMutation.isPending || updateAnnouncementMutation.isPending) && (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Please wait...
              </>
            )}
            {!createAnnouncementMutation.isPending &&
              !updateAnnouncementMutation.isPending &&
              (announcementId && !singleannouncementError ? 'Update' : 'Save')}
          </Button>
        </div>
      </form>
    </Form>
  );
};

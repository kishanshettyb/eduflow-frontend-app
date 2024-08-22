'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import 'react-day-picker/dist/style.css';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/ui/input';
import { useSchoolContext } from '@/lib/provider/schoolContext';

import { DataTable } from '@/components/dataTable/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '../ui/checkbox';
import { AlertDialog } from '../alertdialogue/alert';
import { TrashIcon } from '@radix-ui/react-icons';
import { useViewAttachment } from '@/services/queries/attachment/attachment';
import { workExperienceSchema } from './schema/staffSchema';
import {
  useCreateWorkExperience,
  useDeleteWorkExperience,
  useUpdateWorkExperience
} from '@/services/mutation/superadmin/admin';
import { useGetSingleWorkExperience } from '@/services/queries/superadmin/admins';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const formSchema = workExperienceSchema;

function WorkExperienceForm({ staffId }) {
  const { schoolId } = useSchoolContext();
  const [, setWorkingYears] = useState<string | null>(null);
  const updateWorkExperienceMutation = useUpdateWorkExperience();
  const createWorkExperienceMutation = useCreateWorkExperience();
  const [selectedWorkExperienceId, setSelectedWorkExperienceId] = useState(null);
  const { data: singleWorkExperienceData } = useGetSingleWorkExperience(schoolId, staffId);
  const deleteWorkExperienceMutation = useDeleteWorkExperience();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState(null);
  const [deletedAttachments, setDeletedAttachments] = useState([]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: '',
      positions: '',
      workingYears: '',
      responsibilities: '',
      joiningDate: new Date(),
      leavingDate: new Date(),
      files: null
    }
  });

  useEffect(() => {
    if (selectedWorkExperienceId) {
      const selectedWorkExperience = singleWorkExperienceData.data.find(
        (doc) => doc.workExperienceId === selectedWorkExperienceId
      );
      if (selectedWorkExperience) {
        form.setValue('companyName', selectedWorkExperience.companyName);
        form.setValue('positions', selectedWorkExperience.positions);
        form.setValue('workingYears', selectedWorkExperience.workingYears);
        form.setValue('responsibilities', selectedWorkExperience.responsibilities);
        form.setValue('joiningDate', new Date(selectedWorkExperience.joiningDate) || new Date());
        form.setValue('leavingDate', new Date(selectedWorkExperience.leavingDate) || new Date());
        setFiles(selectedWorkExperience.attachmentSet);
      }
    }
  }, [selectedWorkExperienceId, form, singleWorkExperienceData]);
  function onFileInputChange(event) {
    const newFiles = event.target.files;
    form.setValue('files', newFiles);
  }
  const handleDelete = () => {
    if (selectedWorkExperienceId) {
      deleteWorkExperienceMutation.mutate({
        schoolId: schoolId,
        staffId: staffId,
        workExperienceId: selectedWorkExperienceId
      });
      setSelectedWorkExperienceId(null);
    }
  };

  const handleRemoveFile = (attachmentId) => {
    setDeletedAttachments((prev) => [...prev, attachmentId]);
    setFiles((prev) => prev.filter((file) => file.attachmentId !== attachmentId));
  };

  const ViewAttachmentComponent = ({ schoolId, attachmentId, attachmentName }) => {
    const attachmentData = useViewAttachment(schoolId, attachmentId);

    return attachmentData.isLoading ? (
      <div>Loading...</div>
    ) : attachmentData.isSuccess ? (
      <div className="flex items-center space-x-2">
        <a
          className="text-blue-500 hover:text-blue-700"
          href={attachmentData.data}
          target="_blank"
          rel="noopener noreferrer"
        >
          {attachmentName}
        </a>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0"
          onClick={() => handleRemoveFile(attachmentId)}
        >
          <TrashIcon className="h-4 w-4 text-red-600" />
        </Button>
      </div>
    ) : (
      <div>No File</div>
    );
  };
  const calculateWorkingYears = (joiningDate: Date, leavingDate: Date) => {
    const diffTime = Math.abs(leavingDate.getTime() - joiningDate.getTime());
    const diffYears = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365));
    return diffYears;
  };

  useEffect(() => {
    const { joiningDate, leavingDate } = form.getValues();
    if (joiningDate && leavingDate) {
      const years = calculateWorkingYears(new Date(joiningDate), new Date(leavingDate));
      setWorkingYears(`${years} ${years > 1 ? 'years' : 'year'}`);
      form.setValue('workingYears', years.toString());
    } else {
      setWorkingYears(null);
      form.setValue('workingYears', '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch('joiningDate'), form.watch('leavingDate')]);

  function onSubmit(values) {
    setLoading(true);
    const formData = new FormData();
    const workExperience = {
      schoolId: schoolId,
      staffId: staffId,
      companyName: values.companyName,
      positions: values.positions,
      workingYears: values.workingYears,
      responsibilities: values.responsibilities,
      joiningDate: values.joiningDate.toISOString().substr(0, 10),
      leavingDate: values.leavingDate.toISOString().substr(0, 10),
      deleteAttachmentIds: deletedAttachments
    };

    if (selectedWorkExperienceId) {
      workExperience.workExperienceId = selectedWorkExperienceId;
    }
    formData.append(
      'workExperienceDto',
      new Blob([JSON.stringify(workExperience)], {
        type: 'application/json'
      })
    );

    if (values.files) {
      for (let i = 0; i < values.files.length; i++) {
        formData.append('workExperienceFiles', values.files[i]);
      }
    }

    const handleSuccessOrError = () => {
      setLoading(false);
      setSelectedWorkExperienceId(null);
      setDeletedAttachments([]);
      setFiles(null);
    };

    if (selectedWorkExperienceId) {
      updateWorkExperienceMutation.mutate(formData, {
        onSuccess: handleSuccessOrError,
        onError: handleSuccessOrError
      });
    } else {
      createWorkExperienceMutation.mutate(formData, {
        onSuccess: handleSuccessOrError,
        onError: handleSuccessOrError
      });
    }

    form.reset({
      companyName: '',
      positions: '',
      workingYears: '',
      responsibilities: '',
      joiningDate: new Date(),
      leavingDate: new Date(),
      files: null
    });
    resetFileInput();
  }
  const resetFileInput = () => {
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const ViewAttachment = ({ schoolId, attachmentId, attachmentName }) => {
    const attachmentData = useViewAttachment(schoolId, attachmentId);

    return attachmentData.isLoading ? (
      <div>Loading...</div>
    ) : attachmentData.isSuccess ? (
      <a
        className="text-blue-500 hover:text-blue-700"
        href={attachmentData.data}
        target="_blank"
        rel="noopener noreferrer"
      >
        {attachmentName}
      </a>
    ) : (
      <div>No File</div>
    );
  };

  const columns: ColumnDef<[]>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
            if (value) {
              setSelectedWorkExperienceId(row.original.workExperienceId);
            } else {
              setSelectedWorkExperienceId(null);
              form.reset({
                companyName: '',
                positions: '',
                workingYears: '',
                responsibilities: '',
                joiningDate: new Date(),
                leavingDate: new Date(),
                files: null
              });
            }
          }}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: 'companyName',
      header: 'Company Name',
      cell: ({ row }) => <div>{row.getValue('companyName')}</div>,
      enableSorting: true
    },
    {
      accessorKey: 'positions',
      header: 'Positions',
      cell: ({ row }) => <div>{row.getValue('positions')}</div>,
      enableSorting: true
    },
    {
      accessorKey: 'joiningDate',
      header: 'Joining Date',
      cell: ({ row }) => <div>{format(new Date(row.getValue('joiningDate')), 'PPP')}</div>,
      enableSorting: true
    },
    {
      accessorKey: 'leavingDate',
      header: 'Leaving Date',
      cell: ({ row }) => <div>{format(new Date(row.getValue('leavingDate')), 'PPP')}</div>,
      enableSorting: true
    },
    {
      accessorKey: 'attachments',
      header: 'Attachments',
      cell: ({ row }) => (
        <div>
          {row.original.attachmentSet.map((attachment, index) => (
            <div key={index}>
              <ViewAttachment
                schoolId={schoolId}
                attachmentId={attachment.attachmentId}
                attachmentName={attachment.attachmentName}
              />
            </div>
          ))}
        </div>
      ),
      enableSorting: false
    },
    {
      accessorKey: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const workExperience = row.original;
        return (
          <div className="flex items-center space-x-2">
            <AlertDialog
              title="Confirm Deletion"
              description="Are you sure you want to delete this File? This action cannot be undone."
              triggerButtonText=""
              confirmButtonText="Delete"
              cancelButtonText="Cancel"
              onConfirm={handleDelete}
            >
              <Button
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={() => setSelectedWorkExperienceId(workExperience.workExperienceId)}
              >
                <span className="sr-only">Delete</span>
                <TrashIcon className="h-4 w-4" />
              </Button>
            </AlertDialog>
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="mb-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Company Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="positions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input placeholder="Position" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="responsibilities"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsibilities</FormLabel>
                    <FormControl>
                      <Input placeholder="Responsibilities" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="joiningDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Joining Date<span className="text-red-600">*</span>
                    </FormLabel>
                    <Popover className="w-[400px]">
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          captionLayout="dropdown-buttons"
                          fromYear={2000}
                          toYear={2024}
                          disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-xs text-red-600" />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="leavingDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Leaving Date<span className="text-red-600">*</span>
                    </FormLabel>
                    <Popover className="w-[400px]">
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          captionLayout="dropdown-buttons"
                          fromYear={2000}
                          toYear={2024}
                          disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-xs text-red-600" />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="workingYears"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Working Years <span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder=" Working Years " {...field} disabled={!!staffId} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <FormItem>
            <FormLabel>File Upload</FormLabel>
            <FormControl>
              <Input type="file" onChange={onFileInputChange} multiple />
            </FormControl>
            <FormMessage />
            <div className="text-sm text-gray-500 mt-1">
              Allowed file types: DOC, DOCX, JPG, JPEG, PNG
            </div>
          </FormItem>
          {selectedWorkExperienceId && files && (
            <div>
              <FormLabel>Existing Attachments:</FormLabel>
              {files.map((file) => (
                <ViewAttachmentComponent
                  key={file.attachmentId}
                  schoolId={schoolId}
                  attachmentId={file.attachmentId}
                  attachmentName={file.attachmentName}
                />
              ))}
            </div>
          )}
          <div className="flex items-center justify-end space-x-2">
            <Button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : selectedWorkExperienceId ? 'Update' : 'Add'}
            </Button>
          </div>
        </form>
      </Form>
      <div>
        <h2 className="text-xl font-bold mb-4">Uploaded WorkExperiences</h2>
        {singleWorkExperienceData?.data && (
          <DataTable
            columns={columns}
            data={singleWorkExperienceData.data}
            selectionMode="single"
          />
        )}
      </div>
    </div>
  );
}

export default WorkExperienceForm;

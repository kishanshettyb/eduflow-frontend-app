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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { DataTable } from '@/components/dataTable/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '../ui/checkbox';
import { AlertDialog } from '../alertdialogue/alert';
import { TrashIcon } from '@radix-ui/react-icons';
import { useViewAttachment } from '@/services/queries/attachment/attachment';
import { qualificationSchema } from './schema/staffSchema';
import {
  useCreateQualification,
  useDeleteQualification,
  useUpdateQualification
} from '@/services/mutation/superadmin/admin';
import { useGetSingleQualification } from '@/services/queries/superadmin/admins';

const formSchema = qualificationSchema;

function QualificationForm({ staffId }) {
  const { schoolId } = useSchoolContext();
  const yearOptions = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i);

  const createQualificationMutation = useCreateQualification();
  const updateQualificationMutation = useUpdateQualification();

  const [selectedQualificationId, setSelectedQualificationId] = useState(null);
  const { data: singleQualificationData } = useGetSingleQualification(schoolId, staffId);

  const deleteQualificationMutation = useDeleteQualification();
  const [prefilledFiles, setPrefilledFiles] = useState(null);
  const [deleteAttachment, setDeleteAttachment] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nameOfInstitute: '',
      university: '',
      yearOfPassing: '',
      degree: '',
      files: null
    }
  });

  useEffect(() => {
    if (selectedQualificationId) {
      const selectedQualification = singleQualificationData.data.find(
        (doc) => doc.qualificationId === selectedQualificationId
      );
      if (selectedQualification) {
        form.setValue('nameOfInstitute', selectedQualification.nameOfInstitute);
        form.setValue('university', selectedQualification.university);
        form.setValue('yearOfPassing', selectedQualification.yearOfPassing);
        form.setValue('degree', selectedQualification.degree);
        setPrefilledFiles(selectedQualification.attachmentDto); // set prefilled files
        setDeleteAttachment(false); // reset delete attachment state
      }
    }
  }, [selectedQualificationId, form, singleQualificationData]);

  function onFileInputChange(event) {
    const files = event.target.files;
    form.setValue('files', files);
    setDeleteAttachment(false); // reset delete attachment state
  }

  const handleDelete = () => {
    if (selectedQualificationId) {
      deleteQualificationMutation.mutate({
        schoolId: schoolId,
        staffId: staffId,
        qualificationId: selectedQualificationId
      });
      setSelectedQualificationId(null);
    }
  };

  const ViewAttachmentComponent = ({ schoolId, attachmentId, attachmentName }) => {
    const { data, isLoading, isSuccess } = useViewAttachment(schoolId, attachmentId);

    return isLoading ? (
      <div>Loading...</div>
    ) : isSuccess ? (
      <a
        className="text-blue-500 hover:text-blue-700"
        href={data}
        target="_blank"
        rel="noopener noreferrer"
      >
        {attachmentName}
      </a>
    ) : (
      <div></div>
    );
  };

  const handleRemoveFile = () => {
    setPrefilledFiles(null);
    form.setValue('files', null);
    setDeleteAttachment(true); // set delete attachment state
  };

  function onSubmit(values) {
    const formData = new FormData();
    const qualification = {
      schoolId,
      staffId,
      nameOfInstitute: values.nameOfInstitute,
      university: values.university,
      yearOfPassing: values.yearOfPassing,
      degree: values.degree
    };

    if (selectedQualificationId) {
      qualification.qualificationId = selectedQualificationId;
      if (deleteAttachment) {
        qualification.deleteAttachment = true; // add delete attachment flag
      }
    }

    formData.append(
      'qualificationDto',
      new Blob([JSON.stringify(qualification)], {
        type: 'application/json'
      })
    );

    if (values.files && values.files.length > 0) {
      for (let i = 0; i < values.files.length; i++) {
        formData.append('qualificationFile', values.files[i]);
      }
    }

    const onSuccessCallback = () => {
      setSelectedQualificationId(null); // Uncheck the checkbox
      // Optionally, trigger a re-fetch or update the table data to ensure the table re-renders
    };

    if (selectedQualificationId) {
      updateQualificationMutation.mutate(formData, {
        onSuccess: onSuccessCallback
      });
    } else {
      createQualificationMutation.mutate(formData, {
        onSuccess: onSuccessCallback
      });
    }

    form.reset({
      nameOfInstitute: '',
      university: '',
      yearOfPassing: '',
      degree: '',
      files: null
    });
    setPrefilledFiles(null);
    resetFileInput();
    setSelectedQualificationId(null);
  }

  const resetFileInput = () => {
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
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
              setSelectedQualificationId(row.original.qualificationId);
            } else {
              setSelectedQualificationId(null);
              form.reset({
                nameOfInstitute: '',
                university: '',
                yearOfPassing: '',
                degree: '',
                files: null
              });
              setPrefilledFiles(null);
              setDeleteAttachment(false);
              resetFileInput(); // clear the file input
            }
          }}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: 'nameOfInstitute',
      header: 'Name of Institute',
      cell: ({ row }) => <div>{row.getValue('nameOfInstitute')}</div>,
      enableSorting: true
    },
    {
      accessorKey: 'university',
      header: 'University',
      cell: ({ row }) => <div>{row.getValue('university')}</div>,
      enableSorting: true
    },
    {
      accessorKey: 'degree',
      header: 'Degree',
      cell: ({ row }) => <div>{row.getValue('degree')}</div>,
      enableSorting: true
    },
    {
      accessorKey: 'yearOfPassing',
      header: 'Year of Passing',
      cell: ({ row }) => <div>{row.getValue('yearOfPassing')}</div>,
      enableSorting: true
    },

    {
      accessorKey: 'attachmentId',
      header: 'Attachment',
      cell: ({ row }) => {
        const attachmentId = row.original.attachmentDto?.attachmentId;
        const attachmentName = row.original.attachmentDto?.attachmentName;

        return (
          <ViewAttachmentComponent
            schoolId={schoolId}
            attachmentId={attachmentId}
            attachmentName={attachmentName}
          />
        );
      }
    },

    {
      accessorKey: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const qualification = row.original;
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
                onClick={() => setSelectedQualificationId(qualification.qualificationId)}
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
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mb-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <FormField
                className="w-full"
                control={form.control}
                name="nameOfInstitute"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Name Of Institute<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Name Of Institute" {...field} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="university"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      University <span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="University" {...field} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="yearOfPassing"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Year Of Passing<span className="text-red-600">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {yearOptions.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="degree"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Degree<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Degree" {...field} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="files"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Upload Files<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <input
                          type="file"
                          onChange={(e) => {
                            field.onChange(e.target.files);
                            onFileInputChange(e);
                          }}
                          className="input"
                        />
                        {prefilledFiles && (
                          <>
                            <ViewAttachmentComponent
                              schoolId={schoolId}
                              attachmentId={prefilledFiles.attachmentId}
                              attachmentName={prefilledFiles.attachmentName}
                            />
                            <button
                              type="button"
                              onClick={handleRemoveFile}
                              className="text-red-500"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                    <div className="text-sm text-gray-500 mt-1">
                      Allowed file types: DOC, DOCX, JPG, JPEG, PNG
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2">
            <Button type="submit">{selectedQualificationId ? 'Update' : 'Add'}</Button>
          </div>
        </form>
      </Form>

      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Uploaded Qualifications</h2>
        {singleQualificationData && (
          <DataTable
            columns={columns}
            data={singleQualificationData.data}
            selectionMode="single"
            rowSelection="checkbox"
            onRowSelectionChange={(selectedRows) => {
              if (selectedRows.length === 1) {
                setSelectedQualificationId(selectedRows[0].qualificationId);
              } else {
                setSelectedQualificationId(null);
              }
            }}
          />
        )}
      </div>
    </>
  );
}

export default QualificationForm;

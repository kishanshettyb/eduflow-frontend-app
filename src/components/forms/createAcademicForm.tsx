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
import { z } from 'zod';
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
import {
  useUploadStudentDocument,
  useUpdateUploadStudentDocument,
  useDeleteStudentFile
} from '@/services/mutation/admin/studentDocuments';
import {
  useGetAllDocumentsType,
  useGetStudentAllDocuments
} from '@/services/queries/admin/studentDocument';
import { DataTable } from '@/components/dataTable/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '../ui/checkbox';
import { AlertDialog } from '../alertdialogue/alert';
import { TrashIcon } from '@radix-ui/react-icons';
import { useViewAttachment } from '@/services/queries/attachment/attachment';
import moment from 'moment';
import GeneralFileUpload from '../uploadFiles/generalUploadFiles';

const formSchema = z
  .object({
    attachmentType: z.string().min(1, {
      message: 'Please select a document type.'
    }),
    otherAttachment: z.string().optional(),
    documentNumber: z.string().min(1, {
      message: 'Please enter a document number.'
    }),
    files: z
      .any()
      .refine((file) => file !== null, {
        message: 'File upload is mandatory.'
      })
      .optional()
  })
  .refine(
    (data) => {
      if (data.attachmentType === 'AADHAAR') {
        return data.documentNumber.length === 12 || 'Document number must be 12 characters long.';
      } else if (data.attachmentType === 'VOTER_ID') {
        return data.documentNumber.length === 10 || 'Document number must be 10 characters long.';
      } else if (data.attachmentType === 'PAN') {
        const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
        return (
          panRegex.test(data.documentNumber) ||
          'Invalid PAN number format. It should be like ABCTY1234D'
        );
      } else if (data.attachmentType === 'PASSPORT') {
        return (
          /^[A-Za-z0-9]{6,12}$/g.test(data.documentNumber) || 'Invalid passport number format.'
        );
      } else {
        return true;
      }
    },
    {
      message: 'Invalid document number for the selected document type.',
      path: ['documentNumber']
    }
  );

function AcademicForm({ studentId }) {
  const { schoolId } = useSchoolContext();
  const [attachmentType, setAttachmentType] = useState('');
  const [otherAttachment, setOtherAttachment] = useState('');
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  const { data: studentDocument } = useGetStudentAllDocuments(schoolId, studentId);
  const { data: documentTypes } = useGetAllDocumentsType();
  const uploadStudentFileMutation = useUploadStudentDocument();
  const updateStudentFileMutation = useUpdateUploadStudentDocument();
  const deleteFileMutation = useDeleteStudentFile();

  const selectedDocument = studentDocument?.data?.find(
    (doc) => doc.studentDocumentId === selectedDocumentId
  );

  const attachmentName = selectedDocument?.attachmentDto?.attachmentName;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      attachmentType: '',
      otherAttachment: '',
      documentNumber: '',
      attachmentName: '',
      files: null
    }
  });

  // Key to force remount of GeneralFileUpload component
  const [fileUploadKey, setFileUploadKey] = useState(0);
  console.log(studentDocument, 'studentDocument');
  useEffect(() => {
    if (selectedDocumentId) {
      const selectedDocument = studentDocument.data.find(
        (doc) => doc.studentDocumentId === selectedDocumentId
      );

      if (selectedDocument) {
        setAttachmentType(selectedDocument.documentType);
        form.setValue('attachmentType', selectedDocument.documentType);
        form.setValue('documentNumber', selectedDocument.documentNumber);
        form.setValue('attachmentName', selectedDocument.attachmentDto.attachmentName);

        if (selectedDocument.documentType === 'OTHERS') {
          setOtherAttachment(selectedDocument.documentName);
          form.setValue('otherAttachment', selectedDocument.documentName);
        }
      }
    }
  }, [selectedDocumentId, form, studentDocument]);

  function onAttachmentTypeChange(value) {
    setAttachmentType(value);
    form.setValue('attachmentType', value);
  }

  const handleFileSelected = (file) => {
    form.setValue('files', file);
    form.clearErrors('files');
  };

  const handleDelete = () => {
    if (selectedDocumentId) {
      deleteFileMutation.mutate({ studentDocumentId: selectedDocumentId });
      setSelectedDocumentId(null);
    }
  };

  useEffect(() => {
    if (!selectedDocumentId) {
      form.reset({
        attachmentType: '',
        otherAttachment: '',
        documentNumber: '',
        attachmentName: '',
        files: null
      });
      setAttachmentType('');
      setOtherAttachment('');
    }
  }, [selectedDocumentId, form]);

  const ViewAttachmentComponent = ({ schoolId, attachmentId, attachmentName }) => {
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

  function onSubmit(values) {
    const formData = new FormData();
    const academicDetailsDto = {
      schoolId,
      studentId,
      documentNumber: values.documentNumber,
      documentMasterDto: {
        documentType: attachmentType === 'Others' ? otherAttachment : attachmentType,
        documentName: attachmentType === 'Others' ? otherAttachment : attachmentType
      }
    };

    if (selectedDocumentId) {
      academicDetailsDto.studentDocumentId = selectedDocumentId;
    }

    formData.append(
      'studentDocumentsDto',
      new Blob([JSON.stringify(academicDetailsDto)], {
        type: 'application/json'
      })
    );

    // Validate the file field
    if (!values.files) {
      form.setError('files', {
        type: 'manual',
        message: 'File upload is mandatory.'
      });
      return;
    }

    formData.append('file', values.files);

    const mutation = selectedDocumentId ? updateStudentFileMutation : uploadStudentFileMutation;

    mutation.mutate(formData, {
      onSuccess: () => {
        form.reset({
          attachmentType: '',
          otherAttachment: '',
          documentNumber: '',
          files: null
        });
        setAttachmentType('');
        setOtherAttachment('');
        setSelectedDocumentId(null);
        // Increment key to remount GeneralFileUpload component
        setFileUploadKey((prevKey) => prevKey + 1);
      }
    });
  }

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
              setSelectedDocumentId(row.original.studentDocumentId);
            } else {
              setSelectedDocumentId(null);
            }
          }}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: 'documentType',
      header: 'Document Type',
      cell: ({ row }) => <div>{row.getValue('documentType') || 'N/A'}</div>,
      enableSorting: true
    },
    {
      accessorKey: 'documentNumber',
      header: 'Document Number',
      cell: ({ row }) => <div>{row.getValue('documentNumber')}</div>,
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
      accessorKey: 'createdTime',
      header: 'Uploaded Time',
      cell: ({ row }) => (
        <div>{moment(row.getValue('createdTime')).format('DD-MMMM-YYYY hh:mm A')}</div>
      ),
      enableSorting: true
    },
    {
      accessorKey: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        const standard = row.original;
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
                variant="outline"
                size="sm"
                onClick={() => setSelectedDocumentId(standard.studentDocumentId)}
              >
                <TrashIcon className="h-4 w-4 me-2" />
                Delete
              </Button>
            </AlertDialog>
          </div>
        );
      }
    }
  ];

  return (
    <>
      <div className="mt-5 p-10 border bg-white dark:bg-slate-900 rounded-2xl ">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col md:flex-row gap-5 mb-10">
              <div className="basis-2/5">
                <GeneralFileUpload
                  key={fileUploadKey}
                  onFileSelected={handleFileSelected}
                  error={form.formState.errors.files}
                  attachmentName={attachmentName}
                />
              </div>

              <div className="rounded-2xl basis-3/5 bg-white dark:bg-slate-900 p-5 border shadow-3xl">
                <div className="mb-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <FormField
                      control={form.control}
                      name="attachmentType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Select Document Type<span className="text-red-600">*</span>
                          </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                onAttachmentTypeChange(value);
                              }}
                              value={field.value || 'placeholder'}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Document Type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="placeholder" disabled>
                                  Select Document Type
                                </SelectItem>
                                {documentTypes?.data
                                  .filter((docType) => docType.documentType && docType.documentName)
                                  .map((docType) => (
                                    <SelectItem
                                      key={docType.documentMasterId}
                                      value={docType.documentType}
                                    >
                                      {docType.documentName}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {attachmentType === 'OTHERS' && (
                    <div>
                      <FormField
                        control={form.control}
                        name="otherAttachment"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Other Attachment Type<span className="text-red-600">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Other Attachment Type" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                  <div>
                    <FormField
                      control={form.control}
                      name="documentNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Document Number<span className="text-red-600">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Document Number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <Button className="px-10" type="submit">
                    {selectedDocumentId ? 'Update' : 'Create'}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
      <div className="mt-10">
        {studentDocument && (
          <>
            <h2 className="text-lg font-semibold text-slate-700 my-4">Uploaded Documents</h2>
            <DataTable
              columns={columns}
              data={studentDocument.data}
              selectionMode="single"
              rowSelection="checkbox"
              onRowSelectionChange={(selectedRows) => {
                if (selectedRows.length === 1) {
                  setSelectedDocumentId(selectedRows[0].studentDocumentId);
                } else {
                  setSelectedDocumentId(null);
                }
              }}
            />
          </>
        )}
      </div>
    </>
  );
}

export default AcademicForm;

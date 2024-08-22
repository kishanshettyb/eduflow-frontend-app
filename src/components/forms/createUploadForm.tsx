'use client';

import { useEffect, useRef, useState } from 'react';
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
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { subjectSchema } from './schema/subjectSchema';
import { UploadTypes } from '@/types/admin/uploadSummeryType';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  studentUpload,
  subjectUpload,
  examUpload,
  staffUpload,
  qualificationUpload,
  workExperienceUpload,
  staffAttendanceUpload,
  standardSubjectUpload,
  standardUpload,
  enrollmentUpload
} from '@/services/api/admin/uploadSummary/uploadSummeryApi';
import {
  getenrollmentTemplate,
  getexamTemplate,
  getqualificationTemplate,
  getstaffAttendanceTemplate,
  getstaffTemplate,
  getstandardSubjectTemplate,
  getstandardTemplate,
  getstudentTemplate,
  getsubjectTemplate,
  getworkExperienceTemplate
} from '@/services/api/admin/template/templateApi';
import { DataTable } from '@/components/dataTable/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { useGetAllDetails } from '@/services/queries/admin/uploadDetails';
import { useGetAllBulkError } from '@/services/queries/admin/bulkerror';
import { DownloadIcon, UploadIcon } from '@radix-ui/react-icons';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
const formSchema = subjectSchema;

export const CreateUploadForm = () => {
  const { schoolId, academicYearId } = useSchoolContext();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [bulkErrors, setBulkErrors] = useState<[]>([]);
  const [alertShown, setAlertShown] = useState(false);
  console.log(bulkErrors);
  const [selectedUploadType, setSelectedUploadType] = useState<string>('');
  const [selectedUploadSummary, setSelectedUploadSummary] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { data: uploadDetailsData, refetch } = useGetAllDetails(schoolId, selectedUploadType);
  const { data: bulkErrorData, refetch: refetchBulkErrors } = useGetAllBulkError(
    schoolId,
    selectedUploadSummary
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  });

  useEffect(() => {
    if (selectedUploadType) {
      refetch();
    }
  }, [selectedUploadType, refetch]);

  useEffect(() => {
    if (selectedUploadSummary) {
      refetchBulkErrors();
    }
  }, [selectedUploadSummary, refetchBulkErrors]);

  const handleBulkUploadErrors = () => {
    if (bulkErrorData && bulkErrorData.data && bulkErrorData.data.length > 0) {
      setBulkErrors(bulkErrorData.data);
      setAlertShown(true);
    }
  };

  useEffect(() => {
    handleBulkUploadErrors();
  }, [bulkErrorData]);

  const handleStatusClick = (row) => {
    setSelectedUploadSummary('');
    setAlertShown(false);
    setTimeout(() => {
      if (row.getValue('status') === 'failed') {
        setSelectedUploadSummary(row.original.uploadSummeryId);
        setAlertShown(true);
      }
    }, 0);
  };

  const handleFileBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setLoading(true);
    try {
      let uploadFunction;
      switch (selectedUploadType) {
        case 'student':
          uploadFunction = studentUpload;
          break;
        case 'exam':
          uploadFunction = examUpload;
          break;
        case 'enrollment':
          uploadFunction = enrollmentUpload;
          break;
        case 'subject':
          uploadFunction = subjectUpload;
          break;
        case 'staff':
          uploadFunction = staffUpload;
          break;
        case 'qualification':
          uploadFunction = qualificationUpload;
          break;
        case 'workExperience':
          uploadFunction = workExperienceUpload;
          break;
        case 'staffAttendance':
          uploadFunction = staffAttendanceUpload;
          break;
        case 'standardSubject':
          uploadFunction = standardSubjectUpload;
          break;
        case 'standard':
          uploadFunction = standardUpload;
          break;
        default:
          throw new Error('Invalid upload type');
      }

      const response = await uploadFunction(schoolId, formData);
      if (response.status === 200) {
        toast({
          variant: 'primary',
          title: 'File uploaded successfully'
        });
        refetch();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: errorMessage
      });
      refetch();
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleTemplateDownload = async () => {
    try {
      let getTemplateFunction;
      let fileName = 'template_file.xlsx';

      switch (selectedUploadType) {
        case 'student':
          getTemplateFunction = getstudentTemplate;
          fileName = 'student_template.xlsx';
          break;
        case 'exam':
          getTemplateFunction = async () => await getexamTemplate(schoolId, academicYearId);
          fileName = 'exam_template.xlsx';
          break;
        case 'enrollment':
          getTemplateFunction = async () => await getenrollmentTemplate;
          fileName = 'enrollment_template.xlsx';
          break;
        case 'subject':
          getTemplateFunction = getsubjectTemplate;
          fileName = 'subject_template.xlsx';
          break;
        case 'staff':
          getTemplateFunction = getstaffTemplate;
          fileName = 'staff_template.xlsx';
          break;
        case 'qualification':
          getTemplateFunction = getqualificationTemplate;
          fileName = 'qualification_template.xlsx';
          break;
        case 'workExperience':
          getTemplateFunction = getworkExperienceTemplate;
          fileName = 'workExperience_template.xlsx';
          break;
        case 'staffAttendance':
          getTemplateFunction = getstaffAttendanceTemplate;
          fileName = 'staffAttendance_template.xlsx';
          break;
        case 'standardSubject':
          getTemplateFunction = async () =>
            await getstandardSubjectTemplate(schoolId, academicYearId);

          fileName = 'standardSubject_template.xlsx';
          break;
        case 'standard':
          getTemplateFunction = async () => await getstandardTemplate(schoolId, academicYearId);

          fileName = 'standard_template.xlsx';
          break;
        default:
          throw new Error('Invalid template type');
      }

      const response = await getTemplateFunction(schoolId);
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading template:', error);
      toast({
        variant: 'destructive',
        title: 'Download failed',
        description: 'An unexpected error occurred while downloading the file.'
      });
    }
  };

  const columns: ColumnDef[] = [
    {
      accessorKey: 'uploadType',
      header: 'Upload Type',
      cell: ({ row }) => <div>{row.getValue('uploadType')}</div>,
      enableSorting: true
    },
    {
      accessorKey: 'createdTime',
      header: 'Upload Time',
      cell: ({ row }) => <div>{row.getValue('createdTime')}</div>
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status');
        if (status === 'failed') {
          return (
            <div>
              &nbsp;
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleStatusClick(row); // Call the new function to update selectedUploadSummary
                }}
                className="text-blue-600 underline"
              >
                <span className="text-red-600">{status}</span>
              </a>
            </div>
          );
        }
        return <div>{status}</div>;
      }
    },
    {
      accessorKey: 'totalRecord',
      header: 'Total Record',
      cell: ({ row }) => <div>{row.getValue('totalRecord')}</div>
    },
    {
      accessorKey: 'staffName',
      header: 'Upload By',
      cell: ({ row }) => <div>{row.getValue('staffName')}</div>
    },

    {
      accessorKey: 'skipped',
      header: 'Skipped',
      cell: ({ row }) => <div>{row.getValue('skipped')}</div>
    },
    {
      accessorKey: 'numberOfRecordsUploaded',
      header: 'No of Records Uploaded',
      cell: ({ row }) => <div>{row.getValue('numberOfRecordsUploaded')}</div>
    },
    {
      accessorKey: 'fileName',
      header: 'File Name',
      cell: ({ row }) => <div>{row.getValue('fileName')}</div>
    }
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => console.log(data))}>
        <div className="mb-5 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <FormField
              className="w-full"
              control={form.control}
              name="uploadTypes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Upload Types<span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedUploadType(value);
                      }}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select upload type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(UploadTypes).map(([key, value]) => (
                          <SelectItem key={key} value={value}>
                            {key}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={loading || !selectedUploadType} // Disable button while loading
            >
              <UploadIcon className="w-5 h-5" /> {loading ? 'Uploading.....' : 'Bulk Upload'}
            </Button>
            <input
              type="file"
              accept=".xls,.xlsx"
              onChange={handleFileBulkUpload}
              style={{ display: 'none' }}
              ref={fileInputRef}
            />
            <Button type="button" onClick={handleTemplateDownload} disabled={!selectedUploadType}>
              <DownloadIcon className="w-5 h-5" /> Download Template
            </Button>
          </div>
        </div>
      </form>
      <AlertDialog open={alertShown} onDismiss={() => setAlertShown(false)}>
        <AlertDialogContent className="max-h-96 w-96 overflow-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>Error Details</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            {bulkErrors.map((error, index) => (
              <div key={index}>{error.message}</div>
            ))}
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAlertShown(false)}>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <DataTable columns={columns} data={uploadDetailsData?.data || []} />
    </Form>
  );
};

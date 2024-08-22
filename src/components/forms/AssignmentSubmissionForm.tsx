'use client';
import 'react-day-picker/dist/style.css';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { assignmentSubmissionSchema } from './schema/assignmentSubmissionSchema';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, ReloadIcon, Cross2Icon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import moment from 'moment';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import {
  useCreateSubmitAssignment,
  useUpdateSubmitAssignment
} from '@/services/mutation/teacher/assignment/assignment';
import { useSearchParams } from 'next/navigation';
import { useGetSingleAssignmentsSubmittions } from '@/services/queries/teacher/assignment/assignment';

type AssignmentSubmissionFormProps = {
  assignmentId?: number | null;
  onClose: () => void;
};

const formSchema = assignmentSubmissionSchema;

export const AssignmentSubmissionForm: React.FC<AssignmentSubmissionFormProps> = ({
  assignmentId,
  onClose
}) => {
  const { schoolId, enrollmentId } = useSchoolContext();
  const search = useSearchParams();
  const assignmentSubmissionId = search.get('assignmentSubmissionId');
  const [deleteAttachmentsIds, setDeleteAttachments] = useState<number[]>([]);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<File[]>([]);

  const submitAssignmentMutation = useCreateSubmitAssignment();
  const updateSubmitAssignmentMutation = useUpdateSubmitAssignment();
  const { data: submissionData } = useGetSingleAssignmentsSubmittions(
    schoolId,
    assignmentSubmissionId
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comments: '',
      submissionDate: new Date(),
      files: []
    }
  });

  useEffect(() => {
    if (submissionData) {
      form.setValue('comments', submissionData?.data.comments);
      form.setValue('submissionDate', new Date(submissionData?.data.submissionDate));
      setExistingFiles(submissionData?.data.attachments || []);
    }
  }, [submissionData]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    const formattedDate = format(values.submissionDate, 'yyyy-MM-dd');
    const assignmentSubmission = {
      assignmentSubmissionId,
      assignmentId,
      deleteAttachmentsIds,
      submissionDate: formattedDate,
      comments: values.comments,
      schoolId,
      enrollmentId
    };

    formData.append(
      'submissionDto',
      new Blob([JSON.stringify(assignmentSubmission)], { type: 'application/json' })
    );

    filesToUpload.forEach((file) => {
      formData.append('files', file, file.name);
    });

    const mutation = assignmentSubmissionId
      ? updateSubmitAssignmentMutation
      : submitAssignmentMutation;

    mutation.mutate(formData, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  const handleRemoveAttachment = (attachmentId: number) => {
    setDeleteAttachments((prev) => [...prev, attachmentId]);
    setExistingFiles((prev) => prev.filter((file) => file.attachmentId !== attachmentId));
  };

  const handleRemoveNewFile = (fileName: string) => {
    setFilesToUpload((prev) => prev.filter((file) => file.name !== fileName));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="w-100 mb-3">
          <h2 className="mb-3 uppercase text-slate-400 text-sm">Assignment Submission:</h2>
        </div>

        <div className="mb-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Comments<span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Comments" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormField
              control={form.control}
              name="submissionDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Submission Date<span className="text-red-600">*</span>
                  </FormLabel>
                  <Popover className="w-[400px]">
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant={'outline'} className="w-full text-left font-normal">
                          {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        captionLayout="dropdown"
                        fromYear={moment().year() - 118}
                        toYear={moment().year()}
                        disabled={(date) => date.getTime() < new Date().setHours(0, 0, 0, 0)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
                    <Input
                      type="file"
                      multiple
                      onChange={(e) => {
                        const files = e.target.files ? Array.from(e.target.files) : [];
                        setFilesToUpload((prev) => [...prev, ...files]);
                        field.onChange(files);
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Existing Files:</h3>
              {existingFiles.map((file) => (
                <div key={file.attachmentId} className="flex justify-between items-center mt-2">
                  <span>{file.attachmentName}</span>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveAttachment(file.attachmentId)}
                  >
                    <Cross2Icon className="h-5 w-5" />
                  </Button>
                </div>
              ))}
            </div>
            <div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">New Files:</h3>
              {filesToUpload.map((file) => (
                <div key={file.name} className="flex justify-between items-center mt-2">
                  <span>{file.name}</span>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveNewFile(file.name)}
                  >
                    <Cross2Icon className="h-5 w-5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={
              submitAssignmentMutation.isPending || updateSubmitAssignmentMutation.isPending
            }
          >
            {submitAssignmentMutation.isPending || updateSubmitAssignmentMutation.isPending ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Please wait...
              </>
            ) : (
              'Submit'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

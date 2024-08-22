'use client';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useViewSubject } from '@/services/queries/admin/subject';
import { assignmentSchema } from './schema/assignmentSchema';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, ReloadIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import moment from 'moment';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import {
  useCreateAssignment,
  useUpdateAssignment
} from '@/services/mutation/teacher/assignment/assignment';
import { useGetSingleAssignment } from '@/services/queries/teacher/assignment/assignment';
import { useViewAttachment } from '@/services/queries/attachment/attachment';
import 'react-day-picker/dist/style.css';
const formSchema = assignmentSchema;

function ViewAttachmentComponent({ schoolId, attachmentId, attachmentName }) {
  const { data: attachmentData, isLoading, isSuccess } = useViewAttachment(schoolId, attachmentId);

  return isLoading ? (
    <div>Loading...</div>
  ) : isSuccess && attachmentData ? (
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
}

type CreateAssignmetFormProps = {
  assignmentId?: number | null;
  onClose: () => void;
};

export const CreateAssignmentForm: React.FC<CreateAssignmetFormProps> = ({
  assignmentId,
  onClose
}) => {
  const { schoolId, staffId, academicYearId } = useSchoolContext();
  const id = assignmentId;
  const { data: subjectsData } = useViewSubject(schoolId, academicYearId);
  const createAssignmentMutation = useCreateAssignment();
  const updateAssignmentMutation = useUpdateAssignment();
  const { data: singleAssignmentData, error: singleAssignmentError } = useGetSingleAssignment(
    schoolId,
    id
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      subjectId: '',
      description: '',
      startDate: null,
      lastDate: null,
      file: null
    }
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [existingAttachment, setExistingAttachment] = useState(null);

  useEffect(() => {
    if (singleAssignmentData && !singleAssignmentError) {
      const assignment = singleAssignmentData.data;
      form.reset({
        title: assignment.title,
        subjectId: assignment.subjectId?.toString(),
        description: assignment.description,
        startDate: new Date(assignment.startDate),
        lastDate: new Date(assignment.lastDate)
        //   startDate: format(new Date(assignment.startDate), 'yyyy-MM-dd'),
        // lastDate: format(new Date(assignment.lastDate), 'yyyy-MM-dd')
      });

      if (assignment.attachmentDto) {
        setExistingAttachment({
          attachmentId: assignment.attachmentDto.attachmentId,
          attachmentName: assignment.attachmentDto.attachmentName
        });
      }
    }
  }, [form, singleAssignmentData, singleAssignmentError]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    const assignmentData = {
      academicYearId,
      assignmentId: id,
      title: values.title,
      subjectId: values.subjectId,
      startDate: format(values.startDate, 'yyyy-MM-dd'),
      lastDate: format(values.lastDate, 'yyyy-MM-dd'),
      description: values.description,
      schoolId,
      staffId
    };

    formData.append(
      'assignmentDto',
      new Blob([JSON.stringify(assignmentData)], { type: 'application/json' })
    );

    if (selectedFile) formData.append('file', selectedFile);

    const mutation = id ? updateAssignmentMutation : createAssignmentMutation;
    mutation.mutate(formData, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="w-100 mb-3">
          <h2 className="mb-3 uppercase text-slate-400 text-sm">Assignment Details:</h2>
        </div>

        <div className="mb-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <FormField
              control={form.control}
              name="subjectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Subject</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Subject" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Array.isArray(subjectsData?.data) &&
                        subjectsData.data.map((item) => (
                          <SelectItem key={item.subjectId} value={item.subjectId.toString()}>
                            {item.subjectName}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Title<span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Title" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Description<span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Description" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Start Date<span className="text-red-600">*</span>
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
                        disabled={(date) => date.getTime() < new Date().setHours(0, 0, 0, 0)}
                        captionLayout="dropdown"
                        fromYear={moment().year() - 118}
                        toYear={moment().year()}
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
              name="lastDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    End Date<span className="text-red-600">*</span>
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
                        disabled={(date) => date.getTime() < new Date().setHours(0, 0, 0, 0)}
                        fromYear={moment().year() - 118}
                        toYear={moment().year()}
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
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Upload File<span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files ? e.target.files[0] : null;
                        setSelectedFile(file);
                        field.onChange(file);
                      }}
                    />
                  </FormControl>
                  {existingAttachment && (
                    <div className="mt-2">
                      <ViewAttachmentComponent
                        schoolId={schoolId}
                        attachmentId={existingAttachment.attachmentId}
                        attachmentName={existingAttachment.attachmentName}
                      />
                    </div>
                  )}
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={createAssignmentMutation.isPending || updateAssignmentMutation.isPending}
          >
            {(createAssignmentMutation.isPending || updateAssignmentMutation.isPending) && (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Please wait...
              </>
            )}
            {!createAssignmentMutation.isPending &&
              !updateAssignmentMutation.isPending &&
              (id && !singleAssignmentError ? 'Update' : 'Save')}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateAssignmentForm;

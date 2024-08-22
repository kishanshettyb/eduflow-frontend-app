'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { useGetAllStandards, useSectionByStandard } from '@/services/queries/admin/standard';
import { useGetAllExamType } from '@/services/queries/admin/examType';
import {
  useGetSubjectTypes,
  useGetSubjectBySubjectTypes
} from '@/services/queries/admin/standarSubject';
import { useCreateExam, useUpdateExam } from '@/services/mutation/exam';
import { useGetExambyID } from '@/services/queries/exam';
import { examSchema } from './schema/examSchema';
import { Calendar } from '../ui/calendar';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';
import 'react-day-picker/dist/style.css';
import { format, addMinutes, parse } from 'date-fns';
import moment from 'moment';

const formSchema = examSchema.extend({
  startTime: z.string().nonempty('Start Time is required'),
  endTime: z.string().optional()
});

type CreateExamFormProps = {
  examId?: number | null;
  onClose: () => void;
};

export const CreateExamForm: React.FC<CreateExamFormProps> = ({ examId, onClose }) => {
  const { schoolId, academicYearId } = useSchoolContext();

  const [selectedStandard, setSelectedStandard] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [selectedSubjectTypeId, setSelectedSubjectTypeId] = useState<number | null>(null);
  const [, setSelectedSubjectId] = useState<number | null>(null);

  const createExamMutation = useCreateExam();
  const updateExamMutation = useUpdateExam();

  const { data: sectionsData } = useSectionByStandard(schoolId, academicYearId, selectedStandard);
  const { data: subjectTypedata } = useGetSubjectTypes(schoolId, academicYearId);
  const { data: examtypes } = useGetAllExamType(schoolId, academicYearId);
  const { data: standardsData } = useGetAllStandards(schoolId, academicYearId);
  const { data: examData, error: singleexamError } = useGetExambyID(schoolId, examId);
  const { data: subjectData } = useGetSubjectBySubjectTypes(
    schoolId,
    academicYearId,
    selectedStandard,
    selectedSection,
    selectedSubjectTypeId
  );

  console.log(subjectData, 'subjectData');
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      examType: '',
      standards: '',
      sections: '',
      subject: '',
      subjectType: '',
      duration: '',
      minMarks: '',
      maxMarks: '',
      examDate: null,
      startTime: '',
      endTime: ''
    }
  });

  useEffect(() => {
    if (examData && !singleexamError) {
      // Ensure data and no error
      const {
        examTypeId,
        examDate,
        minMarks,
        maxMarks,
        examDuration,
        startTime,
        endTime,
        standardSubjectDto: {
          standardDto: { standard, section },
          subjectDto: { subjectId },
          subjectTypeDto: { subjectTypeId }
        }
      } = examData.data; // Destructure exam data

      form.reset({
        examType: examTypeId.toString(), // Set form fields
        examDate: new Date(examDate),
        minMarks: minMarks.toString(),
        maxMarks: maxMarks.toString(),
        duration: examDuration.toString(),
        standards: standard,
        sections: section,
        subject: subjectId.toString(),
        subjectType: subjectTypeId.toString(),
        startTime,
        endTime
      });

      setSelectedStandard(standard); // Set selected states
      setSelectedSection(section);
      setSelectedSubjectId(subjectId);
      setSelectedSubjectTypeId(subjectTypeId);
      setStartTime(startTime);
      setEndTime(endTime);
      setDuration(examDuration.toString());
    }
  }, [examData, singleexamError, form]);

  useEffect(() => {
    if (sectionsData && sectionsData.data && sectionsData.data.length > 0) {
      form.setValue('sections', sectionsData.data[0]);
      setSelectedSection(sectionsData.data[0]);
    }
  }, [sectionsData, form]);

  // Calculate end time based on start time and duration
  useEffect(() => {
    if (startTime && duration) {
      const startDateTime = parse(startTime, 'HH:mm', new Date());
      const endDateTime = addMinutes(startDateTime, parseInt(duration));
      if (!isNaN(endDateTime.getTime())) {
        setEndTime(format(endDateTime, 'HH:mm'));
      }
    }
  }, [startTime, duration]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const exam = {
      examId: examId,
      schoolId: schoolId,
      academicYearId: academicYearId,
      examDate: format(values.examDate, 'yyyy-MM-dd'),

      examTypeId: values.examType,
      standard: values.standards,
      ...(examId ? { section: values.sections } : { sections: [values.sections] }),
      subjectId: values.subject,
      subjectTypeId: values.subjectType,
      minMarks: values.minMarks,
      maxMarks: values.maxMarks,
      examDuration: values.duration,
      startTime: values.startTime,
      endTime: values.endTime
    };

    const mutation = examId && !singleexamError ? updateExamMutation : createExamMutation;
    mutation.mutate(exam, {
      onSuccess: () => {
        onClose();
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <FormField
              control={form.control}
              name="examType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select ExamType</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a ExamType" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {examtypes?.data?.map((item) => (
                        <SelectItem key={item.examTypeId} value={item.examTypeId.toString()}>
                          {item.examNameTitle}
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
              name="standards"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Standard<span className="text-red-600">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedStandard(value);
                    }}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Standard" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {standardsData?.data?.length > 0 ? (
                        standardsData.data.map((standard) => (
                          <SelectItem key={standard} value={standard}>
                            {standard}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem disabled>No standards available</SelectItem>
                      )}
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
              name="sections"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Section<span className="text-red-600">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedSection(value);
                    }}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Section" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sectionsData?.data?.map((section) => (
                        <SelectItem key={section} value={section}>
                          {section}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="mb-5 grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <FormField
              control={form.control}
              name="subjectType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Subject Type<span className="text-red-600">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedSubjectTypeId(Number(value));
                    }}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Subject Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Array.isArray(subjectTypedata) ? (
                        subjectTypedata.map((subjectType) => (
                          <SelectItem
                            key={subjectType.subjectTypeId}
                            value={subjectType.subjectTypeId.toString()}
                          >
                            {subjectType.subjectTypeTitle}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem disabled>No subject types available</SelectItem>
                      )}
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
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Subject<span className="text-red-600">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedSubjectId(Number(value));
                    }}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Subject" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Array.isArray(subjectData) ? (
                        subjectData.map((subject) => (
                          <SelectItem key={subject.subjectId} value={subject.subjectId.toString()}>
                            {subject.subjectName}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem disabled>No subject available</SelectItem>
                      )}
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
              name="minMarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Min marks <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Min Marks"
                      {...field}
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key) || field.value?.length >= 3) {
                          e.preventDefault();
                        }
                      }}
                      maxLength={3}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormField
              control={form.control}
              name="maxMarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Max Marks <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Max Marks"
                      {...field}
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key) || field.value?.length >= 3) {
                          e.preventDefault();
                        }
                      }}
                      maxLength={3}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="mb-5 grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <FormField
              control={form.control}
              name="examDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Exam Date<span className="text-red-600">*</span>
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
                        fromYear={moment().year() - 118}
                        toYear={moment().year()}
                        fromDate={new Date()}
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
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Start Time <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      {...field}
                      value={field.value || startTime}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        setStartTime(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Duration (mins) <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Duration in minutes"
                      {...field}
                      value={field.value || duration}
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        setDuration(e.target.value);
                      }}
                      maxLength={3}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} value={field.value || endTime} readOnly />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex items-center justify-end space-x-2">
          <Button type="submit">{examId && !singleexamError ? 'Update' : 'Save'}</Button>
        </div>
      </form>
    </Form>
  );
};

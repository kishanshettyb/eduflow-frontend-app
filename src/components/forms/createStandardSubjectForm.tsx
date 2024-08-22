'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormItem,
  FormLabel,
  FormMessage,
  FormField,
  FormControl
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateStandardSubject } from '@/services/mutation/admin/standardSubject';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { useGetAllStandard } from '@/services/queries/admin/standard';
import { useViewSubject } from '@/services/queries/admin/subject';
import React from 'react';
import { useGetAllSubjectType } from '@/services/queries/admin/subjectType';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import ReactSelect from 'react-select';

const formSchema = z.object({
  standardIds: z.string().min(1, {
    message: 'Please select Standard.'
  }),
  subjectIds: z.array(z.string()).min(1, {
    message: 'Please select at least one subject.'
  }),
  subjectTypeId: z.string().min(1, {
    message: 'Please select subject type.'
  })
});

type FormValues = z.infer<typeof formSchema>;

type CreateStandardSubjectFormProps = {
  onClose: () => void;
};

export const CreateStandardSubjectForm: React.FC<CreateStandardSubjectFormProps> = ({
  onClose
}) => {
  const createStandardSubjectMutation = useCreateStandardSubject();
  const { schoolId, academicYearId } = useSchoolContext();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      standardIds: '',
      subjectIds: [],
      subjectTypeId: ''
    }
  });

  const { data: standards } = useGetAllStandard(schoolId, academicYearId);
  const { data: subjects } = useViewSubject(schoolId, academicYearId);
  const { data: subjectTypes } = useGetAllSubjectType(schoolId, academicYearId);

  const onSubmit = (values: FormValues) => {
    const standardSubject = {
      schoolId: schoolId,
      academicYearId: academicYearId,
      subjectIds: values.subjectIds.map((id) => parseInt(id)),
      standardIds: [parseInt(values.standardIds)],
      subjectTypeId: parseInt(values.subjectTypeId)
    };

    createStandardSubjectMutation.mutate(standardSubject, {
      onSuccess: () => {
        onClose(); // Close the dialog on success
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-5 grid grid-cols-1 md:grid-cols-1 gap-4">
          <div>
            <FormField
              control={form.control}
              name="standardIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Standard</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Standard" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Array.isArray(standards?.data) &&
                        standards.data.map(
                          (item) =>
                            item.standardId && (
                              <SelectItem key={item.standardId} value={item.standardId.toString()}>
                                {item.title}
                              </SelectItem>
                            )
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
              name="subjectTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Subject Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Subject Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subjectTypes?.data?.map(
                        (item) =>
                          item.subjectTypeId && (
                            <SelectItem
                              key={item.subjectTypeId}
                              value={item.subjectTypeId.toString()}
                            >
                              {item.subjectTypeTitle}
                            </SelectItem>
                          )
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="md:col-span-3">
            <FormField
              control={form.control}
              name="subjectIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Subjects</FormLabel>
                  <ReactSelect
                    className="dark:text-slate-900"
                    options={
                      Array.isArray(subjects?.data)
                        ? subjects.data.map((item) => ({
                            value: item.subjectId?.toString(),
                            label: item.subjectName
                          }))
                        : []
                    }
                    isMulti
                    onChange={(selectedOptions) => {
                      field.onChange(selectedOptions.map((option) => option.value));
                    }}
                    value={field.value.map((value) => ({
                      value,
                      label: subjects?.data?.find(
                        (subject) => subject.subjectId?.toString() === value
                      )?.subjectName
                    }))}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-2">
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
};

'use client';

import { useEffect } from 'react';
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
import { examTypeSchema } from './schema/examTypeSchema';
import { useCreateExamType, useUpdateExamType } from '@/services/mutation/admin/examType';
import { useGetExamTypebyID } from '@/services/queries/admin/examType';
import { Textarea } from '../ui/textarea';
const formSchema = examTypeSchema;

type CreateExamTypeFormProps = {
  examTypeId?: number | null;
  onClose: () => void;
};

export const CreateExamTypeForm: React.FC<CreateExamTypeFormProps> = ({ examTypeId, onClose }) => {
  const createExamTypeMutation = useCreateExamType();
  const updateExamTypeMutation = useUpdateExamType();
  const { schoolId, academicYearId } = useSchoolContext();
  const { data: examtypeData, error: singleexamtypeError } = useGetExamTypebyID(
    schoolId,
    examTypeId
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      examNameTitle: '',
      description: ''
    }
  });

  useEffect(() => {
    if (examtypeData) {
      form.reset({
        examNameTitle: examtypeData.examNameTitle,
        description: examtypeData.description
      });
    }
  }, [examtypeData, form]);
  useEffect(() => {
    if (examtypeData && !singleexamtypeError) {
      const examtype = examtypeData.data;
      form.reset({
        examNameTitle: examtype.examNameTitle,
        description: examtype.description
      });
    }
  }, [examtypeData, singleexamtypeError, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const examtype = {
      examTypeId: examTypeId,
      schoolId: schoolId,

      academicYearId: academicYearId,

      examNameTitle: values.examNameTitle,
      description: values.description
    };
    const mutation =
      examTypeId && !singleexamtypeError ? updateExamTypeMutation : createExamTypeMutation;

    mutation.mutate(examtype, {
      onSuccess: () => {
        onClose(); // Close the dialog on success
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-5 grid grid-cols-1 gap-y-5">
          <div>
            <FormField
              className="w-full"
              control={form.control}
              name="examNameTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Exam Type<span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Exam Type"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Remove leading numbers
                        if (/^\d/.test(value)) {
                          field.onChange(value.replace(/^\d+/, ''));
                        } else {
                          field.onChange(value);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>
          <div className="">
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
        </div>

        <div className="flex items-center justify-end space-x-2">
          <Button type="submit">{examTypeId ? 'Update' : 'Save'}</Button>
        </div>
      </form>
    </Form>
  );
};

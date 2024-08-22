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
import { subjectSchema } from './schema/subjectSchema';
import { useCreateSubject, useUpdateSubject } from '@/services/mutation/admin/subject';
import { useGetSubjectbyID } from '@/services/queries/admin/subject';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { Textarea } from '../ui/textarea';

const formSchema = subjectSchema;

type CreateSubjectFormProps = {
  subjectId?: number | null;
  onClose: () => void;
};

export const CreateSubjectForm: React.FC<CreateSubjectFormProps> = ({ subjectId, onClose }) => {
  const createSubjectMutation = useCreateSubject();
  const updateSubjectMutation = useUpdateSubject();
  const { schoolId, academicYearId } = useSchoolContext();
  const { data: subjectData, error: singlesubjectError } = useGetSubjectbyID(schoolId, subjectId);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subjectName: '',
      description: ''
    }
  });

  useEffect(() => {
    if (subjectData) {
      form.reset({
        subjectName: subjectData.subjectName,
        description: subjectData.description
      });
    }
  }, [subjectData, form]);
  useEffect(() => {
    if (subjectData && !singlesubjectError) {
      const subject = subjectData.data;
      form.reset({
        subjectName: subject.subjectName,
        description: subject.description
      });
    }
  }, [subjectData, singlesubjectError, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const subject = {
      subjectId: subjectId,
      schoolId: schoolId,
      academicYearDto: {
        academicYearId: academicYearId
      },
      subjectName: values.subjectName,
      description: values.description
    };
    const mutation =
      subjectId && !singlesubjectError ? updateSubjectMutation : createSubjectMutation;

    mutation.mutate(subject, {
      onSuccess: () => {
        onClose(); // Close the dialog on success
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-5 grid grid-cols-1 gap-4">
          <div>
            <FormField
              className="w-full"
              control={form.control}
              name="subjectName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Subject Name<span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Subject Name"
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
          <div>
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
          <Button type="submit">{subjectId ? 'Update' : 'Save'}</Button>
        </div>
      </form>
    </Form>
  );
};

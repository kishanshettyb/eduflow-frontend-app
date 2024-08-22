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
import { periodSchema } from './schema/periodSchema';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { useCreatePeriod, useUpdatePeriod } from '@/services/mutation/admin/period';
import { useGetPeriodbyID } from '@/services/queries/admin/period';
import { Checkbox } from '@/components/ui/checkbox';

const formSchema = periodSchema;

type CreatePeriodFormProps = {
  periodId?: number | null;
  onClose: () => void;
};

export const CreatePeriodForm: React.FC<CreatePeriodFormProps> = ({ periodId, onClose }) => {
  const createPeriodMutation = useCreatePeriod();
  const updatePeriodMutation = useUpdatePeriod();
  const { schoolId, academicYearId } = useSchoolContext();
  const { data: periodData, error: singleperiodError } = useGetPeriodbyID(schoolId, periodId);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startTime: '',
      endTime: '',
      breakTime: false,
      title: ''
    }
  });

  useEffect(() => {
    if (periodData) {
      form.reset({
        startTime: periodData.startTime,
        endTime: periodData.endTime,
        title: periodData.title,
        breakTime: periodData.breakTime
      });
    }
  }, [periodData, form]);

  useEffect(() => {
    if (periodData && !singleperiodError) {
      const period = periodData.data;
      form.reset({
        startTime: period.startTime,
        endTime: period.endTime,
        title: period.title,
        breakTime: period.breakTime
      });
    }
  }, [periodData, singleperiodError, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const period = {
      periodId: periodId,
      schoolId: schoolId,
      academicYearId: academicYearId,
      startTime: values.startTime,
      endTime: values.endTime,
      title: values.title,
      breakTime: values.breakTime
    };
    const mutation = periodId && !singleperiodError ? updatePeriodMutation : createPeriodMutation;

    mutation.mutate(period, {
      onSuccess: () => {
        onClose(); // Close the dialog on success
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
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Start Time <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
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
                  <FormLabel>
                    End Time <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
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
                    Title <span className="text-red-600">*</span>
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
              name="breakTime"
              render={({ field }) => (
                <FormItem className="space-y-0 flex items-center justify-start space-x-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked)}
                    />
                  </FormControl>
                  <FormLabel className="mt-0">Break Time</FormLabel>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-2">
          <Button type="submit">{periodId ? 'Update' : 'Save'}</Button>
        </div>
      </form>
    </Form>
  );
};

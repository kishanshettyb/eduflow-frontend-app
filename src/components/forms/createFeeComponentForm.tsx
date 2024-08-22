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
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSchoolContext } from '@/lib/provider/schoolContext';

import { feecomponentSchema } from './schema/feeComponentSchema';
import {
  useCreateFeeComponent,
  useUpdateFeeComponent
} from '@/services/mutation/admin/feecomponent';
import { useGetFeeComponentbyID } from '@/services/queries/admin/feecomponent';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '../ui/calendar';
import { CalendarIcon } from 'lucide-react';

const formSchema = feecomponentSchema;

type CreateFeeComponentFormProps = {
  feeComponentId?: number | null;
  onClose: () => void;
};

export const CreateFeeComponentForm: React.FC<CreateFeeComponentFormProps> = ({
  feeComponentId,
  onClose
}) => {
  const createFeeComponentMutation = useCreateFeeComponent();
  const updateFeeComponentMutation = useUpdateFeeComponent();
  const { schoolId, academicYearId } = useSchoolContext();
  const { data: feecomponentData, error: singlefeecomponentError } = useGetFeeComponentbyID(
    schoolId,
    feeComponentId
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      feeComponentName: '',
      amount: '',
      description: '',
      partialPayment: '',
      dueDate: null
    }
  });
  useEffect(() => {
    if (feecomponentData && !singlefeecomponentError) {
      const feecomponent = feecomponentData.data;
      form.reset({
        feeComponentName: feecomponent.feeComponentName,
        amount: feecomponent.amount.toString(),
        description: feecomponent.description,
        partialPayment: feecomponent.partialPayment ? 'true' : 'false', // Ensure correct value is set
        dueDate: new Date(feecomponent.dueDate)
      });
    }
  }, [feecomponentData, singlefeecomponentError, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const feecomponent = {
      feeComponentId: feeComponentId,
      schoolId: schoolId,
      academicYearId: academicYearId,
      feeComponentName: values.feeComponentName,
      amount: values.amount.toString(),
      description: values.description,
      partialPayment: values.partialPayment,
      dueDate: format(values.dueDate, 'yyyy-MM-dd')
    };
    const mutation =
      feeComponentId && !singlefeecomponentError
        ? updateFeeComponentMutation
        : createFeeComponentMutation;

    mutation.mutate(feecomponent, {
      onSuccess: () => {
        onClose(); // Close the dialog on success
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-5 grid grid-cols-1  gap-4">
          <div>
            <FormField
              className="w-full"
              control={form.control}
              name="feeComponentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Fee Component Name <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Fee Component Name" {...field} />
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
                    <Input placeholder="Description" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="mb-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <FormField
              className="w-full"
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Amount<span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Amount"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        const newValue = value.replace(/[^0-9]/g, '');
                        field.onChange(newValue);
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
              name="partialPayment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Partial Payment<span className="text-red-600">*</span>
                  </FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="true">True</SelectItem>
                      <SelectItem value="false">False</SelectItem>
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
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Due date<span className="text-red-600">*</span>
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
                        selected={field.value || new Date()}
                        onSelect={field.onChange}
                        captionLayout="dropdown-buttons"
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
        </div>

        <div className="flex items-center justify-end space-x-2">
          <Button type="submit">{feeComponentId ? 'Update' : 'Save'}</Button>
        </div>
      </form>
    </Form>
  );
};

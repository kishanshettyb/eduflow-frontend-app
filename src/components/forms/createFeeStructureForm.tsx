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
import { feestructureSchema } from './schema/feeStructureSchema';
import {
  useCreateFeeStructure,
  useUpdateFeeStructure
} from '@/services/mutation/admin/feestructure';
import { useGetAllFeeComponent } from '@/services/queries/admin/feecomponent';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '../ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import ReactSelect from 'react-select';
import 'react-day-picker/dist/style.css';
import { useGetFeeStructurebyID } from '@/services/queries/admin/feestructure';

const formSchema = feestructureSchema;

type CreateFeeStructureFormProps = {
  feeStructureId?: number | null;
  onClose: () => void;
};

export const CreateFeeStructureForm: React.FC<CreateFeeStructureFormProps> = ({
  feeStructureId,
  onClose
}) => {
  const createFeeStructureMutation = useCreateFeeStructure();
  const updateFeeStructureMutation = useUpdateFeeStructure();
  const { schoolId, academicYearId } = useSchoolContext();
  const { data: feecomponent } = useGetAllFeeComponent(schoolId, academicYearId);
  const { data: feestructureData, error: singlefeestructureError } = useGetFeeStructurebyID(
    schoolId,
    feeStructureId
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      feeStructureName: '',
      feeComponentId: [],
      dueDate: null
    }
  });
  useEffect(() => {
    if (feestructureData && !singlefeestructureError) {
      const feestructure = feestructureData.data;
      const feeComponentIds = Array.isArray(feestructure.feeComponentIds)
        ? feestructure.feeComponentIds
        : [];

      form.reset({
        feeStructureName: feestructure.feeStructureName,
        feeComponentId: feeComponentIds.map(String),
        dueDate: new Date(feestructure.dueDate)
      });
    }
  }, [feestructureData, singlefeestructureError, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const feestructure = {
      feeStructureId: feeStructureId,
      schoolId: schoolId,
      academicYearId: academicYearId,
      feeStructureName: values.feeStructureName,
      feeComponentIds: values.feeComponentId.map(Number), // Convert to array of integers
      dueDate: format(values.dueDate, 'yyyy-MM-dd')
    };

    const mutation =
      feeStructureId && !singlefeestructureError
        ? updateFeeStructureMutation
        : createFeeStructureMutation;

    mutation.mutate(feestructure, {
      onSuccess: () => {
        onClose(); // Close the dialog on success
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FormField
              className="w-full"
              control={form.control}
              name="feeStructureName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Fee Structure <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Fee Structure" {...field} />
                  </FormControl>
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
                        selected={field.value}
                        onSelect={field.onChange}
                        captionLayout="dropdown-buttons"
                        fromYear={2000}
                        toYear={2030} // Example: Allow dates up to the year 2030
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
        <div className="mb-5 grid grid-cols-1 gap-4">
          <div>
            <FormField
              control={form.control}
              name="feeComponentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Fee Components<span className="text-red-600">*</span>
                  </FormLabel>
                  <ReactSelect
                    options={feecomponent?.data?.map((item) => ({
                      value: item.feeComponentId?.toString(),
                      label: item.feeComponentName
                    }))}
                    isMulti
                    onChange={(selectedOptions) => {
                      field.onChange(selectedOptions.map((option) => option.value));
                    }}
                    value={(field.value || []).map((value) => ({
                      value: value.toString(),
                      label: feecomponent?.data?.find(
                        (component) => component.feeComponentId?.toString() === value.toString()
                      )?.feeComponentName
                    }))}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-2">
          <Button type="submit">{feeStructureId ? 'Update' : 'Create'}</Button>
        </div>
      </form>
    </Form>
  );
};

'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { academicYearSchema } from './schema/acadmicYearSchema';
import { Calendar } from '../ui/calendar';
import { useGetAcademicYearbyID } from '@/services/queries/admin/academicYear';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import 'react-day-picker/dist/style.css';
import {
  useCreateAcademicYear,
  useUpdateAcademicYear
} from '@/services/mutation/admin/academicYear';
import { isDefaultCheckAcademicYear } from '@/services/api/admin/acedamicyear/acedamicyearApi';

const formSchema = academicYearSchema;

type CreateAcademicYearFormProps = {
  academicYearId?: number | null;
  onClose: () => void;
};

export const CreateAcademicYearForm: React.FC<CreateAcademicYearFormProps> = ({
  onClose,
  academicYearId
}) => {
  const { schoolId } = useSchoolContext();
  const createAcademicYearMutation = useCreateAcademicYear();
  const updateAcademicYearMutation = useUpdateAcademicYear();
  const [loading, setLoading] = useState(false);

  const { data: academicYearData, error: singleYearError } = useGetAcademicYearbyID(
    schoolId,
    academicYearId
  );

  const [defaultYearMessage, setDefaultYearMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startDate: null,
      endDate: null,
      title: '',
      isDefault: false
    }
  });

  useEffect(() => {
    if (academicYearData) {
      form.reset({
        startDate: new Date(academicYearData.startDate),
        endDate: new Date(academicYearData.endDate),
        title: academicYearData.title,
        isDefault: academicYearData.isDefault
      });
    }
  }, [academicYearData, form]);

  useEffect(() => {
    if (academicYearData && !singleYearError) {
      const academicYears = academicYearData.data;
      form.reset({
        startDate: new Date(academicYears.startDate),
        endDate: new Date(academicYears.endDate),
        title: academicYears.title,
        isDefault: academicYears.isDefault
      });
    }
  }, [academicYearData, singleYearError, form]);

  const startDate = useWatch({
    control: form.control,
    name: 'startDate'
  });

  const endDate = useWatch({
    control: form.control,
    name: 'endDate'
  });

  useEffect(() => {
    if (startDate && endDate) {
      const startYear = new Date(startDate).getFullYear();
      const endYear = new Date(endDate).getFullYear();
      form.setValue('title', `${startYear}-${endYear}`);
    }
  }, [startDate, endDate, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const academicYear = {
      academicYearId: academicYearId,
      schoolId,
      startDate: format(values.startDate, 'yyyy-MM-dd'),
      endDate: format(values.endDate, 'yyyy-MM-dd'),
      isDefault: values.isDefault,
      title: values.title,
      isActive: true
    };
    const mutation =
      academicYearId && !singleYearError ? updateAcademicYearMutation : createAcademicYearMutation;

    mutation.mutate(academicYear, {
      onSuccess: () => {
        onClose();
        setLoading(false);
      },
      onError: () => {
        onClose(); // Close the modal on error as well
        setLoading(false);
      }
    });
  }

  const handleIsDefaultCheck = async () => {
    try {
      const response = await isDefaultCheckAcademicYear(schoolId);
      if (response) {
        setDefaultYearMessage(response);
      } else {
        setDefaultYearMessage(null);
      }
    } catch (error) {
      console.error('Error checking default academic year:', error);
      setDefaultYearMessage('Failed to check default academic year.');
    }
  };

  const currentYear = new Date().getFullYear();
  const fromYear = currentYear - 1;
  const toYear = currentYear + 2;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-5 grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        fromYear={fromYear}
                        toYear={toYear}
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
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    End Date<span className="text-red-600">*</span>
                  </FormLabel>
                  <Popover className="w-[100px]">
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
                    <PopoverContent className="w-auto p-0 " align="start">
                      <Calendar
                        mode="single"
                        selected={field.value || new Date()}
                        onSelect={field.onChange}
                        captionLayout="dropdown-buttons"
                        fromYear={fromYear}
                        toYear={toYear}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage className="text-xs text-red-600" />
                </FormItem>
              )}
            />
          </div>

          <div className="hidden">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Title<span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="title" {...field} readOnly />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-1 md:col-span-3 flex flex-col items-start">
            <FormField
              control={form.control}
              name="isDefault"
              render={({ field }) => (
                <FormItem className="space-y-0 flex items-center justify-start space-x-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        if (checked) {
                          handleIsDefaultCheck();
                        } else {
                          setDefaultYearMessage(null); // Clear message when unchecked
                        }
                      }}
                    />
                  </FormControl>
                  <FormLabel className="mt-0">Set as Default Year</FormLabel>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            {defaultYearMessage && (
              <div className="text-blue-600 font-semi text-xs mt-2">Note:{defaultYearMessage}</div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-end space-x-2">
          <Button className="mt-5" type="submit" disabled={loading}>
            {academicYearId ? 'Update' : 'Save'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

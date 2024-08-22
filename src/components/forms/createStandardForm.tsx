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
import { Input } from '@/components/ui/input'; // Ensure this is the correct path
import { Checkbox } from '@/components/ui/checkbox'; // Ensure this is the correct path
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { standardSchema } from './schema/standardSchema';
import { useCreateStandard, useUpdateStandard } from '@/services/mutation/admin/standard';
import { useGetStandardbyID } from '@/services/queries/admin/standard';
import { useSchoolContext } from '@/lib/provider/schoolContext';

const formSchema = standardSchema.extend({
  enablePromotion: z.boolean().optional()
});

type CreateStandardFormProps = {
  standardId?: number | null;
  onClose: () => void;
};

export const CreateStandardForm: React.FC<CreateStandardFormProps> = ({ standardId, onClose }) => {
  const createStandardMutation = useCreateStandard();
  const updateStandardMutation = useUpdateStandard();
  const { schoolId, academicYearId } = useSchoolContext();

  const { data: standardData, error: singlestandardError } = useGetStandardbyID(
    schoolId,
    standardId
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      standard: '',
      section: '',
      level: '',
      maxStrength: '',
      enablePromotion: false
    }
  });

  useEffect(() => {
    if (standardData && !singlestandardError) {
      const standard = standardData.data;
      form.reset({
        standard: standard.standard,
        section: standard.section,
        level: standard.level.toString(),
        maxStrength: standard.maxStrength.toString(),
        enablePromotion: standard.enablePromotion || false
      });
    }
  }, [standardData, singlestandardError, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const standard = {
      standardId: standardId,
      schoolId: schoolId,
      academicYearDto: {
        academicYearId: academicYearId
      },
      standard: values.standard,
      section: values.section,
      level: values.level.toString(),
      maxStrength: values.maxStrength.toString(),
      ...(standardId && !singlestandardError && { enablePromotion: values.enablePromotion })
    };

    const mutation =
      standardId && !singlestandardError ? updateStandardMutation : createStandardMutation;

    mutation.mutate(standard, {
      onSuccess: () => {
        onClose(); // Close the dialog on success
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-5 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <FormField
              className="w-full"
              control={form.control}
              name="standard"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Standard<span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Standard" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              className="w-full"
              control={form.control}
              name="section"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Section<span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Section"
                      {...field}
                      onChange={(e) => {
                        const newValue = e.target.value.replace(/[0-9]/g, ''); // Remove all numeric characters
                        field.onChange(newValue.toUpperCase().slice(0, 1)); // Take only the first character after removing numbers
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
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Level <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Level"
                      {...field}
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key) || e.target.value.length >= 2) {
                          e.preventDefault();
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
              name="maxStrength"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Max Strength <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Max Strength"
                      {...field}
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) => {
                        const value = parseInt(e.target.value, 10);
                        if (value > 100) {
                          field.onChange('100');
                        } else if (value < 1) {
                          field.onChange('1');
                        } else {
                          field.onChange(e.target.value);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          {standardId && !singlestandardError && (
            <div>
              <FormField
                control={form.control}
                name="enablePromotion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enable Promotion</FormLabel>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked)}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-end space-x-2">
          <Button type="submit">{standardId && !singlestandardError ? 'Update' : 'Save'}</Button>
        </div>
      </form>
    </Form>
  );
};

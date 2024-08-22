'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import StandardMappingForm from './StandardMappingForm';
import StudentMappingForm from './StudentMappingForm';

const formSchema = z.object({
  mapTo: z.string().nonempty('Map to selection is required')
});

function FeeStructureMappingForm() {
  const [mapTo, setMapTo] = useState<string>('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mapTo: ''
    }
  });

  return (
    <Form {...form}>
      <form>
        <div className="mb-5 grid grid-cols-3 gap-4">
          <div>
            <FormField
              control={form.control}
              name="mapTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assign To</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setMapTo(value);
                    }}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a assign option" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="standard">Assign to Standards</SelectItem>
                      <SelectItem value="student">Assign to Students</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
      {mapTo === 'standard' && <StandardMappingForm />}
      {mapTo === 'student' && <StudentMappingForm />}
    </Form>
  );
}

export default FeeStructureMappingForm;

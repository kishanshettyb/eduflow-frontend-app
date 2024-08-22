'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { useViewStandard } from '@/services/queries/admin/standard';
import { useSearchParams } from 'next/navigation';
import { DataTable } from '@/components/dataTable/DataTable';
import { ColumnDef } from '@tanstack/react-table';
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
import { Button } from '@/components/ui/button';
import { FeeStructure } from '@/types/admin/feestuctureTypes';
import { useGetAllMappedAssignments } from '@/services/queries/teacher/assignment/assignment';
import { useCreateAssignmentMapping } from '@/services/mutation/teacher/assignment/assignment';

const standardFormSchema = z.object({
  standard: z.string().nonempty('Standard is required')
});

function AssignmentStandardMappingForm() {
  const search = useSearchParams();
  const id = search.get('assignmentId');
  const { schoolId, academicYearId } = useSchoolContext();
  const { data: standardsData } = useViewStandard(schoolId, academicYearId);
  const createAssignmentMappingMutation = useCreateAssignmentMapping();
  const { data: assignmentMappingData } = useGetAllMappedAssignments(schoolId, id);

  const form = useForm<z.infer<typeof standardFormSchema>>({
    resolver: zodResolver(standardFormSchema),
    defaultValues: {
      standard: ''
    }
  });

  function onSubmit(values: z.infer<typeof standardFormSchema>) {
    const payload = {
      standardIds: [values.standard],
      schoolId: schoolId,
      assignmentId: id
    };
    createAssignmentMappingMutation.mutate(payload);
  }

  const Columns: ColumnDef<FeeStructure>[] = [
    {
      accessorKey: 'assignmentTitle',
      header: 'Assignment Title',
      cell: ({ row }) => <div>{row.getValue('assignmentTitle')}</div>
    },
    {
      accessorKey: 'standardTitle',
      header: 'Standard Title',
      cell: ({ row }) => <div>{row.getValue('standardTitle')}</div>
    }
  ];

  const mappedStandardIds =
    assignmentMappingData?.data?.flatMap((item) =>
      item?.ClassAssignments.map((mapping) => mapping?.standardId)
    ) || [];

  const filteredStandards = standardsData?.data?.filter(
    (standard) => !mappedStandardIds.includes(standard?.standardId)
  );

  const mappedData = assignmentMappingData?.data?.flatMap((item) =>
    item?.ClassAssignments?.map((mapping) => ({
      assignmentTitle: mapping?.assignmentTitle,
      standardTitle: mapping?.standard
    }))
  );

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mb-5 grid grid-cols-3 gap-4">
            <div>
              <FormField
                control={form.control}
                name="standard"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Standard</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a standard" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredStandards?.map((standard) => (
                          <SelectItem
                            key={standard.standardId}
                            value={standard.standardId?.toString()}
                          >
                            {standard.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-8">
              <Button type="submit">Submit</Button>
            </div>
          </div>
        </form>
      </Form>

      <div className="mt-8">
        <DataTable columns={Columns} data={mappedData || []} />
      </div>
    </div>
  );
}

export default AssignmentStandardMappingForm;

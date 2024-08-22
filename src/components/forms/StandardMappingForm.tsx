'use client';

import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { useViewStandard } from '@/services/queries/admin/standard';
import { useCreateFeeStructureMapping } from '@/services/mutation/admin/feemapping';
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
import { useGetFeeStructureMapping } from '@/services/queries/admin/feestructure';
import { FeeStructure } from '@/types/admin/feestuctureTypes';

const standardFormSchema = z.object({
  standard: z.string().nonempty('Standard is required')
});

function StandardMappingForm() {
  const search = useSearchParams();
  const id = search.get('feeStructureId');
  const { schoolId, academicYearId } = useSchoolContext();
  const { data: standardsData } = useViewStandard(schoolId, academicYearId);
  const createFeeStructureMappingMutation = useCreateFeeStructureMapping();
  const { data: feeStructureMappingData } = useGetFeeStructureMapping(schoolId, academicYearId, id);

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
      feeStructureId: id
    };
    createFeeStructureMappingMutation.mutate(payload);
  }

  const Columns: ColumnDef<FeeStructure>[] = [
    {
      accessorKey: 'feeStructureName',
      header: 'Fee Structure Name',
      cell: ({ row }) => <div>{row.getValue('feeStructureName')}</div>
    },
    {
      accessorKey: 'standardTitle',
      header: 'Standard Title',
      cell: ({ row }) => <div>{row.getValue('standardTitle')}</div>
    }
  ];

  const mappedData = useMemo(() => {
    return (
      feeStructureMappingData?.data?.flatMap((item) =>
        item?.standardFeeMappings.map((mapping) => ({
          feeStructureName: mapping.feeStructureDto.feeStructureName,
          standardTitle: mapping.standardDto.title
        }))
      ) || []
    );
  }, [feeStructureMappingData]);

  const mappedStandardIds = useMemo(() => {
    return new Set(
      feeStructureMappingData?.data?.flatMap((item) =>
        item?.standardFeeMappings.map((mapping) => mapping.standardDto.standardId)
      ) || []
    );
  }, [feeStructureMappingData]);

  const filteredStandards = useMemo(() => {
    const standards = Array.isArray(standardsData?.data) ? standardsData.data : [];
    return standards.filter(
      (standard) => standard.standardId && !mappedStandardIds.has(standard.standardId)
    );
  }, [standardsData?.data, mappedStandardIds]);

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
                        {filteredStandards.map((standard) => (
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
        <DataTable columns={Columns} data={mappedData} />
      </div>
    </div>
  );
}

export default StandardMappingForm;

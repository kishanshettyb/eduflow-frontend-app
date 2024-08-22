'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSchoolContext } from '@/lib/provider/schoolContext';

import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useFilteredStudents } from '@/services/queries/admin/student';
import { useCreateStudentFeeStructureMapping } from '@/services/mutation/admin/feemapping';
import { useSearchParams } from 'next/navigation';
import { useViewStandard } from '@/services/queries/admin/standard';
import { useGetFeeStructureMapping } from '@/services/queries/admin/feestructure';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '../dataTable/DataTable';
import { FeeStructure } from '@/types/admin/feestuctureTypes';
import Select from 'react-select';

const studentFormSchema = z.object({
  standard: z.array(z.string()).nonempty('Standard is required'),
  student: z.array(z.string()).nonempty('Student is required')
});

function StudentMappingForm() {
  const search = useSearchParams();
  const id = search.get('feeStructureId');
  const { schoolId, academicYearId } = useSchoolContext();
  const { data: standardsData } = useViewStandard(schoolId, academicYearId);
  const createStudentFeeStructureMappingMutation = useCreateStudentFeeStructureMapping();
  const { data: feeStructureMappingData } = useGetFeeStructureMapping(schoolId, academicYearId, id);

  const [selectedStandard, setSelectedStandard] = useState<string[]>([]);
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const { data: studentsData, refetch: refetchStudents } = useFilteredStudents(
    schoolId,
    academicYearId,
    'true',
    Number(selectedStandard),
    selectedSection
  );

  const form = useForm<z.infer<typeof studentFormSchema>>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      standard: [],
      student: []
    }
  });

  useEffect(() => {
    if (selectedStandard.length > 0) {
      refetchStudents();
    }
  }, [selectedStandard, selectedSection, refetchStudents]);

  function onSubmit(values: z.infer<typeof studentFormSchema>) {
    console.log('Form Submitted', values);

    const payload = {
      enrollmentIds: selectedStudents,
      schoolId: schoolId,
      feeStructureId: id
    };

    createStudentFeeStructureMappingMutation.mutate(payload);
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
    },
    {
      accessorKey: 'studentName',
      header: 'Student Name',
      cell: ({ row }) => <div>{row.getValue('studentName')}</div>
    }
  ];

  const mappedData =
    feeStructureMappingData?.data?.flatMap((item) =>
      item?.studentFeeMappings.map((mapping) => ({
        feeStructureName: mapping.feeStructureDto.feeStructureName,
        standardTitle: mapping.enrollmentDto.standardDto.title,
        studentName: `${mapping.enrollmentDto.studentDto.firstName} ${mapping.enrollmentDto.studentDto.lastName}`
      }))
    ) || [];

  const standardsOptions = Array.isArray(standardsData?.data)
    ? standardsData.data.map((standard) => ({
        value: standard.standard,
        label: standard.title
      }))
    : [];

  const studentsOptions = Array.isArray(studentsData)
    ? studentsData.map((student) => ({
        value: student.enrollmentId?.toString(),
        label: `${student.studentDto.firstName} ${student.studentDto.lastName}`
      }))
    : [];

  return (
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
                    isMulti
                    options={standardsOptions}
                    onChange={(selectedOptions) => {
                      const values = selectedOptions.map((option) => option.value);
                      field.onChange(values);
                      setSelectedStandard(values);
                      const selectedStandard = standardsData?.data?.find(
                        (standard) => standard.standard?.toString() === values[0]
                      );
                      setSelectedSection(selectedStandard ? selectedStandard.section : '');
                      setSelectedStudents([]);
                    }}
                    value={field.value.map((value) => ({
                      value,
                      label: standardsOptions.find((option) => option.value === value)?.label
                    }))}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {selectedStandard.length > 0 && (
            <div>
              <FormField
                control={form.control}
                name="student"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Students</FormLabel>
                    <Select
                      isMulti
                      options={studentsOptions}
                      onChange={(selectedOptions) => {
                        const values = selectedOptions.map((option) => option.value);
                        field.onChange(values);
                        setSelectedStudents(values);
                      }}
                      value={field.value.map((value) => {
                        const student = studentsOptions.find((option) => option.value === value);
                        return {
                          value,
                          label: student?.label || ''
                        };
                      })}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          <div className="mt-8">
            <Button type="submit">Submit</Button>
          </div>
        </div>
      </form>
      <div className="mt-8">
        <DataTable columns={Columns} data={mappedData} />
      </div>
    </Form>
  );
}

export default StudentMappingForm;

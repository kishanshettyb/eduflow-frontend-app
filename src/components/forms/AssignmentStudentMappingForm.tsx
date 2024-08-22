'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSchoolContext } from '@/lib/provider/schoolContext';

import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useFilteredStudents } from '@/services/queries/admin/student';
import { useSearchParams } from 'next/navigation';
import { useViewStandard } from '@/services/queries/admin/standard';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '../dataTable/DataTable';
import { FeeStructure } from '@/types/admin/feestuctureTypes';
import Select from 'react-select';
import { useCreateStudentAssignmentMapping } from '@/services/mutation/teacher/assignment/assignment';
import { useGetAllMappedAssignments } from '@/services/queries/teacher/assignment/assignment';

const studentFormSchema = z.object({
  standard: z.array(z.string()).nonempty('Standard is required'),
  student: z.array(z.string()).nonempty('Student is required')
});

function AssignmentStudentMappingForm() {
  const search = useSearchParams();
  const id = search.get('assignmentId');
  const { schoolId, academicYearId } = useSchoolContext();
  const { data: standardsData } = useViewStandard(schoolId, academicYearId);
  const createStudentAssignmentMutation = useCreateStudentAssignmentMapping();
  const { data: assignmentMappingData } = useGetAllMappedAssignments(schoolId, id);

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

  function onSubmit() {
    const payload = {
      enrollmentsIds: selectedStudents,
      schoolId: schoolId,
      assignmentId: id
    };

    createStudentAssignmentMutation.mutate(payload);
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
    },
    {
      accessorKey: 'studentName',
      header: 'Student Name',
      cell: ({ row }) => <div>{row.getValue('studentName')}</div>
    }
  ];

  const mappedData = assignmentMappingData?.data?.flatMap((item) =>
    item?.StudentAssignments.map((mapping) => ({
      assignmentTitle: mapping.assignmentTitle,
      standardTitle: mapping.title,
      studentName: `${mapping.firstName} ${mapping.lastName}`
    }))
  );

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
                    className="dark:bg-slate-900"
                    isMulti
                    options={standardsData?.data?.map((standard) => ({
                      value: standard.standard,
                      label: standard.title
                    }))}
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
                      label: standardsData?.data?.find((standard) => standard.standard === value)
                        ?.title
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
                      options={studentsData?.map((student) => ({
                        value: student.enrollmentId?.toString(),
                        label: `${student.studentDto.firstName} ${student.studentDto.lastName}`
                      }))}
                      onChange={(selectedOptions) => {
                        const values = selectedOptions.map((option) => option.value);
                        field.onChange(values);
                        setSelectedStudents(values);
                      }}
                      value={field.value.map((value) => {
                        const student = studentsData?.find(
                          (student) => student.enrollmentId?.toString() === value
                        );
                        return {
                          value,
                          label: `${student?.studentDto.firstName} ${student?.studentDto.lastName}`
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
        <DataTable columns={Columns} data={mappedData || []} />
      </div>
    </Form>
  );
}

export default AssignmentStudentMappingForm;

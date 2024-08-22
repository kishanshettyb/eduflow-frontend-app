'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { DataTable } from '@/components/dataTable/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Controller, useForm } from 'react-hook-form';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import 'react-day-picker/dist/style.css';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useFilteredStudents } from '@/services/queries/admin/student';
import { useGetAllStudentAttendancesByDate } from '@/services/queries/admin/attendance';
import { CalendarIcon } from 'lucide-react';
import {
  useCreateStudentAttendance,
  useUpdateStudentAttendance
} from '@/services/mutation/admin/attendence';

function CreateStudentAttendanceForm() {
  const { schoolId, academicYearId } = useSchoolContext();
  const searchParams = useSearchParams();
  const attendanceDateParam = searchParams.get('date');
  const initialAttendanceDate = attendanceDateParam ? new Date(attendanceDateParam) : new Date();
  const standard = searchParams.get('standard');
  const section = searchParams.get('section');

  const form = useForm({
    defaultValues: {
      attendanceDate: initialAttendanceDate,
      attendanceData: []
    }
  });

  const { data: studentData } = useFilteredStudents(
    schoolId,
    academicYearId,
    'true',
    standard,
    section
  );
  const { data: existingAttendanceData } = useGetAllStudentAttendancesByDate(
    schoolId,
    standard,
    section,
    format(initialAttendanceDate, 'yyyy-MM-dd')
  );
  const { mutate: createAttendance } = useCreateStudentAttendance();
  const { mutate: updateAttendance } = useUpdateStudentAttendance();

  const [isEditMode, setIsEditMode] = useState(false);
  const [selectAll, setSelectAll] = useState(true);

  useEffect(() => {
    if (existingAttendanceData?.data.length > 0) {
      const studentAttendanceData = existingAttendanceData?.data.map((attendance) => ({
        studentDayAttendanceId: attendance.studentDayAttendanceId,
        enrolmentId: attendance.enrolmentId,
        present: attendance.present,
        comment: attendance.comment,
        studentDto: {
          firstName: attendance.firstName,
          lastName: attendance.lastName
        }
      }));
      form.setValue('attendanceData', studentAttendanceData);
      setIsEditMode(true);
    } else if (studentData) {
      const studentAttendanceData = studentData.map((student) => ({
        enrolmentId: student.enrollmentId,
        present: true,
        comment: '',
        studentDto: {
          firstName: student.studentDto.firstName,
          lastName: student.studentDto.lastName
        }
      }));
      form.setValue('attendanceData', studentAttendanceData);
      setIsEditMode(false);
    }
  }, [studentData, existingAttendanceData, form]);

  const handleDateChange = (date) => {
    form.setValue('attendanceDate', date);
  };

  const handleSelectAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    setSelectAll(checked);
    form.setValue(
      'attendanceData',
      form.getValues('attendanceData').map((item) => ({
        ...item,
        present: checked
      }))
    );
  };

  const onSubmit = (data) => {
    const formattedDate = format(data.attendanceDate, 'yyyy-MM-dd');
    const existingDataArray = Array.isArray(existingAttendanceData?.data)
      ? existingAttendanceData.data
      : [];
    const payload = data.attendanceData.map((item) => {
      const existingItem = existingDataArray.find((att) => att.enrolmentId === item.enrolmentId);
      return {
        studentDayAttendanceId: existingItem ? existingItem.studentDayAttendanceId : undefined,
        enrollmentId: item.enrolmentId,
        present: item.present,
        comment: item.comment
      };
    });

    if (isEditMode) {
      updateAttendance({ schoolId, data: payload });
    } else {
      createAttendance({ schoolId, attendanceDate: formattedDate, data: payload });
    }
  };

  const columns: ColumnDef[] = [
    {
      accessorKey: 'attendanceDate',
      header: 'Attendance Date',
      cell: () => <div>{format(initialAttendanceDate, 'PPP')}</div>,
      enableSorting: false
    },
    {
      accessorKey: 'studentDto',
      header: 'Student Name',
      cell: ({ row }) => (
        <div>{`${row.original.studentDto?.firstName || ''} ${row.original.studentDto?.lastName || ''}`}</div>
      ),
      enableSorting: true
    },
    {
      accessorKey: 'present',
      header: () => (
        <div className="flex items-center">
          <span>Present</span>
          <input
            type="checkbox"
            className="ml-2"
            checked={selectAll}
            onChange={handleSelectAllChange}
          />
        </div>
      ),
      cell: ({ row }) => (
        <Controller
          name={`attendanceData.${row.index}.present`}
          control={form.control}
          render={({ field }) => (
            <input
              type="checkbox"
              {...field}
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
            />
          )}
        />
      ),
      enableSorting: false
    },
    {
      accessorKey: 'comment',
      header: 'Comment',
      cell: ({ row }) => (
        <Controller
          name={`attendanceData.${row.index}.comment`}
          control={form.control}
          render={({ field }) => (
            <input
              type="text"
              {...field}
              value={field.value || ''}
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        />
      ),
      enableSorting: false
    }
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <FormField
              control={form.control}
              name="attendanceDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Attendance Date<span className="text-red-600">*</span>
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
                          disabled // Make the button disabled
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
                        onSelect={(date) => {
                          field.onChange(date);
                          handleDateChange(date);
                        }}
                        captionLayout="dropdown-buttons"
                        initialFocus
                        disabled // Make the calendar disabled
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <Button type="submit" className="mt-8">
              {isEditMode ? 'Edit' : 'Save'}
            </Button>
          </div>
        </div>

        <DataTable columns={columns} data={form.watch('attendanceData')} />
      </form>
    </Form>
  );
}

export default CreateStudentAttendanceForm;

'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { DataTable } from '@/components/dataTable/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { useGetAllSchoolStaffs } from '@/services/queries/superadmin/admins';
import { CalendarIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useGetAllStaffAttendances } from '@/services/queries/admin/attendance';
import {
  useCreateStaffAttendance,
  useUpdateStaffAttendance
} from '@/services/mutation/admin/attendence';
import { attendanceFormSchema } from '@/components/forms/schema/attendenceSchema';
import { Input } from '@/components/ui/input';

function CreateStaffAttendanceForm() {
  const { schoolId } = useSchoolContext();
  const searchParams = useSearchParams();
  const attendanceDateParam = searchParams.get('date');
  const initialAttendanceDate = attendanceDateParam ? new Date(attendanceDateParam) : new Date();

  const form = useForm<FormValues>({
    resolver: zodResolver(attendanceFormSchema),
    defaultValues: {
      attendanceDate: initialAttendanceDate,
      attendanceData: []
    }
  });

  const { data: staffData, isLoading: isLoadingStaffData } = useGetAllSchoolStaffs(schoolId);
  const { data: existingAttendanceData, isLoading: isLoadingExistingAttendanceData } =
    useGetAllStaffAttendances(schoolId, format(initialAttendanceDate, 'yyyy-MM-dd'));
  const { mutate: createAttendance } = useCreateStaffAttendance();
  const { mutate: updateAttendance } = useUpdateStaffAttendance();

  const [isEditMode, setIsEditMode] = useState(false);
  const [selectAll, setSelectAll] = useState(true);

  useEffect(() => {
    if (existingAttendanceData?.data?.length > 0) {
      const staffAttendanceData = existingAttendanceData.data.map((attendance) => ({
        attendanceId: attendance.attendanceId,
        staffId: attendance.staffId,
        present: attendance.present,
        comment: attendance.comment,
        loginTime: attendance.loginTime,
        logoutTime: attendance.logoutTime,
        staffDto: {
          firstName: attendance.staffDto.firstName,
          lastName: attendance.staffDto.lastName
        }
      }));
      form.setValue('attendanceData', staffAttendanceData);
      setIsEditMode(true);
    } else if (staffData?.data?.length > 0) {
      const staffAttendanceData = staffData.data.map((staff) => ({
        staffId: staff.staffId,
        present: true,
        comment: '',
        loginTime: '10:00',
        logoutTime: '17:30',
        staffDto: {
          firstName: staff.firstName,
          lastName: staff.lastName
        }
      }));
      form.setValue('attendanceData', staffAttendanceData);
      setIsEditMode(false);
    }
  }, [staffData, existingAttendanceData, form]);

  const handleDateChange = (date: Date | null) => {
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

  const onSubmit = (data: FormValues) => {
    const formattedDate = format(data.attendanceDate, 'yyyy-MM-dd');
    const payload = data.attendanceData.map((item) => {
      const existingItem = existingAttendanceData?.data.find((att) => att.staffId === item.staffId);
      return {
        attendanceId: existingItem ? existingItem.attendanceId : undefined,
        staffId: item.staffId,
        present: item.present,
        comment: item.comment,
        loginTime: item.loginTime,
        logoutTime: item.logoutTime,
        staffDto: {
          firstName: item.staffDto.firstName,
          lastName: item.staffDto.lastName
        }
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
      accessorKey: 'staffDto',
      header: 'Staff Name',
      cell: ({ row }) => (
        <div>{`${row.original.staffDto?.firstName || ''} ${row.original.staffDto?.lastName || ''}`}</div>
      ),
      enableSorting: true
    },
    {
      accessorKey: 'loginTime',
      header: 'Login Time',
      cell: ({ row }) => (
        <Controller
          name={`attendanceData.${row.index}.loginTime`}
          control={form.control}
          render={({ field }) => (
            <Input
              type="time"
              {...field}
              value={field.value || ''}
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        />
      ),
      enableSorting: false
    },
    {
      accessorKey: 'logoutTime',
      header: 'Logout Time',
      cell: ({ row }) => (
        <Controller
          name={`attendanceData.${row.index}.logoutTime`}
          control={form.control}
          render={({ field }) => (
            <Input
              type="time"
              {...field}
              value={field.value || ''}
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        />
      ),
      enableSorting: false
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
            <Input
              type="text"
              size="sm"
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
            <Button
              type="submit"
              className="mt-8"
              disabled={isLoadingStaffData || isLoadingExistingAttendanceData}
            >
              {isEditMode ? 'Update' : 'Save'}
            </Button>
          </div>
        </div>

        <DataTable columns={columns} data={form.getValues('attendanceData')} />
      </form>
    </Form>
  );
}

export default CreateStaffAttendanceForm;

'use client';

import { useState, useEffect } from 'react';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/dataTable/DataTable';
import { ColumnDef } from '@tanstack/react-table';
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
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { useGetAllStaffAttendances } from '@/services/queries/admin/attendance';
import 'react-day-picker/dist/style.css';
import { cn } from '@/lib/utils';
import NotFound from '../notfound/notfound';
import moment from 'moment';
import Image from 'next/image';
import { ViewImage } from '../viewfiles/viewImage';
const formSchema = z.object({
  attendanceDate: z
    .date()
    .nullable()
    .refine((date) => date !== null, {
      message: 'Please select an attendance date.'
    })
});

function GetStaffAttendance() {
  const { schoolId } = useSchoolContext();
  const router = useRouter();
  const [formattedDate, setFormattedDate] = useState<string | null>(
    format(new Date(), 'yyyy-MM-dd')
  );
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      attendanceDate: new Date()
    }
  });
  const { data: staffAttendanceData } = useGetAllStaffAttendances(schoolId, formattedDate);
  const handleDateChange = (date: Date | null) => {
    if (date) {
      const formatted = format(date, 'yyyy-MM-dd');
      setFormattedDate(formatted);
    } else {
      setFormattedDate(null);
    }
    form.setValue('attendanceDate', date);
  };

  useEffect(() => {
    setFormattedDate(format(form.getValues('attendanceDate'), 'yyyy-MM-dd'));
  }, []);

  const columns: ColumnDef<StaffAttendance>[] = [
    {
      accessorKey: 'photo',
      header: 'Profile',
      cell: function CellComponent({ row }) {
        const attachmentId = row.original.staffDto?.photo?.attachmentId;

        if (!attachmentId) {
          const gender = row.original.staffDto.gender;
          return (
            <div className="flex w-[200px] flex-row items-center justify-start gap-x-4">
              <div>
                <Image
                  src={gender == 'male' ? '/man-1.png' : '/woman-1.png'}
                  alt="eduflow"
                  width="50"
                  height="50"
                  className="object-contain rounded-full"
                />
              </div>
            </div>
          );
        }

        return (
          <ViewImage
            schoolId={schoolId}
            attachmentId={attachmentId}
            width={40}
            height={40}
            styles="rounded-full object-cover"
            alt="eduflow"
          />
        );
      }
    },
    {
      accessorKey: 'staffDto.firstName',
      header: 'Staff Name',
      cell: ({ row }) => {
        return (
          <div>
            {`${row.original.staffDto?.firstName || ''} ${row.original.staffDto?.lastName || ''}`}
          </div>
        );
      },
      enableSorting: true
    },
    {
      accessorKey: 'attendanceDate',
      header: 'Attendance Date',
      cell: ({ row }) => <div>{moment(row.getValue('attendanceDate')).format('DD MMMM YYYY')}</div>,
      enableSorting: true
    },
    {
      accessorKey: 'loginTime',
      header: 'Login Time',
      cell: ({ row }) => (
        <div>{moment(row.getValue('loginTime'), 'HH:mm:ss').format('hh:mm:ss A')}</div>
      ),
      enableSorting: true
    },
    {
      accessorKey: 'logoutTime',
      header: 'Logout Time',
      cell: ({ row }) => (
        <div>{moment(row.getValue('logoutTime'), 'HH:mm:ss').format('hh:mm:ss A')}</div>
      ),
      enableSorting: true
    },
    {
      accessorKey: 'present',
      header: 'Status',
      cell: ({ row }) => (
        <div>
          {row.getValue('present') ? (
            <div className="border border-green-200 w-100  rounded-2xl px-2 py-1 w-auto flex justify-center items-center ">
              <p className="text-xs text-green-500">Present</p>
            </div>
          ) : (
            <div className="border border-red-200  w-100 rounded-2xl px-2 py-1 w-auto flex justify-center items-center ">
              <p className="text-xs text-red-500">Absent</p>
            </div>
          )}
        </div>
      ),
      enableSorting: true
    },
    {
      accessorKey: 'comment',
      header: 'Comment',
      cell: ({ row }) => <div>{row.getValue('comment')}</div>,
      enableSorting: true
    }
  ];

  const handleCreateAttendance = () => {
    router.push(`/admin/attendance/staff-attendances/create?date=${formattedDate}`);
  };

  return (
    <>
      <div className="border p-4 mb-96 shadow-3xl rounded-2xl mb-5">
        <Form {...form}>
          <div className="mb-5 bg-slate-100 dark:bg-slate-900 dark:bg-slate-950  border border-slate-200  p-4 rounded-2xl flex justify-start gap-4">
            <div className="w-1/5">
              <FormField
                control={form.control}
                name="attendanceDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Date</FormLabel>
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
                          onSelect={(date) => {
                            field.onChange(date);
                            handleDateChange(date);
                          }}
                          captionLayout="dropdown-buttons"
                          fromYear={2000}
                          toYear={2024}
                          disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-xs text-red-600" />
                  </FormItem>
                )}
              />
            </div>
            {staffAttendanceData?.data == '' ? (
              <div>{''}</div>
            ) : (
              <div>
                <Button onClick={handleCreateAttendance} className="mt-8">
                  Update
                </Button>
              </div>
            )}
          </div>
        </Form>

        {staffAttendanceData?.data == '' ? (
          <NotFound
            title="No Attendance Found!!"
            description="Please click the button to create an attandance"
            btnLink={'./staff-attendances/create?date=' + formattedDate}
            btnName="Add Attendance"
            image="/Nodata.svg"
          />
        ) : (
          <DataTable columns={columns} data={staffAttendanceData?.data || []} />
        )}
      </div>
    </>
  );
}

export default GetStaffAttendance;

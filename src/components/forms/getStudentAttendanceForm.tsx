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
import { useGetAllStudentAttendancesByDate } from '@/services/queries/admin/attendance';
import 'react-day-picker/dist/style.css';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useGetAllStandards, useSectionByStandard } from '@/services/queries/admin/standard';

const formSchema = z.object({
  attendanceDate: z
    .date()
    .nullable()
    .refine((date) => date !== null, {
      message: 'Please select an attendance date.'
    }),
  standard: z.string().nonempty('Please select a standard.'),
  section: z.string().nonempty('Please select a section.')
});

function GetStudentAttendance() {
  const { schoolId, academicYearId } = useSchoolContext();
  const router = useRouter();
  const [selectedStandard, setSelectedStandard] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [formattedDate, setFormattedDate] = useState<string | null>(
    format(new Date(), 'yyyy-MM-dd')
  );

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      attendanceDate: new Date(),
      standard: '',
      section: ''
    }
  });

  const { data: standardsData } = useGetAllStandards(schoolId, academicYearId);
  const { data: sectionsData } = useSectionByStandard(schoolId, academicYearId, selectedStandard);

  const { data: studentAttendanceData } = useGetAllStudentAttendancesByDate(
    schoolId,
    selectedStandard,
    selectedSection,
    formattedDate
  );

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

  const columns: ColumnDef[] = [
    {
      accessorKey: 'firstName',
      header: 'First Name',
      cell: ({ row }) => <div>{row.getValue('firstName')}</div>,
      enableSorting: true
    },
    {
      accessorKey: 'lastName',
      header: 'Last Name',
      cell: ({ row }) => <div>{row.getValue('lastName')}</div>,
      enableSorting: true
    },
    {
      accessorKey: 'present',
      header: 'Present',
      cell: ({ row }) => <div>{row.getValue('present') ? 'Yes' : 'No'}</div>,
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
    router.push(
      `/teacher/attendances/studentAttendance/create?date=${formattedDate}&standard=${selectedStandard}&section=${selectedSection}`
    );
  };

  return (
    <div className="border rounded-2xl shadow-3xl p-4">
      <div className="bg-slate-100 border border-slate-200 dark:bg-slate-900 p-4 rounded-2xl mb-2">
        <Form {...form}>
          <div className="mb-5 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div>
              <FormField
                control={form.control}
                name="attendanceDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Attendance Date<span className="text-red-600 ">*</span>
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
            <div>
              <FormField
                control={form.control}
                name="standard"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Standard<span className="text-red-600">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedStandard(value);
                      }}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Standard" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {standardsData?.data?.map((standard) => (
                          <SelectItem key={standard} value={standard}>
                            {standard}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="section"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Section<span className="text-red-600">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedSection(value);
                      }}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Section" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sectionsData?.data?.map((section) => (
                          <SelectItem key={section} value={section}>
                            {section}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <Button onClick={handleCreateAttendance} className="mt-8">
                Add Attendance
              </Button>
            </div>
          </div>
        </Form>
      </div>

      <DataTable columns={columns} data={studentAttendanceData?.data || []} />
    </div>
  );
}

export default GetStudentAttendance;

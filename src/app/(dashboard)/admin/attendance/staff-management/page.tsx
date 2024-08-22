'use client';
import React, { useState, useEffect } from 'react';
import { useGetAllStaffAttendanceByRange } from '@/services/queries/admin/attendance';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import 'react-day-picker/dist/style.css';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
import TitleBar from '@/components/header/titleBar';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const StaffMonthAttendancePage: React.FC = () => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [attendanceType, setAttendanceType] = useState<string>('weekly');
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const { schoolId } = useSchoolContext();

  const getDaysInRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const days = [];
    while (startDate <= endDate) {
      days.push(new Date(startDate));
      startDate.setDate(startDate.getDate() + 1);
    }
    return days;
  };

  const size = getDaysInRange(startDate, endDate).length * 600;

  const { data, refetch } = useGetAllStaffAttendanceByRange(schoolId, {
    page: '0',
    size,
    sortBy: [],
    sortOrder: 'desc',
    startDate,
    endDate
  });

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);

  useEffect(() => {
    const currentDate = new Date();
    if (attendanceType === 'weekly') {
      const firstDay = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
      const lastDay = new Date(
        currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 6)
      );
      setStartDate(firstDay.toISOString().split('T')[0]);
      setEndDate(lastDay.toISOString().split('T')[0]);
    } else if (attendanceType === 'monthly') {
      const firstDay = new Date(selectedYear, selectedMonth, 1);
      const lastDay = new Date(selectedYear, selectedMonth + 1, 0);
      setStartDate(firstDay.toISOString().split('T')[0]);
      setEndDate(lastDay.toISOString().split('T')[0]);
    }
  }, [attendanceType, selectedMonth, selectedYear]);

  useEffect(() => {
    if (startDate && endDate) {
      refetch();
    }
  }, [startDate, endDate, refetch]);

  const isWeekend = (date: Date) => {
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  };

  const getDayOfWeek = (date: Date) => {
    return daysOfWeek[date.getDay()];
  };

  const pageCount = Math.ceil((data?.data?.content.length || 0) / perPage);

  const renderData = () => {
    if (!data) return null;

    const groupedData = data?.data?.content.reduce((acc, curr) => {
      const staffId = curr.staffDto?.staffId;
      if (!acc[staffId]) {
        acc[staffId] = [];
      }
      acc[staffId].push(curr);
      return acc;
    }, {});

    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedStaffIds = Object.keys(groupedData).slice(startIndex, endIndex);

    return paginatedStaffIds.map((staffId) => {
      const attendanceRecords = groupedData[staffId];
      const staffInfo = attendanceRecords[0].staffDto;

      const attendanceByDate = getDaysInRange(startDate, endDate).map((date) => {
        const formattedDate = format(date, 'dd-MMMM-yyyy');
        const attendance = attendanceRecords.find(
          (record) => format(parseISO(record.attendanceDate), 'dd-MMMM-yyyy') === formattedDate
        );

        const day = date.getDate();
        const isWeekendDay = isWeekend(date);

        return (
          <TableCell
            key={day}
            className={`border dark:bg-slate-900 border-gray-300 ${isWeekendDay ? 'bg-gray-200 dark:bg-gray-900' : ''}`}
          >
            {attendance ? (
              attendance.present ? (
                <div>
                  <div className="px-2 rounded-lg bg-green-100 border border-green-600">
                    <p className="text-[10px] text-green-600">Present</p>
                  </div>
                  <span className="text-[10px]">{attendance.comment}</span>
                </div>
              ) : (
                <div className="flex justify-start flex-col">
                  <div className="px-2 rounded-lg bg-red-100 border border-red-600">
                    <p className="text-[12px] text-red-600">Absent</p>
                  </div>
                  <span className="text-[10px]">{attendance.comment}</span>
                </div>
              )
            ) : (
              '-'
            )}
          </TableCell>
        );
      });

      return (
        <TableRow key={staffInfo.staffId} className="dark:bg-slate-900">
          <TableCell className="border border-gray-300">
            <div className="flex flex-row justify-start items-center gap-x-2 w-[200px]">
              <div>
                <Image
                  src={staffInfo.staffDto?.gender === 'male' ? '/man-1.png' : '/woman-1.png'}
                  alt="Profile"
                  width="40"
                  height="40"
                  className="rounded-full w-[40px] h-[40px] object-contain border"
                />
              </div>
              <div>
                <p>
                  {staffInfo.firstName} {staffInfo.lastName}
                </p>
              </div>
            </div>
          </TableCell>
          {attendanceByDate}
        </TableRow>
      );
    });
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pageCount) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePerPageChange = (value: string) => {
    setPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when per page changes
  };

  const handleAttendanceTypeChange = (value: string) => {
    setAttendanceType(value);
    setCurrentPage(1); // Reset to first page when attendance type changes
  };

  const handleMonthChange = (value: string) => {
    setSelectedMonth(Number(value));
  };

  const handleYearChange = (value: string) => {
    setSelectedYear(Number(value));
  };

  return (
    <div className="p-4">
      <TitleBar title="Staff Attendance" placeholder="Search..." />
      <div className="border border-slate-100 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-3xl mb-60">
        <div className="border border-slate-100 mb-5 bg-slate-50 dark:bg-slate-900 border p-6 rounded-2xl shadow-3xl grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm font-medium mb-2">Attendance Type</p>
            <Select onValueChange={handleAttendanceTypeChange} defaultValue={attendanceType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Attendance Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {attendanceType === 'monthly' && (
            <>
              <div>
                <p htmlFor="month" className="text-sm font-medium mb-2">
                  Month
                </p>
                <Select onValueChange={handleMonthChange} defaultValue={String(selectedMonth)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem key={i} value={String(i)}>
                        {new Date(0, i).toLocaleString('default', { month: 'long' })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <p htmlFor="year" className="text-sm font-medium mb-2">
                  Year
                </p>
                <Select onValueChange={handleYearChange} defaultValue={String(selectedYear)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(
                      (year) => (
                        <SelectItem key={year} value={String(year)}>
                          {year}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="border dark:bg-slate-900 border-gray-300">Staff Name</TableHead>
              {getDaysInRange(startDate, endDate).map((date) => {
                const dayOfWeek = getDayOfWeek(date);
                return (
                  <TableHead
                    key={date.toISOString()}
                    className={`border border-gray-300 ${isWeekend(date) ? 'bg-gray-200 dark:bg-gray-900' : ''}`}
                  >
                    {`${date.getDate()} ${dayOfWeek}`}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>{renderData()}</TableBody>
        </Table>
        <TableFooter className="flex flex-row justify-between items-center pt-4">
          <Button variant="outline" onClick={handlePreviousPage} disabled={currentPage === 1}>
            Previous
          </Button>
          <div className="flex items-center">
            <span className="mr-2">Rows per page:</span>
            <Select onValueChange={handlePerPageChange} defaultValue={String(perPage)}>
              <SelectTrigger className="w-20">
                <SelectValue placeholder="Rows per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" onClick={handleNextPage} disabled={currentPage === pageCount}>
            Next
          </Button>
        </TableFooter>
      </div>
    </div>
  );
};

export default StaffMonthAttendancePage;

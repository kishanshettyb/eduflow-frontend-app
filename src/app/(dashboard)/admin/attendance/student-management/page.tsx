'use client';
import React, { useState, useEffect } from 'react';
import { useGetAllStudentByRange } from '@/services/queries/admin/attendance';
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
import { format } from 'date-fns';
import TitleBar from '@/components/header/titleBar';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const StudentMonthAttendancePage: React.FC = () => {
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
  const { data, refetch } = useGetAllStudentByRange(schoolId, {
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
    const groupedData = data?.data?.content.reduce((acc, record) => {
      const { enrollmentId } = record;
      if (!acc[enrollmentId]) {
        acc[enrollmentId] = [];
      }
      acc[enrollmentId].push(record);
      return acc;
    }, {});

    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedEnrollmentIds = Object.keys(groupedData).slice(startIndex, endIndex);

    return paginatedEnrollmentIds.map((enrollmentId) => {
      const attendanceRecords = groupedData[enrollmentId];
      const studentInfo = attendanceRecords[0];
      const attendanceByDate = getDaysInRange(startDate, endDate).map((date) => {
        const formattedDate = format(date, 'dd-MMMM-yyyy');
        const attendance = attendanceRecords.find(
          (record) => format(new Date(record.attendanceDate), 'dd-MMMM-yyyy') === formattedDate
        );

        const day = date.getDate();
        const isWeekendDay = isWeekend(date);

        return (
          <TableCell
            key={day}
            className={`border border-gray-300 ${isWeekendDay ? 'bg-gray-200' : ''}`}
          >
            {attendance ? (
              attendance.present ? (
                <div className="px-2 rounded-lg bg-green-100 border border-green-600">
                  <p className="text-[10px] text-green-600">Present</p>
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
        <TableRow key={studentInfo.studentDayAttendanceId}>
          <TableCell className="border border-gray-300">
            <div className="flex flex-row justify-start items-center gap-x-2 w-[200px]">
              <div>
                <Image
                  src={'/woman.png'}
                  alt="Profile"
                  width="40"
                  height="40"
                  className="rounded-full w-[40px] h-[40px] object-contain border"
                />
              </div>
              <div>
                <p>
                  {studentInfo?.firstName} {studentInfo?.lastName}
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
      <TitleBar title="Student Attendance" placeholder="Search..." />
      <div className="border border-slate-100 mb-5 bg-white p-6 rounded-2xl">
        <div className="flex gap-4 w-full mb-5">
          <div className="w-1/4">
            <p htmlFor="attendanceType" className="text-sm font-medium mb-2">
              Attendance Type
            </p>
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
          <div className="grid w-1/2 gap-4 grid-cols-2">
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
                      {Array.from({ length: 12 }).map((_, index) => (
                        <SelectItem key={index} value={String(index)}>
                          {format(new Date(0, index), 'MMMM')}
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
                      {Array.from({ length: 10 }).map((_, index) => (
                        <SelectItem key={index} value={String(new Date().getFullYear() - index)}>
                          {new Date().getFullYear() - index}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="max-w-full overflow-auto">
          <Table className="border border-gray-300 min-w-full divide-y divide-gray-200">
            <TableHeader>
              <TableRow>
                <TableHead className="border border-gray-300">Student Name</TableHead>
                {getDaysInRange(startDate, endDate).map((date, index) => (
                  <TableHead key={index} className="border border-gray-300">
                    <div className="flex flex-col items-center">
                      <span className={`font-semibold ${isWeekend(date) ? 'text-red-500' : ''}`}>
                        {format(date, 'dd')}
                      </span>
                      <span className="text-sm">{getDayOfWeek(date)}</span>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>{renderData()}</TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={getDaysInRange(startDate, endDate).length + 1}>
                  <div className="flex justify-between items-center py-2">
                    <div>
                      <Button
                        variant="outline"
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleNextPage}
                        disabled={currentPage === pageCount}
                      >
                        Next
                      </Button>
                    </div>
                    <div className="flex items-center">
                      <span>Rows per page: </span>
                      <Select onValueChange={handlePerPageChange} defaultValue={String(perPage)}>
                        <SelectTrigger className="w-16">
                          <SelectValue placeholder="Rows" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="25">25</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <span>
                        Page {currentPage} of {pageCount}
                      </span>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default StudentMonthAttendancePage;

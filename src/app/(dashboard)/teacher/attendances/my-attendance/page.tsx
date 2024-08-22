'use client';
import React, { useMemo, useState } from 'react';
import { useGetStaffAttendance } from '@/services/queries/admin/attendance';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import TitleBar from '@/components/header/titleBar';
import { format, parseISO } from 'date-fns';

const StaffAttendanceGrid = () => {
  const { schoolId, staffId } = useSchoolContext();
  const { data: attendances, error } = useGetStaffAttendance(schoolId, staffId);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const attendanceDates = useMemo(() => {
    if (!attendances) return {};

    return attendances?.data?.map((attendance) => ({
      date: format(parseISO(attendance.attendanceDate), 'dd-MMMM-yyyy'),
      status: attendance.present ? 'Present' : 'Absent'
    }));
  }, [attendances]);

  const renderDayCell = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const attendance = attendanceDates.find((item) => item.date === format(date, 'dd-MMMM-yyyy'));
    const attendanceStatus = attendance ? attendance.status : '';
    const bgColor =
      attendanceStatus === 'Present'
        ? 'bg-green-500'
        : attendanceStatus === 'Absent'
          ? 'bg-red-500'
          : '';
    const cellClasses = `p-2 border border-gray-300 flex justify-between ${bgColor}`;

    return (
      <div key={dateStr} className={cellClasses}>
        <span>{date.getDate()}</span>
      </div>
    );
  };
  const renderMonthGrid = () => {
    if (!attendances) return null;

    const numDays = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const firstDay = new Date(selectedYear, selectedMonth, 1);
    const lastDay = new Date(selectedYear, selectedMonth, numDays);

    const days = [];
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(<div key={`empty-${i}`} className="p-2 border border-gray-300"></div>);
    }
    for (let date = new Date(firstDay); date <= lastDay; date.setDate(date.getDate() + 1)) {
      days.push(renderDayCell(new Date(date)));
    }

    return days;
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(parseInt(event.target.value));
  };

  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value));
  };

  if (error) return <div>Error loading attendance data</div>;

  return (
    <>
      <div className="mt-5">
        <TitleBar title="My Attendance" search={false} sort={false} />
      </div>
      <div className="p-4 border rounded-2xl shadow-3xl bg-slate-50 dark:bg-slate-900">
        <div className="flex border rounded-xl p-4  justify-start items-center mb-6">
          <label className="mr-2">Month:</label>
          <select
            value={selectedMonth}
            onChange={handleMonthChange}
            className="p-2 border border-gray-300 rounded"
          >
            {Array.from({ length: 12 }, (_, index) => (
              <option key={index} value={index}>
                {new Date(selectedYear, index).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
          <label className="ml-4 mr-2">Year:</label>
          <select
            value={selectedYear}
            onChange={handleYearChange}
            className="p-2 border border-gray-300 rounded"
          >
            {Array.from({ length: 10 }, (_, index) => (
              <option key={index} value={new Date().getFullYear() - index}>
                {new Date().getFullYear() - index}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-7 gap-1">
          <div className="p-2 bg-gray-200 font-semibold dark:bg-slate-900">Sun</div>
          <div className="p-2 bg-gray-200 font-semibold dark:bg-slate-900">Mon</div>
          <div className="p-2 bg-gray-200 font-semibold dark:bg-slate-900">Tue</div>
          <div className="p-2 bg-gray-200 font-semibold dark:bg-slate-900">Wed</div>
          <div className="p-2 bg-gray-200 font-semibold dark:bg-slate-900">Thu</div>
          <div className="p-2 bg-gray-200 font-semibold dark:bg-slate-900">Fri</div>
          <div className="p-2 bg-gray-200 font-semibold dark:bg-slate-900">Sat</div>
          {renderMonthGrid()}
        </div>
      </div>
    </>
  );
};

export default StaffAttendanceGrid;

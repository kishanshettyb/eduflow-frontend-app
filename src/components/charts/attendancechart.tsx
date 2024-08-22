'use client';

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, Label } from 'recharts';
import { format } from 'date-fns';
import { useGetAllStaffPresentAbsesnt } from '@/services/queries/admin/attendance';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

const AttendanceChart = () => {
  const { schoolId } = useSchoolContext();
  const currentDate = format(new Date(), 'dd MMMM yyyy');
  const { data: attendanceData } = useGetAllStaffPresentAbsesnt(
    schoolId,
    format(new Date(), 'yyyy-MM-dd')
  );

  const chartData = [
    { name: 'Present', value: attendanceData?.data.Present || 0, fill: '#0088FE' },
    { name: 'Absent', value: attendanceData?.data.Absent || 0, fill: '#FF8042' }
  ];

  const totalAttendance = React.useMemo(() => {
    return attendanceData ? attendanceData.data.Present + attendanceData.data.Absent : 0;
  }, [attendanceData]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Attendance Overview</CardTitle>
        <CardDescription>{currentDate}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="flex justify-center">
          <PieChart width={400} height={400}>
            <Pie
              data={chartData}
              cx={200}
              cy={200}
              innerRadius={60}
              outerRadius={120}
              dataKey="value"
              fill="#8884d8"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="text-3xl font-bold fill-foreground"
                        >
                          {totalAttendance.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">Showing total attendance data</div>
      </CardFooter>
    </Card>
  );
};

export default AttendanceChart;

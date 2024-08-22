'use client';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import ReusableLineChart from '@/components/charts/lineChart';

const data = [
  { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 }
];

const lineKeys = ['pv', 'uv'];
const colors = ['#8884d8', '#82ca9d'];

function AttendanceOverviewCard() {
  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl text-slate-800 font-semibold">Attendance Overview</h2>
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                All
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Staff</DropdownMenuLabel>
              <DropdownMenuLabel>Student</DropdownMenuLabel>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="w-full my-10 h-[500px]">
        <ReusableLineChart data={data} lineKeys={lineKeys} colors={colors} />
      </div>
    </>
  );
}

export default AttendanceOverviewCard;

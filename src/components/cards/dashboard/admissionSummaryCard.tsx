import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import ReusableBarChart from '../../charts/barChart';
import { useViewAcademicYear } from '@/services/queries/admin/academicYear';
import { useSchoolContext } from '@/lib/provider/schoolContext';

const data = [
  { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 }
];

const barKeys = ['pv', 'uv'];
const colors = ['#8884d8', '#82ca9d'];

function AdmissionSummaryCard() {
  const { schoolId } = useSchoolContext();
  const { data: academicYears, isLoading } = useViewAcademicYear(schoolId);
  const [selectedYear, setSelectedYear] = useState(null);

  const handleSelectYear = (year) => {
    setSelectedYear(year);
  };
  return (
    <>
      <div className="flex justify-between items-center ">
        <div>
          <h2 className="text-xl text-slate-800 font-semibold">Admission Summary</h2>
          <p className="text-slate-500 text-xs">Track your Admissions history</p>
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div>
                <Button variant="outline" size="sm">
                  {selectedYear ? selectedYear.title : 'Select Year'}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Select Academic Year</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {isLoading ? (
                <DropdownMenuItem>Loading...</DropdownMenuItem>
              ) : (
                academicYears?.data.map((year) => (
                  <DropdownMenuItem
                    key={year.academicYearId}
                    onClick={() => handleSelectYear(year)}
                  >
                    {year.title}
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex my-5 gap-5 justify-start items-center ">
        <div className="flex justify-center items-center gap-x-2">
          <div className="block w-3 h-3 bg-blue-500 rounded-full"></div>
          <p className="text-xs text-slate-600">Total number of applications received </p>
        </div>
        <div className="flex justify-center items-center gap-x-2">
          <div className="block w-3 h-3 bg-green-500 rounded-full"></div>
          <p className="text-xs text-slate-600">Applications in progress</p>
        </div>
      </div>
      <div className="w-full my-10 h-[400px]">
        <ReusableBarChart data={data} barKeys={barKeys} colors={colors} />
      </div>
    </>
  );
}

export default AdmissionSummaryCard;

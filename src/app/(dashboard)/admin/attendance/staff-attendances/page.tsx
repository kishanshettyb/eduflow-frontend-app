'use client';
import dynamic from 'next/dynamic';
import { CalendarCheck, CalendarOff, Users } from 'lucide-react';
import { useGetAllStaffs } from '@/services/queries/admin/staff';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { useGetAllStaffPresentAbsesnt } from '@/services/queries/admin/attendance';
import { format } from 'date-fns';
const GetStaffAttendance = dynamic(() => import('@/components/forms/getStaffAttendenceForm'), {
  ssr: false
});
const TitleBar = dynamic(() => import('@/components/header/titleBar'), {
  ssr: false
});
function StaffAttendance() {
  const { schoolId } = useSchoolContext();
  const { data: allStaffsData } = useGetAllStaffs(schoolId);
  const allStaffsCount = allStaffsData?.data?.length;
  const currentDate = format(new Date(), 'yyyy-MM-dd');
  const { data: attendnaceData } = useGetAllStaffPresentAbsesnt(schoolId, currentDate);

  return (
    <>
      <div className="mt-5">
        <div className="mt-5">
          <TitleBar title="Staff Attendance" />
        </div>

        <div className="border border-slate-100 mb-5  bg-white dark:bg-slate-900 dark:border-slate-600 p-6 rounded-2xl shadow-3xl grid grid-cols-3 gap-4">
          <div className="p-4 border border-slate-200 dark:border-slate-600 rounded-xl p-4 flex justify-start gap-x-4 items-center">
            <div>
              <div className="rounded-xl bg-blue-50 border border-blue-100 p-3">
                <Users className="text-blue-400" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold">{allStaffsCount}</h2>
              <h2 className="text-md text-slate-400">Total Staff</h2>
            </div>
          </div>
          <div className="p-4 border border-slate-200 rounded-xl p-4 flex justify-start gap-x-4 items-center">
            <div>
              <div className="rounded-xl bg-green-50 border border-green-100 p-3">
                <CalendarCheck className="text-green-400" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold">{attendnaceData?.data?.Present || 0}</h2>
              <h2 className="text-md text-slate-400">Present</h2>
            </div>
          </div>
          <div className="p-4 border border-slate-200 rounded-xl p-4 flex justify-start gap-x-4 items-center">
            <div>
              <div className="rounded-xl bg-red-50 border border-red-100 p-3">
                <CalendarOff className="text-red-400" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold">{attendnaceData?.data?.Absent || 0}</h2>
              <h2 className="text-md text-slate-400">Absent</h2>
            </div>
          </div>
        </div>

        <>
          <GetStaffAttendance />
        </>
      </div>
    </>
  );
}

export default StaffAttendance;

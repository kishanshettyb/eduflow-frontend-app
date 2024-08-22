'use client';
import React, { useEffect, useState } from 'react';
import InfoCountCard from '@/components/cards/infoCountCard';
import NotFound from '@/components/notfound/notfound';
import { BasicSlider } from '@/components/sliders/basicSlider';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { useViewAcademicYear } from '@/services/queries/admin/academicYear';
import LatestTransactionCard from '@/components/cards/latestTransactionCard';
import WelcomeCard from '@/components/cards/welcomeCard';
import AdmissionSummaryCard from '@/components/cards/dashboard/admissionSummaryCard';
import AttendanceOverviewCard from '@/components/cards/dashboard/attendanceOverviewCard';
import SchoolBannerCard from '@/components/cards/SchoolBannerCard';
import { useGetStudentCount } from '@/services/queries/admin/student';
import { useGetAllStaffs, useGetStaffCount } from '@/services/queries/admin/staff';
import { useGetAllStandard } from '@/services/queries/admin/standard';
import AttendanceChart from '@/components/charts/attendancechart';
import { NewBarChart } from '@/components/charts/newBarChart';
import { NewPieChart } from '@/components/charts/newPieChart';

function AdminDashboard() {
  const [showAccademicyeanNotFound, setShowAccademicyeanNotFound] = useState(true);
  const { schoolId, academicYearId } = useSchoolContext();
  const { data: academicData } = useViewAcademicYear(schoolId);
  const academicYearData = academicData?.data;

  const { data: studentCountData, isLoading: isStudentCountLoading } = useGetStudentCount(
    schoolId,
    academicYearId
  );
  const studentCount = studentCountData?.data;

  const staffType = 'ROLE_TEACHER';

  const { data: staffCountData, isLoading: isStaffCountLoading } = useGetStaffCount(
    schoolId,
    staffType
  );
  const staffCount = staffCountData?.data;

  const { data: allStaffsData, isLoading: isAllStaffsLoading } = useGetAllStaffs(schoolId);
  const allStaffsCount = allStaffsData?.data?.length;

  const { data: allClassData, isLoading: isAllClassLoading } = useGetAllStandard(
    schoolId,
    academicYearId
  );
  const allClassCount = allClassData?.data?.length;

  useEffect(() => {
    if (academicYearData && academicYearData.length > 0) {
      setShowAccademicyeanNotFound(true);
    } else {
      setShowAccademicyeanNotFound(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [academicData]);

  return (
    <>
      <div className="mb-[200px]">
        <SchoolBannerCard />
        <div className="flex flex-col gap-2 mt-5 md:flex-row">
          <div className="w-full md:w-2/3 lg:w-3/5">
            <WelcomeCard
              title="Welcome back"
              role="Admin"
              description="Eduflow SaaS admin! Total control, seamless operation across schools."
              imageUrl="/other/admin.png"
              cardLink="#"
            />
          </div>
          <div className="w-full text-lg font-semibold md:w-1/3 lg:w-2/5 ">
            <BasicSlider />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 my-10">
          <div>
            <InfoCountCard
              isLoading={isStudentCountLoading}
              cardLink="/admin/students/searchStudent"
              blueBg={true}
              title={studentCount}
              description="Students"
              imageUrl="/icons/student.svg"
            />
          </div>
          <div>
            <InfoCountCard
              isLoading={isStaffCountLoading}
              cardLink="/admin/staffs"
              blueBg={true}
              title={staffCount}
              description="Teachers"
              imageUrl="/icons/teacher.svg"
            />
          </div>
          <div>
            <InfoCountCard
              isLoading={isAllStaffsLoading}
              cardLink="/admin/staffs"
              greenBg={true}
              title={allStaffsCount}
              description="Staffs"
              imageUrl="/icons/staff.svg"
            />
          </div>
          <div>
            <InfoCountCard
              isLoading={isAllClassLoading}
              yellowBg={true}
              cardLink="/admin/standards"
              title={allClassCount}
              description="Classes"
              imageUrl="/icons/classroom.svg"
            />
          </div>
        </div>

        <div className="flex justify-between gap-x-5">
          <div className="w-1/2 h-auto ">
            <NewBarChart />
          </div>
          <div className="w-1/2 h-auto ">
            <NewPieChart />
          </div>
        </div>
        <div className="flex justify-between gap-x-5">
          <div className="w-1/2 border my-10 p-4 bg-white rounded-2xl h-[600px] hidden">
            <AdmissionSummaryCard />
          </div>
          <div className="w-1/2 h-auto p-4 my-10 bg-white border rounded-2xl hidden">
            <AttendanceOverviewCard />
          </div>
        </div>

        <div className="w-1/2 h-auto p-4 my-10 bg-white border rounded-2xl hidden">
          <AttendanceChart />
        </div>
        <div className="w-full mt-10">
          <LatestTransactionCard />
        </div>
        {showAccademicyeanNotFound == false ? (
          <div className="flex justify-between">
            <div className="w-1/2 p-4 border bg-slate-50 rounded-2xl">
              <NotFound
                image="/Nodata.svg"
                title="Add Academic Year"
                description="Please Add Academic Year"
                btnLink="/admin/academic-years"
                btnName="Add Academic Year"
              />
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </>
  );
}

export default AdminDashboard;

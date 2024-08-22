'use client';
import DashboardHeader from '@/components/header/dashboardHeader';
import Sidebar from '@/components/sidebar/sidebar';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { useGetAllUsersDetails } from '@/services/queries/users/users';

export default function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {
    setStudentId,
    setAttachmentId,
    setFirstName,
    setLastName,
    setEnrollmentId,
    setStandardId,
    schoolId,
    userName
  } = useSchoolContext();

  const { data: userDetails } = useGetAllUsersDetails(schoolId, userName);

  const studentId = userDetails?.data.enrollmentStudentDto.studentId;
  const standardId = userDetails?.data.enrollmentStudentDto.standardId;
  const enrollmentId = userDetails?.data.enrollmentStudentDto.enrollmentId;
  const firstName = userDetails?.data.firstName;
  const lastName = userDetails?.data.lastName;
  const attachmentId = userDetails?.data?.photo?.attachmentId;

  setStudentId(studentId);
  setStandardId(standardId);
  setEnrollmentId(enrollmentId);
  setAttachmentId(attachmentId);
  setFirstName(firstName);
  setLastName(lastName);
  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex relative flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <DashboardHeader />
          <main>
            <div className="container  pt-0 lg:pt-[100px] px-4 xl:px-8 pb-4 mx-auto">
              {children}
            </div>
          </main>
          {/* <DashboardFooter /> */}
        </div>
      </div>
    </>
  );
}

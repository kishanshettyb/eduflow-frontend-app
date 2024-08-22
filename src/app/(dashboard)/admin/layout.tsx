'use client';
import DashboardFooter from '@/components/footer/dashboardFooter';
import DashboardHeader from '@/components/header/dashboardHeader';
import Sidebar from '@/components/sidebar/sidebar';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { useGetAllUsersDetails } from '@/services/queries/users/users';
import { Modal } from '@/components/modals/modal';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useViewAcademicYear } from '@/services/queries/admin/academicYear';
import webSocketService from '@/services/webSocketService';

export default function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { setStaffId, setAttachmentId, setFirstName, setLastName, schoolId, userName } =
    useSchoolContext();

  const { data: userDetails } = useGetAllUsersDetails(schoolId, userName);
  const router = useRouter();
  const staffId = userDetails?.data.staffId;
  const firstName = userDetails?.data.firstName;
  const lastName = userDetails?.data.lastName;
  const attachmentId = userDetails?.data?.photo?.attachmentId;
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [academicYearId, setAcademicYearId] = useState<number | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    webSocketService.connect();

    // Cleanup on component unmount
    return () => {};
  }, []);

  const { data: academicData } = useViewAcademicYear(schoolId);
  const academicYearData = academicData?.data;

  useEffect(() => {
    if (academicYearData && academicYearData.length > 0) {
      const firstAcademicYearId = academicYearData[0]?.academicYearId;
      setAcademicYearId(firstAcademicYearId);
    } else {
      setAcademicYearId(null);
    }
  }, [academicData]);

  useEffect(() => {
    let timer;
    if (pathname !== '/admin/academic-years' && !academicYearId) {
      timer = setTimeout(() => {
        setIsCreateDialogOpen(true);
      }, 2000);
    } else {
      setIsCreateDialogOpen(false);
    }
    return () => clearTimeout(timer);
  }, [academicYearId, pathname]);

  useEffect(() => {
    setStaffId(staffId);
    setAttachmentId(attachmentId);
    setFirstName(firstName);
    setLastName(lastName);
  }, [
    setStaffId,
    setAttachmentId,
    setFirstName,
    setLastName,
    staffId,
    attachmentId,
    firstName,
    lastName
  ]);

  const handleCreateAcademicYear = () => {
    router.push('/admin/academic-years');
    setIsCreateDialogOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Modal
        title="No Academic Year Created"
        description="Academic year is not created. Please create the academic year to proceed."
        open={isCreateDialogOpen}
        closeOnEscape={false}
        closeOnOverlayClick={false}
      >
        <div className="flex items-center justify-end space-x-2">
          <Button className="mt-5" onClick={handleCreateAcademicYear}>
            Create Academic Year
          </Button>
        </div>
      </Modal>

      <Sidebar />
      <div className="flex relative flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <DashboardHeader />
        <main>
          <div className="container pt-0 lg:pt-[100px] px-4 xl:px-8 pb-4 mx-auto">{children}</div>
        </main>
        <DashboardFooter />
      </div>
    </div>
  );
}

'use client';

import GetStudentAttendance from '@/components/forms/getStudentAttendanceForm';
import TitleBar from '@/components/header/titleBar';

function StudentAttendance() {
  return (
    <>
      <div className="mt-5">
        <div className="mt-5">
          <TitleBar title="Student Attendance" placeholder="Search..." modal={true} />
        </div>
        <GetStudentAttendance />
      </div>
    </>
  );
}

export default StudentAttendance;

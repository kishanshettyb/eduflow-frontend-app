import React from 'react';
import { updateStudentAttachments } from '@/services/mutation/admin/attachment/attachement';
import { useGetSingleStudent } from '@/services/queries/admin/student';
import ProfileStudentPage from './profileStudent';

const StudentProfile = ({ schoolId, studentId }) => {
  const { data: singleStudentData, isError } = useGetSingleStudent(schoolId, studentId);

  const { mutate: updateAttachmentMutation } = updateStudentAttachments();

  const updateAttachment = async (schoolId, studentId, file) => {
    const formData = new FormData();
    formData.append('file', file);

    await updateAttachmentMutation({
      schoolId,
      studentId,
      formData
    });
  };

  if (isError) return <div>Error loading profile</div>;
  if (!singleStudentData || !singleStudentData.data) return <div>No profile data available</div>;

  const student = singleStudentData.data;
  console.log(singleStudentData, 'student dataaa');

  const profileData = {
    name: `${student.firstName} ${student.lastName}`,
    email: student.email,
    phone: student.contactNumber,
    role: student.enrollmentStudentDto?.standardSection || 'Student',
    joiningDate: student.admissionDate,
    department: 'N/A', // Assuming students don't have departments, otherwise replace with appropriate value
    qualifications: [], // Assuming students don't have qualifications, otherwise replace with appropriate value
    address: `${student.currentAddress.streetName}, ${student.currentAddress.city}, ${student.currentAddress.state}, ${student.currentAddress.country} - ${student.currentAddress.pinCode}`,
    emergencyContact: `${student.emergencyContactName} - ${student.emergencyContact}`,
    photoUrl: student.photo ? student.photo.attachmentUrl : undefined,
    photoAttachmentId: student.photo ? student.photo.attachmentId : undefined
  };

  return (
    <ProfileStudentPage
      data={profileData}
      schoolId={schoolId}
      attachmentId={student.photo?.attachmentId}
      updateAttachment={updateAttachment}
    />
  );
};

export default StudentProfile;

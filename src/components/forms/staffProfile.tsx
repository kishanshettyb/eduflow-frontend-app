import React from 'react';
import { useGetSingleStaff } from '@/services/queries/superadmin/admins';
import { useUpdateAttachement } from '@/services/mutation/admin/attachment/attachement';
import ProfilePage from './profilePage';

const StaffProfile = ({ schoolId, staffId }) => {
  const { data: staffData, isError } = useGetSingleStaff(schoolId, staffId);
  const { mutate: updateAttachmentMutation } = useUpdateAttachement();

  const updateAttachment = async (schoolId: string, attachmentId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    await updateAttachmentMutation({
      schoolId,
      attachmentId,
      formData
    });
  };

  if (isError) return <div>Error loading profile</div>;
  if (!staffData || !staffData.data) return <div>No profile data available</div>;

  const staff = staffData.data;

  const profileData = {
    name: `${staff.firstName} ${staff.lastName}`,
    email: staff.email,
    phone: staff.contactNumber,
    role: staff.staffType,
    joiningDate: staff.joiningDate,
    department: staff.departmentDto.departmentName,
    qualifications: staff.qualificationDtoSet.map((q) => q.qualificationName),
    address: `${staff.currentAddress.streetName}, ${staff.currentAddress.city}, ${staff.currentAddress.state}, ${staff.currentAddress.country} - ${staff.currentAddress.pinCode}`,
    emergencyContact: `${staff.emergencyContactName} - ${staff.emergencyContact}`,
    photoUrl: staff.photo ? staff.photo.attachmentUrl : undefined,
    photoAttachmentId: staff.photo ? staff.photo.attachmentId : undefined
  };

  return (
    <ProfilePage
      data={profileData}
      schoolId={schoolId}
      attachmentId={staff.photo?.attachmentId}
      updateAttachment={updateAttachment}
    />
  );
};

export default StaffProfile;

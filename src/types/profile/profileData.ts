export type ProfileData = {
  name: string;
  email: string;
  phone: string;
  role: string;
  joiningDate: string;
  department: string;
  qualifications: string[];
  address: string;
  emergencyContact: string;
  photoUrl?: string;
  photoAttachmentId?: string;
};

export type ProfilePageProps = {
  data: ProfileData;
  schoolId: string;
  attachmentId?: string;
  // eslint-disable-next-line no-unused-vars
  updateAttachment: (schoolId: string, attachmentId: string, file: File) => Promise<void>;
};

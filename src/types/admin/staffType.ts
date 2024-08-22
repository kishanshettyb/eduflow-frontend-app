export type Staff = {
  staffId: number | undefined;
  customerId: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  department: string;
  staffType: string;
  motherName: string;
  fatherName: string;
  employmentStatus: string;
  schoolId: number;
  dateOfBirth: Date;
  gender: string;
  photo: File | null;
  emergencyContact: number | undefined;
  emergencyContactName: string;
  joiningDate: Date;
  leavingDate: Date;
  currentAddress: {
    streetName: string;
    city: string;
    state: string;
    pinCode: string;
    country: string;
  };
  permanentAddress: {
    streetName: string;
    city: string;
    state: string;
    pinCode: string;
    country: string;
  };
};

export type Qualification = {
  qualificationId: string;
  attachmentDto: {
    attachmentId: number | null;
  };
  nameOfInstitute: string;
  university: string;
  yearOfPassing: number | undefined;
  degree: string;
  [key: string]: string | number | undefined;
};

export type WorkExperience = {
  workExperienceId: string;
  companyName: string;
  positions: string;
  workingYears: number | undefined;
  responsibilities: string;
  joiningDate: Date;
  leavingDate: Date;
  multtiAttachment: unknown;
  [key: string]: string | number | Date | unknown;
};

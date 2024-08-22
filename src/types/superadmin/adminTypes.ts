export type Admin = {
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
  attachmentSet: {
    filter(): {
      // eslint-disable-next-line no-unused-vars
      map(): import('react').ReactNode;
      // arg0: (attachment: unknown, index: unknown) => import('react').JSX.Element
      attachmentId: number | null;
    };
    // eslint-disable-next-line no-unused-vars
    map(): import('react').ReactNode;
    attachmentId: number | null;
  };
  multtiAttachment: unknown;
  [key: string]: string | number | Date | unknown;
};

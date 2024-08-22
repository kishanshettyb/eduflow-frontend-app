export type Student = {
  enrollmentId: number;
  standardDto: {
    title: string;
  };
  schoolId: number;
  firstName: string;
  lastName: string;
  gender: string;
  contactNumber: string;
  dateOfBirth: Date;
  email: string;
  motherName: string;
  fatherName: string;
  photo: File | null;
  admissionDate: Date;
  parentContactNumber: number | undefined;
  bloodGroup: string;
  isActive: boolean;
  emergencyContact: number | undefined;
  emergencyContactName: string;
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

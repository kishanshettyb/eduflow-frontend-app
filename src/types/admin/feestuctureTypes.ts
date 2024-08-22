export type FeeStructure = {
  feeStructureId: number;
  feeTypeAmounts: number;
  feeStructureName: string;
  totalAmount: number;
  schoolName: string;
  standardIds: number;
  enrollmentIds: number;
  dueDate: Date;
  title: string;
  academicYearId: number;
};

export type FeesPayment = {
  feeStructureName: string;
  schoolId: number;
  firstName: string;
  lastName: string;
  gender: string;
  contactNumber: string;
  standardIds: number;
  sectionIds: number;
  dateOfBirth: Date;
  studentDto: {
    firstName: string;
    lastName: string;
  };
  enrollmentId: number;
};

export type ConfigurationSettings = {
  isDeleted: number;
  configurationSettingsId: number;
  schoolId: number;
  type: string;
  value: string;
  subType: string;
  isEncoded: boolean;
};

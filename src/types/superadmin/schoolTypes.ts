export type School = {
  schoolId: number;
  schoolName: string;
  description: string;
  contactNumber: number;
  contactPerson: string;
  emailId: string;
  customerId: number;
  uniqueCode: string;
  address: {
    streetName: string;
    city: string;
    state: string;
    pinCode: string;
    country: string;
  };
};

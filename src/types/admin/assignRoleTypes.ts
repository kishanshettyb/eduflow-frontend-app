export type Staff = {
  staffId: number;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  staffType: string;
  department: string;
  photo: {
    viewLink: string;
  };
};
export type Role = {
  roleId: number;
  roleName: string;
  title: string;
};

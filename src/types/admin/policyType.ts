export type Role = {
  createdBy: number;
  modifiedBy: number;
  createdTime: string;
  modifiedTime: string;
  isDeleted: number;
  roleId: number;
  roleName: string;
  schoolId: number;
  title: string;
};

export type PolicyRule = {
  createdBy: number;
  modifiedBy: number;
  createdTime: string;
  modifiedTime: string;
  isDeleted: number;
  policyRuleId: number;
  schoolId: number;
  type: string;
  subject: string;
  resource: string;
  actions: string[];
  editable: boolean;
};

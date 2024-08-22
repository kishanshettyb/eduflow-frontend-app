import { PolicyRule } from '@/types/admin/policyType';
import axios from 'axios';

import Cookies from 'js-cookie';

const token = Cookies.get('token');
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`
  }
});
export const getPolicyByRoleName = async (schoolId: number, roleName: string) => {
  return await axiosInstance.get<PolicyRule[]>(
    `policy-rules/schools/${schoolId}/roleName/${roleName}`
  );
};

export const getPolicy = async (schoolId: number) => {
  return await axiosInstance.get<PolicyRule[]>(`policy-rules/resources/schools/${schoolId}`);
};
export const deletePolicy = async (schoolId: number, policyRuleId: number) => {
  return await axiosInstance.delete(
    `policy-rules/deletePolicyRule/schools/${schoolId}/policy-rule/${policyRuleId}`
  );
};

export const editPolicy = async (policyRuleId: number, data) => {
  await axiosInstance.put(`policy-rules/edit/${policyRuleId}`, data);
};

export const multiplePolicyUpdate = async (data: PolicyRule) => {
  await axiosInstance.put('policy-rules/multiple', data);
};

export const assignPolicy = async (roleName: string, data) => {
  return await axiosInstance.post(`policy-rules/roleName/${roleName}`, data);
};

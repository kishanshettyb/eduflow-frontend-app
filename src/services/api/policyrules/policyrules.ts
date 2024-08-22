import { Features } from '@/types/admin/features';
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
export const getPolicyRules = async (schoolId: number, loggedInRole: string) => {
  return await axiosInstance.get<PolicyRule[]>(
    `policy-rules/schools/${schoolId}/roleName/${loggedInRole}`
  );
};

export const getAllFeatures = async (schoolId: number) => {
  return await axiosInstance.get<Features[]>(`features/schools/${schoolId}`);
};

export const getFeatures = async (schoolId: number, loggedInRole: string) => {
  return await axiosInstance.get<PolicyRule[]>(
    `features/schools/${schoolId}/roleName/${loggedInRole}`
  );
};

export const createFeatures = async (data: Features) => {
  await axiosInstance.post('features', data);
};

export const updateFeatures = async (schoolId: number, data) => {
  return await axiosInstance.put(`features/schools/${schoolId}`, data);
};

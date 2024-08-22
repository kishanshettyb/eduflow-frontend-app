import { Role } from '@/types/roleTypes';
import axios from 'axios';

import Cookies from 'js-cookie';

const token = Cookies.get('token');
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`
  }
});
export const getAllRole = async (schoolId: number) => {
  return await axiosInstance.get<Role[]>(`roles/schools/${schoolId}`);
};

export const createRole = async (data: Role) => {
  await axiosInstance.post('roles', data);
};

export const getRoleByStaff = async (schoolId: number, staffId: number) => {
  return await axiosInstance.get<Role[]>(`roles/schools/${schoolId}/staffs/${staffId}`);
};

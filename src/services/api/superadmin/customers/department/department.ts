import { Department } from '@/types/superadmin/departmentTypes';
import axios from 'axios';
import Cookies from 'js-cookie';

const token = Cookies.get('token');

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'multipart/form-data'
  }
});

export const getAllDepartment = async (schoolId: number) => {
  return await axiosInstance.get<Department[]>(`departments/schools/${schoolId}`);
};

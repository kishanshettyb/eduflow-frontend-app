import axios from 'axios';
import { School } from '@/types/superadmin/schoolTypes';

import Cookies from 'js-cookie';

const token = Cookies.get('token');
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`
  }
});

export const getAllSchools = async () => {
  return await axiosInstance.get<School[]>('schools');
};

export const getSchoolSetting = async (schoolId: number) => {
  return await axiosInstance.get(`schools/schools/${schoolId}`);
};

export const getSingleSchool = async (id: number) => {
  return await axiosInstance.get<School[]>(`schools/${id}`);
};

export const createSchool = async (data: School) => {
  await axiosInstance.post('schools', data);
};

export const updateSchool = async (data: School) => {
  await axiosInstance.put('schools', data);
};
export const checkUniqueCodeApi = async (uniqueCode: string) => {
  return await axiosInstance.get(`schools/codes/${uniqueCode}`);
};

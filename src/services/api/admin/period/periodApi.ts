import { Period } from '@/types/admin/periodTypes';
import axios from 'axios';

import Cookies from 'js-cookie';

const token = Cookies.get('token');
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`
  }
});
export const getAllPeriod = async (schoolId: number, acedamicyearId: number) => {
  return await axiosInstance.get<Period[]>(`/periods/schools/${schoolId}/years/${acedamicyearId}`);
};

export const getPeriodbyID = async (schoolId: number, periodId: number) => {
  return await axiosInstance.get<Period[]>(`periods/schools/${schoolId}/periods/${periodId}`);
};
export const createPeriod = async (data: Period) => {
  await axiosInstance.post('periods', data);
};

export const updatePeriod = async (data: Period) => {
  await axiosInstance.put('periods', data);
};

export const viewPeriod = async (schoolId: number, acedamicyearId: number) => {
  return await axiosInstance.get<Period[]>(`periods/schools/${schoolId}/years/${acedamicyearId}`);
};

export const deletePeriod = async (schoolId: number, periodId: number) => {
  return await axiosInstance.delete(`periods/schools/${schoolId}/periods/${periodId}`);
};

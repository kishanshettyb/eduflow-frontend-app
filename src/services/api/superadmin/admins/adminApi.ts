import axios from 'axios';
import { Admin, Qualification, WorkExperience } from '@/types/superadmin/adminTypes';

import Cookies from 'js-cookie';
import { Staff } from '@/types/admin/staffType';

const token = Cookies.get('token');
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`
  }
});

export const getAllAdmins = async (schoolId: number) => {
  return await axiosInstance.get<Admin[]>(`staffs/schools/${schoolId}/admins`);
};

export const getAllStaffs = async (schoolId: number, payload: unknown) => {
  return await axiosInstance.post<Admin[]>(
    `staffs/pagination-filter/user-staff/schools/${schoolId}`,
    payload
  );
};

export const getAllSchoolStaffs = async (schoolId: number) => {
  return await axiosInstance.get<Admin[]>(`staffs/schools/${schoolId}`);
};
export const getSingleAdmin = async (schoolId: number, id: number) => {
  return await axiosInstance.get<Admin[]>(`staffs/schools/${schoolId}/staffs/${id}`);
};

export const getSingleStaff = async (schoolId: number, id: number) => {
  return await axiosInstance.get<Staff[]>(`staffs/schools/${schoolId}/staffs/${id}`);
};

export const createAdmin = async (data: Admin) => {
  const response = await axiosInstance.post('staffs', data);
  return response.data;
};

export const updateAdmin = async (data: Admin) => {
  const response = await axiosInstance.put('staffs', data);
  return response.data;
};

export const createQualification = async (data: Qualification) => {
  const response = await axiosInstance.post('staffs/qualifications', data);
  return response.data;
};

export const getSingleQualification = async (schoolId: number, staffId: number) => {
  return await axiosInstance.get(`staffs/qualifications/schools/${schoolId}/staffs/${staffId}`);
};

export const updateQualification = async (data: Qualification) => {
  const response = await axiosInstance.put('staffs/qualifications', data);
  return response.data;
};

export const createWorkExperience = async (data: WorkExperience) => {
  const response = await axiosInstance.post('staffs/workExperiences', data);
  return response.data;
};

export const getSingleWorkExperience = async (schoolId: number, staffId: number) => {
  return await axiosInstance.get(`staffs/workExperiences/schools/${schoolId}/staffs/${staffId}`);
};

export const updateWorkExperience = async (data: WorkExperience) => {
  const response = await axiosInstance.put('staffs/workExperiences', data);
  return response.data;
};

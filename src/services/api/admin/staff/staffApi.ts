import { Staff } from '@/types/admin/staffType';
import axios from 'axios';
import Cookies from 'js-cookie';

const token = Cookies.get('token');
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`
  }
});

export const getAllStaffs = async (schoolId: number) => {
  return await axiosInstance.get<Staff[]>(`staffs/schools/${schoolId}`);
};

export const getStaffsCount = async (schoolId: number, staffType: string) => {
  return await axiosInstance.get<Staff[]>(
    `staffs/active-staff-count/schools/${schoolId}/staffTypes/${staffType}`
  );
};

export const createStaff = async (data: Staff) => {
  // await axiosInstance.post('staffs', data);
  const response = await axiosInstance.post('staffs', data);
  return response.data;
};

export const updateStaff = async (data: Staff) => {
  await axiosInstance.put('staffs', data);
};

export const getQualification = async (schoolId: number, staffId: number) => {
  return await axiosInstance.get<Staff[]>(
    `staffs/qualifications/schools/${schoolId}/staffs/${staffId}`
  );
};

export const createQualification = async (data: Staff) => {
  // await axiosInstance.post('staffs/qualifications', data);
  const response = await axiosInstance.post('staffs/qualifications', data);
  return response.data;
};

export const getWorkExperience = async (schoolId: number) => {
  return await axiosInstance.get<Staff[]>(`staffs/schools/${schoolId}`);
};

export const createWorkExperience = async (data: Staff) => {
  await axiosInstance.post('staffs/workExperiences', data);
};

export const deleteQualification = async (
  schoolId: number,
  staffId: number,
  qualificationId: number
) => {
  await axiosInstance.delete(
    `staffs/schools/${schoolId}/staffs/${staffId}/qualifications/${qualificationId}`
  );
};

export const deleteWorkExperience = async (
  schoolId: number,
  staffId: number,
  workExperienceId: number
) => {
  await axiosInstance.delete(
    `staffs/schools/${schoolId}/staffs/${staffId}/workExperiences/${workExperienceId}`
  );
};

export const getStaffType = async (schoolId: number) => {
  return await axiosInstance.get<Staff[]>(`staffs/getAllStaffTypes/schools/${schoolId}`);
};

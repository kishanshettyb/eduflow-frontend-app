import { Student } from '@/types/admin/studentTypes';
import axios from 'axios';

import Cookies from 'js-cookie';

const token = Cookies.get('token');
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`
  }
});

export const createEnrollment = async (data: FormData) => {
  await axiosInstance.post('enrollments', data);
};
export const updateEnrollment = async (data: FormData) => {
  await axiosInstance.put('enrollments', data);
};
export const promoteStudent = async (studentId: number, payload) => {
  return await axiosInstance.put(`enrollments/updateStatus?studentIds=${studentId}`, payload);
};

export const getStudentEnrollment = async (
  schoolId: number,
  studentId: number,
  academicYearId: number
) => {
  return await axiosInstance.get<Student[]>(
    `enrollments/schools/${schoolId}/students/${studentId}/years/${academicYearId}`
  );
};

export const getPromoteStudent = async (schoolId: number, standardId: number) => {
  return await axiosInstance.get<Student[]>(
    `enrollments/schools/${schoolId}/standards/${standardId}`
  );
};

export const getAllPromotedPagination = async (schoolId: number, payload: unknown) => {
  return await axiosInstance.post(`enrollments/pagination-filter/schools/${schoolId}`, payload);
};

export const createPromoteEnrollment = async (studentId: number, data: data) => {
  return await axiosInstance.post(`enrollments/promoteStudent?studentIds=${studentId}`, data);
};

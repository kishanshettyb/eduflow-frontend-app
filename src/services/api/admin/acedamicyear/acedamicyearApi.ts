import { AcademicYear } from '@/types/admin/academicYearTypes';
import axios from 'axios';
import Cookies from 'js-cookie';

const token = Cookies.get('token');
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`
  }
});

export const viewAcademicYear = async (schoolId: number) => {
  return await axiosInstance.get<AcademicYear[]>(`academic-years/schools/${schoolId}`);
};

export const getAcademicYearbyID = async (schoolId: number, academicYearId: number) => {
  return await axiosInstance.get<AcademicYear[]>(
    `academic-years/schools/${schoolId}/years/${academicYearId}`
  );
};

export const isDefaultCheckAcademicYear = async (schoolId: number) => {
  const response = await axiosInstance.get<AcademicYear[]>(
    `academic-years/checkIsDefault/schools/${schoolId}`
  );
  return response.data;
};

export const isConfirmDefaultAcademicYear = async (
  schoolId: number,
  academicYearId: number,
  permission: boolean
) => {
  await axiosInstance.put(
    `academic-years/default-year-permission/schools/${schoolId}/years/${academicYearId}/permission/${permission}`
  );
};
export const createAcademicYear = async (data: AcademicYear) => {
  await axiosInstance.post('academic-years', data);
};
export const updateAcademicYear = async (data: AcademicYear) => {
  await axiosInstance.put('academic-years', data);
};

export const getAcademicYearbyPromotion = async (schoolId: number, studentId: number) => {
  return await axiosInstance.get<AcademicYear[]>(
    `academic-years/EnrollingYears/schools/${schoolId}?studentIds=${studentId}`
  );
};

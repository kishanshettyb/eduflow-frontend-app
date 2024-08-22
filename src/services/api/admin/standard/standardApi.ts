import { Standard } from '@/types/admin/standardTypes';
import axios from 'axios';

import Cookies from 'js-cookie';

const token = Cookies.get('token');
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`
  }
});
export const getAllStandard = async (schoolId: number, academicYearId: number) => {
  return await axiosInstance.get<Standard[]>(
    `standards/schools/${schoolId}/years/${academicYearId}/allStandards`
  );
};

export const getAllStandards = async (schoolId: number, academicYearId: number) => {
  return await axiosInstance.get<Standard[]>(
    `standards/schools/${schoolId}/years/${academicYearId}`
  );
};

export const getAllSection = async (schoolId: number, academicYearId: number, standard: number) => {
  return await axiosInstance.get<Standard[]>(
    `standards/schools/${schoolId}/years/${academicYearId}standards/${standard}`
  );
};
export const getStandardbyID = async (schoolId: number, standardId: number) => {
  return await axiosInstance.get<Standard[]>(
    `standards/schools/${schoolId}/standards/${standardId}`
  );
};

export const getSectionByStandard = async (
  schoolId: number,
  academicYearId: number,
  standards: number
) => {
  return await axiosInstance.get<Standard[]>(
    `standards/schools/${schoolId}/years/${academicYearId}/standards/${standards}`
  );
};

export const createStandard = async (data: Standard) => {
  await axiosInstance.post('standards', data);
};

export const updateStandard = async (data: Standard) => {
  await axiosInstance.put('standards', data);
};
export const deleteStandard = async (schoolId: number, standardId: number) => {
  await axiosInstance.delete(`standards/delete/${schoolId}/${standardId}`);
};

export const getPromoteYearStandard = async (
  academicYearId: number,
  schoolId: number,
  studentId: number
) => {
  return await axiosInstance.get<Standard[]>(
    `standards/years/${academicYearId}/schools/${schoolId}?studentIds=${studentId}`
  );
};

export const getStandardPaginationDetails = async (schoolId: number, payload: object) => {
  return await axiosInstance.post(`standards/pagination-filter/schools/${schoolId}`, payload);
};

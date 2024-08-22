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
export const getAllSubjectType = async (schoolId: number, academicYearId: number) => {
  return await axiosInstance.get<Standard[]>(
    `subject-types/schools/${schoolId}/years/${academicYearId}`
  );
};

export const getGroupSubjectTypes = async (
  schoolId: number,
  academicYearId: number,
  standards: string,
  sections: string
) => {
  return await axiosInstance.get<Standard[]>(
    `subject-types/groups/schools/${schoolId}/years/${academicYearId}/standards/${standards}/sections/${sections}`
  );
};

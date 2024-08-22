import { StandardSubject } from '@/types/admin/standardSubjectType';
import axios from 'axios';

import Cookies from 'js-cookie';

const token = Cookies.get('token');
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`
  }
});
export const getAllStandardSubject = async (schoolId: number, academicYearId: number) => {
  return await axiosInstance.get<StandardSubject[]>(
    `standard-subjects/schools/${schoolId}/years/${academicYearId}/getAll`
  );
};

export const createStandardSubject = async (data: StandardSubject) => {
  await axiosInstance.post('standard-subjects', data);
};

export const updateStandardSubject = async (data: StandardSubject) => {
  await axiosInstance.put('standard-subjects', data);
};
export const deleteStandardSubject = async (schoolId: number, standardSubjectId: number) => {
  await axiosInstance.delete(
    `standard-subjects/schools/${schoolId}/standardSubjects/${standardSubjectId}`
  );
};

export const getGroupSubjectTypes = async (
  schoolId: number,
  academicYearId: number,
  standards: string,
  sections: string
) => {
  return await axiosInstance.get<StandardSubject[]>(
    `standard-subjects/groups/schools/${schoolId}/years/${academicYearId}/standards/${standards}/sections/${sections}`
  );
};

export const getStandardSubjects = async (
  schoolId: number,
  academicYearId: number,
  standards: string,
  sections: string
) => {
  return await axiosInstance.get<StandardSubject[]>(
    `standard-subjects/schools/${schoolId}/years/${academicYearId}/standards/${standards}/sections/${sections}`
  );
};

export const getSubjectTypes = async (schoolId: number, academicYearId: number) => {
  return await axiosInstance.get<StandardSubject[]>(
    `subject-types/schools/${schoolId}/years/${academicYearId}`
  );
};

export const getSubjectBySubjectTypes = async (
  schoolId: number,
  academicYearId: number,
  standards: string,
  sections: string,
  subjectTypes: number
) => {
  return await axiosInstance.get<StandardSubject[]>(
    `standard-subjects/schools/${schoolId}/years/${academicYearId}/standards/${standards}/sections/${sections}/subjectTypes/${subjectTypes}`
  );
};

export const getAllSubjectTypes = async (
  schoolId: number,
  academicYearId: number,
  standards: string,
  sections: string,
  subjectId: number
) => {
  return await axiosInstance.get<StandardSubject[]>(
    `standard-subjects/subjectTypes/schools/${schoolId}/years/${academicYearId}/standards/${standards}/sections/${sections}/subjects/${subjectId}`
  );
};

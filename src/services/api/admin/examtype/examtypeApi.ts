import { ExamType } from '@/types/admin/examtypeTypes';
import axios from 'axios';

import Cookies from 'js-cookie';

const token = Cookies.get('token');
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`
  }
});
export const getAllExamType = async (schoolId: number, acedamicyearId: number) => {
  return await axiosInstance.get<ExamType[]>(
    `/exam-types/schools/${schoolId}/years/${acedamicyearId}`
  );
};

export const getExamTypebyID = async (schoolId: number, examTypeId: number) => {
  return await axiosInstance.get<ExamType[]>(
    `exam-types/schools/${schoolId}/examTypes/${examTypeId}`
  );
};
export const createExamType = async (data: ExamType) => {
  await axiosInstance.post('exam-types', data);
};

export const updateExamType = async (data: ExamType) => {
  await axiosInstance.put('exam-types', data);
};

export const viewExamType = async (schoolId: number, acedamicyearId: number) => {
  return await axiosInstance.get<ExamType[]>(
    `exam-types/schools/${schoolId}/years/${acedamicyearId}`
  );
};

export const deleteExamType = async (schoolId: number, examTypeId: number) => {
  return await axiosInstance.delete(`exam-types/schools/${schoolId}/examTypes/${examTypeId}`);
};

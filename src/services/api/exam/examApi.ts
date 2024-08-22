import { Exam } from '@/types/examTypes';
import axios from 'axios';

import Cookies from 'js-cookie';

const token = Cookies.get('token');
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`
  }
});
export const getAllExam = async (schoolId: number, acedamicyearId: number) => {
  return await axiosInstance.get<Exam[]>(`exams/schools/${schoolId}/years/${acedamicyearId}`);
};
export const getAllExamByStandard = async (
  schoolId: number,
  accademicYearId: number,
  standardId: number
) => {
  return await axiosInstance.get<Exam[]>(
    `exams/schools/${schoolId}/years/${accademicYearId}/standards/${standardId}`
  );
};

export const getExambyID = async (schoolId: number, examId: number) => {
  return await axiosInstance.get<Exam[]>(`exams/schools/${schoolId}/exams/${examId}`);
};
export const createExam = async (data: Exam) => {
  await axiosInstance.post('exams', data);
};

export const updateExam = async (data: Exam) => {
  await axiosInstance.put('exams', data);
};

export const viewExam = async (schoolId: number, acedamicyearId: number) => {
  return await axiosInstance.get<Exam[]>(`exams/schools/${schoolId}/years/${acedamicyearId}`);
};

export const deleteExam = async (schoolId: number, examId: number) => {
  return await axiosInstance.delete(`exams/schools/${schoolId}/exams/${examId}`);
};

export const conductExam = async (data: Exam) => {
  await axiosInstance.put('exams/conducts', data);
};

export const getAllExamPagination = async (schoolId: number, payload: unknown) => {
  return await axiosInstance.post<Exam[]>(`exams/pagination-filter/schools/${schoolId}`, payload);
};

export const getExamDetails = async (schoolId: number, payload: object) => {
  return await axiosInstance.post<Exam[]>(`exams/pagination-filter/schools/${schoolId}`, payload);
};

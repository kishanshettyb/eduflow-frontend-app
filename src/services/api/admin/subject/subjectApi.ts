import { Subject } from '@/types/admin/subjectTypes';
import axios from 'axios';
import Cookies from 'js-cookie';

const token = Cookies.get('token');
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`
  }
});

export const getAllSubject = async (schoolId: number) => {
  return await axiosInstance.get<Subject[]>(`/subjects/schools/${schoolId}/years/1942`);
};

export const getSubjectbyID = async (schoolId: number, subjectId: number) => {
  return await axiosInstance.get<Subject[]>(`subjects/schools/${schoolId}/subjects/${subjectId}`);
};

export const createSubject = async (data: Subject) => {
  await axiosInstance.post('subjects', data);
};

export const updateSubject = async (data: Subject) => {
  await axiosInstance.put('subjects', data);
};

export const viewSubject = async (schoolId: number, acedamicyearId: number) => {
  return await axiosInstance.get<Subject[]>(`subjects/schools/${schoolId}/years/${acedamicyearId}`);
};

export const deleteSubject = async (schoolId: number, subjectId: number) => {
  return await axiosInstance.delete(`subjects/delete/${schoolId}/${subjectId}`);
};

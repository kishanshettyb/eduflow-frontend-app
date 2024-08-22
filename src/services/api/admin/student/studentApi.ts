import { Student } from '@/types/admin/studentTypes';
import axios from 'axios';

import Cookies from 'js-cookie';

const token = Cookies.get('token');
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'multipart/form-data'
  }
});
export const getAllStudent = async (schoolId: number, academicYearId: number) => {
  return await axiosInstance.get<Student[]>(`students/schools/${schoolId}/years/${academicYearId}`);
};

export const getSingleStudent = async (schoolId: number, id: number) => {
  return await axiosInstance.get<Student[]>(`students/schools/${schoolId}/students/${id}`);
};

export const getStudentCount = async (schoolId: number, academicYearId: number) => {
  return await axiosInstance.get<Student[]>(
    `students/schools/${schoolId}/years/${academicYearId}/totalStudents `
  );
};

export const createStudent = async (data: Student) => {
  // await axiosInstance.post('students', data);
  const response = await axiosInstance.post('students', data);
  return response.data;
};

export const updateStudent = async (data: Student) => {
  // await axiosInstance.post('students', data);
  const response = await axiosInstance.put('students', data);
  return response.data;
};

export const getFilteredStudents = async (
  schoolId: number,
  academicYearId: number,
  isActive: string,
  standard: string,
  section: string
): Promise<Student[]> => {
  const params: Record<string, string | number> = {};

  if (isActive) {
    params.isActive = isActive === 'active' ? 'true' : isActive;
  }

  if (standard) {
    params.standard = standard;
  }

  if (section) {
    params.section = section;
  }

  const queryString = Object.keys(params)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
    .join('&');

  const response = await axiosInstance.get<Student[]>(
    `students/schools/${schoolId}/years/${academicYearId}/enrollment?${queryString}`
  );
  return response.data;
};

export const getStudentDocument = async (schoolId: number, studentId: number) => {
  return await axiosInstance.get(`student-documents/schools/${schoolId}/students/${studentId}`);
};

export const getStudentWithNoEnrollment = async (schoolId: number) => {
  return await axiosInstance.get(`students/withNoEnrollments/schools/${schoolId}`);
};

export const submitStudentDocuments = async (data: FormData) => {
  await axiosInstance.post('student-documents', data);
};

export const updateStudentDocuments = async (data: FormData) => {
  await axiosInstance.put('student-documents', data);
};

export const getAllDocumentType = async () => {
  return await axiosInstance.get('documents/getAll');
};

export const deleteStudentFile = async (studentDocumentId: number) => {
  await axiosInstance.delete(`student-documents/studentDocuments/${studentDocumentId}`);
};

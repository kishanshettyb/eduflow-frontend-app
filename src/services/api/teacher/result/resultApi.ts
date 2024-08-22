import axios from 'axios';

import Cookies from 'js-cookie';

const token = Cookies.get('token');
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`
  }
});
export const getAllResultTable = async (
  schoolId: number,
  examTypeId: number,
  standard: string,
  section: string,
  subjectId: number,
  academicYearId: number,
  subjectTypeId: number
) => {
  return await axiosInstance.get(
    `results/schools/${schoolId}/examTypes/${examTypeId}/standards/${standard}/sections/${section}/subjects/${subjectId}/years/${academicYearId}/subjectTypes/${subjectTypeId}`
  );
};

export const updateResult = async (schoolId: number, data) => {
  return await axiosInstance.put(`results/schools/${schoolId}`, data);
};

export const verifyResult = async (
  schoolId: number,
  examTypeId: number,
  standard: string,
  section: string,
  subjectId: number,
  subjectTypeId: number,
  data
) => {
  return await axiosInstance.put(
    `results/schools/${schoolId}/examTypes/${examTypeId}/standards/${standard}/sections/${section}/subjects/${subjectId}/subjectTypes/${subjectTypeId}`,
    data
  );
};

export const publishResult = async (
  schoolId: number,
  examTypeId: number,
  standard: string,
  section: string
) => {
  return await axiosInstance.put(
    `results/publish/schools/${schoolId}/examTypes/${examTypeId}/standards/${standard}/sections/${section}`
  );
};

export const getAllResultStudent = async (
  schoolId: number,
  academicYearId: number,
  examTypeId: number,
  studentId: number
) => {
  return await axiosInstance.get(
    `results/schools/${schoolId}/years/${academicYearId}/examTypes/${examTypeId}/students/${studentId}`
  );
};
export const getAllResultPagination = async (schoolId: number, payload: unknown) => {
  return await axiosInstance.post(`results/pagination-filter/schools/${schoolId}`, payload);
};


export const getAllStandardReport = async (
  academicYearId: number,
  schoolId: number,
  examTypeId: number
) => {
  return await axiosInstance.get(
    `results/standardPercent/years/${academicYearId}/schools/${schoolId}/examTypes/${examTypeId}`
  );
};

export const getAllSubjectReport = async (
  schoolId: number,
  academicYearId: number,
  standardId: number,
  examTypeId: number
) => {
  return await axiosInstance.get(
    `results/subjectPercent/schools/${schoolId}/years/${academicYearId}/standards/${standardId}/examTypes/${examTypeId}`
  );
};


export const getResults = async (
  schoolId: number,
  academicYearId: number,
  examTypeId: number,
  studentId: number
) => {
  return await axiosInstance.get(
    `results/schools/${schoolId}/years/${academicYearId}/examTypes/${examTypeId}/students/${studentId}`
  );
};

export const downloadMarksCard = async (
  schoolId: number,
  academicYearId: number,
  examTypeId: number,
  studentId: number
): Promise<Blob> => {
  const response = await axiosInstance.get(
    `results/generate-pdf/schools/${schoolId}/years/${academicYearId}/examTypes/${examTypeId}/students/${studentId}`,
    { responseType: 'blob' }
  );
  return response.data;
};

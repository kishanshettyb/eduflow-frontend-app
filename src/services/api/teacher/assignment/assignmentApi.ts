import axios from 'axios';

import Cookies from 'js-cookie';

const token = Cookies.get('token');
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`
  }
});
export const getAllAssignments = async (schoolId: number, academicYearId: number) => {
  return await axiosInstance.get(`assignments/schools/${schoolId}/years/${academicYearId}`);
};

export const getAssignmentById = async (schoolId: number, assignmentId: number) => {
  return await axiosInstance.get(`assignments/schools/${schoolId}/assignments/${assignmentId}`);
};

export const createAssignment = async (data) => {
  await axiosInstance.post('assignments', data);
};

export const createAssignmentMapping = async (data) => {
  await axiosInstance.post('assignments/assign-classes', data);
};

export const createAssignmentSubmit = async (data) => {
  await axiosInstance.post('submissions', data);
};

export const getAllStandardSubject = async (schoolId: number, payload: unknown) => {
  return await axiosInstance.post(`assignments/pagination-filter/schools/${schoolId}`, payload);
};
export const getAllAssignmentReview = async (schoolId: number, payload: unknown) => {
  return await axiosInstance.post(
    `submissions/pagination-filter/schools/${schoolId}/assignments`,
    payload
  );
};

export const updateAssignmentSubmit = async (data) => {
  await axiosInstance.put('submissions', data);
};

export const createStudentAssignmentMapping = async (data) => {
  await axiosInstance.post('assignments/assign-enrollments', data);
};

export const updateAssignment = async (data) => {
  await axiosInstance.put('assignments', data);
};

export const reviewAssignment = async (data) => {
  await axiosInstance.put('submissions/teachers', data);
};

export const deleteAssignment = async (
  schoolId: number,
  assignmentId: number,
  forceDelete: boolean
) => {
  const response = await axiosInstance.delete(
    `assignments/schools/${schoolId}/assignments/${assignmentId}/forceDelete/${forceDelete}`
  );
  return response.data;
};

export const getMappedAssignment = async (schoolId: number, assignmentId: number) => {
  return await axiosInstance.get(
    `assignments/schools/${schoolId}/assignments/${assignmentId}/mappings`
  );
};

export const getAllStudentAssignment = async (schoolId: number, enrollmentId: number) => {
  return await axiosInstance.get(`assignments/schools/${schoolId}/enrollments/${enrollmentId}`);
};

export const getAllSubmitAssignment = async (schoolId: number, academicYearId: number) => {
  return await axiosInstance.get(`submissions/schools/${schoolId}/years/${academicYearId}`);
};

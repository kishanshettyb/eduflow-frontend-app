import axios from 'axios';

import Cookies from 'js-cookie';

const token = Cookies.get('token');
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`
  }
});
export const assignRole = async (schoolId: number, staffId: number, data) => {
  return await axiosInstance.post(`users/assign-role/schools/${schoolId}/staffs/${staffId}`, data);
};

export const deleteAssignRole = async (schoolId: number, staffId: number, roleId: number) => {
  return await axiosInstance.delete(`users/schools/${schoolId}/staffs/${staffId}/roles/${roleId}`);
};
export const getSingleAssignmentsSubmitionDetails = async (
  schoolId: number,
  assignmentSubmissionId: number
) => {
  return await axiosInstance.get<Assignments[]>(
    `submissions/schools/${schoolId}/submissions/${assignmentSubmissionId}`
  );
};

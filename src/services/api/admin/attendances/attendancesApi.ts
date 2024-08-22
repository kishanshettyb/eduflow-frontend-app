import axios from 'axios';
import Cookies from 'js-cookie';

const token = Cookies.get('token');
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`
  }
});

export const getStaffsAttendanceByDate = async (schoolId: number, localDate: Date) => {
  return await axiosInstance.get(`staff-attendances/schools/${schoolId}/dates/${localDate}`);
};

export const getStaffsPresentAbsent = async (schoolId: number, date: Date) => {
  return await axiosInstance.get(
    `staff-attendances/attendanceReport/schools/${schoolId}/dates/${date}`
  );
};
export const createStaffAttendance = async (schoolId: number, attendanceDate: Date, data) => {
  const response = await axiosInstance.post(
    `staff-attendances/schools/${schoolId}/dates/${attendanceDate}`,
    data
  );
  return response.data;
};

export const updateStaffAttendance = async (schoolId: number, data) => {
  const response = await axiosInstance.put(`staff-attendances/schools/${schoolId}`, data);
  return response.data;
};

export const getStaffsAttendanceByMonth = async (
  schoolId: number,
  year: string,
  monthName: string
) => {
  return await axiosInstance.get(
    `staff-attendances/schools/${schoolId}/years/${year}/months/${monthName}`
  );
};

export const getStudentsAttendanceByDate = async (
  schoolId: number,
  standard: string,
  section: string,
  localDate: Date
) => {
  return await axiosInstance.get(
    `student-day-attendances/schools/${schoolId}/standards/${standard}/sections/${section}/dates/${localDate}`
  );
};

export const createStudentAttendance = async (schoolId: number, attendanceDate: Date, data) => {
  const response = await axiosInstance.post(
    `student-day-attendances/schools/${schoolId}/dates/${attendanceDate}`,
    data
  );
  return response.data;
};

export const updateStudentAttendance = async (schoolId: number, data) => {
  const response = await axiosInstance.put(`student-day-attendances/schools/${schoolId}`, data);
  return response.data;
};

export const getStaffAttendance = async (schoolId: number, staffId: number) => {
  return await axiosInstance.get(`staff-attendances/schools/${schoolId}/staffs/${staffId}`);
};

export const getStudentAttendance = async (schoolId: number, studentId: number) => {
  return await axiosInstance.get(
    `student-day-attendances/schools/${schoolId}/students/${studentId}`
  );
};

export const getStaffsAttendanceByRange = async (schoolId: number, data) => {
  return await axiosInstance.post(`staff-attendances/schools/${schoolId}/by-date-range`, data);
};

export const getSudentsAttendanceByRange = async (schoolId: number, data) => {
  return await axiosInstance.post(
    `student-day-attendances/schools/${schoolId}/by-date-range`,
    data
  );
};
export const getAllHolidayPagination = async (schoolId: number, payload: unknown) => {
  return await axiosInstance.post(`holidays/pagination-filter/schools/${schoolId}`, payload);
};

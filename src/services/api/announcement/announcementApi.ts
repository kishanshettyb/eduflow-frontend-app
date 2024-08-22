import { Announcement } from '@/types/admin/announcementTypes';
import axios from 'axios';

import Cookies from 'js-cookie';

const token = Cookies.get('token');
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`
  }
});

export const getAllAnnouncement = async (schoolId: number, academicYearId: number) => {
  return await axiosInstance.get<Announcement[]>(
    `announcements/schools/${schoolId}/years/${academicYearId}`
  );
};

export const getAnnouncementbyID = async (schoolId: number, announcementId: number) => {
  return await axiosInstance.get<Announcement[]>(
    `announcements/schools/${schoolId}/announcements/${announcementId}`
  );
};
export const viewAnnouncement = async (schoolId: number, acedamicyearId: number) => {
  return await axiosInstance.get<Announcement[]>(
    `announcements/schools/${schoolId}/years/${acedamicyearId}`
  );
};

export const createAnnouncement = async (data: Announcement) => {
  await axiosInstance.post('announcements', data);
};

export const updateAnnouncement = async (data: Announcement) => {
  await axiosInstance.put('announcements', data);
};
export const deleteAnnouncement = async (schoolId: number, announcementId: number) => {
  await axiosInstance.delete(`announcements/${schoolId}/${announcementId}`);
};

export const publishAnnouncement = async (data: Announcement) => {
  await axiosInstance.put('announcements/publish', data);
};

export const getAllStaffAnnouncements = async (
  schoolId: number,
  academicYearId: number,
  staffId: number
) => {
  return await axiosInstance.get<Announcement[]>(
    `announcements/schools/${schoolId}/years/${academicYearId}/staffs/${staffId}`
  );
};

export const getAllStudentAnnouncements = async (
  schoolId: number,
  academicYearId: number,
  enrollmentId: number
) => {
  return await axiosInstance.get<Announcement[]>(
    `announcements/schools/${schoolId}/years/${academicYearId}/enrollments/${enrollmentId}`
  );
};

export const getAllNotificationCount = async (
  schoolId: number,
  userType: string,
  id: number,
  startDate: string,
  endDate: string
) => {
  return await axiosInstance.get<Announcement[]>(
    `notification/schools/${schoolId}/user-type/${userType}/id/${id}/dismissed/false`,
    {
      params: {
        startDate,
        endDate
      }
    }
  );
};

export const readNotification = async (schoolId: number, paylod: unknown) => {
  await axiosInstance.post(`notification/read/schools/${schoolId}`, paylod);
};

export const dismissNotification = async (schoolId: number, paylod: unknown) => {
  await axiosInstance.post(`notification/dismiss/schools/${schoolId}`, paylod);
};

export const getAnnouncementPagination = async (schoolId: number, payload: unknown) => {
  return await axiosInstance.post(`announcements/pagination-filter/schools/${schoolId}`, payload);
};

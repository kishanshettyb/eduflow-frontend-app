import {
  getAllAnnouncement,
  getAllNotificationCount,
  getAllStaffAnnouncements,
  getAllStudentAnnouncements,
  getAnnouncementbyID,
  getAnnouncementPagination,
  viewAnnouncement
} from '@/services/api/announcement/announcementApi';
import { useQuery } from '@tanstack/react-query';

export function useGetAllAnnouncement(schoolId: number, acedamicyearId: number) {
  return useQuery({
    queryKey: ['announcements', schoolId, acedamicyearId],
    queryFn: () => getAllAnnouncement(schoolId, acedamicyearId),
    enabled: !!schoolId
  });
}

export function useViewAnnouncement(schoolId: number, acedamicyearId: number) {
  return useQuery({
    queryKey: ['viewAnnouncement', schoolId, acedamicyearId],
    queryFn: () => viewAnnouncement(schoolId, acedamicyearId)
  });
}

export function useGetAnnouncementbyID(schoolId: number, examTypeId: number) {
  return useQuery({
    queryKey: ['getAnnouncementById', schoolId, examTypeId],
    queryFn: () => getAnnouncementbyID(schoolId, examTypeId!)
  });
}

export function useGetDeletebyID(schoolId: number, examTypeId: number) {
  return useQuery({
    queryKey: ['getAnnouncementById', schoolId, examTypeId],
    queryFn: () => getAnnouncementbyID(schoolId, examTypeId!)
  });
}

export function useGetStaffAllAnnouncement(
  schoolId: number,
  acedamicyearId: number,
  staffId: number
) {
  return useQuery({
    queryKey: ['announcements', schoolId, acedamicyearId, staffId],
    queryFn: () => getAllStaffAnnouncements(schoolId, acedamicyearId, staffId),
    enabled: !!staffId
  });
}

export function useGetStudentAllAnnouncement(
  schoolId: number,
  acedamicyearId: number,
  enrollmentId: number
) {
  return useQuery({
    queryKey: ['announcements', schoolId, acedamicyearId, enrollmentId],
    queryFn: () => getAllStudentAnnouncements(schoolId, acedamicyearId, enrollmentId),
    enabled: !!enrollmentId
  });
}

export function useGetAllNotificationCount(
  schoolId: number,
  userType: string,
  id: number,
  startDate: string,
  endDate: string
) {
  return useQuery({
    queryKey: ['notifications', schoolId, userType, id, startDate, endDate],
    queryFn: () => getAllNotificationCount(schoolId, userType, id, startDate, endDate),
    enabled: !!id
  });
}

export function useGetAnnouncementPagination(schoolId: number, payload?: unknown) {
  return useQuery({
    queryKey: ['announcement', schoolId, payload],
    queryFn: () => getAnnouncementPagination(schoolId, payload),
    enabled: !!schoolId
  });
}

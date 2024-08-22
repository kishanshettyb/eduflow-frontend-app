import {
  getAllHolidayPagination,
  getStaffAttendance,
  getStaffsAttendanceByDate,
  getStaffsAttendanceByMonth,
  getStaffsAttendanceByRange,
  getStaffsPresentAbsent,
  getStudentAttendance,
  getStudentsAttendanceByDate,
  getSudentsAttendanceByRange
} from '@/services/api/admin/attendances/attendancesApi';
import { useQuery } from '@tanstack/react-query';

export function useGetAllStaffAttendances(schoolId: number, localDate: string) {
  return useQuery({
    queryKey: ['viewAttendances', schoolId, localDate],
    queryFn: () => getStaffsAttendanceByDate(schoolId, localDate),
    enabled: !!localDate
  });
}

export function useGetAllStaffPresentAbsesnt(schoolId: number, date: string) {
  return useQuery({
    queryKey: ['viewAttendances', schoolId, date],
    queryFn: () => getStaffsPresentAbsent(schoolId, date),
    enabled: !!date
  });
}

export function useGetAllStaffAttendancesByMonth(
  schoolId: number,
  year: string,
  monthName: string
) {
  return useQuery({
    queryKey: ['viewAttendances', schoolId, year, monthName],
    queryFn: () => getStaffsAttendanceByMonth(schoolId, year, monthName),
    enabled: !!monthName
  });
}

export function useGetAllStudentAttendancesByDate(
  schoolId: number,
  standard: string,
  section: string,
  localDate: string
) {
  return useQuery({
    queryKey: ['viewAttendances', schoolId, standard, section, localDate],
    queryFn: () => getStudentsAttendanceByDate(schoolId, standard, section, localDate),
    enabled: !!section
  });
}

export function useGetStaffAttendance(schoolId: number, staffId: number) {
  return useQuery({
    queryKey: ['viewAttendances', schoolId, staffId],
    queryFn: () => getStaffAttendance(schoolId, staffId),
    enabled: !!staffId
  });
}

export function useGetStudentAttendance(schoolId: number, studentId: number) {
  return useQuery({
    queryKey: ['viewAttendances', schoolId, studentId],
    queryFn: () => getStudentAttendance(schoolId, studentId),
    enabled: !!studentId
  });
}

export function useGetAllStaffAttendanceByRange(schoolId: number, data) {
  return useQuery({
    queryKey: ['viewAttendances', schoolId, data],
    queryFn: () => getStaffsAttendanceByRange(schoolId, data),
    enabled: !!schoolId
  });
}

export function useGetAllStudentByRange(schoolId: number, data) {
  return useQuery({
    queryKey: ['viewAttendances', schoolId, data],
    queryFn: () => getSudentsAttendanceByRange(schoolId, data),
    enabled: !!schoolId
  });
}
export function useGetAllHolidayPagination(schoolId: number, payload?: unknown) {
  return useQuery({
    queryKey: ['exam', schoolId, payload],
    queryFn: () => getAllHolidayPagination(schoolId, payload),
    enabled: !!schoolId
  });
}

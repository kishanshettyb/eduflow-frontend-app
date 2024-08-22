import { useQuery } from '@tanstack/react-query';

import {
  getAllStudent,
  getFilteredStudents,
  getSingleStudent,
  getStudentCount,
  getStudentWithNoEnrollment
} from '@/services/api/admin/student/studentApi';

export function useGetAllStudent(schoolId: number, academicYearId: number) {
  return useQuery({
    queryKey: ['students', schoolId, academicYearId],
    queryFn: () => getAllStudent(schoolId, academicYearId),
    enabled: !!schoolId
  });
}

export function useGetSingleStudent(schoolId: number, id: number) {
  return useQuery({
    queryKey: ['singleStudent', schoolId, id],
    queryFn: () => getSingleStudent(schoolId, id!),
    enabled: !!id
  });
}

export function useGetStudentCount(schoolId: number, academicYearId: number) {
  return useQuery({
    queryKey: ['singleStudent', schoolId, academicYearId],
    queryFn: () => getStudentCount(schoolId, academicYearId!),
    enabled: !!academicYearId
  });
}

export function useFilteredStudents(
  schoolId: number,
  academicYearId: number,
  isActive: string,
  standard: number,
  section: string
) {
  return useQuery({
    queryKey: ['filterStudent', schoolId, academicYearId, isActive, standard, section],
    queryFn: () => getFilteredStudents(schoolId, academicYearId, isActive, standard, section!),
    enabled: !!schoolId && !!academicYearId
  });
}

export function useGetNotEnrolledStudent(schoolId: number) {
  return useQuery({
    queryKey: ['notEnroledStudent', schoolId],
    queryFn: () => getStudentWithNoEnrollment(schoolId!),
    enabled: !!schoolId
  });
}

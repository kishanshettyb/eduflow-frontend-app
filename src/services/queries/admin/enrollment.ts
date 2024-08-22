import {
  getAllPromotedPagination,
  getStudentEnrollment
} from '@/services/api/admin/student/enrollment';
import { useQuery } from '@tanstack/react-query';

export function useGetStudentEnrollment(
  schoolId: number,
  studentId: number,
  academicYearId: number
) {
  return useQuery({
    queryKey: ['enrollment', schoolId, studentId, academicYearId],
    queryFn: () => getStudentEnrollment(schoolId, studentId, academicYearId),
    enabled: !!studentId
  });
}

export function useGetStudentPromote(schoolId: number, payload?: unknown) {
  return useQuery({
    queryKey: ['enrollement', schoolId, payload],
    queryFn: () => getAllPromotedPagination(schoolId, payload),
    enabled: !!schoolId
  });
}

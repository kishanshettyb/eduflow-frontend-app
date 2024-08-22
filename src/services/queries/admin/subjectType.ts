import { useQuery } from '@tanstack/react-query';
import {
  getAllSubjectType,
  getGroupSubjectTypes
} from '@/services/api/admin/subjectType/subjectTypeApi';

export function useGetAllSubjectType(schoolId: number, academicYearId: number) {
  return useQuery({
    queryKey: ['subject-types', schoolId, academicYearId],
    queryFn: () => getAllSubjectType(schoolId, academicYearId),
    enabled: !!schoolId
  });
}

export function useGetGroupSubjectTypes(
  schoolId: number,
  academicYearId: number,
  standards: string,
  sections: string
) {
  return useQuery({
    queryKey: ['subject-types', schoolId, academicYearId, standards, sections],
    queryFn: () => getGroupSubjectTypes(schoolId, academicYearId, standards, sections),
    enabled: !!schoolId
  });
}

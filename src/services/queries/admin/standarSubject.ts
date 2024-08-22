import { useQuery } from '@tanstack/react-query';
import {
  getAllStandardSubject,
  getAllSubjectTypes,
  getGroupSubjectTypes,
  getStandardSubjects,
  getSubjectBySubjectTypes,
  getSubjectTypes
} from '../../api/admin/standardSubject/standardSubjectApi';

export function useGetAllStandardSubject(schoolId: number, academicYearId: number) {
  return useQuery({
    queryKey: ['standard-subjects', schoolId, academicYearId],
    queryFn: () => getAllStandardSubject(schoolId, academicYearId),
    enabled: !!schoolId
  });
}
export function useViewStandardSubject(schoolId: number, acedamicYearId: number) {
  return useQuery({
    queryKey: ['standard-subjects', schoolId, acedamicYearId],
    queryFn: () => getAllStandardSubject(schoolId, acedamicYearId),
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

export function useGetStandardSubject(
  schoolId: number,
  academicYearId: number,
  standards: string,
  sections: string
) {
  return useQuery({
    queryKey: ['subject-types', schoolId, academicYearId, standards, sections],
    queryFn: () => getStandardSubjects(schoolId, academicYearId, standards, sections),
    enabled: !!sections
  });
}

export function useGetSubjectTypes(schoolId: number, academicYearId: number) {
  return useQuery({
    queryKey: ['subject-types', schoolId, academicYearId],
    queryFn: () => getSubjectTypes(schoolId, academicYearId),
    enabled: !!academicYearId,
    select: (data) => data?.data ?? {}
  });
}

export function useGetSubjectBySubjectTypes(
  schoolId: number,
  academicYearId: number,
  standards: string,
  sections: string,
  subjectTypes: number
) {
  return useQuery({
    queryKey: ['subject-types', schoolId, academicYearId, standards, sections, subjectTypes],
    queryFn: () =>
      getSubjectBySubjectTypes(schoolId, academicYearId, standards, sections, subjectTypes),
    enabled: !!subjectTypes,
    select: (data) => data?.data ?? {}
  });
}

export function useGetAllSubjectTypes(
  schoolId: number,
  academicYearId: number,
  standards: string,
  sections: string,
  subjectId: number
) {
  return useQuery({
    queryKey: ['subject-types', schoolId, academicYearId, standards, sections, subjectId],
    queryFn: () => getAllSubjectTypes(schoolId, academicYearId, standards, sections, subjectId),
    enabled: !!subjectId
  });
}

import { useQuery } from '@tanstack/react-query';
import {
  getAllStandard,
  getAllStandards,
  getPromoteYearStandard,
  getSectionByStandard,
  getStandardbyID,
  getStandardPaginationDetails
} from '@/services/api/admin/standard/standardApi';

export function useGetAllStandard(schoolId: number, academicYearId: number) {
  return useQuery({
    queryKey: ['standards', schoolId, academicYearId],
    queryFn: () => getAllStandard(schoolId, academicYearId),
    enabled: !!schoolId,
    staleTime: 1000
  });
}

export function useGetAllStandards(schoolId: number, acedamicyearId: number) {
  return useQuery({
    queryKey: ['standards', schoolId],
    queryFn: () => getAllStandards(schoolId, acedamicyearId),
    staleTime: 1000,
    enabled: !!acedamicyearId
  });
}

export function useGetAllSection(schoolId: number, academicYearId: number, standard: number) {
  return useQuery({
    queryKey: ['standards', schoolId, academicYearId, standard],
    queryFn: () => getAllStandard(schoolId, academicYearId, standard),
    enabled: !!schoolId
  });
}

export function useGetAllPromote(academicYearId: number, schoolId: number, studentId: number) {
  return useQuery({
    queryKey: ['standards', academicYearId, schoolId, studentId],
    queryFn: () => getPromoteYearStandard(academicYearId, schoolId, studentId)
  });
}
export function useViewStandard(schoolId: number, acedamicYearId: number) {
  return useQuery({
    queryKey: ['standards', schoolId, acedamicYearId],
    queryFn: () => getAllStandard(schoolId, acedamicYearId),
    enabled: !!schoolId
  });
}
// export function useGetAllStandards(schoolId: number, acedamicYearId: number) {
//   return useQuery({
//     queryKey: ['standards', schoolId, acedamicYearId],
//     queryFn: () => getAllStandards(schoolId, acedamicYearId),
//     enabled: !!acedamicYearId
//   });
// }

export function useGetStandardbyID(schoolId: number, standardId: number) {
  return useQuery({
    queryKey: ['getSubjectById', schoolId, standardId],
    queryFn: () => getStandardbyID(schoolId, standardId!),
    enabled: !!standardId
  });
}

export function useSectionByStandard(schoolId: number, academicYearId: number, standards: number) {
  return useQuery({
    queryKey: ['getSection', schoolId, academicYearId, standards],
    queryFn: () => getSectionByStandard(schoolId, academicYearId, standards!),
    enabled: !!standards
  });
}

export function useGetStandardPaginationDetails(schoolId: number, payload?: object) {
  return useQuery({
    queryKey: ['getExamDetails', schoolId, payload],
    queryFn: () => getStandardPaginationDetails(schoolId, payload),
    enabled: !!schoolId
  });
}

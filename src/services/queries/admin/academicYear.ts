import { useQuery } from '@tanstack/react-query';
import {
  getAcademicYearbyID,
  getAcademicYearbyPromotion,
  isDefaultCheckAcademicYear,
  viewAcademicYear
} from '../../api/admin/acedamicyear/acedamicyearApi';

export function useViewAcademicYear(schoolId: number) {
  return useQuery({
    queryKey: ['viewAcademicYear', schoolId],
    queryFn: () => viewAcademicYear(schoolId),
    enabled: !!schoolId
  });
}

export function useIsDefaultAcademicYear(schoolId: number) {
  return useQuery({
    queryKey: ['idDefaultCheckAcademicYear', schoolId],
    queryFn: () => isDefaultCheckAcademicYear(schoolId)
  });
}

export function useGetAcademicYearbyID(schoolId: number, academicYearId: number) {
  return useQuery({
    queryKey: ['getAcademicYearById', schoolId, academicYearId],
    queryFn: () => getAcademicYearbyID(schoolId, academicYearId!)
  });
}

export function useGetAllPromoteYear(schoolId: number, studentId: number) {
  return useQuery({
    queryKey: ['standards', schoolId, studentId],
    queryFn: () => getAcademicYearbyPromotion(schoolId, studentId)
  });
}

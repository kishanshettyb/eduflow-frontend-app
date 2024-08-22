import { useQuery } from '@tanstack/react-query';
import {
  getAllFeeStructure,
  getFeeStructureAllMapping,
  getFeeStructurebyID,
  getStudentFeeStructure,
  viewFeeStructure,
  getSingleStudentFeesPaymentDetails
} from '@/services/api/admin/fees/fee';

export function useGetAllFeeStructure(schoolId: number, acedamicyearId: number) {
  return useQuery({
    queryKey: ['fee-structures', schoolId, acedamicyearId],
    queryFn: () => getAllFeeStructure(schoolId, acedamicyearId),
    enabled: !!schoolId
  });
}

export function useViewFeeStructure(schoolId: number, acedamicyearId: number) {
  return useQuery({
    queryKey: ['viewFeeStructure', schoolId, acedamicyearId],
    queryFn: () => viewFeeStructure(schoolId, acedamicyearId)
  });
}

export function useGetFeeStructurebyID(schoolId: number, feeStructureId: number) {
  return useQuery({
    queryKey: ['getFeeStructureById', schoolId, feeStructureId],
    queryFn: () => getFeeStructurebyID(schoolId, feeStructureId!)
  });
}

export function useGetDeletebyID(schoolId: number, feeStructureId: number) {
  return useQuery({
    queryKey: ['getFeeStructureById', schoolId, feeStructureId],
    queryFn: () => getFeeStructurebyID(schoolId, feeStructureId!)
  });
}

export function useGetFeeStructureMapping(
  schoolId: number,
  acedamicyearId: number,
  feeStructureId: number
) {
  return useQuery({
    queryKey: ['getFeeStructureById', schoolId, acedamicyearId, feeStructureId],
    queryFn: () => getFeeStructureAllMapping(schoolId, acedamicyearId, feeStructureId!),
    enabled: !!feeStructureId
  });
}

export function useGetStudentFeeStructure(
  schoolId: number,
  enrollmentId: number,
  AcademicYearId: number
) {
  const { isLoading, isError, data } = useQuery({
    queryKey: ['feeStructure', schoolId, enrollmentId, AcademicYearId],
    queryFn: () => getStudentFeeStructure(schoolId, enrollmentId, AcademicYearId),
    staleTime: 10000
  });

  return { isLoading, isError, data };
}

export function useGetSingleStudentFeesPaymentDetails(
  schoolId: number,
  academicYearId: number,
  enrollmentId: number
) {
  const { isLoading, isError, data } = useQuery({
    queryKey: ['singleStudentFeesPaymentDetails', schoolId, academicYearId, enrollmentId],
    queryFn: () => getSingleStudentFeesPaymentDetails(schoolId, academicYearId, enrollmentId),
    enabled: !!enrollmentId,
    staleTime: 10000
  });
  return { isLoading, isError, data };
}

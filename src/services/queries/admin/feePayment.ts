import { useQuery } from '@tanstack/react-query';
import {
  getAllAssignedFeesPayment,
  getAllEnrollmentFeesPayment,
  getAllPaymentHistory,
  getEnrollmentIdStudentDetailes,
  getEnrollmentbyID,
  getFeeStructures,
  getFeesPaymentDetailes,
  getFeesPaymentDetailsByPaymentId,
  getPDFPaymentDetailes,
  getSingleStudentFeesPaymentDetailes,
  getUpdateChequeDetailes
} from '@/services/api/admin/fees/fee';

export function useGetAllAssignedFeePayment(
  schoolId: number,
  acedamicyearId: number,
  standardIds: number,
  sectionIds: number
) {
  return useQuery({
    queryKey: ['fee-payments', schoolId, acedamicyearId, standardIds, sectionIds],
    queryFn: () => getAllAssignedFeesPayment(schoolId, acedamicyearId, standardIds, sectionIds),
    enabled: sectionIds && sectionIds.length > 0
  });
}

export function useGetEnrollmentbyID(schoolId: number, enrollmentId: number) {
  return useQuery({
    queryKey: ['getEnrollmentIdById', schoolId, enrollmentId],
    queryFn: () => getEnrollmentbyID(schoolId, enrollmentId!)
  });
}

export function useGetEnrollmentFeesPayment(
  schoolId: number,
  enrollmentId: number,
  acedamicyearId: number
) {
  return useQuery({
    queryKey: ['getEnrollmentFeesPayment', schoolId, enrollmentId, acedamicyearId],
    queryFn: () => getAllEnrollmentFeesPayment(schoolId, enrollmentId, acedamicyearId)
  });
}

export function useGetFeesPaymentDetailes(schoolId: number, feePaymentId: number) {
  return useQuery({
    queryKey: ['getFeesPaymentDetailes', schoolId, feePaymentId],
    queryFn: () => getFeesPaymentDetailes(schoolId, feePaymentId!)
  });
}

export function useGetPDFFeesPaymentDetailes(
  schoolId: number,
  feePaymentId: number,
  academicYearId: number,
  enrollmentId: number
) {
  return useQuery({
    queryKey: ['getPDFFeesPaymentDetailes', schoolId, feePaymentId, academicYearId, enrollmentId],
    queryFn: () => getPDFPaymentDetailes(schoolId, feePaymentId, academicYearId, enrollmentId),
    enabled: !!schoolId && !!feePaymentId && !!academicYearId && !!enrollmentId // Fetch only when all params are available
  });
}

export function useGetAllPaymentHistory(schoolId: number, payload?: unknown) {
  return useQuery({
    queryKey: ['paymentHistory', schoolId, payload],
    queryFn: () => getAllPaymentHistory(schoolId, payload),
    enabled: !!schoolId,
    staleTime: 1000
  });
}

export function useGetSingleStudentFeesPaymentDetailes(
  schoolId: number,
  academicYearId: number,
  enrollmentId: number
) {
  return useQuery({
    queryKey: ['singleStudentFeesPaymentDetailes', schoolId, academicYearId, enrollmentId],
    queryFn: () => getSingleStudentFeesPaymentDetailes(schoolId, academicYearId, enrollmentId),
    enabled: !!enrollmentId
  });
}

export function useGetEnrollmentIdStudentDetailes(schoolId: number, enrollmentId: number) {
  return useQuery({
    queryKey: ['enrollmentIdStudentDetailes', schoolId, enrollmentId],
    queryFn: () => getEnrollmentIdStudentDetailes(schoolId, enrollmentId),
    enabled: !!enrollmentId
  });
}

export function useGetFeeStructures(
  schoolId: number,
  academicYearId: number,
  enrollmentId: number
) {
  return useQuery({
    queryKey: ['getFeeStructures', schoolId, academicYearId, enrollmentId],
    queryFn: () => getFeeStructures(schoolId, academicYearId, enrollmentId),
    enabled: !!enrollmentId
  });
}

export function useGetUpdateChequeDetailes(schoolId: number, feePaymentId: number) {
  return useQuery({
    queryKey: ['getUpdateChequeDetailes', schoolId, feePaymentId],
    queryFn: () => getUpdateChequeDetailes(schoolId, feePaymentId),
    enabled: !!feePaymentId
  });
}

export function useGetFeesPaymentDetails(schoolId: number, feePaymentId: number) {
  return useQuery({
    queryKey: ['getFeesPaymentDetailsByPaymentId', schoolId, feePaymentId],
    queryFn: () => getFeesPaymentDetailsByPaymentId(schoolId, feePaymentId!)
  });
}

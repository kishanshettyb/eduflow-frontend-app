import { useQuery } from '@tanstack/react-query';
import {
  downloadAttachment,
  getPDFPaymentDetails,
  viewAttachment
} from '@/services/api/attachment/attachmentApi';

export function useViewAttachment(schoolId: number, attachmentId: number) {
  return useQuery({
    queryKey: ['view', schoolId, attachmentId],
    queryFn: () => viewAttachment(schoolId, attachmentId!),
    enabled: !!attachmentId
  });
}

export function useDownloadAttachment(schoolId: number, attachmentId: number) {
  return useQuery({
    queryKey: ['download', schoolId, attachmentId],
    queryFn: () => downloadAttachment(schoolId, attachmentId!),
    enabled: !!attachmentId
  });
}

export function useDownloadInvoices(
  schoolId: number,
  feePaymentId: number,
  academicYearId: number,
  enrollmentId: number
) {
  const { isLoading, isError, data } = useQuery({
    queryKey: ['view', schoolId, feePaymentId, academicYearId, enrollmentId],
    queryFn: () => getPDFPaymentDetails(schoolId, feePaymentId, academicYearId, enrollmentId!),
    enabled: !!enrollmentId,
    staleTime: 1000
  });
  return { isLoading, isError, data };
}

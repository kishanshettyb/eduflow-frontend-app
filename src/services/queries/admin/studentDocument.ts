import { useQuery } from '@tanstack/react-query';
import { getAllDocumentType, getStudentDocument } from '@/services/api/admin/student/studentApi';

export function useGetStudentAllDocuments(schoolId: number, staffId: number) {
  return useQuery({
    queryKey: ['documents', schoolId, staffId],
    queryFn: () => getStudentDocument(schoolId, staffId),
    enabled: !!staffId
  });
}

export function useGetAllDocumentsType() {
  return useQuery({
    queryKey: ['documents'],
    queryFn: () => getAllDocumentType()
  });
}

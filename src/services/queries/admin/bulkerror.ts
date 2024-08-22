import { getbulkerror } from '@/services/api/admin/bulkerror/bulkerrorApi';
import { useQuery } from '@tanstack/react-query';

export function useGetAllBulkError(schoolId: number, uploadSummaryId: number) {
  return useQuery({
    queryKey: ['bulkerror', schoolId, uploadSummaryId],
    queryFn: () => getbulkerror(schoolId, uploadSummaryId),
    enabled: !!schoolId
  });
}

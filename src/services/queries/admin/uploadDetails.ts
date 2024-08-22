import { getAllUploadDetails } from '@/services/api/admin/uploadDetails/uploadDetailsApi';
import { useQuery } from '@tanstack/react-query';

export function useGetAllDetails(schoolId: number, uploadType: number) {
  return useQuery({
    queryKey: ['uploaddetails', schoolId, uploadType],
    queryFn: () => getAllUploadDetails(schoolId, uploadType)
  });
}

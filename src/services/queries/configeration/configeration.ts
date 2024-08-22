import { getSchoolConfigeration } from '@/services/api/configeration/configerationApi';
import { useQuery } from '@tanstack/react-query';

export function useGetAllConfigeration(schoolId: number) {
  return useQuery({
    queryKey: ['configeration', schoolId],
    queryFn: () => getSchoolConfigeration(schoolId!),
    enabled: !!schoolId
  });
}

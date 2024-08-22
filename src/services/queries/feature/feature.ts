import { getAllResourcesMenu } from '@/services/api/admin/feature/featureApi';
import { useQuery } from '@tanstack/react-query';

export function useGetAllResourcesMenu(schoolId: number, roleName: string) {
  return useQuery({
    queryKey: ['resources', schoolId, roleName],
    queryFn: () => getAllResourcesMenu(schoolId, roleName)
  });
}

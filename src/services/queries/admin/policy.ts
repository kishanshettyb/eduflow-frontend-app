import { getPolicy, getPolicyByRoleName } from '@/services/api/admin/policy/policyApi';
import { useQuery } from '@tanstack/react-query';

export function useGetPolicyByRoleName(schoolId: number, roleName: string) {
  return useQuery({
    queryKey: ['policy', schoolId, roleName],
    queryFn: () => getPolicyByRoleName(schoolId, roleName),
    enabled: !!roleName
  });
}

export function useGetPolicy(schoolId: number) {
  return useQuery({
    queryKey: ['singlepolicy', schoolId],
    queryFn: () => getPolicy(schoolId),
    enabled: !!schoolId
  });
}

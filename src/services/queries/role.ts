import { useQuery } from '@tanstack/react-query';
import { getAllRole, getRoleByStaff } from '../api/role/roleApi';

export function useGetAllRole(schoolId: number) {
  return useQuery({
    queryKey: ['roles', schoolId],
    queryFn: () => getAllRole(schoolId),
    enabled: !!schoolId
  });
}

export function useGetAllRoleByStaff(schoolId: number, staffId: number) {
  return useQuery({
    queryKey: ['roles', schoolId, staffId],
    queryFn: () => getRoleByStaff(schoolId, staffId),
    enabled: !!staffId
  });
}

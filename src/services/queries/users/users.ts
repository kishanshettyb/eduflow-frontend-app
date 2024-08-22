import { getUsersDetails } from '@/services/api/users/users';
import { useQuery } from '@tanstack/react-query';

export function useGetAllUsersDetails(schoolId: number, userName: string) {
  return useQuery({
    queryKey: ['users', schoolId, userName],
    queryFn: () => getUsersDetails(schoolId, userName),
    enabled: !!schoolId
  });
}

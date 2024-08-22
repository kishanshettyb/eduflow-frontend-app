import { useQuery } from '@tanstack/react-query';
import { getAllDepartment } from '@/services/api/superadmin/customers/department/department';

export function useGetAllDepartments(schoolId: number) {
  return useQuery({
    queryKey: ['department', schoolId],
    queryFn: () => getAllDepartment(schoolId)
  });
}

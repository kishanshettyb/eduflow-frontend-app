import { getQualification, getStaffsCount } from '@/services/api/admin/staff/staffApi';
import { getAllSchoolStaffs } from '@/services/api/superadmin/admins/adminApi';
import { useQuery } from '@tanstack/react-query';

export function useGetQualification(schoolId: number, staffId: number) {
  return useQuery({
    queryKey: ['staff', schoolId, staffId],
    queryFn: () => getQualification(schoolId, staffId),
    enabled: !!schoolId
  });
}

export function useGetAllStaffs(schoolId: number) {
  return useQuery({
    queryKey: ['staff', schoolId],
    queryFn: () => getAllSchoolStaffs(schoolId),
    enabled: !!schoolId
  });
}

export function useGetStaffCount(schoolId: number, staffType: string) {
  return useQuery({
    queryKey: ['singleStudent', schoolId, staffType],
    queryFn: () => getStaffsCount(schoolId, staffType!),
    enabled: !!staffType
  });
}

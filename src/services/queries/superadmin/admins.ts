import { useQuery } from '@tanstack/react-query';
import {
  getAllAdmins,
  getSingleAdmin,
  getAllStaffs,
  getSingleStaff,
  getSingleQualification,
  getSingleWorkExperience,
  getAllSchoolStaffs
} from '../../api/superadmin/admins/adminApi';
import { getStaffType } from '@/services/api/admin/staff/staffApi';

export function useGetAllAdmins(schoolId: number) {
  return useQuery({
    queryKey: ['admins', schoolId],
    queryFn: () => getAllAdmins(schoolId),
    enabled: !!schoolId
  });
}

export function useGetAllStaffs(schoolId: number, payload?: unknown) {
  return useQuery({
    queryKey: ['staff', schoolId, payload],
    queryFn: () => getAllStaffs(schoolId, payload),
    enabled: !!schoolId
  });
}

export function useGetAllSchoolStaffs(schoolId: number) {
  return useQuery({
    queryKey: ['staff', schoolId],
    queryFn: () => getAllSchoolStaffs(schoolId),
    enabled: !!schoolId
  });
}
export function useGetSingleAdmin(schoolId: number, id: number) {
  return useQuery({
    queryKey: ['singleAdmin', schoolId, id],
    queryFn: () => getSingleAdmin(schoolId, id!),
    enabled: !!id
  });
}

export function useGetSingleQualification(schoolId: number, staffId: number) {
  return useQuery({
    queryKey: ['singleQualification', schoolId, staffId],
    queryFn: () => getSingleQualification(schoolId, staffId),
    enabled: !!staffId
  });
}
export function useGetSingleWorkExperience(schoolId: number, staffId: number) {
  return useQuery({
    queryKey: ['singleWorkExperience', schoolId, staffId],
    queryFn: () => getSingleWorkExperience(schoolId, staffId),
    enabled: !!staffId
  });
}

export function useGetSingleStaff(schoolId: number, id: number) {
  return useQuery({
    queryKey: ['singleStaff', schoolId, id],
    queryFn: () => getSingleStaff(schoolId, id!),
    enabled: !!id
  });
}

export function useGetStaffType(schoolId: number) {
  return useQuery({
    queryKey: ['staffType', schoolId],
    queryFn: () => getStaffType(schoolId)
  });
}

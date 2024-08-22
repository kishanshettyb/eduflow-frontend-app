import {
  checkUniqueCodeApi,
  getAllSchools,
  getSchoolSetting,
  getSingleSchool
} from '../../api/superadmin/schools/schoolApi';
import { useQuery } from '@tanstack/react-query';

export function useGetAllSchools() {
  return useQuery({
    queryKey: ['schools'],
    queryFn: getAllSchools
  });
}

export function useGetSingleSchool(id: number | null) {
  return useQuery({
    queryKey: ['singleSchool', id],
    queryFn: () => getSingleSchool(id),
    enabled: !!id
  });
}

export function useGetSchoolSetting(schoolId: number) {
  return useQuery({
    queryKey: ['school', schoolId],
    queryFn: () => getSchoolSetting(schoolId),
    enabled: !!schoolId
  });
}
export function useCheckUniqueCode(uniqueCode: string) {
  return useQuery({
    queryKey: ['uniqueCode', uniqueCode],
    queryFn: () => checkUniqueCodeApi(uniqueCode),
    enabled: !!uniqueCode && uniqueCode.length === 3,
    retry: false
  });
}

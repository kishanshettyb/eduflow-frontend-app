import { getstandardTemplate, getstudentTemplate } from '@/services/api/admin/template/templateApi';

import { useQuery } from '@tanstack/react-query';

export function useGetStudentTemplate(schoolId: number) {
  return useQuery({
    queryKey: ['viewStudent', schoolId],
    queryFn: () => getstudentTemplate(schoolId),
    enabled: !!schoolId
  });
}

export function useGetStandardTemplate(schoolId: number, academicYearId: number) {
  return useQuery({
    queryKey: ['viewStudent', schoolId, academicYearId],
    queryFn: () => getstandardTemplate(schoolId, academicYearId),
    enabled: !!schoolId
  });
}

import { useQuery } from '@tanstack/react-query';
import { getAllPeriod, getPeriodbyID, viewPeriod } from '../../api/admin/period/periodApi';

export function useGetAllPeriod(schoolId: number, acedamicyearId: number) {
  return useQuery({
    queryKey: ['periods', schoolId, acedamicyearId],
    queryFn: () => getAllPeriod(schoolId, acedamicyearId),
    enabled: !!schoolId
  });
}

export function useViewPeriod(schoolId: number, acedamicyearId: number) {
  return useQuery({
    queryKey: ['viewPeriod', schoolId, acedamicyearId],
    queryFn: () => viewPeriod(schoolId, acedamicyearId)
  });
}
// export function useGetSinglePeriod(schoolId: number, id: number) {
//   return useQuery({
//     queryKey: ['singleSubject', schoolId, id],
//     queryFn: () => getSinglePeriod(schoolId, id!),
//     enabled: !!id
//   });
// }

export function useGetPeriodbyID(schoolId: number, periodId: number) {
  return useQuery({
    queryKey: ['getPeriodtById', schoolId, periodId],
    queryFn: () => getPeriodbyID(schoolId, periodId!)
  });
}

export function useGetDeletebyID(schoolId: number, periodId: number) {
  return useQuery({
    queryKey: ['getPeriodById', schoolId, periodId],
    queryFn: () => getPeriodbyID(schoolId, periodId!)
  });
}

import { useQuery } from '@tanstack/react-query';
import {
  getAllExamType,
  getExamTypebyID,
  viewExamType
} from '@/services/api/admin/examtype/examtypeApi';

export function useGetAllExamType(schoolId: number, acedamicyearId: number) {
  return useQuery({
    queryKey: ['exam-types', schoolId, acedamicyearId],
    queryFn: () => getAllExamType(schoolId, acedamicyearId),
    enabled: !!schoolId
  });
}

export function useViewExamType(schoolId: number, acedamicyearId: number) {
  return useQuery({
    queryKey: ['viewExamType', schoolId, acedamicyearId],
    queryFn: () => viewExamType(schoolId, acedamicyearId)
  });
}
// export function useGetSingleSubject(schoolId: number, id: number) {
//   return useQuery({
//     queryKey: ['singleSubject', schoolId, id],
//     queryFn: () => getSingleExamType(schoolId, id!),
//     enabled: !!id
//   });
// }

export function useGetExamTypebyID(schoolId: number, examTypeId: number) {
  return useQuery({
    queryKey: ['getExamTypeById', schoolId, examTypeId],
    queryFn: () => getExamTypebyID(schoolId, examTypeId!)
  });
}

export function useGetDeletebyID(schoolId: number, examTypeId: number) {
  return useQuery({
    queryKey: ['getExamTypeById', schoolId, examTypeId],
    queryFn: () => getExamTypebyID(schoolId, examTypeId!)
  });
}

import { useQuery } from '@tanstack/react-query';
import {
  getAllSubject,
  // getSingleSubject,
  getSubjectbyID,
  viewSubject
} from '../../api/admin/subject/subjectApi';

export function useGetAllSubject(schoolId: number) {
  return useQuery({
    queryKey: ['subjects', schoolId],
    queryFn: () => getAllSubject(schoolId),
    enabled: !!schoolId
  });
}

export function useViewSubject(schoolId: number, acedamicyearId: number) {
  return useQuery({
    queryKey: ['viewSubject', schoolId, acedamicyearId],
    queryFn: () => viewSubject(schoolId, acedamicyearId)
  });
}

// export function useGetSingleSubject(schoolId: number, id: number) {
//   return useQuery({
//     queryKey: ['singleSubject', schoolId, id],
//     queryFn: () => getSingleSubject(schoolId, id!),
//     enabled: !!id
//   });
// }

export function useGetSubjectbyID(schoolId: number, subjectId: number) {
  return useQuery({
    queryKey: ['getSubjectById', schoolId, subjectId],
    queryFn: () => getSubjectbyID(schoolId, subjectId!),
    enabled: !!subjectId
  });
}

export function useGetDeletebyID(schoolId: number, subjectId: number) {
  return useQuery({
    queryKey: ['getSubjectById', schoolId, subjectId],
    queryFn: () => getSubjectbyID(schoolId, subjectId!)
  });
}

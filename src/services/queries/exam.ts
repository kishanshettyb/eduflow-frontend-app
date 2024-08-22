import { useQuery } from '@tanstack/react-query';
import {
  getAllExam,
  getAllExamByStandard,
  getAllExamPagination,
  getExambyID,
  getExamDetails,
  viewExam
} from '../api/exam/examApi';

export function useGetAllExam(schoolId: number, acedamicyearId: number) {
  return useQuery({
    queryKey: ['exams', schoolId, acedamicyearId],
    queryFn: () => getAllExam(schoolId, acedamicyearId),
    enabled: !!schoolId
  });
}

export function useViewExam(schoolId: number, acedamicyearId: number) {
  return useQuery({
    queryKey: ['viewExam', schoolId, acedamicyearId],
    queryFn: () => viewExam(schoolId, acedamicyearId)
  });
}

export function useGetExambyID(schoolId: number, examId: number) {
  return useQuery({
    queryKey: ['getExamById', schoolId, examId],
    queryFn: () => getExambyID(schoolId, examId!),
    enabled: !!examId
  });
}

export function useGetDeletebyID(schoolId: number, examId: number) {
  return useQuery({
    queryKey: ['getExamById', schoolId, examId],
    queryFn: () => getExambyID(schoolId, examId!)
  });
}
export function useGetAllExamPagination(schoolId: number, payload?: unknown) {
  return useQuery({
    queryKey: ['exam', schoolId, payload],
    queryFn: () => getAllExamPagination(schoolId, payload),
    enabled: !!schoolId
  });
}

export function useGetAllExamsByStandard(
  schoolId: number,
  accademicYearId: number,
  standardId: number
) {
  const { isLoading, isError, data } = useQuery({
    queryKey: ['exams', schoolId, accademicYearId, standardId],
    queryFn: () => getAllExamByStandard(schoolId, accademicYearId, standardId),
    staleTime: 1000
  });
  return { isLoading, isError, data };
}

export function useGetExamDetails(schoolId: number, payload?: object) {
  return useQuery({
    queryKey: ['getExamDetails', schoolId, payload],
    queryFn: () => getExamDetails(schoolId, payload),
    enabled: !!schoolId
  });
}

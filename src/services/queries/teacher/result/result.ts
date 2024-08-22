import {
  downloadMarksCard,
  getAllResultPagination,
  getAllResultStudent,
  getAllResultTable,
  getAllStandardReport,
  getAllSubjectReport,
  getResults
} from '@/services/api/teacher/result/resultApi';
import { useQuery } from '@tanstack/react-query';

export function useGetAllResultTable(
  schoolId: number,
  examTypeId: number,
  standard: string,
  section: string,
  subjectId: number,
  academicYearId: number,
  subjectTypeId: number
) {
  return useQuery({
    queryKey: [
      'results',
      schoolId,
      examTypeId,
      standard,
      section,
      subjectId,
      academicYearId,
      subjectTypeId
    ],
    queryFn: () =>
      getAllResultTable(
        schoolId,
        examTypeId,
        standard,
        section,
        subjectId,
        academicYearId,
        subjectTypeId
      ),
    enabled: !!subjectId
  });
}

export function useGetResultStudent(
  schoolId: number,
  academicYearId: number,
  examTypeId: number,
  studentId: number
) {
  return useQuery({
    queryKey: ['getResultStudent', schoolId, academicYearId, examTypeId, studentId],
    queryFn: () => getAllResultStudent(schoolId, academicYearId, examTypeId, studentId)
  });
}

export function useGetStandardReport(academicYearId: number, schoolId: number, examTypeId: number) {
  return useQuery({
    queryKey: ['getResultStudent', academicYearId, schoolId, examTypeId],
    queryFn: () => getAllStandardReport(academicYearId, schoolId, examTypeId)
  });
}

export function useGetSubjectReport(
  schoolId: number,
  academicYearId: number,
  standardId: number,
  examTypeId: number
) {
  return useQuery({
    queryKey: ['getResultStudent', schoolId, academicYearId, standardId, examTypeId],
    queryFn: () => getAllSubjectReport(schoolId, academicYearId, standardId, examTypeId)
  });
}

export function useGetAllResultPagination(schoolId: number, payload?: unknown) {
  return useQuery({
    queryKey: ['exam', schoolId, payload],
    queryFn: () => getAllResultPagination(schoolId, payload),
    enabled: !!schoolId
  });
}

export function useGetResults(
  schoolId: number,
  academicYearId: number,
  examTypeId: number,
  studentId: number
) {
  const { isLoading, isError, data } = useQuery({
    queryKey: ['results', schoolId, academicYearId, examTypeId, studentId],
    queryFn: () => getResults(schoolId, academicYearId, examTypeId, studentId),
    staleTime: 10000
  });

  return { isLoading, isError, data };
}

export function useDownloadMarksCard(
  schoolId: number,
  academicYearId: number,
  examTypeId: number,
  studentId: number
) {
  return useQuery({
    queryKey: ['results', schoolId, academicYearId, examTypeId, studentId],
    queryFn: () => downloadMarksCard(schoolId, academicYearId, examTypeId, studentId),
    enabled: !!schoolId && !!academicYearId && !!examTypeId && !!studentId // Fetch only when all params are available
  });
}

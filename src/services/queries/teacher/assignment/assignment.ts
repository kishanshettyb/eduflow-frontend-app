import { getSingleAssignmentsSubmitionDetails } from '@/services/api/admin/assignrole/assignroleApi';
import {
  getAllAssignmentReview,
  getAllAssignments,
  getAllStandardSubject,
  getAllStudentAssignment,
  getAllSubmitAssignment,
  getAssignmentById,
  getMappedAssignment
} from '@/services/api/teacher/assignment/assignmentApi';
import { useQuery } from '@tanstack/react-query';

export function useGetSingleAssignment(schoolId: number, assignmentId: number) {
  return useQuery({
    queryKey: ['assignments', schoolId, assignmentId],
    queryFn: () => getAssignmentById(schoolId, assignmentId!),
    enabled: !!assignmentId
  });
}

export function useGetAllAssignments(schoolId: number, academicYearId: number) {
  return useQuery({
    queryKey: ['assignments', schoolId, academicYearId],
    queryFn: () => getAllAssignments(schoolId, academicYearId!),
    enabled: !!academicYearId
  });
}

export function useGetAllMappedAssignments(schoolId: number, academicYearId: number) {
  return useQuery({
    queryKey: ['assignments', schoolId, academicYearId],
    queryFn: () => getMappedAssignment(schoolId, academicYearId!),
    enabled: !!academicYearId
  });
}

export function useGetAllStudentAssignments(schoolId: number, enrollmentId: number) {
  return useQuery({
    queryKey: ['assignments', schoolId, enrollmentId],
    queryFn: () => getAllStudentAssignment(schoolId, enrollmentId!),
    enabled: !!enrollmentId
  });
}

export function useGetAllSubmitAssignments(schoolId: number, academicYearId: number) {
  return useQuery({
    queryKey: ['assignments', schoolId, academicYearId],
    queryFn: () => getAllSubmitAssignment(schoolId, academicYearId!),
    enabled: !!academicYearId
  });
}

export function useGetSingleAssignmentsSubmittions(
  schoolId: number,
  assignmentSubmissionId: number
) {
  const { isLoading, isError, data } = useQuery({
    queryKey: ['singleAssignment', schoolId, assignmentSubmissionId],
    queryFn: () => getSingleAssignmentsSubmitionDetails(schoolId, assignmentSubmissionId),
    staleTime: 1000
  });
  return { isLoading, isError, data };
}

export function useGetAllAssignmentReview(schoolId: number, payload?: unknown) {
  return useQuery({
    queryKey: ['submission', schoolId, payload],
    queryFn: () => getAllAssignmentReview(schoolId, payload),
    enabled: !!schoolId
  });
}

export function useGetAllStandardSubject(schoolId: number, payload?: unknown) {
  return useQuery({
    queryKey: ['assignments', schoolId, payload],
    queryFn: () => getAllStandardSubject(schoolId, payload),
    enabled: !!schoolId
  });
}

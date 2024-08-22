import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { publishResult, updateResult, verifyResult } from '@/services/api/teacher/result/resultApi';

export function useUpdateResult() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { schoolId: number; data }) => updateResult(data.schoolId, data.data),
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Unable to update result',
        description: error.response?.data?.message || 'An error occurred'
      });
    },
    onSuccess: () => {
      toast({
        variant: 'default',
        title: 'Result updated successfully'
      });

      queryClient.invalidateQueries('results');
    }
  });
}

export function useVerifyResult() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      schoolId: number;
      examTypeId: number;
      standard: string;
      section: string;
      subjectId: number;
      subjectTypeId: number;
      data;
    }) =>
      verifyResult(
        data.schoolId,
        data.examTypeId,
        data.standard,
        data.section,
        data.subjectId,
        data.subjectTypeId,
        data.data
      ),
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Unable to verified result',
        description: error.response?.data?.message || 'An error occurred'
      });
    },
    onSuccess: () => {
      toast({
        variant: 'default',
        title: 'Result verified successfully'
      });

      queryClient.invalidateQueries('results-verified');
    }
  });
}

export function usePublishResult() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      schoolId: number;
      examTypeId: number;
      standard: string;
      section: string;
    }) => publishResult(data.schoolId, data.examTypeId, data.standard, data.section),
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Unable to publish result',
        description: error.response?.data?.message || 'An error occurred'
      });
    },
    onSuccess: () => {
      toast({
        variant: 'default',
        title: 'Result publish successfully'
      });

      queryClient.invalidateQueries('results-publish');
    }
  });
}

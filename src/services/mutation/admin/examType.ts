import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ExamType } from '@/types/admin/examtypeTypes';
import { toast, useToast } from '@/components/ui/use-toast';
import {
  createExamType,
  deleteExamType,
  updateExamType
} from '@/services/api/admin/examtype/examtypeApi';

export function useCreateExamType() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: ExamType) => createExamType(data),
    onMutate: () => {
      console.log('mutate!!!');
    },

    onError: () => {
      console.log('error!!!');
    },

    onSuccess: () => {
      console.log('success!!!');
      toast({
        variant: 'default',
        title: 'Examtype Created Successfully'
      });
      queryClient.invalidateQueries('exam-types');
    },

    onSettled: async (_, error) => {
      console.log('settled');
      if (error) {
        console.log('Show Error: ' + error);
        toast({
          variant: 'destructive',
          title: 'Unable to crete Examtype',
          description: error.response.data.message
        });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['createExamType'] });
      }
    }
  });
}

export function useUpdateExamType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ExamType) => updateExamType(data),
    onMutate: () => {
      console.log('mutate');
    },

    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.'
      });
    },

    onSuccess: () => {
      toast({
        variant: 'default',
        title: 'Examtype Updated Successfully'
      });
      queryClient.invalidateQueries('exam-types');
    },

    onSettled: async (_, error) => {
      console.log('settled**');
      if (error) {
        console.log('Show Error: ' + error);
        toast({
          variant: 'destructive',
          title: 'Unable to update Examtype',
          description: error.response.data.message
        });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['updateExamType'] });
      }
    }
  });
}
export function useDeleteExamType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ schoolId, examTypeId }: { schoolId: number; examTypeId: number }) =>
      deleteExamType(schoolId, examTypeId),
    onMutate: () => {
      console.log('Deleting Exam type...');
    },
    onError: (error) => {
      console.log('Error deleting Exam type');
      toast({
        variant: 'destructive',
        title: 'Unable to delete Exam type',
        description: error.response?.data?.message || 'An error occurred'
      });
    },
    onSuccess: () => {
      console.log('Exam type deleted successfully');
      toast({
        variant: 'default',
        title: 'Exam type Deleted Successfully'
      });
      queryClient.invalidateQueries('exam-types');
    },
    onSettled: async (_, error) => {
      console.log('Delete operation settled');
      if (!error) {
        await queryClient.invalidateQueries({ queryKey: ['viewExamType'] });
      }
    }
  });
}

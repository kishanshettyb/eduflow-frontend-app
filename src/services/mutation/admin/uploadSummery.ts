import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import {
  examUpload,
  studentUpload,
  subjectUpload
} from '@/services/api/admin/uploadSummary/uploadSummeryApi';

export function useStudentUpload() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data) => studentUpload(data),
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
        title: 'Students uploaded Successfully'
      });
      queryClient.invalidateQueries('roles');
    },

    onSettled: async (_, error) => {
      console.log('settled');
      if (error) {
        console.log('Show Error: ' + error);
        toast({
          variant: 'destructive',
          title: 'Unable to crete Role',
          description: error.response.data.message
        });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['uploadStudent'] });
      }
    }
  });
}

export function useExamUpload() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data) => examUpload(data),
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
        title: 'Exam uploaded Successfully'
      });
      queryClient.invalidateQueries('roles');
    },

    onSettled: async (_, error) => {
      console.log('settled');
      if (error) {
        console.log('Show Error: ' + error);
        toast({
          variant: 'destructive',
          title: 'Unable to crete Role',
          description: error.response.data.message
        });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['uploadExam'] });
      }
    }
  });
}

export function useSubjectUpload() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data) => subjectUpload(data),
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
        title: 'Subject uploaded Successfully'
      });
      queryClient.invalidateQueries('roles');
    },

    onSettled: async (_, error) => {
      console.log('settled');
      if (error) {
        console.log('Show Error: ' + error);
        toast({
          variant: 'destructive',
          title: 'Unable to crete Role',
          description: error.response.data.message
        });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['uploadExam'] });
      }
    }
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Student } from '@/types/admin/studentTypes';
import { toast, useToast } from '@/components/ui/use-toast';
import { createStudent, updateStudent } from '@/services/api/admin/student/studentApi';

export function useCreateStudent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: Student) => createStudent(data),
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
        title: 'Student Created Successfully'
      });
    },

    onSettled: async (_, error) => {
      console.log('settled');
      if (error) {
        console.log('Show Error: ' + error);
        toast({
          variant: 'destructive',
          title: 'Unable to crete student',
          description: error.response.data.message
        });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['createStudent'] });
      }
    }
  });
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Student) => updateStudent(data),
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
        title: 'Student Updated Successfully'
      });
    },

    onSettled: async (_, error) => {
      console.log('settled**');
      if (error) {
        console.log('Show Error: ' + error);
        toast({
          variant: 'destructive',
          title: 'Unable to update school',
          description: error.response.data.message
        });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['updateStudent'] });
      }
    }
  });
}

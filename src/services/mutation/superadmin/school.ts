import { School } from '@/types/superadmin/schoolTypes';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSchool, updateSchool } from '@/services/api/superadmin/schools/schoolApi';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

export function useCreateSchool() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();
  return useMutation({
    mutationFn: (data: School) => createSchool(data),
    onMutate: () => {
      console.log('mutate**');
    },

    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Unable to create school',
        description: error.response.data.message
      });
    },

    onSuccess: () => {
      toast({
        variant: 'default',
        title: 'School Created Succesfully'
      });
      router.push('/superadmin/schools');
    },

    onSettled: async (_, error) => {
      console.log('settled**');
      if (error) {
        console.log('Show Error: ' + error);
        toast({
          variant: 'destructive',
          title: 'Unable to crete school',
          description: error.response.data.message
        });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['createSchool'] });
      }
    }
  });
}
export function useUpdateSchool() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: School) => updateSchool(data),
    onMutate: () => {
      console.log('mutate**');
    },

    onError: (error) => {
      console.log('error**');
      toast({
        variant: 'destructive',
        title: 'Unable to update school',
        description: error.response.data.message
      });
    },

    onSuccess: () => {
      toast({
        variant: 'default',
        title: 'School Updated Succesfully'
      });
      router.push('/superadmin/schools');
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
        await queryClient.invalidateQueries({ queryKey: ['updateSchool'] });
      }
    }
  });
}

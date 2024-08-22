import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast, useToast } from '@/components/ui/use-toast';
import { FeeComponent } from '@/types/admin/feecomponentTypes';
import {
  createFeeComponent,
  deleteFeeComponent,
  updateFeeComponent
} from '@/services/api/admin/fees/fee';

export function useCreateFeeComponent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: FeeComponent) => createFeeComponent(data),
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
        title: 'FeeComponent Created Successfully'
      });
      queryClient.invalidateQueries('FeeComponent');
    },

    onSettled: async (_, error) => {
      console.log('settled');
      if (error) {
        console.log('Show Error: ' + error);
        toast({
          variant: 'destructive',
          title: 'Unable to Create FeeComponent',
          description: error.response.data.message
        });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['createFeeComponent'] });
      }
    }
  });
}

export function useUpdateFeeComponent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FeeComponent) => updateFeeComponent(data),
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
        title: 'FeeComponent Updated Successfully'
      });
      queryClient.invalidateQueries('FeeComponent');
    },

    onSettled: async (_, error) => {
      console.log('settled**');
      if (error) {
        console.log('Show Error: ' + error);
        toast({
          variant: 'destructive',
          title: 'Unable to update FeeComponent',
          description: error.response.data.message
        });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['updateFeeComponent'] });
      }
    }
  });
}
export function useDeleteFeeComponent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ schoolId, feeComponentId }: { schoolId: number; feeComponentId: number }) =>
      deleteFeeComponent(schoolId, feeComponentId),
    onMutate: () => {
      console.log('Deleting FeeComponent...');
    },
    onError: (error) => {
      console.log('Error deleting FeeComponent');
      toast({
        variant: 'destructive',
        title: 'Unable to delete FeeComponent',
        description: error.response?.data?.message || 'An error occurred'
      });
    },
    onSuccess: () => {
      console.log('FeeComponent deleted successfully');
      toast({
        default: 'primary',
        title: 'FeeComponent Deleted Successfully'
      });
      queryClient.invalidateQueries('FeeComponent');
    },
    onSettled: async (_, error) => {
      console.log('Delete operation settled');
      if (!error) {
        await queryClient.invalidateQueries({ queryKey: ['viewFeeComponent'] });
      }
    }
  });
}

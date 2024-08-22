import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast, useToast } from '@/components/ui/use-toast';
import { FeeStructure } from '@/types/admin/feestuctureTypes';
import {
  createFeeStructure,
  deleteFeeStructure,
  updateFeeStructure
} from '../../api/admin/fees/fee';

export function useCreateFeeStructure() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: FeeStructure) => createFeeStructure(data),
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
        title: 'FeeStructure Created Successfully'
      });
      queryClient.invalidateQueries('fee-structures');
    },

    onSettled: async (_, error) => {
      console.log('settled');
      if (error) {
        console.log('Show Error: ' + error);
        toast({
          variant: 'destructive',
          title: 'Unable to create FeeStructure',
          description: error.response.data.message
        });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['createFeeStructure'] });
      }
    }
  });
}

export function useUpdateFeeStructure() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FeeStructure) => updateFeeStructure(data),
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
        title: 'FeeStructure Updated Successfully'
      });
      queryClient.invalidateQueries('exam-types');
    },

    onSettled: async (_, error) => {
      console.log('settled**');
      if (error) {
        console.log('Show Error: ' + error);
        toast({
          variant: 'destructive',
          title: 'Unable to update FeeStructure',
          description: error.response.data.message
        });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['updateFeeStructure'] });
      }
    }
  });
}
export function useDeleteFeeStructure() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ schoolId, feeStructureId }: { schoolId: number; feeStructureId: number }) =>
      deleteFeeStructure(schoolId, feeStructureId),
    onMutate: () => {
      console.log('Deleting FeeStructure...');
    },
    onError: (error) => {
      console.log('Error deleting FeeStructure');
      toast({
        variant: 'destructive',
        title: 'Unable to delete FeeStructure',
        description: error.response?.data?.message || 'An error occurred'
      });
    },
    onSuccess: () => {
      console.log('FeeStructure deleted successfully');
      toast({
        default: 'primary',
        title: 'FeeStructure Deleted Successfully'
      });
      queryClient.invalidateQueries('fee-structure');
    },
    onSettled: async (_, error) => {
      console.log('Delete operation settled');
      if (!error) {
        await queryClient.invalidateQueries({ queryKey: ['viewFeeStructure'] });
      }
    }
  });
}

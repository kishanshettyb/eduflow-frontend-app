import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import {
  createFeePayment,
  updateCheque,
  updateOnlinePaymentDetails
} from '@/services/api/admin/fees/fee';
import { FeesPayment } from '@/types/admin/feestuctureTypes';
// import { useRouter } from 'next/navigation';

export function useCreateFeePayment() {
  // const router = useRouter();

  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: FeesPayment) => createFeePayment(data),
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
        title: 'FeePayment Created Successfully'
      });
      queryClient.invalidateQueries('fee-payments');
    },

    onSettled: async (_, error) => {
      console.log('settled');
      if (error) {
        console.log('Show Error: ' + error);
        toast({
          variant: 'destructive',
          title: 'Unable to Create FeePayment',
          description: error.response.data.message
        });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['createFeePayment'] });
      }
    }
  });
}

export function useUpdateOnlinePayment() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: FeesPayment) => updateOnlinePaymentDetails(data),
    onMutate: () => {
      console.log('mutate!!!');
    },
    onError: () => {
      console.log('error!!!');
    },
    onSuccess: (data) => {
      console.log('success!!!', data); // Log response data here
      toast({
        variant: 'default',
        title: 'FeePayment Updated Successfully'
      });
      queryClient.invalidateQueries('fee-payments/updatePayment');
    },
    onSettled: async (_, error) => {
      console.log('settled');
      if (error) {
        console.log('Show Error: ' + error);
        toast({
          variant: 'destructive',
          title: 'Unable to Update FeePayment',
          description: error.response.data.message
        });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['updatePayment'] });
      }
    }
  });
}

export function useUpdateChequePayment() {
  // const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: FeesPayment) => updateCheque(data),
    onMutate: () => {
      console.log('mutate!!!');
    },
    onError: () => {
      console.log('error!!!');
    },
    onSuccess: (data) => {
      console.log('success!!!', data); // Log response data here
      toast({
        variant: 'default',
        title: 'Cheque details Updated Successfully'
      });
      // router.push('/');
      queryClient.invalidateQueries('cheque-details');
    },
    onSettled: async (_, error) => {
      console.log('settled');
      if (error) {
        console.log('Show Error: ' + error);
        toast({
          variant: 'destructive',
          title: 'Unable to Update Cheque details',
          description: error.response.data.message
        });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['cheque-details'] });
      }
    }
  });
}

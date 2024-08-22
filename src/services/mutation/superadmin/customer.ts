import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Customer } from '@/types/superadmin/customerTypes';
import { useToast } from '@/components/ui/use-toast';

import { useRouter } from 'next/navigation';
import { createCustomer, updateCustomer } from '@/services/api/superadmin/customers/customerApi';
export function useCreateCustomer() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: Customer) => createCustomer(data),
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
        title: 'Customer Created Successfully'
      });
      router.push('/superadmin/customers');
    },

    onSettled: async (_, error) => {
      console.log('settled');
      if (error) {
        console.log('Show Error: ' + error);
        toast({
          variant: 'destructive',
          title: 'Unable to crete customer',
          description: error.response.data.message
        });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['createCustomer'] });
      }
    }
  });
}
export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: Customer) => updateCustomer(data),
    onMutate: () => {
      toast({
        title: 'Customer Updated Successfully'
      });
    },

    onError: () => {
      toast({
        title: 'Something went wrong'
      });
    },

    onSuccess: () => {
      toast({
        title: 'Customer Updated Successfully'
      });
      router.push('/superadmin/customers');
    },

    onSettled: async (_, error) => {
      console.log('settled');
      if (error) {
        console.log(error);
      } else {
        await queryClient.invalidateQueries({ queryKey: ['updateCustomer'] });
      }
    }
  });
}

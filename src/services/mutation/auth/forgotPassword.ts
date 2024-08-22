import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { toast } from '@/components/ui/use-toast';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const useForgotPasswordMutation = () => {
  const token = Cookies.get('token');
  const router = useRouter();

  return useMutation({
    mutationFn: (data: { userName: string }) => {
      return axios.post(`${BASE_URL}forgot-password/send-email`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    },
    onSuccess: (data, variables) => {
      router.push(`/auth/new-password/?userName=${variables.userName}`);
    },
    onError: (error) => {
      console.error('Failed to send email:', error);
      const errorMessage =
        error.response?.data?.message || 'An unexpected error occurred. Please try again.';

      toast({
        variant: 'destructive',
        title: 'Request Failed',
        description: errorMessage,
        status: 'error'
      });
    }
  });
};

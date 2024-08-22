import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { toast } from '@/components/ui/use-toast';

const token = Cookies.get('token');

const verifyOtp = async (data: { userName: string; otp: string }) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}forgot-password/verify-otp`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
};

const resendOtp = async (userName: string) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}forgot-password/send-email`,
    { userName },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
};

export const useOtpMutations = (
  setIsOTPVerified: React.Dispatch<React.SetStateAction<boolean>>,
  setIsOTPEnabled: React.Dispatch<React.SetStateAction<boolean>>,
  setTimer: React.Dispatch<React.SetStateAction<number>>,
  setOtp: React.Dispatch<React.SetStateAction<string>>
) => {
  const otpVerificationMutation = useMutation({
    mutationFn: verifyOtp,
    onSuccess: () => {
      console.log('OTP verified successfully');
      toast({
        title: 'OTP Verified',
        description: 'Your OTP has been verified successfully.'
      });
      setIsOTPVerified(true);
      setIsOTPEnabled(false);
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'OTP Verification Failed',
        description: 'The OTP you entered is incorrect. Please try again.'
      });
      console.error('Failed to verify OTP:', error);
    }
  });

  const otpResendMutation = useMutation({
    mutationFn: resendOtp,
    onSuccess: () => {
      setTimer(60);
      setIsOTPEnabled(true);
      setOtp('');
    }
  });

  return { otpVerificationMutation, otpResendMutation };
};

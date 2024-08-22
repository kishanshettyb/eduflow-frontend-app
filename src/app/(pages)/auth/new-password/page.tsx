// 'use client';
// import React, { useState, useEffect } from 'react';
// import { ArrowLeft, RefreshCw, Send } from 'lucide-react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { NewPasswordForm } from '@/components/forms/newPasswordForm';
// import {
//   InputOTP,
//   InputOTPGroup,
//   InputOTPSeparator,
//   InputOTPSlot
// } from '@/components/ui/input-otp';
// import { useOtpMutations } from '@/services/mutation/auth/otp';

// function NewPassword() {
//   const [isOTPVerified, setIsOTPVerified] = useState(false);
//   const [isOTPEnabled, setIsOTPEnabled] = useState(true);
//   const searchParams = useSearchParams();
//   const [token, setToken] = useState<string>('');
//   const router = useRouter();
//   const userName = searchParams.get('userName');
//   const [otp, setOtp] = useState<string>('');
//   const [timer, setTimer] = useState<number>(60);

//   const { otpVerificationMutation, otpResendMutation } = useOtpMutations(
//     setIsOTPVerified,
//     setIsOTPEnabled,
//     setTimer,
//     setOtp
//   );

//   useEffect(() => {
//     const handleVerifyOTP = () => {
//       const data = {
//         userName: userName,
//         otp: otp
//       };

//       otpVerificationMutation.mutate(data, {
//         onSuccess: (response) => {
//           const token = response.token;
//           setToken(token);
//         }
//       });
//     };

//     if (otp.length === 6 && isOTPEnabled) {
//       handleVerifyOTP();
//     }
//   }, [otp, userName, isOTPEnabled]);

//   useEffect(() => {
//     let intervalId: NodeJS.Timeout;

//     if (timer > 0) {
//       intervalId = setInterval(() => {
//         setTimer((prevTimer) => prevTimer - 1);
//       }, 1000);
//     }

//     return () => clearInterval(intervalId);
//   }, [timer]);

//   const handleResendOTP = () => {
//     setTimer(60);
//     otpResendMutation.mutate(userName);
//   };

//   return (
//     <div className="bg-white dark:bg-slate-950 w-screen h-screen relative">
//       <div className="container flex flex-col justify-center items-center w-screen h-screen m-auto">
//         <div className="rounded-full my-10 w-[70px] h-[70px] items-center flex justify-center bg-green-50 border-green-600">
//           <Send className="h-[45px] w-[45px] text-green-600" />
//         </div>
//         <div>
//           <div className="py-10 border m-4 lg:m-0 p-5 rounded-2xl text-center w-[362px]">
//             <h2 className="text-3xl font-bold text-slate-700 mt-5 mb-3">
//               Request sent <br />
//               Successfully
//             </h2>
//             <p className="text-sm text-slate-700 mb-10">
//               We&apos;ve sent a 6-digit confirmation email to your email. Please enter the code in
//               below box to verify your email.
//             </p>
//             <Input disabled className="mb-5" type="userName" placeholder="Email" value={userName} />
//             {!isOTPVerified && (
//               <div>
//                 <InputOTP
//                   maxLength={6}
//                   onChange={(value) => setOtp(value)}
//                   disabled={!isOTPEnabled}
//                 >
//                   <InputOTPGroup>
//                     <InputOTPSlot
//                       index={0}
//                       className={
//                         otpVerificationMutation.isSuccess
//                           ? 'border-green-500'
//                           : otpVerificationMutation.isError
//                             ? 'border-red-500'
//                             : 'border-gray-300'
//                       }
//                       disabled={!isOTPEnabled}
//                     />
//                     <InputOTPSlot
//                       index={1}
//                       className={
//                         otpVerificationMutation.isSuccess
//                           ? 'border-green-500'
//                           : otpVerificationMutation.isError
//                             ? 'border-red-500'
//                             : 'border-gray-300'
//                       }
//                       disabled={!isOTPEnabled}
//                     />
//                   </InputOTPGroup>
//                   <InputOTPSeparator />
//                   <InputOTPGroup>
//                     <InputOTPSlot
//                       index={2}
//                       className={
//                         otpVerificationMutation.isSuccess
//                           ? 'border-green-500'
//                           : otpVerificationMutation.isError
//                             ? 'border-red-500'
//                             : 'border-gray-300'
//                       }
//                       disabled={!isOTPEnabled}
//                     />
//                     <InputOTPSlot
//                       index={3}
//                       className={
//                         otpVerificationMutation.isSuccess
//                           ? 'border-green-500'
//                           : otpVerificationMutation.isError
//                             ? 'border-red-500'
//                             : 'border-gray-300'
//                       }
//                       disabled={!isOTPEnabled}
//                     />
//                   </InputOTPGroup>
//                   <InputOTPSeparator />
//                   <InputOTPGroup>
//                     <InputOTPSlot
//                       index={4}
//                       className={
//                         otpVerificationMutation.isSuccess
//                           ? 'border-green-500'
//                           : otpVerificationMutation.isError
//                             ? 'border-red-500'
//                             : 'border-gray-300'
//                       }
//                       disabled={!isOTPEnabled}
//                     />
//                     <InputOTPSlot
//                       index={5}
//                       className={
//                         otpVerificationMutation.isSuccess
//                           ? 'border-green-500'
//                           : otpVerificationMutation.isError
//                             ? 'border-red-500'
//                             : 'border-gray-300'
//                       }
//                       disabled={!isOTPEnabled}
//                     />
//                   </InputOTPGroup>
//                 </InputOTP>
//               </div>
//             )}
//             <div className="my-4 flex justify-end">
//               {!isOTPVerified && timer === 0 && (
//                 <Button
//                   variant="ghost"
//                   onClick={handleResendOTP}
//                   disabled={otpResendMutation.isLoading}
//                 >
//                   <p className="text-xs flex justify-end items-center text-blue-500">
//                     <RefreshCw className="w-3 h-3 me-2" /> Resend OTP
//                   </p>
//                 </Button>
//               )}
//               {!isOTPVerified && timer > 0 && (
//                 <Button variant="ghost" disabled>
//                   <p className="text-xs flex justify-end items-center text-gray-500">
//                     Resend OTP in <span className="font-bold block ms-2">{timer}</span>
//                   </p>
//                 </Button>
//               )}
//             </div>
//             <div className="my-4">
//               {isOTPVerified && <NewPasswordForm isOTPVerified={isOTPVerified} token={token} />}
//             </div>
//             <Button
//               className="mt-5"
//               variant="link"
//               size="sm"
//               onClick={() => router.push('/auth/login')}
//             >
//               <ArrowLeft className="w-4 h-4 me-2" />
//               Return to sign in
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default NewPassword;

'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, Send } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NewPasswordForm } from '@/components/forms/newPasswordForm';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useOtpMutations } from '@/services/mutation/auth/otp';

function NewPassword() {
  const [isOTPVerified, setIsOTPVerified] = useState(false);
  const [isOTPEnabled, setIsOTPEnabled] = useState(true);
  const searchParams = useSearchParams();
  const [token, setToken] = useState('');
  const router = useRouter();
  const userName = searchParams.get('userName');
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);

  const { otpVerificationMutation, otpResendMutation } = useOtpMutations(
    setIsOTPVerified,
    setIsOTPEnabled,
    setTimer,
    setOtp
  );

  useEffect(() => {
    const handleVerifyOTP = () => {
      const data = {
        userName: userName,
        otp: otp
      };

      otpVerificationMutation.mutate(data, {
        onSuccess: (response) => {
          const token = response.token;
          setToken(token);
        }
      });
    };

    if (otp.length === 6 && isOTPEnabled) {
      handleVerifyOTP();
    }
  }, [otp, userName, isOTPEnabled]);

  useEffect(() => {
    let intervalId;

    if (timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [timer]);

  const handleResendOTP = () => {
    setTimer(60);
    otpResendMutation.mutate(userName);
  };

  return (
    <div className="bg-white dark:bg-slate-950 w-screen h-screen relative">
      <div className="container flex flex-col justify-center items-center w-screen h-screen m-auto">
        <div className="rounded-full my-10 w-[70px] h-[70px] items-center flex justify-center bg-green-50 border-green-600">
          <Send className="h-[45px] w-[45px] text-green-600" />
        </div>
        <div>
          <div className="py-10 border m-4 lg:m-0 p-5 rounded-2xl text-center w-[362px]">
            <h2 className="text-3xl font-bold text-slate-700 mt-5 mb-3">
              Request sent <br />
              Successfully
            </h2>
            <p className="text-sm text-slate-700 mb-10">
              We&apos;ve sent a 6-digit confirmation email to your email. Please enter the code in
              below box to verify your email.
            </p>
            <Input disabled className="mb-5" type="userName" placeholder="Email" value={userName} />
            {!isOTPVerified && (
              <div>
                <InputOTP
                  maxLength={6}
                  onChange={(value) => setOtp(value)}
                  disabled={!isOTPEnabled}
                >
                  <InputOTPGroup>
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        className={
                          otpVerificationMutation.isSuccess
                            ? 'border-green-500'
                            : otpVerificationMutation.isError
                              ? 'border-red-500'
                              : 'border-gray-300'
                        }
                        disabled={!isOTPEnabled}
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
            )}
            <div className="my-4 flex justify-end">
              {!isOTPVerified && timer === 0 && (
                <Button
                  variant="ghost"
                  onClick={handleResendOTP}
                  disabled={otpResendMutation.isLoading}
                >
                  <p className="text-xs flex justify-end items-center text-blue-500">
                    <RefreshCw className="w-3 h-3 me-2" /> Resend OTP
                  </p>
                </Button>
              )}
              {!isOTPVerified && timer > 0 && (
                <Button variant="ghost" disabled>
                  <p className="text-xs flex justify-end items-center text-gray-500">
                    Resend OTP in <span className="font-bold block ms-2">{timer}</span>
                  </p>
                </Button>
              )}
            </div>
            <div className="my-4">
              {isOTPVerified && <NewPasswordForm isOTPVerified={isOTPVerified} token={token} />}
            </div>
            <Button
              className="mt-5"
              variant="link"
              size="sm"
              onClick={() => router.push('/auth/login')}
            >
              <ArrowLeft className="w-4 h-4 me-2" />
              Return to sign in
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewPassword;

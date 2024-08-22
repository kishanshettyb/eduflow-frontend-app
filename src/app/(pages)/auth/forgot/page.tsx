'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Fingerprint, ArrowLeft } from 'lucide-react';
import { ForgotPasswordForm } from '@/components/forms/forgotPasswordForm';
import Link from 'next/link';

function Forgot() {
  return (
    <div className="bg-white dark:bg-slate-950 w-screen h-screen relative">
      <div className="container flex flex-col justify-center items-center w-screen h-screen m-auto">
        <div className="rounded-full my-10 w-[70px] h-[70px] items-center flex justify-center bg-blue-50 border-blue-600">
          <Fingerprint className="h-[45px] w-[45px]  text-blue-600" />
        </div>
        <div>
          <div className="py-10 border m-4 lg:m-0 p-5 rounded-2xl w-auto text-center">
            <h2 className="text-3xl font-bold text-slate-700 mt-5 mb-3">Forgot Password?</h2>
            <p className="text-sm text-slate-700 mb-10">
              No worries, we&apos;ll send you reset instructions.
            </p>
            <ForgotPasswordForm />
            <Link href="/auth/login">
              <Button className="mt-5" variant="link" size="sm">
                <ArrowLeft className="w-4 h-4 me-2" />
                Return to Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Forgot;

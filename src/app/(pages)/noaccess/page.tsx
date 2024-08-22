'use client';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

function Noaccess() {
  const router = useRouter();
  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen">
      <Image
        width="400"
        height="400"
        src="/no-access.svg"
        className="mb-10 rounded-full bg-cover object-cover border shadow"
        alt="no access"
      />
      <h1 className="text-4xl font-bold dark:text-white text-slate-800 mb-10">✋ Access Denied</h1>
      <Button variant="outline" onClick={() => router.back()}>
        <ArrowLeft className="w-4 h-4 me-3" />
        Go Back
      </Button>
    </div>
  );
}

export default Noaccess;

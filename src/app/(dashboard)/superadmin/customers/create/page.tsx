'use client';
import { CreateCustomerForm } from '@/components/forms/createCustomerForm';
import TitleBar from '@/components/header/titleBar';
import FileUpload from '@/components/uploadFiles/uploadFiles';
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';

function CreateCustomers() {
  const [selectedFile, setSelectedFile] = useState(null);
  const searchParams = useSearchParams();
  const id = searchParams.get('customerId');

  return (
    <div className="mt-5">
      <TitleBar title={id ? 'Update  Institution' : 'Create New Institution'} />
      <div className="flex flex-col md:flex-row gap-5 mb-10">
        <div className="basis-2/5">
          <div className="p-10  border   bg-white dark:bg-slate-900  rounded-2xl shadow-3xl h-[450px]">
            <FileUpload
              onFileSelected={setSelectedFile}
              title="Upload Profile Photo"
              description='Upload Institution profile photo below to personalize their experience and improve identification across the platform."'
            />
          </div>
        </div>
        <div className="rounded-2xl basis-3/5 bg-white dark:bg-slate-900 p-5 border shadow-3xl">
          <CreateCustomerForm selectedFile={selectedFile} />
        </div>
      </div>
    </div>
  );
}

export default CreateCustomers;

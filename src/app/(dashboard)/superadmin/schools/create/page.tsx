'use client';
import { CreateSchoolForm } from '@/components/forms/createSchoolForm';
import TitleBar from '@/components/header/titleBar';
import FileUpload from '@/components/uploadFiles/uploadFiles';
import { useViewAttachment } from '@/services/queries/attachment/attachment';
import { useGetSingleSchool } from '@/services/queries/superadmin/schools';
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

function CreatSchools() {
  const [selectedFile, setSelectedFile] = useState(null);
  const searchParams = useSearchParams();
  const id = searchParams.get('schoolId');

  const { data: singleSchoolData } = useGetSingleSchool(id);

  const attachmentId = singleSchoolData?.data.photo?.attachmentId;
  const { data: imageUrl } = useViewAttachment(id, attachmentId);

  return (
    <div className="mt-5">
      <TitleBar title={id ? 'Update  School' : 'Create New School'} />
      <div className="flex flex-col md:flex-row gap-5 mb-10">
        <div className="basis-2/5">
          <div className="p-10  border   bg-white dark:bg-slate-900  rounded-2xl shadow-3xl h-[450px]">
            <FileUpload
              onFileSelected={setSelectedFile}
              initialFileUrl={imageUrl}
              title="Upload Logo"
              description="Upload your logo and fill in the form below to optimize administrative tasks and improve communication within your institution"
            />
          </div>
        </div>
        <div className="rounded-2xl shadow-3xl basis-3/5 bg-white dark:bg-slate-900 p-5 border">
          <CreateSchoolForm selectedFile={selectedFile} />
        </div>
      </div>
    </div>
  );
}

export default CreatSchools;

'use client';

import { CreateAdminForm } from '@/components/forms/createAdminForm';
import TitleBar from '@/components/header/titleBar';
import FileUpload from '@/components/uploadFiles/uploadFiles';
import { useViewAttachment } from '@/services/queries/attachment/attachment';
import { useGetSingleAdmin } from '@/services/queries/superadmin/admins';
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

function CreateAdmins() {
  const [selectedFile, setSelectedFile] = useState(null);
  const searchParams = useSearchParams();
  const schoolId = searchParams.get('schoolId');
  const id = searchParams.get('staffId');
  const { data: singleAdminData } = useGetSingleAdmin(schoolId, id);
  const attachmentId = singleAdminData?.data.photo?.attachmentId;
  const { data: imageUrl } = useViewAttachment(schoolId, attachmentId);

  return (
    <div className="mt-5">
      <TitleBar title={id ? 'Update  Admin' : 'Create New Admin'} />

      <div className="flex flex-col md:flex-row gap-5 mb-10">
        <div className="basis-2/5">
          <div className="p-10  border   bg-white dark:bg-slate-900  rounded-2xl shadow-3xl h-[450px]">
            <FileUpload
              onFileSelected={setSelectedFile}
              initialFileUrl={imageUrl}
              title="Upload Admin Profile Photo"
              description="Easily personalize admin profiles by uploading their photo here. Ideal for enhancing recognition and engagement across the platform."
            />
          </div>
        </div>
        <div className="rounded-2xl shadow-3xl basis-3/5 bg-white dark:bg-slate-900 p-5 border">
          <CreateAdminForm selectedFile={selectedFile} />
        </div>
      </div>
    </div>
  );
}

export default CreateAdmins;

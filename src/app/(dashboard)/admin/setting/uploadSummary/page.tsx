'use client';

import * as React from 'react';

import TitleBar from '@/components/header/titleBar';

import { CreateUploadForm } from '@/components/forms/createUploadForm';

function UploadSummary() {
  return (
    <>
      <div className="mt-5">
        <div className="mt-5">
          <TitleBar title="Upload Summary" />
        </div>
      </div>

      <CreateUploadForm />
    </>
  );
}

export default UploadSummary;

import React from 'react';
import { useViewAttachment } from '@/services/queries/attachment/attachment';

const DownloadAttachment = ({ schoolId, attachmentId, attachmentName }) => {
  const attachmentData = useViewAttachment(schoolId, attachmentId);
  return attachmentData.isLoading ? (
    <div>Loading...</div>
  ) : attachmentData.isSuccess ? (
    <a
      className="truncate text-blue-500 hover:text-blue-700 w-[100px]"
      href={attachmentData.data}
      rel="noopener noreferrer"
    >
      {attachmentName}
    </a>
  ) : (
    <div>No File</div>
  );
};

export default DownloadAttachment;

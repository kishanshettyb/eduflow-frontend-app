'use client';
import React from 'react';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { useGetAnnouncementbyID } from '@/services/queries/admin/announcement';
import { useViewAttachment } from '@/services/queries/attachment/attachment';
import moment from 'moment';
import { useSearchParams } from 'next/navigation';

function AnnouncementDetails() {
  const { schoolId } = useSchoolContext();
  const search = useSearchParams();

  const id = search.get('announcementId');
  const { data: announcementData, isLoading, isError } = useGetAnnouncementbyID(schoolId, id);
  const announcement = announcementData?.data;
  const attachmentId = announcement?.attachment?.attachmentId;
  const { data: attachmentData } = useViewAttachment(schoolId, attachmentId);
  const blobUrl = attachmentData;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 bg-white rounded-2xl text-center shadow-md">
        <p>No Announcement found!!</p>
      </div>
    );
  }

  return (
    <div className="w-full p-6  mx-auto">
      <div className="p-6 bg-white shadow rounded-2xl transform transition duration-500 hover:scale-105 hover:shadow-2xl dark:bg-slate-900">
        <div className="flex justify-between items-center bg-slate-50 border border-slate-100 p-4 rounded-2xl mb-5 dark:bg-slate-900">
          <div
            className={`p-2 border ${announcement.targetType === 'STUDENT' ? 'bg-blue-500 border-blue-300' : 'bg-slate-100 border-slate-300'} flex justify-center items-center w-24 rounded-2xl`}
          >
            <p
              className={`text-xs capitalize ${announcement.targetType === 'STUDENT' ? 'text-white' : 'text-slate-700'}`}
            >
              {announcement.targetType}
            </p>
          </div>
          <div>
            <p>
              <span className="font-semibold">Published On:</span>{' '}
              <span className="text-red-600">
                {moment(announcement.createdTime).format('DD MMMM YYYY')}
              </span>
            </p>
          </div>
        </div>
        <h1 className="mb-4 mt-5 text-2xl font-semibold">{announcement.announcementTitle}</h1>
        <p className="mb-5 text-base">{announcement.description}</p>

        {announcement.attachment ? (
          <div className="flex justify-center items-center">
            {announcement.attachment.contentType.split('/')[0] === 'image' ? (
              <img
                className="w-full h-auto max-h-[500px] object-cover rounded-2xl mb-5"
                src={blobUrl}
                alt={announcement.attachment.attachmentName}
              />
            ) : (
              <a href={blobUrl} download className="text-blue-500 hover:text-blue-700 underline">
                {announcement.attachment.attachmentName}
              </a>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center p-4 m-5 border bg-slate-100 opacity-30 rounded-2xl">
            <p>No Attachments Found!!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AnnouncementDetails;

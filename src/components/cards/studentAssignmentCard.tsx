'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { useGetAllStudentAssignments } from '@/services/queries/teacher/assignment/assignment';
import { ChevronRight, Download, FileText, FileImage } from 'lucide-react';
import { ViewImage } from '@/components/viewfiles/viewImage';
import { useDownloadAttachment } from '@/services/queries/attachment/attachment';
import moment from 'moment';

const AssignmentCard = () => {
  const { schoolId, enrollmentId } = useSchoolContext();
  const router = useRouter();
  const [attachmentToDownload, setAttachmentToDownload] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const { data, isError } = useGetAllStudentAssignments(schoolId, enrollmentId);
  const assignments = data?.data || [];
  const { data: downloadUrl } = useDownloadAttachment(
    schoolId,
    attachmentToDownload?.attachmentId || 0
  );

  const handleCardClick = (assignmentId, assignmentSubmissionId) => {
    const query = assignmentSubmissionId
      ? `?assignmentId=${assignmentId}&assignmentSubmissionId=${assignmentSubmissionId}`
      : `?assignmentId=${assignmentId}`;
    router.push(`/student/assignments/assignment-details${query}`);
  };

  const getFileTypeIcon = (contentType) => {
    if (contentType.includes('image'))
      return <FileImage className="w-5 h-5 text-slate-900 dark:text-slate-500" />;
    if (contentType.includes('pdf'))
      return <FileText className="w-5 h-5 text-white text-slate-900 dark:text-slate-500" />;
    return <FileText className="w-5 h-5 text-slate-900 dark:text-slate-500" />; // Default icon for any other type
  };

  const handleDownload = (attachment) => {
    setAttachmentToDownload(attachment);
  };

  useEffect(() => {
    const downloadFile = async () => {
      if (downloadUrl && attachmentToDownload && !isDownloading) {
        setIsDownloading(true);
        try {
          const response = await fetch(downloadUrl);
          const blob = await response.blob();

          const extension = attachmentToDownload.contentType.split('/')[1];
          const fileName = `${attachmentToDownload.attachmentName}.${extension}`;

          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (error) {
          console.error('File download failed:', error);
        } finally {
          setIsDownloading(false);
          setAttachmentToDownload(null);
        }
      }
    };

    downloadFile();
  }, [downloadUrl, attachmentToDownload, isDownloading]);

  if (isError) return <div>Error loading assignments</div>;

  return (
    <>
      {assignments.length > 0 ? (
        assignments.map((item, index) => (
          <div
            key={index}
            className="shadow-3xl mb-5 w-full border rounded-2xl bg-white dark:bg-slate-900"
            onClick={() =>
              handleCardClick(
                item.assignmentId,
                item.assignmentSubmissionDto?.assignmentSubmissionId
              )
            }
          >
            <div className="relative">
              {item.attachmentDto?.contentType.includes('image') ? (
                <ViewImage
                  schoolId={schoolId}
                  attachmentId={item.attachmentDto.attachmentId}
                  width="1920"
                  height="500"
                  styles="rounded-t-2xl h-[250px] object-cover w-full"
                  alt="assignment image"
                />
              ) : (
                <div className="relative  w-full h-[250px] bg-slate-100 dark:bg-slate-950 flex justify-center items-center rounded-t-2xl">
                  <span className="text-sm flex justify-center items-center text-slate-700 gap-2 dark:text-slate-500 ml-2 mb-5">
                    {getFileTypeIcon(item.attachmentDto.contentType)}
                    {item.attachmentDto.attachmentName}
                  </span>
                </div>
              )}

              {item.attachmentDto && (
                <div className="absolute top-[135px] left-[45%] w-[50px] h-[50px] rounded-full flex justify-center items-center bg-slate-800">
                  <Download
                    className="w-5 h-5 text-white cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(item.attachmentDto);
                    }}
                  />
                </div>
              )}
            </div>
            <div>
              <div className="flex  p-4 justify-between border-b pb-3 border-slate-100 dark:border-slate-600">
                <div>
                  <h2 className="text-xl font-semibold">{item.title}</h2>
                </div>
                <div>
                  <p>
                    <span className="text-xs text-slate-600 font-semibold dark:text-slate-400">
                      Subject:
                    </span>
                    <span className="text-xs text-slate-950 dark:text-slate-200 font-semibold">
                      {item.subjectName}
                    </span>
                  </p>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-slate-700 mt-2 dark:text-slate-200">
                  {item.description}
                  <span className="text-blue-800 inline-flex items-center">
                    Read More
                    <ChevronRight className="w-4 h-4 ms-1" />
                  </span>
                </p>
              </div>
            </div>
            <div className="border-t border-slate-100 dark:border-slate-600">
              <div className="p-4 flex flex-wrap justify-between items-center">
                <div className="flex gap-4">
                  <p>
                    <span className="text-xs text-slate-700 font-semibold dark:text-slate-400">
                      Status:
                    </span>
                    <span className="text-xs text-green-600 font-semibold">
                      {item.assignmentSubmissionDto ? 'Submitted' : 'Pending'}
                    </span>
                  </p>
                  <p>
                    <span className="text-xs text-slate-700 font-semibold dark:text-slate-400">
                      Review Status:
                    </span>
                    <span className="text-xs text-red-600 font-semibold">
                      {item.assignmentSubmissionDto ? 'Reviewed' : 'Pending'}
                    </span>
                  </p>
                </div>
                <p>
                  <span className="font-semibold text-slate-700 text-xs dark:text-slate-400">
                    Due Date:
                  </span>
                  <span className="font-semibold text-red-600 text-xs">
                    {moment(item.lastDate).format('DD MMMM YYYY')}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="flex justify-center p-4 text-center bg-white rounded-2xl">
          <span>No Assignments Found !!</span>
        </div>
      )}
    </>
  );
};

export default AssignmentCard;

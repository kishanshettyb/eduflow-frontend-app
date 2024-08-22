'use client';
import React, { useState } from 'react';
import moment from 'moment';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { useSearchParams } from 'next/navigation';
import {
  useGetSingleAssignment,
  useGetSingleAssignmentsSubmittions
} from '@/services/queries/teacher/assignment/assignment';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/modals/modal';
import { AssignmentSubmissionForm } from '@/components/forms/AssignmentSubmissionForm';
import { useViewAttachment } from '@/services/queries/attachment/attachment';

const ViewAttachmentComponent = ({ schoolId, attachmentId, attachmentName }) => {
  const { data, isLoading, isSuccess } = useViewAttachment(schoolId, attachmentId);

  return isLoading ? (
    <div>Loading...</div>
  ) : isSuccess ? (
    <a
      className="text-blue-500 hover:text-blue-700 transition duration-300 ease-in-out"
      href={data}
      target="_blank"
      rel="noopener noreferrer"
    >
      {attachmentName}
    </a>
  ) : (
    <div>No File</div>
  );
};

const AssignmentDetails = () => {
  const search = useSearchParams();
  const id = search.get('assignmentId');
  const assignmentSubmissionId = search.get('assignmentSubmissionId');
  const { schoolId } = useSchoolContext();

  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);

  const { data: assignmentData } = useGetSingleAssignment(schoolId, id);
  const assignment = assignmentData?.data;

  const { data: submissionData } = useGetSingleAssignmentsSubmittions(
    schoolId,
    assignmentSubmissionId
  );
  const submissionDetails = submissionData?.data;

  const handleOpenSubmitModal = () => {
    setIsSubmitDialogOpen(true);
  };

  return (
    <div className="p-4 animate__animated animate__fadeIn">
      <div className="bg-white rounded-2xl p-4 mb-5 shadow-lg animate__animated animate__fadeInUp dark:bg-slate-900">
        <h1 className="text-3xl font-semibold mb-2">{assignment?.title}</h1>
        <p className="text-sm font-semibold mb-4">{assignment?.description}</p>

        {assignment?.attachmentDto ? (
          <ViewAttachmentComponent
            attachmentId={assignment?.attachmentDto.attachmentId}
            schoolId={schoolId}
            attachmentName={assignment?.attachmentDto.attachmentName}
          />
        ) : (
          <div className="p-4 mb-5 bg-slate-100 text-center rounded-2xl">No Attachments Found</div>
        )}

        <div className="flex justify-between items-center border-t pt-4 border-slate-200 dark:bg-slate-900">
          <div className="flex items-center space-x-4">
            <div className="p-2 border rounded-lg bg-slate-100 dark:text-slate-900">
              <span>{assignment?.subjectName}</span>
            </div>
            <span>
              Review Status:{' '}
              <span
                className={
                  submissionData?.data?.status === 'GRADED' ? 'text-green-600' : 'text-red-600'
                }
              >
                {submissionData?.data?.status === 'GRADED' ? 'Graded' : 'Pending'}
              </span>
            </span>
          </div>
          <img src="/Man.png" alt="Profile" className="w-8 h-8 rounded-full" />
        </div>

        <div className="flex justify-between mt-4">
          <div className="text-xs font-semibold">
            Created On:{' '}
            <span className="text-green-900">
              {moment(assignment?.createdTime).format('DD MMMM YYYY')}
            </span>
          </div>
          <div className="text-xs font-semibold">
            Due Date:{' '}
            <span className="text-red-500">
              {moment(assignment?.lastDate).format('DD MMMM YYYY')}
            </span>
          </div>
        </div>
      </div>

      {assignmentSubmissionId && submissionDetails ? (
        <div className="bg-white rounded-2xl shadow-lg animate__animated animate__fadeInUp dark:bg-slate-900">
          <div className="p-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold">Submission Details</h2>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2 p-2 bg-green-100 border border-green-200 rounded-lg">
                <span className="dark:text-slate-900">Status:</span>
                <span className="text-green-600">Submitted Successfully</span>
              </div>
              <span className="text-xs">
                Submitted On: {moment(submissionDetails.submissionDate).format('DD MMMM YYYY')}
              </span>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Your Comments:</h3>
              <div className="bg-slate-100 p-4 rounded-xl dark:bg-slate-800">
                <p>{submissionDetails.comments}</p>
              </div>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Your Attachments:</h3>
              {submissionDetails.attachments.map((attachment) => (
                <div key={attachment?.attachmentId} className="mb-4">
                  <ViewAttachmentComponent
                    attachmentId={attachment.attachmentId}
                    schoolId={schoolId}
                    attachmentName={attachment.attachmentName}
                  />
                </div>
              ))}
            </div>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Grade:</h3>
              <div className="bg-slate-100 p-4 rounded-xl dark:bg-slate-800">
                <p>{submissionDetails.grade ? submissionDetails.grade : 'Not Graded Yet'}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Feedback:</h3>
              <div className="bg-slate-100 p-4 rounded-xl dark:bg-slate-800">
                <p>{submissionDetails.feedback ? submissionDetails.feedback : 'No Feedback Yet'}</p>
              </div>
            </div>
          </div>
          <Button
            size="lg"
            onClick={handleOpenSubmitModal}
            className="animate__animated animate__pulse"
            style={{ display: submissionDetails?.status === 'GRADED' ? 'none' : 'block' }}
          >
            Edit Submission
          </Button>
        </div>
      ) : !assignmentSubmissionId ? (
        <Button
          size="lg"
          onClick={handleOpenSubmitModal}
          className="animate__animated animate__pulse"
        >
          Submit Assignment
        </Button>
      ) : null}

      <Modal
        title={assignmentSubmissionId ? 'Edit Submission' : 'Submit Assignment'}
        modalSize="max-w-xl"
        description="Enter the details below."
        triggerButtonText={assignmentSubmissionId ? 'Edit Submission' : 'Submit Assignment'}
        open={isSubmitDialogOpen}
        onOpenChange={setIsSubmitDialogOpen}
      >
        <AssignmentSubmissionForm
          assignmentId={id}
          submissionId={assignmentSubmissionId}
          submissionDetails={submissionDetails}
          onClose={() => setIsSubmitDialogOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default AssignmentDetails;

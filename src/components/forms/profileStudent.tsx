/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from 'react';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { Button } from '../ui/button';
import FileUpload from '../uploadFiles/uploadFiles';
import { updateStudentAttachments } from '@/services/mutation/admin/attachment/attachement';
import { Modal } from '../modals/modal';
import { useViewAttachment } from '@/services/queries/attachment/attachment';
import { useGetSingleStudent } from '@/services/queries/admin/student';
import { Image } from 'lucide-react';

const ViewAttachmentComponent = ({ schoolId, attachmentId }) => {
  const attachmentData = useViewAttachment(schoolId, attachmentId);

  return attachmentData.isLoading ? (
    <div>Loading...</div>
  ) : attachmentData.isSuccess && attachmentData.data ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={attachmentData.data || 'https://github.com/shadcn.png'}
      alt="@shadcn"
      className="rounded-full border-4 border-gray-300"
      style={{ width: '150px', height: '150px' }}
    />
  ) : (
    <div>No Image</div>
  );
};

function ProfileStudentPage() {
  const { schoolId, studentId } = useSchoolContext();
  const { data: singleStudentData, isError } = useGetSingleStudent(schoolId, studentId);

  const [isUploadVisible, setIsUploadVisible] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { mutate: updateAttachmentMutation } = updateStudentAttachments();

  useEffect(() => {
    const updateAttachment = async () => {
      if (uploadedFile) {
        const formData = new FormData();
        formData.append('file', uploadedFile);

        try {
          await updateAttachmentMutation({
            schoolId: schoolId,
            studentId: studentId,
            formData: formData
          });
          setIsUploadVisible(false); // Close modal on successful update
        } catch (error) {
          console.error('Error updating attachment:', error);
        }
      }
    };

    updateAttachment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedFile]);

  if (isError) return <div>Error loading profile</div>;
  if (!singleStudentData || !singleStudentData.data) return <div>No profile data available</div>;

  const student = singleStudentData.data;

  return (
    <div className="max-w-4xl mx-auto p-4 dark:bg-slate-900">
      <div className="border p-4 rounded-2xl dark:bg-slate-900">
        <div className="w-full mb-5 bg-slate-50 p-4 rounded-2xl flex justify-center items-center dark:bg-slate-900">
          <div className="flex flex-col justify-center items-center w-1/2 border rounded-2xl border-slate-200 mb-5 p-5 dark:bg-slate-900">
            <div className="flex items-center space-x-4 mb-6 dark:bg-slate-900">
              {student.photo && (
                <ViewAttachmentComponent
                  schoolId={schoolId}
                  attachmentId={student.photo.attachmentId}
                />
              )}
            </div>
            <Button
              variant="outline"
              className="opacity-70 hover:opacity-100"
              onClick={() => setIsUploadVisible(true)}
            >
              <Image className="w-4 h-4 me-2" />
              Change Profile Photo
            </Button>
          </div>
        </div>
        <div className="w-full dark:bg-slate-900">
          {/* Basic Details */}
          <h2 className="text-lg font-semibold mb-2">Basic Details</h2>
          <div className="border rounded-2xl border-slate-200 dark:bg-slate-900">
            <div className="w-full flex dlex-row bg-slate-50 border rounded-tl-2xl rounded-tr-2xl border-b-slate-200 border-x-0 border-t-0 p-2 dark:bg-slate-900">
              <div className="w-1/5">
                <p className="text-sm">Name:</p>
              </div>
              <div className="w-4/5">
                <h2 className="text-sm">{`${student.firstName} ${student.lastName}`}</h2>
              </div>
            </div>
            <div className="w-full flex dlex-row bg-slate-50 border border-b-slate-200 border-x-0 border-t-0 p-2 dark:bg-slate-900">
              <div className="w-1/5">
                <p className="text-sm">Email:</p>
              </div>
              <div className="w-4/5">
                <h2 className="text-sm">{student.email}</h2>
              </div>
            </div>
            <div className="w-full flex dlex-row bg-slate-50 border border-b-slate-200 border-x-0 border-t-0 p-2 dark:bg-slate-900">
              <div className="w-1/5">
                <p className="text-sm">Phone:</p>
              </div>
              <div className="w-4/5">
                <h2 className="text-sm">{student.contactNumber}</h2>
              </div>
            </div>

            <div className="w-full flex dlex-row rounded-bl-2xl rounded-br-2xl bg-slate-50 border border-b-slate-200 border-x-0 border-t-0 p-2 dark:bg-slate-900">
              <div className="w-1/5">
                <p className="text-sm">Standard:</p>
              </div>
              <div className="w-4/5">
                <h2 className="text-sm">
                  {student.enrollmentStudentDto?.standardSection || 'No enrollment details'}
                </h2>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <h2 className="text-lg font-semibold mb-2 mt-5">Contact Details</h2>
          <div className="border rounded-2xl border-slate-200 dark:bg-slate-900">
            <div className="w-full flex dlex-row bg-slate-50 border rounded-tl-2xl rounded-tr-2xl border-b-slate-200 border-x-0 border-t-0 p-2 dark:bg-slate-900">
              <div className="w-1/5">
                <p className="text-sm">Address:</p>
              </div>
              <div className="w-4/5">
                <h2 className="text-sm">
                  {student.currentAddress.streetName}, {student.currentAddress.city},{' '}
                  {student.currentAddress.state}, {student.currentAddress.country} -{' '}
                  {student.currentAddress.pinCode}
                </h2>
              </div>
            </div>
            <div className="w-full flex dlex-row bg-slate-50 rounded-bl-2xl rounded-br-2xl border border-b-slate-200 border-x-0 border-t-0 p-2 dark:bg-slate-900">
              <div className="w-1/5">
                <p className="text-sm">Emergency Contact:</p>
              </div>
              <div className="w-4/5">
                <h2 className="text-sm">
                  {student.emergencyContactName} - {student.emergencyContact}
                </h2>
              </div>
            </div>
          </div>

          {/* Personal Details */}
          <h2 className="text-lg font-semibold mb-2 mt-5">Personal Details</h2>
          <div className="border rounded-2xl border-slate-200 dark:bg-slate-900">
            <div className="w-full flex dlex-row bg-slate-50 border rounded-tl-2xl rounded-tr-2xl border-b-slate-200 border-x-0 border-t-0 p-2 dark:bg-slate-900">
              <div className="w-1/5">
                <p className="text-sm">Father Name:</p>
              </div>
              <div className="w-4/5">
                <h2 className="text-sm">{student.fatherName}</h2>
              </div>
            </div>
            <div className="w-full flex dlex-row bg-slate-50 border border-b-slate-200 border-x-0 border-t-0 p-2 dark:bg-slate-900">
              <div className="w-1/5">
                <p className="text-sm">Mother Name:</p>
              </div>
              <div className="w-4/5">
                <h2 className="text-sm">{student.motherName}</h2>
              </div>
            </div>
            <div className="w-full flex dlex-row rounded-bl-2xl rounded-br-2xl bg-slate-50 border border-b-slate-200 border-x-0 border-t-0 p-2 dark:bg-slate-900">
              <div className="w-1/5">
                <p className="text-sm">Parent Contact:</p>
              </div>
              <div className="w-4/5">
                <h2 className="text-sm">{student.parentContactNumber}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        title="Upload Profile Photo"
        description="Upload a new profile photo for the student ."
        open={isUploadVisible}
        onOpenChange={setIsUploadVisible}
      >
        <FileUpload
          onFileSelected={(file) => setUploadedFile(file)}
          initialFileUrl={student.photo ? student.photo.attachmentUrl : null}
          title="Upload Profile Photo"
          description="Upload a new profile photo for the student."
        />
      </Modal>
    </div>
  );
}

export default ProfileStudentPage;

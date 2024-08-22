/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import FileUpload from '../uploadFiles/uploadFiles';
import { Modal } from '../modals/modal';
import { Image } from 'lucide-react';
import moment from 'moment';
import { ProfileData } from '@/types/profile/profileData';

type ProfilePageProps = {
  data: ProfileData;
  schoolId: string;
  attachmentId?: string;
  // eslint-disable-next-line no-unused-vars
  updateAttachment: (schoolId: string, attachmentId: string, file: File) => Promise<void>;
};

const ViewAttachmentComponent = ({
  photoUrl,
  attachmentId,
  schoolId,
  updateAttachment
}: {
  photoUrl?: string;
  attachmentId?: string;
  schoolId: string;
  // eslint-disable-next-line no-unused-vars
  updateAttachment: (schoolId: string, attachmentId: string, file: File) => Promise<void>;
}) => {
  const [isUploadVisible, setIsUploadVisible] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  useEffect(() => {
    if (uploadedFile && attachmentId) {
      updateAttachment(schoolId, attachmentId, uploadedFile).finally(() =>
        setIsUploadVisible(false)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedFile]);

  return (
    <>
      <div className="flex items-center space-x-4 mb-6 dark:bg-slate-900">
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoUrl}
            alt="Profile"
            className="rounded-full border-4 border-gray-300"
            style={{ width: '150px', height: '150px' }}
          />
        ) : (
          <div>No Image</div>
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
      <Modal
        title="Upload Profile Photo"
        description="Upload a new profile photo."
        open={isUploadVisible}
        onOpenChange={setIsUploadVisible}
      >
        <FileUpload
          onFileSelected={(file) => setUploadedFile(file)}
          initialFileUrl={photoUrl || undefined}
          title="Upload Profile Photo"
          description="Upload a new profile photo."
        />
      </Modal>
    </>
  );
};

const ProfilePage = ({ data, schoolId, attachmentId, updateAttachment }: ProfilePageProps) => {
  return (
    <div className="max-w-4xl mx-auto p-4 dark:bg-slate-900">
      <div className="border p-4 rounded-2xl dark:bg-slate-900">
        <ViewAttachmentComponent
          photoUrl={data.photoUrl}
          attachmentId={attachmentId}
          schoolId={schoolId}
          updateAttachment={updateAttachment}
        />
        <div className="w-full dark:bg-slate-900">
          {/* Basic Details */}
          <h2 className="text-lg font-semibold mb-2">Basic Details</h2>
          <div className="border rounded-2xl border-slate-200 dark:bg-slate-900">
            {[
              { label: 'Name', value: data.name },
              { label: 'Email', value: data.email },
              { label: 'Phone', value: data.phone },
              { label: 'Role', value: data.role },
              { label: 'Joining Date', value: moment(data.joiningDate).format('DD-MMMM-YYYY') },
              { label: 'Department', value: data.department }
            ].map((item, index) => (
              <div
                key={index}
                className="w-full flex dlex-row bg-slate-50 border border-b-slate-200 border-x-0 border-t-0 p-2 dark:bg-slate-900"
              >
                <div className="w-1/5">
                  <p className="text-sm">{item.label}:</p>
                </div>
                <div className="w-4/5">
                  <h2 className="text-sm">{item.value}</h2>
                </div>
              </div>
            ))}
            <div className="w-full flex dlex-row  bg-slate-50 border border-b-slate-200 border-x-0 border-t-0 p-2 dark:bg-slate-900">
              <div className="w-1/5">
                <p className="text-sm">Qualifications:</p>
              </div>
              <div className="w-4/5">
                <ul className="list-disc list-inside">
                  {data.qualifications.length > 0 ? (
                    data.qualifications.map((qual, index) => (
                      <li key={index} className="text-gray-600">
                        {qual}
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-600">No qualifications listed</li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <h2 className="text-lg font-semibold mb-2 mt-5">Contact Details</h2>
          <div className="border rounded-2xl border-slate-200">
            <div className="w-full flex dlex-row bg-slate-50 border rounded-tl-2xl  rounded-tr-2xl border-b-slate-200 border-x-0 border-t-0 p-2 dark:bg-slate-900">
              <div className="w-1/5">
                <p className="text-sm">Address:</p>
              </div>
              <div className="w-4/5">
                <h2 className="text-sm">{data.address}</h2>
              </div>
            </div>
            <div className="w-full flex dlex-row bg-slate-50 rounded-bl-2xl  rounded-br-2xl border border-b-slate-200 border-x-0 border-t-0 p-2 dark:bg-slate-900">
              <div className="w-1/5">
                <p className="text-sm">Emergency Contact:</p>
              </div>
              <div className="w-4/5">
                <h2 className="text-sm">{data.emergencyContact}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

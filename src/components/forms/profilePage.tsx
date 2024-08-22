/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from 'react';
import { useGetSingleStaff } from '@/services/queries/superadmin/admins';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { Button } from '../ui/button';
import FileUpload from '../uploadFiles/uploadFiles';
import { updateAttachmentProfiles } from '@/services/mutation/admin/attachment/attachement';
import { Modal } from '../modals/modal';
import { useViewAttachment } from '@/services/queries/attachment/attachment';
import moment from 'moment';
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
function ProfilePage() {
  const { schoolId, staffId } = useSchoolContext();
  const { data: staffData, isError } = useGetSingleStaff(schoolId, staffId);
  const [isUploadVisible, setIsUploadVisible] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { mutate: updateAttachmentMutation } = updateAttachmentProfiles();

  useEffect(() => {
    const updateAttachment = async () => {
      if (uploadedFile) {
        const formData = new FormData();
        formData.append('file', uploadedFile);

        try {
          await updateAttachmentMutation({
            schoolId: schoolId,
            staffId: staffId,
            formData: formData
          });
          setIsUploadVisible(false); // Close modal on successful update
        } catch (error) {
          console.error('Error updating attachment:', error);
          // Handle error (e.g., show error message)
        }
      }
    };

    updateAttachment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedFile]);

  if (isError) return <div>Error loading profile</div>;
  if (!staffData || !staffData.data) return <div>No profile data available</div>;

  const staff = staffData.data;

  return (
    <div className="max-w-4xl mx-auto p-4 dark:bg-slate-900">
      <div className="border p-4  rounded-2xl dark:bg-slate-900">
        <div className="w-full mb-5   bg-slate-50  p-4 rounded-2xl flex justify-center items-center dark:bg-slate-900">
          <div className="flex flex-col justify-center items-center w-1/2 border rounded-2xl border-slate-200 mb-5 p-5 dark:bg-slate-900">
            <div className="flex items-center space-x-4 mb-6 dark:bg-slate-900">
              {staff.photo && (
                <ViewAttachmentComponent
                  schoolId={schoolId}
                  attachmentId={staff.photo.attachmentId}
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
            <div className="w-full flex dlex-row bg-slate-50 border rounded-tl-2xl  rounded-tr-2xl border-b-slate-200 border-x-0 border-t-0 p-2 dark:bg-slate-900">
              <div className="w-1/5">
                <p className="text-sm">Name:</p>
              </div>
              <div className="w-4/5">
                <h2 className="text-sm ">{`${staff.firstName} ${staff.lastName}`}</h2>
              </div>
            </div>
            <div className="w-full flex dlex-row bg-slate-50 border border-b-slate-200 border-x-0 border-t-0 p-2 dark:bg-slate-900">
              <div className="w-1/5">
                <p className="text-sm ">Email:</p>
              </div>
              <div className="w-4/5 ">
                <h2 className="text-sm">{staff.email}</h2>
              </div>
            </div>
            <div className="w-full flex dlex-row bg-slate-50 border border-b-slate-200 border-x-0 border-t-0 p-2 dark:bg-slate-900">
              <div className="w-1/5">
                <p className="text-sm">Phone:</p>
              </div>
              <div className="w-4/5">
                <h2 className="text-sm">{staff.contactNumber}</h2>
              </div>
            </div>
            <div className="w-full flex dlex-row bg-slate-50 border border-b-slate-200 border-x-0 border-t-0 p-2 dark:bg-slate-900">
              <div className="w-1/5">
                <p className="text-sm">Role:</p>
              </div>
              <div className="w-4/5">
                <h2 className="text-sm">{staff.staffType}</h2>
              </div>
            </div>
            <div className="w-full flex dlex-row  bg-slate-50 border border-b-slate-200 border-x-0 border-t-0 p-2 dark:bg-slate-900">
              <div className="w-1/5">
                <p className="text-sm">Joining Date:</p>
              </div>
              <div className="w-4/5">
                <h2 className="text-sm">{moment(staff.joiningDate).format('DD-MMMM-YYYY')}</h2>
              </div>
            </div>
            <div className="w-full flex dlex-row  bg-slate-50 border border-b-slate-200 border-x-0 border-t-0 p-2 dark:bg-slate-900">
              <div className="w-1/5">
                <p className="text-sm">Department:</p>
              </div>
              <div className="w-4/5">
                <h2 className="text-sm">{staff.departmentDto.departmentName}</h2>
              </div>
            </div>
            <div className="w-full flex dlex-row rounded-bl-2xl  rounded-br-2xl bg-slate-50 border border-b-slate-200 border-x-0 border-t-0 p-2 dark:bg-slate-900">
              <div className="w-1/5">
                <p className="text-sm">Qualifications:</p>
              </div>
              <div className="w-4/5">
                <ul className="list-disc list-inside">
                  {staff.qualificationDtoSet.length > 0 ? (
                    staff.qualificationDtoSet.map((qual, index) => (
                      <li key={index} className="text-gray-600">
                        {qual.qualificationName}
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-600">No qualifications listed</li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Details  */}
          <h2 className="text-lg font-semibold mb-2 mt-5">Contact Details</h2>
          <div className="border rounded-2xl border-slate-200">
            <div className="w-full flex dlex-row bg-slate-50 border rounded-tl-2xl  rounded-tr-2xl border-b-slate-200 border-x-0 border-t-0 p-2 dark:bg-slate-900">
              <div className="w-1/5">
                <p className="text-sm">Address:</p>
              </div>
              <div className="w-4/5">
                <h2 className="text-sm">
                  {staff.currentAddress.streetName}, {staff.currentAddress.city},
                  {staff.currentAddress.state}, {staff.currentAddress.country} -
                  {staff.currentAddress.pinCode}
                </h2>
              </div>
            </div>
            <div className="w-full flex dlex-row bg-slate-50 rounded-bl-2xl  rounded-br-2xl border border-b-slate-200 border-x-0 border-t-0 p-2 dark:bg-slate-900">
              <div className="w-1/5">
                <p className="text-sm">Emergency Contact:</p>
              </div>
              <div className="w-4/5">
                <h2 className="text-sm">
                  {staff.emergencyContactName} - {staff.emergencyContact}
                </h2>
              </div>
            </div>
          </div>

          {/* Personal Details */}
          <h2 className="text-lg font-semibold mb-2 mt-5">Personal Details</h2>
          <div className="border rounded-2xl border-slate-200">
            <div className="w-full flex dlex-row bg-slate-50 border rounded-tl-2xl  rounded-tr-2xl border-b-slate-200 border-x-0 border-t-0 p-2 dark:bg-slate-900">
              <div className="w-1/5">
                <p className="text-sm">Father Name:</p>
              </div>
              <div className="w-4/5">
                <h2 className="text-sm">{`${staff.firstName} ${staff.lastName}`}</h2>
              </div>
            </div>
            <div className="w-full flex dlex-row bg-slate-50 border border-b-slate-200 border-x-0 border-t-0 p-2 dark:bg-slate-900">
              <div className="w-1/5">
                <p className="text-sm">Mother Name:</p>
              </div>
              <div className="w-4/5">
                <h2 className="text-sm">{staff.email}</h2>
              </div>
            </div>
            <div className="w-full flex dlex-row rounded-bl-2xl  rounded-br-2xl bg-slate-50 border border-b-slate-200 border-x-0 border-t-0 p-2 dark:bg-slate-900">
              <div className="w-1/5">
                <p className="text-sm">Date of Birth:</p>
              </div>
              <div className="w-4/5">
                <h2 className="text-sm">{staff.contactNumber}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        title="Upload Profile Photo"
        description="Upload a new profile photo for the staff member."
        open={isUploadVisible}
        onOpenChange={setIsUploadVisible}
      >
        <FileUpload
          onFileSelected={(file) => setUploadedFile(file)}
          initialFileUrl={staff.photo ? staff.photo.attachmentUrl : null}
          title="Upload Profile Photo"
          description="Upload a new profile photo for the staff member."
        />
      </Modal>
    </div>
  );
}

export default ProfilePage;

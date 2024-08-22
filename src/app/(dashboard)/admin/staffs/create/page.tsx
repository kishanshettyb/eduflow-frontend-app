'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TitleBar from '@/components/header/titleBar';
import FileUpload from '@/components/uploadFiles/uploadFiles';
import { useViewAttachment } from '@/services/queries/attachment/attachment';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { useSearchParams } from 'next/navigation';
import { CreateStaffInfoForm } from '@/components/forms/createStaffInfoForm';
import { useGetSingleStaff } from '@/services/queries/superadmin/admins';
import QualificationForm from '@/components/forms/createQualificationForm';
import WorkExperienceForm from '@/components/forms/createWorkExperienceForm';

function CreateStaff() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeTab, setActiveTab] = useState('personalInfo');
  const [staffId, setStaffId] = useState(null);
  const { schoolId } = useSchoolContext();
  const searchParams = useSearchParams();
  const id = searchParams?.get('staffId');

  const { data: singleStaffData } = useGetSingleStaff(schoolId, id);
  const attachmentId = singleStaffData?.data.photo?.attachmentId;
  const { data: imageUrl } = useViewAttachment(schoolId, attachmentId);

  useEffect(() => {
    if (id) {
      setStaffId(id);
    }
  }, [id]);

  const handleStaffCreated = (staffId) => {
    setStaffId(staffId);
    setActiveTab('qualification');
  };

  return (
    <div className="mt-5">
      <TitleBar title={id ? 'Update staff' : 'Create New Staff'} />
      <div className="flex flex-row gap-5 mb-10">
        <div className="rounded-2xl shadow-3xl w-full bg-white dark:bg-slate-900 p-5 border">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personalInfo">Personal Info</TabsTrigger>
              <TabsTrigger value="qualification" disabled={!id && !staffId}>
                Qualification
              </TabsTrigger>
              <TabsTrigger value="workExperience" disabled={!id && !staffId}>
                Work Experience
              </TabsTrigger>
            </TabsList>
            <TabsContent value="personalInfo">
              <div className="flex flex-row gap-5">
                <div className="basis-2/5">
                  <div className="p-10 border bg-white dark:bg-slate-900 rounded-2xl shadow-3xl h-[450px]">
                    <FileUpload
                      onFileSelected={setSelectedFile}
                      initialFileUrl={imageUrl}
                      title="Upload Profile"
                      description="Upload your Profile and fill in the form below to optimize administrative tasks and improve communication within your institution"
                    />
                  </div>
                </div>
                <div className="basis-3/5">
                  <CreateStaffInfoForm selectedFile={selectedFile} onSuccess={handleStaffCreated} />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="qualification">
              <QualificationForm staffId={staffId} />
            </TabsContent>
            <TabsContent value="workExperience">
              <WorkExperienceForm staffId={staffId} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default CreateStaff;

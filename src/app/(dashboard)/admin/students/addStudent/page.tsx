'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreateStudentForm } from '@/components/forms/createStudentForm';
import AcademicForm from '@/components/forms/createAcademicForm';
import TitleBar from '@/components/header/titleBar';
import FileUpload from '@/components/uploadFiles/uploadFiles';
import { useViewAttachment } from '@/services/queries/attachment/attachment';
import { useGetSingleStudent } from '@/services/queries/admin/student';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { useSearchParams } from 'next/navigation';
import EnrollmentForm from '@/components/forms/createStudentEnrollementForm';

function CreateStudent() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<string>('createStudentForm');
  const [studentId, setStudentId] = useState<number | null>(null); // State to store studentId
  const [deleteAttachment, setDeleteAttachment] = useState<boolean>(false);
  const { schoolId } = useSchoolContext();
  const searchParams = useSearchParams();
  const id = searchParams?.get('studentId');
  const { data: singleStudentData } = useGetSingleStudent(schoolId, id);
  const attachmentId = singleStudentData?.data?.photo?.attachmentId;
  const { data: imageUrl, refetch } = useViewAttachment(schoolId, attachmentId);

  useEffect(() => {
    if (id) {
      setStudentId(Number(id));
    } else {
      // Reset form state and navigate to CreateStudentForm tab if studentId is not present
      setStudentId(null);
      setSelectedFile(null);
      setActiveTab('createStudentForm');
    }
  }, [id]);

  useEffect(() => {
    if (studentId) {
      // Refetch the attachment and student data when studentId is present
      refetch();
    }
  }, [studentId, refetch]);

  const handleStudentCreated = (studentId: number) => {
    setStudentId(studentId);
    setActiveTab('academicForm');
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'createStudentForm') {
      // Refetch to ensure the profile image and other data are correct
      refetch();
    }
  };

  return (
    <div className="mt-5">
      <TitleBar title={id ? 'Update Student' : 'Create New Student'} />
      <div className="flex flex-row gap-5 mb-10">
        <div className="rounded-2xl shadow-3xl w-full bg-white dark:bg-slate-900 p-5 border">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="createStudentForm">Personal Details</TabsTrigger>
              <TabsTrigger value="academicForm" disabled={!studentId}>
                Documents
              </TabsTrigger>
              <TabsTrigger value="enrollmentForm" disabled={!studentId}>
                Enrollment Details
              </TabsTrigger>
            </TabsList>
            <TabsContent value="createStudentForm">
              <div className="flex flex-col lg:flex-row gap-5 mt-5">
                <div className="basis-2/5 ">
                  <div className="p-10 border bg-white dark:bg-slate-900 rounded-2xl h-[450px]">
                    <FileUpload
                      key={studentId} // Adding key to reset FileUpload when studentId changes
                      onFileSelected={setSelectedFile}
                      onRemoveFile={() => setDeleteAttachment(true)}
                      initialFileUrl={studentId ? imageUrl : null}
                      title="Upload Profile"
                      description="Upload your Profile and fill in the form below to optimize administrative tasks and improve communication within your institution"
                    />
                  </div>
                </div>
                <div className="basis-3/5">
                  <div className="p-10 border bg-white dark:bg-slate-900 rounded-2xl">
                    <CreateStudentForm
                      key={studentId} // Adding a key to reset the form when studentId changes
                      selectedFile={selectedFile}
                      onSuccess={handleStudentCreated}
                      deleteAttachment={deleteAttachment}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="academicForm">
              <AcademicForm studentId={studentId} />
            </TabsContent>
            <TabsContent value="enrollmentForm">
              <EnrollmentForm studentId={studentId} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default CreateStudent;

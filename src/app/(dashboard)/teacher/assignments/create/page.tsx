'use client';

import React from 'react';

import TitleBar from '@/components/header/titleBar';

import { useSearchParams } from 'next/navigation';
import CreateAssignmentForm from '@/components/forms/createAssignmentForm';

function CreateAssignment() {
  const searchParams = useSearchParams();
  const id = searchParams?.get('assignmentId');

  return (
    <div className="mt-5">
      <TitleBar title={id ? 'Update Assignment' : 'Create Assignment'} />
      <div className="flex flex-row gap-5 mb-10">
        <CreateAssignmentForm />
      </div>
    </div>
  );
}

export default CreateAssignment;

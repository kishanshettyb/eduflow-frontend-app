'use client';
import TitleBar from '@/components/header/titleBar';
import React from 'react';

import AssignmentMappingForm from '@/components/forms/AssignmentMappingForm';

function AssignmentMapping() {
  return (
    <div className="mt-5">
      <TitleBar title="Create Assignment Mapping" />

      <div className="rounded-2xl basis-3/5 bg-white dark:bg-slate-900 p-5 border shadow-3xl">
        <AssignmentMappingForm />
      </div>
    </div>
  );
}

export default AssignmentMapping;

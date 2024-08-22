'use client';

import CreateAssignRoleForm from '@/components/forms/createAssignRoleForm';
import TitleBar from '@/components/header/titleBar';

import React from 'react';

function AssignRole() {
  return (
    <div className="mt-5">
      <TitleBar title="" />

      <div className="rounded-2xl basis-3/5 bg-white dark:bg-slate-900 p-5 border shadow-3xl">
        <CreateAssignRoleForm />
      </div>
    </div>
  );
}

export default AssignRole;

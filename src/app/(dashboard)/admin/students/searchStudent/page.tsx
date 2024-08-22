'use client';

import * as React from 'react';

import TitleBar from '@/components/header/titleBar';
import StudentForm from '@/components/forms/getStudentForm';

function searchStudent() {
  return (
    <>
      <div className="mt-5">
        <div className="mt-5">
          <TitleBar
            title="Search Student"
            btnLink="/admin/students/addStudent"
            btnName="Create Student"
          />
        </div>
        <StudentForm />
      </div>
    </>
  );
}

export default searchStudent;

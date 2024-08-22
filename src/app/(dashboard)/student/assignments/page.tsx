import React from 'react';
import TitleBar from '@/components/header/titleBar';
import AssignmentCard from '@/components/cards/studentAssignmentCard';
const Assignments = () => {
  return (
    <>
      <div className="mt-5">
        <TitleBar title="Student Assignments" />
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          <AssignmentCard />
        </div>
      </div>
    </>
  );
};

export default Assignments;

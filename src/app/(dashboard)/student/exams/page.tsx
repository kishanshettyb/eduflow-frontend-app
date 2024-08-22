'use client';
import React from 'react';
import ExamsCard from '@/components/cards/examCard';
import TitleBar from '@/components/header/titleBar';

const Exams = () => {
  return (
    <>
      <div className="mt-5">
        <TitleBar title="Exams" />
      </div>

      <div className="mt-5">
        <ExamsCard />
      </div>
    </>
  );
};

export default Exams;

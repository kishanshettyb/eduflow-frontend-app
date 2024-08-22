'use client';

import { CreateResultForm } from '@/components/forms/createResultForm';
import TitleBar from '@/components/header/titleBar';

import React from 'react';

function Result() {
  return (
    <div className="mt-5">
      <TitleBar title="Create Result" />

      <div className="rounded-2xl basis-3/5 bg-white dark:bg-slate-900 p-5 border shadow-3xl">
        <CreateResultForm />
      </div>
    </div>
  );
}

export default Result;

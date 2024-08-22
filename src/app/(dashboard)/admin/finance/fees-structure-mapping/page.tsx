'use client';
import TitleBar from '@/components/header/titleBar';
import React from 'react';

import FeeStructureMappingForm from '@/components/forms/feeStructureMappingForm';

function FeeStructureMapping() {
  return (
    <div className="mt-5">
      <TitleBar title="Create Fee Structure Mapping" />

      <div className="rounded-2xl basis-3/5 bg-white dark:bg-slate-900 p-5 border shadow-3xl">
        <FeeStructureMappingForm />
      </div>
    </div>
  );
}

export default FeeStructureMapping;

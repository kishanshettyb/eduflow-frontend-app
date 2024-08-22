import React from 'react';
import { FileUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as XLSX from 'xlsx/xlsx.mjs';

const ExportData = ({ data = [], fileName }) => {
  return (
    <>
      <Button
        variant="outline"
        onClick={() => {
          const datas = data?.length ? data : [];
          const worksheet = XLSX.utils.json_to_sheet(datas);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
          XLSX.writeFile(workbook, fileName ? `${fileName}.xlsx` : 'report.xlsx');
        }}
      >
        <FileUp className="w-4 h-4 mr-2" />
        Export
      </Button>
    </>
  );
};

export default ExportData;

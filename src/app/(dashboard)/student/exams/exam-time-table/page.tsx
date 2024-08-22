'use client';
import React from 'react';
import moment from 'moment';
import { useGetExamDetails } from '@/services/queries/exam';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { useSearchParams } from 'next/navigation';
import TitleBar from '@/components/header/titleBar';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

const ExamTimeTable = () => {
  const search = useSearchParams();
  const id = search.get('examId');
  const name = search.get('name');
  const { schoolId, academicYearId } = useSchoolContext();
  const examData = {
    page: '0',
    size: '10',
    sortBy: [],
    sortOrder: 'desc',
    filterBy: {
      school: {
        schoolId: schoolId
      },
      examType: {
        examTypeId: id,
        academicYear: {
          academicYearId: academicYearId
        }
      }
    }
  };
  const getExamDetails = useGetExamDetails(schoolId, examData);
  const exam = getExamDetails.data?.data;

  if (getExamDetails.isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-row items-center justify-between p-4 my-5 bg-slate-100 rounded-2xl">
          <div className="w-[50px] h-[50px] rounded-full bg-slate-200"></div>
          <div className="py-2 w-[100px] bg-slate-200 rounded-2xl"></div>
          <div className="px-5 py-2 bg-slate-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mt-5">
        <TitleBar title={`${name}  Time Table `} />
      </div>
      <div className="flex flex-1 flex-col p-4 w-full">
        <div className="p-4 rounded-2xl shadow-3xl border ">
          <Table className="border shadow-3xl">
            <TableCaption>{`${name} Time Table `}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Sl.</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Min Mark</TableHead>
                <TableHead>Max Mark</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exam.content.map((item, index) => (
                <TableRow key={item.examId}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="font-medium">
                    {moment(item.examDate).format('DD-MMMM-YYYY')}
                    <span className="p-2 border inline-block ml-2 rounded">
                      {moment(item.startTime, 'HH:mm').format('HH:mm A')}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">
                    {item.standardSubjectDto.subjectDto.subjectName}
                  </TableCell>
                  <TableCell className="font-medium">{item.minMarks}</TableCell>
                  <TableCell className="font-medium">{item.maxMarks}</TableCell>
                  <TableCell className="font-medium">{item.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default ExamTimeTable;

'use client';
import React from 'react';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import { useGetAllExamsByStandard } from '@/services/queries/exam';
import { useSchoolContext } from '@/lib/provider/schoolContext';

const ExamsCard = () => {
  const { standardId, schoolId, academicYearId } = useSchoolContext();
  const getAllExams = useGetAllExamsByStandard(schoolId, academicYearId, standardId);
  const exams = getAllExams.data?.data;
  const router = useRouter();

  const groupedExams = exams?.reduce((groups, exam) => {
    const examNameTitle = exam.examTypeDto.examNameTitle;
    const examTypeId = exam.examTypeDto.examTypeId;

    if (!groups[examNameTitle]) {
      groups[examNameTitle] = {
        examNameTitle,
        examTypeId,
        exams: []
      };
    }

    groups[examNameTitle].exams.push({
      subject: exam.standardSubjectDto.subjectDto.subjectName,
      examDate: exam.examDate
    });
    return groups;
  }, {});

  // Convert grouped exams object to an array for rendering
  const groupedExamsArray = Object.values(groupedExams || {});
  console.log('groupedExamsArray', JSON.stringify(groupedExamsArray));

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 ">
        {groupedExamsArray.map((group, index) => (
          <div
            key={index}
            className="p-6 bg-white text-blue-500 mb-5 rounded-2xl shadow-md dark:bg-slate-900"
          >
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-col justify-start w-4/5">
                <h2 className="text-2xl font-semibold mb-3">{group.examNameTitle}</h2>
                <div className="mr-3 gap-4 overflow-x-scroll flex flex-row">
                  {group.exams.map((exam, examIndex) => (
                    <div
                      key={examIndex}
                      className="bg-teal-50 flex justify-center items-center h-[30px] px-4 border border-teal-100 rounded-lg"
                    >
                      <span>{exam.subject}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-center justify-center w-1/5 px-1 py-2 text-center bg-blue-500 rounded-xl h-[85px]">
                <div className="text-2xl font-bold text-white">
                  {moment(group.exams[0]?.examDate).date()}
                </div>
                <div className="text-lg font-bold text-white">
                  {moment(group.exams[0]?.examDate).format('MMM')}
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                router.push(
                  `/student/exams/exam-time-table?examId=${group.examTypeId}&name=${group.examNameTitle}`
                );
              }}
              className="mt-4 px-4 py-2 bg-blue-900 hover:bg-blue-600 text-white rounded-lg transition duration-300"
            >
              View Exam Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExamsCard;

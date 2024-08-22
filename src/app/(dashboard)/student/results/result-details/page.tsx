'use client';
import { useGetResults } from '@/services/queries/teacher/result/result';
import { useDownloadMarksCard } from '@/services/queries/teacher/result/result';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { useEffect, useState } from 'react';
import moment from 'moment';
import React from 'react';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation';
import TitleBar from '@/components/header/titleBar';

const ResultDetails = () => {
  const { schoolId, academicYearId, studentId } = useSchoolContext();
  const search = useSearchParams();
  const examTypeId = search?.get('examTypeId');

  const [results, setResults] = useState([]);
  const getAllResults = useGetResults(schoolId, academicYearId, examTypeId, studentId);
  const fetchedResults = getAllResults.data?.data || [];

  useEffect(() => {
    if (fetchedResults.length > 0) {
      setResults(fetchedResults);
    }
  }, [fetchedResults]);

  const { isLoading: isDownloading, refetch: refetchMarksCard } = useDownloadMarksCard(
    schoolId,
    academicYearId,
    examTypeId,
    studentId
  );

  const handleDownload = async () => {
    try {
      const blob = await refetchMarksCard().then((res) => res.data);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'marks_card.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading marks card:', error);
    }
  };

  if (results.length === 0) {
    return <p className="text-gray-500 text-center">Loading...</p>;
  }

  const studentName = `${results[0].studentDto.firstName} ${results[0].studentDto.lastName}`;
  const resultAnnouncementDate = moment(results[0].resultAnnouncementDate).format('DD-MMMM-YYYY');
  const examType = results[0].examDto?.examTypeDto?.examNameTitle || 'N/A';

  return (
    <div>
      <TitleBar title={'Marks Card'} />

      <div className="mb-4 p-4 bg-white rounded-lg shadow-md border border-gray-300 dark:bg-slate-900">
        <h2 className="text-2xl font-semibold mb-2">Student Information</h2>
        <p className="text-lg">
          Name: <span className="font-semibold text-blue-600">{studentName}</span>
        </p>
        <p className="text-lg">
          Result Announcement Date:{' '}
          <span className="font-semibold text-blue-600">{resultAnnouncementDate}</span>
        </p>
        <p className="text-lg">
          Exam Type: <span className="font-semibold text-blue-600">{examType}</span>
        </p>
      </div>

      <div className="grid grid-cols-6 gap-4 bg-white border border-gray-200 p-4 rounded-lg shadow-md dark:bg-slate-900 ">
        <div>Subject</div>
        <div>Score Obtained</div>
        <div>Minimum Marks</div>
        <div>Maximum Marks</div>
        <div>Grade</div>
        <div>Remarks</div>

        {results.map((result) => {
          const { examDto } = result;
          const { standardSubjectDto } = examDto || {};
          return (
            <React.Fragment key={result.resultId}>
              <div>{standardSubjectDto?.subjectDto?.subjectName}</div>
              <div>{result.score}</div>
              <div>{examDto.minMarks}</div>
              <div>{examDto.maxMarks}</div>
              <div>{result.grade}</div>
              <div>{result.remarks}</div>
            </React.Fragment>
          );
        })}
      </div>

      <Button className="mt-6 w-full" onClick={handleDownload} disabled={isDownloading}>
        {isDownloading ? 'Downloading...' : 'Download Marks Card'}
      </Button>
    </div>
  );
};

export default ResultDetails;

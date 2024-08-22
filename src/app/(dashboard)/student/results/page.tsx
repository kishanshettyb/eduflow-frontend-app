'use client';

import { useRouter } from 'next/navigation';
import { useGetResults } from '@/services/queries/teacher/result/result';
import moment from 'moment';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useGetAllExamType } from '@/services/queries/admin/examType';
import TitleBar from '@/components/header/titleBar';
import { useGetPolicyRules } from '@/services/queries/policyRules/policyRules';

const Results = () => {
  const { schoolId, academicYearId, studentId } = useSchoolContext();
  const [examTypeId, setExamTypeId] = useState(null);
  const router = useRouter();
  const { data: examTypesData } = useGetAllExamType(schoolId, academicYearId);
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    const storedRoles = JSON.parse(localStorage.getItem('roles') || '[]');
    const formattedRoles = storedRoles
      .map((role: string) => role.replace('ROLE_', ''))
      .filter((role: string) => role !== 'USER');
    setRoles(formattedRoles);
  }, []);

  const policyRulesActionData = useGetPolicyRules(schoolId, roles);

  const [, setResultActions] = useState<string[]>([]);

  useEffect(() => {
    if (policyRulesActionData) {
      const rules = policyRulesActionData.data || [];

      // Filter for result resource
      const resultRules = rules.find((rule: unknown) => rule.resource === 'results');
      if (resultRules) {
        console.log('Matching resource:', resultRules.resource);
        setResultActions(resultRules.actions);
      }
    }
  }, [policyRulesActionData]);
  useEffect(() => {
    if (examTypesData?.data?.length > 0) {
      setExamTypeId(examTypesData.data[0].examTypeId);
    }
  }, [examTypesData]);

  const { data: resultsData } = useGetResults(schoolId, academicYearId, examTypeId, studentId);
  const results = resultsData?.data || [];

  const groupedResults = results.reduce((acc, result) => {
    const examTitle = result.examDto.examTypeDto.examNameTitle;
    if (!acc[examTitle]) {
      acc[examTitle] = [];
    }
    acc[examTitle].push(result);
    return acc;
  }, {});

  const handleNavigation = (resultId) => {
    router.push(`/student/results/result-details?resultId=${resultId}&examTypeId=${examTypeId}`);
  };

  return (
    <div className="p-4">
      <TitleBar title={'Exam Results'} />

      <label htmlFor="examTypeSelect" className="block mb-2 text-sm font-medium">
        Select Exam Type
      </label>

      <Select id="examTypeSelect" onValueChange={setExamTypeId} value={examTypeId}>
        <SelectTrigger className="w-[180px] mb-4">
          <SelectValue placeholder="Select Exam Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {examTypesData?.data.map((examType) => (
              <SelectItem key={examType.examTypeId} value={examType.examTypeId}>
                {examType.examNameTitle}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {Object.keys(groupedResults).length === 0 ? (
        <p>No results available.</p>
      ) : (
        Object.keys(groupedResults).map((examTitle) => (
          <div
            key={examTitle}
            className="block shadow-lg border border-slate-200 p-4 rounded-2xl bg-white mb-5 cursor-pointer dark:bg-slate-900"
            onClick={() => handleNavigation(groupedResults[examTitle][0].resultId)}
          >
            <div className="flex flex-row justify-between items-center border border-slate-200 border-x-0 border-t-0 pb-4 mb-4">
              <div>
                <h2 className="font-semibold text-lg">{examTitle}</h2>
              </div>
              <div>
                <p className="font-semibold text-md">
                  {moment(groupedResults[examTitle][0].resultAnnouncementDate).format(
                    'DD-MMMM-YYYY'
                  )}
                </p>
              </div>
            </div>
            <div>
              {groupedResults[examTitle].map((result) => (
                <div key={result.resultId} className="flex flex-row justify-between mb-2">
                  <div>
                    <p>
                      <span>{result.examDto.standardSubjectDto.subjectDto.subjectName}: </span>
                      <span className="font-semibold">{result.score}</span>
                    </p>
                  </div>
                  <div>
                    <p>
                      <span>Grade: </span>
                      <span className="text-green-700 font-semibold">{result.grade}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
      {/* ) : (
            <div>No permission to view Results</div>
      )}{' '} */}
    </div>
  );
};

export default Results;

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { useGetAnnouncementPagination } from '@/services/queries/admin/announcement';
import moment from 'moment';
import TitleBar from '@/components/header/titleBar';
import { useGetPolicyRules } from '@/services/queries/policyRules/policyRules';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

function StudentAnnouncements() {
  const { schoolId, academicYearId, standardId } = useSchoolContext();
  const router = useRouter();
  const [roles, setRoles] = useState<string[]>([]);
  const [selectedTargetType, setSelectedTargetType] = useState<string>('STUDENT');

  const payload = {
    page: 0,
    size: 10,
    sortCriteria: [],
    filterCriteria: [
      {
        operation: 'equals',
        column: {
          schoolId: String(schoolId)
        }
      },
      {
        operation: 'equals',
        column: {
          targetType: selectedTargetType
        }
      },
      {
        operation: 'equals',
        column: {
          academicYear: {
            academicYearId: academicYearId
          }
        }
      },
      {
        operation: 'equals',
        column: {
          announcementStatus: 'PUBLISHED'
        }
      },
      // Only include this filter if the selected target type is 'STUDENT'
      ...(selectedTargetType === 'STUDENT'
        ? [
            {
              operation: 'equals',
              column: {
                announcementStandards: {
                  standard: {
                    standardId: standardId
                  }
                }
              }
            }
          ]
        : [])
    ]
  };

  const announcementData = useGetAnnouncementPagination(schoolId, payload);
  const announcements = announcementData.data?.data?.content || [];

  useEffect(() => {
    const storedRoles = JSON.parse(localStorage.getItem('roles') || '[]');
    const formattedRoles = storedRoles
      .map((role: string) => role.replace('ROLE_', ''))
      .filter((role: string) => role !== 'USER');
    setRoles(formattedRoles);
  }, []);

  const policyRulesActionData = useGetPolicyRules(schoolId, roles);
  const [, setAnnouncementActions] = useState<string[]>([]);

  useEffect(() => {
    if (policyRulesActionData) {
      const rules = policyRulesActionData.data || [];
      const announcementRules = rules.find((rule: unknown) => rule.resource === 'announcements');
      if (announcementRules) {
        setAnnouncementActions(announcementRules.actions);
      }
    }
  }, [policyRulesActionData]);

  // const handleTargetTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   setSelectedTargetType(event.target.value);
  // };

  if (announcementData.isError) {
    return (
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl text-center shadow-md">
        <p>No Announcements found!!</p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-5">
        <TitleBar title="Student Announcements" search={false} sort={false} />
      </div>

      <div className="grid grid-cols-1 gap-4 p-4 mb-5 border bg-slate-50 dark:bg-slate-900 rounded-2xl md:grid-cols-3">
        <Select onValueChange={setSelectedTargetType} value={selectedTargetType}>
          <SelectTrigger>
            <SelectValue placeholder="Select Target Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="STUDENT">Student</SelectItem>
            <SelectItem value="GENERAL">General</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {announcements.map((announcement) => (
          <div
            key={announcement.announcementId}
            className="border border-slate-100 dark:border-slate-950 bg-white shadow-md p-4 rounded-2xl transition transform hover:scale-105 hover:shadow-xl cursor-pointer dark:bg-slate-900"
            onClick={() =>
              router.push(
                `/student/announcements/announcement-details?announcementId=${announcement.announcementId}`
              )
            }
          >
            {announcement.announcementStatus === 'PUBLISHED' && (
              <div>
                <p className="mb-2 text-lg font-semibold">{announcement.announcementTitle}</p>
                <div className="mb-3 overflow-hidden text-ellipsis whitespace-nowrap">
                  {announcement.description}
                </div>
                <div className="flex items-center gap-x-4 border-t border-slate-100 pt-3">
                  <div
                    className={`px-2 py-1 rounded-2xl ${announcement.targetType === 'STUDENT' ? 'bg-blue-400 text-white' : 'bg-slate-200 text-slate-700'}`}
                  >
                    <p className="text-xs capitalize">{announcement.targetType}</p>
                  </div>
                  <p className="text-xs flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3M3 12h18M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H5a2 2 0 00-2 2v5a2 2 0 002 2z"
                      />
                    </svg>
                    {moment(announcement.createdTime).format('MMMM Do YYYY')}
                  </p>
                  <p className="text-xs flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6 0A9 9 0 113 9a9 9 0 0118 0z"
                      />
                    </svg>
                    {moment(announcement.createdTime).format('h:mm a')}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default StudentAnnouncements;

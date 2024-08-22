'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { DataTable } from '@/components/dataTable/DataTable';
import TitleBar from '@/components/header/titleBar';
import { ColumnDef } from '@tanstack/react-table';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { useGetStaffAllAnnouncement } from '@/services/queries/admin/announcement';
import { Announcement } from '@/types/admin/announcementTypes';
import { useGetPolicyRules } from '@/services/queries/policyRules/policyRules';
import moment from 'moment';
import { ViewImage } from '@/components/viewfiles/viewImage';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Download } from 'lucide-react';
import DownloadAttachment from '@/components/download/downloadAttachment';

function TeacherAnnouncements() {
  const { schoolId, academicYearId, staffId } = useSchoolContext();
  const announcementData = useGetStaffAllAnnouncement(schoolId, academicYearId, staffId);
  const [announcementActions, setAnnouncementActions] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const policyRulesActionData = useGetPolicyRules(schoolId, roles);

  useEffect(() => {
    const storedRoles = JSON.parse(localStorage.getItem('roles') || '[]');
    const formattedRoles = storedRoles
      .map((role: string) => role.replace('ROLE_', ''))
      .filter((role: string) => role !== 'USER');
    setRoles(formattedRoles);
  }, []);

  useEffect(() => {
    if (policyRulesActionData) {
      const rules = policyRulesActionData.data || [];

      // Filter for announcement resource
      const announcementRules = rules.find((rule: unknown) => rule.resource === 'announcements');
      if (announcementRules) {
        console.log('Matching resource:', announcementRules.resource);
        setAnnouncementActions(announcementRules.actions);
      }
    }
  }, [policyRulesActionData]);

  const Columns: ColumnDef<Announcement>[] = [
    {
      accessorKey: 'attachment.attachmentName',
      header: 'Attachment',
      cell: ({ row }) => {
        const attachmentId = row.original.attachment?.attachmentId;
        const attachmentName = row.original.attachment?.attachmentName;
        const attachmentType = row.original.attachment?.contentType;

        return (
          <div className="">
            {attachmentType?.includes('image') ? (
              <div className="relative">
                <ViewImage
                  schoolId={schoolId}
                  width={50}
                  height={50}
                  styles="rounded-lg w-[100px] h-[60px] object-cover"
                  attachmentId={attachmentId}
                  attachmentName={attachmentName}
                />
                <div className="absolute left-[35px] cursor-pointer top-[15px]">
                  <div className="rounded-full  w-[30px] h-[30px] flex justify-center items-center bg-slate-700 hover:bg-slate-950">
                    <Download className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
            ) : (
              <DownloadAttachment
                schoolId={schoolId}
                attachmentId={attachmentId}
                attachmentName={attachmentName}
              />
            )}
          </div>
        );
      }
    },
    {
      accessorKey: 'announcementTitle',
      header: 'Title',
      cell: ({ row }) => <div>{row.getValue('announcementTitle')}</div>,
      enableSorting: true
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => (
        <div>
          <HoverCard>
            <HoverCardTrigger>
              <p className="truncate w-[200px] cursor-pointer">{row.getValue('description')}</p>
            </HoverCardTrigger>
            <HoverCardContent>{row.getValue('description')}</HoverCardContent>
          </HoverCard>
        </div>
      )
    },
    {
      accessorKey: 'targetType',
      header: 'User Type',
      cell: ({ row }) => (
        <div className="w-[100px] flex justify-center items-center rounded-lg px-2 py-1   border text-xs text-green-600 border-green-500 bg-green-100  capitalize">
          {row.getValue('targetType')}
        </div>
      )
    },

    {
      accessorKey: 'Date',
      header: 'Created Time',
      cell: ({ row }) => <div>{moment(row.getValue('createdTime')).format('DD-MMMM-YYYY')}</div>
    }
  ];

  return (
    <>
      <div className="mt-5">
        <TitleBar title="Teacher Announcements" search={false} sort={false} />
      </div>
      {announcementActions.includes('READ') ? (
        <DataTable columns={Columns} data={announcementData?.data?.data || []} />
      ) : (
        <div>No permission to view TeacherAnnouncements</div>
      )}{' '}
    </>
  );
}

export default TeacherAnnouncements;

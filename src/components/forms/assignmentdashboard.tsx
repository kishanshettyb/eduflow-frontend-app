'use client';

import { useState, useEffect } from 'react';
import { DataTable } from '@/components/dataTable/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { useGetAllAssignments } from '@/services/queries/teacher/assignment/assignment';
import { Student } from '@/types/admin/studentTypes';
import { useViewAttachment } from '@/services/queries/attachment/attachment';

import moment from 'moment';
import { useGetPolicyRules } from '@/services/queries/policyRules/policyRules';
function Assignments() {
  const { schoolId, academicYearId } = useSchoolContext();
  const { data } = useGetAllAssignments(schoolId, academicYearId);
  const [assignmentActions, setAssignmentActions] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    const storedRoles = JSON.parse(localStorage.getItem('roles') || '[]');
    const formattedRoles = storedRoles
      .map((role: string) => role.replace('ROLE_', ''))
      .filter((role: string) => role !== 'USER');
    setRoles(formattedRoles);
  }, []);

  const policyRulesActionData = useGetPolicyRules(schoolId, roles);

  useEffect(() => {
    if (policyRulesActionData) {
      const rules = policyRulesActionData.data || [];

      // Filter for announcement resource
      const assignmentRules = rules.find((rule: unknown) => rule.resource === 'assignments');
      if (assignmentRules) {
        console.log('Matching resource:', assignmentRules.resource);
        setAssignmentActions(assignmentRules.actions);
      }
    }
  }, [policyRulesActionData]);

  const ViewAttachmentComponent = ({ schoolId, attachmentId, attachmentName }) => {
    const attachmentData = useViewAttachment(schoolId, attachmentId);

    return attachmentData.isLoading ? (
      <div>Loading...</div>
    ) : attachmentData.isSuccess ? (
      <a
        className="text-blue-500 hover:text-blue-700"
        href={attachmentData.data}
        target="_blank"
        rel="noopener noreferrer"
      >
        {attachmentName}
      </a>
    ) : (
      <div>No File</div>
    );
  };

  const Columns: ColumnDef<Student>[] = [
    {
      accessorKey: 'subjectName',
      header: 'Subject Name',
      cell: ({ row }) => <div>{row.getValue('subjectName')}</div>,
      enableSorting: true
    },
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => <div>{row.getValue('title')}</div>,
      enableSorting: true
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => <div>{row.getValue('description')}</div>
    },
    {
      accessorKey: 'startDate',
      header: 'Start Date',
      cell: ({ row }) => <div>{moment(row.getValue('startDate')).format('DD MMM YYYY')}</div>
    },
    {
      accessorKey: 'lastDate',
      header: 'End Date',
      cell: ({ row }) => <div>{moment(row.getValue('lastDate')).format('DD MMM YYYY')}</div>
    },

    {
      accessorKey: 'attachmentId',
      header: 'Attachment',
      cell: ({ row }) => {
        const attachmentId = row.original.attachmentDto?.attachmentId;
        const attachmentName = row.original.attachmentDto?.attachmentName;

        return (
          <ViewAttachmentComponent
            schoolId={schoolId}
            attachmentId={attachmentId}
            attachmentName={attachmentName}
          />
        );
      }
    },
    {
      accessorKey: 'standardDtoList',
      header: 'Mapped Standards',
      cell: ({ row }) => (
        <div>{row.original.standardDtoList?.map((standard) => standard.title).join(', ')}</div>
      )
    }
  ];

  return (
    <>
      <div className="w-full p-4 border rounded-2xl">
        <h2 className="mb-4 font-semibold text-md text-slate-800">Assignments</h2>
        {assignmentActions.includes('READ') ? (
          <DataTable columns={Columns} data={data?.data || []} />
        ) : (
          <div>No permission to view Assignments</div>
        )}{' '}
      </div>
    </>
  );
}

export default Assignments;

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/dataTable/DataTable';
import TitleBar from '@/components/header/titleBar';
import { Pencil1Icon } from '@radix-ui/react-icons';
import { ColumnDef } from '@tanstack/react-table';
import { useViewAcademicYear } from '@/services/queries/admin/academicYear';
import { CreateAcademicYearForm } from '@/components/forms/createAcademicYearForm';
import { AcademicYear } from '@/types/admin/academicYearTypes';
import { Modal } from '@/components/modals/modal';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import moment from 'moment';
import { useGetPolicyRules } from '@/services/queries/policyRules/policyRules';

function AcademicYears() {
  const { schoolId } = useSchoolContext();
  const academicData = useViewAcademicYear(schoolId);
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState<number | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [academicYearsActions, setAcademicYearsActions] = useState<string[]>([]);
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
      const academicYearsRules = rules.find((rule: unknown) => rule.resource === 'academic-years');
      if (academicYearsRules) {
        console.log('Matching resource:', academicYearsRules.resource);
        setAcademicYearsActions(academicYearsRules.actions);
      }
    }
  }, [policyRulesActionData]);

  const Columns: ColumnDef<AcademicYear>[] = [
    {
      accessorKey: 'startDate',
      header: 'Start Date',
      cell: ({ row }) => <div>{moment(row.getValue('startDate')).format('DD MMMM YYYY')}</div>,
      enableSorting: true
    },
    {
      accessorKey: 'endDate',
      header: 'End Date',
      cell: ({ row }) => <div>{moment(row.getValue('endDate')).format('DD MMMM YYYY')}</div>
    },
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => <div>{row.getValue('title')}</div>
    },
    {
      accessorKey: 'isDefault',
      header: 'Is Default',
      cell: ({ row }) => <div>{row.getValue('isDefault') ? 'True' : 'False'}</div>
    },
    {
      accessorKey: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        const academicYear = row.original;

        return (
          <Button
            variant="outline"
            title="Update"
            size="sm"
            onClick={() => {
              setSelectedAcademicYearId(academicYear.academicYearId);
              setIsUpdateDialogOpen(true);
            }}
          >
            <Pencil1Icon className="h-4 w-4 me-2" />
            Edit
          </Button>
        );
      }
    }
  ];
  const hasWritePermission = academicYearsActions.includes('WRITE');

  return (
    <>
      <div className="mt-5">
        <TitleBar
          title="Academic Years"
          btnName={hasWritePermission ? 'Create Academic Year' : undefined}
          placeholder="Search..."
          modal={true}
          onButtonClick={() => setIsCreateDialogOpen(true)}
        />
      </div>
      <Modal
        title="Create a new Academic Year"
        description="Enter the details for the new academic year below."
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      >
        <CreateAcademicYearForm onClose={() => setIsCreateDialogOpen(false)} />
      </Modal>
      <Modal
        title="Update Academic Year"
        description="Update the details for the academic year below."
        open={isUpdateDialogOpen}
        onOpenChange={(open) => {
          setIsUpdateDialogOpen(open);
          if (!open) setSelectedAcademicYearId(null);
        }}
      >
        <CreateAcademicYearForm
          onClose={() => setIsUpdateDialogOpen(false)}
          academicYearId={selectedAcademicYearId}
        />
      </Modal>
      {academicYearsActions.includes('READ') ? (
        <DataTable columns={Columns} data={academicData?.data?.data || []} />
      ) : (
        <div>No permission to view AcademicYears</div>
      )}{' '}
    </>
  );
}

export default AcademicYears;

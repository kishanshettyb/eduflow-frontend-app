'use client';

import { useState, useEffect } from 'react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/dataTable/DataTable';
import TitleBar from '@/components/header/titleBar';
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';
import { ColumnDef } from '@tanstack/react-table';
import { Modal } from '@/components/modals/modal';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { AlertDialog } from '@/components/alertdialogue/alert';
import { useViewPeriod } from '@/services/queries/admin/period';
import { useDeletePeriod } from '@/services/mutation/admin/period';
import { Period } from '@/types/admin/periodTypes';
import { CreatePeriodForm } from '@/components/forms/createPeriodForm';
import moment from 'moment';
import { useGetPolicyRules } from '@/services/queries/policyRules/policyRules';

function Periods() {
  const { schoolId, academicYearId } = useSchoolContext();
  const periodData = useViewPeriod(schoolId, academicYearId);
  const [selectedPeriodId, setSelectedPeriodId] = useState<number | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [setIsDeleteDialogOpen] = useState(false);
  const [periodActions, setPeriodActions] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    const storedRoles = JSON.parse(localStorage.getItem('roles') || '[]');
    const formattedRoles = storedRoles
      .map((role: string) => role.replace('ROLE_', ''))
      .filter((role: string) => role !== 'USER');
    setRoles(formattedRoles);
  }, []);

  const deletePeriodMutation = useDeletePeriod();

  const policyRulesActionData = useGetPolicyRules(schoolId, roles);
  useEffect(() => {
    if (policyRulesActionData) {
      const rules = policyRulesActionData.data || [];

      // Filter for announcement resource
      const periodRules = rules.find((rule: unknown) => rule.resource === 'periods');
      if (periodRules) {
        console.log('Matching resource:', periodRules.resource);
        setPeriodActions(periodRules.actions);
      }
    }
  }, [policyRulesActionData]);

  const handleDelete = () => {
    if (selectedPeriodId) {
      deletePeriodMutation.mutate({ schoolId, periodId: selectedPeriodId });
      setSelectedPeriodId(null);
    }
  };

  const Columns: ColumnDef<Period>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => <div>{row.getValue('title')}</div>,
      enableSorting: true
    },
    {
      accessorKey: 'startTime',
      header: 'Start Time',
      cell: ({ row }) => (
        <div>{moment(row.getValue('startTime'), 'HH:mm:ss').format('hh:mm:ss A')}</div>
      )
    },
    {
      accessorKey: 'endTime',
      header: 'End Time',
      cell: ({ row }) => (
        <div>{moment(row.getValue('endTime'), 'HH:mm:ss').format('hh:mm:ss A')}</div>
      )
    },
    {
      accessorKey: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        const period = row.original;
        return (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedPeriodId(period.periodId);
                setIsUpdateDialogOpen(true);
              }}
            >
              <Pencil1Icon className="h-4 w-4 me-2" />
              Edit
            </Button>
            {periodActions.includes('DELETE') && (
              <AlertDialog
                title="Confirm Deletion"
                description="Are you sure you want to delete this period? This action cannot be undone."
                triggerButtonText=""
                confirmButtonText="Delete"
                cancelButtonText="Cancel"
                onConfirm={handleDelete}
                onCancel={() => setIsDeleteDialogOpen(false)}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedPeriodId(period.periodId)}
                >
                  <TrashIcon className="h-4 w-4 me-2" />
                  Delete
                </Button>
              </AlertDialog>
            )}
          </div>
        );
      }
    }
  ];
  const hasWritePermission = periodActions.includes('WRITE');

  return (
    <>
      <div className="mt-5">
        <div className="mt-5">
          <TitleBar
            title="Periods"
            btnLink=""
            btnName={hasWritePermission ? 'Create Period' : undefined}
            search={false}
            sort={false}
            placeholder="Search..."
            onSearch={() => {}}
            onSort={() => {}}
            modal={true}
            onButtonClick={() => setIsCreateDialogOpen(true)}
          />
        </div>
      </div>
      <Modal
        title="Create a new Period"
        description="Enter the details for the Period below."
        triggerButtonText="Create Period"
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      >
        <CreatePeriodForm onClose={() => setIsCreateDialogOpen(false)} />
      </Modal>
      <Modal
        title="Update Period"
        description="Update the details for the Period below."
        triggerButtonText=""
        open={isUpdateDialogOpen}
        onOpenChange={(open) => {
          setIsUpdateDialogOpen(open);
          if (!open) setSelectedPeriodId(null);
        }}
      >
        <CreatePeriodForm
          periodId={selectedPeriodId}
          onClose={() => setIsUpdateDialogOpen(false)}
        />
      </Modal>
      {periodActions.includes('READ') ? (
        <DataTable columns={Columns} data={periodData?.data?.data || []} />
      ) : (
        <div>No permission to view Periods</div>
      )}{' '}
    </>
  );
}

export default Periods;

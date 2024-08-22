'use client';

import { useState, useEffect } from 'react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/dataTable/DataTable';
import TitleBar from '@/components/header/titleBar';
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';
import { ColumnDef } from '@tanstack/react-table';
import { Modal } from '@/components/modals/modal';
import { useGetStandardPaginationDetails } from '@/services/queries/admin/standard';
import { CreateStandardForm } from '@/components/forms/createStandardForm';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { useDeleteStandard } from '@/services/mutation/admin/standard';
import { AlertDialog } from '@/components/alertdialogue/alert';
import { useGetPolicyRules } from '@/services/queries/policyRules/policyRules';

function Standards() {
  const { schoolId, academicYearId } = useSchoolContext();
  const [selectedStandardId, setSelectedStandardId] = useState<number | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const deleteStandardMutation = useDeleteStandard();
  const [standardsActions, setStandardsActions] = useState<string[]>([]);
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

      const standardsRules = rules.find((rule) => rule.resource === 'standards');
      if (standardsRules) {
        console.log('Matching resource:', standardsRules.resource);
        setStandardsActions(standardsRules.actions);
      }
    }
  }, [policyRulesActionData]);

  const payload = {
    page: 0,
    size: 10,
    sortCriteria: [],
    filterCriteria: [
      {
        operation: 'equals',
        column: {
          school: {
            schoolId: schoolId?.toString()
          }
        }
      },
      {
        operation: 'equals',
        column: {
          academicYear: {
            academicYearId: academicYearId?.toString()
          }
        }
      }
    ]
  };

  const { data: standardData } = useGetStandardPaginationDetails(schoolId, payload);

  const handleDelete = () => {
    if (selectedStandardId) {
      deleteStandardMutation.mutate({ schoolId, standardId: selectedStandardId });
      setSelectedStandardId(null);
    }
  };

  const Columns: ColumnDef<Standard>[] = [
    {
      accessorKey: 'standard',
      header: 'Standard',
      cell: ({ row }) => <div>{row.getValue('standard')}</div>,
      enableSorting: true
    },
    {
      accessorKey: 'section',
      header: 'Section',
      cell: ({ row }) => <div>{row.getValue('section')}</div>
    },
    {
      accessorKey: 'level',
      header: 'Level',
      cell: ({ row }) => <div>{row.getValue('level')}</div>
    },
    {
      accessorKey: 'maxStrength',
      header: 'Max Strength',
      cell: ({ row }) => <div>{row.getValue('maxStrength')}</div>
    },
    {
      accessorKey: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        const standard = row.original;
        return (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedStandardId(standard.standardId);
                setIsUpdateDialogOpen(true);
              }}
            >
              <Pencil1Icon className="h-4 w-4 me-2" />
              Edit
            </Button>

            <AlertDialog
              title="Confirm Deletion"
              description="Are you sure you want to delete this standard? This action cannot be undone."
              triggerButtonText=""
              confirmButtonText="Delete"
              cancelButtonText="Cancel"
              onConfirm={handleDelete}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedStandardId(standard.standardId)}
              >
                <TrashIcon className="h-4 w-4 me-2" />
                Delete
              </Button>
            </AlertDialog>
          </div>
        );
      }
    }
  ];
  const hasWritePermission = standardsActions.includes('WRITE');

  return (
    <>
      <div className="mt-5">
        <div className="mt-5">
          <TitleBar
            title="Standards"
            btnLink=""
            btnName={hasWritePermission ? 'Create Standard' : undefined}
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
        title="Create a new Standard"
        modalSize="max-w-xl"
        description="Enter the details for the new Standard below."
        triggerButtonText="Create Standard"
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      >
        <CreateStandardForm onClose={() => setIsCreateDialogOpen(false)} />
      </Modal>
      <Modal
        title="Update Standard"
        description="Update the details for the Standard below."
        triggerButtonText=""
        modalSize="max-w-xl"
        open={isUpdateDialogOpen}
        onOpenChange={(open) => {
          setIsUpdateDialogOpen(open);
          if (!open) setSelectedStandardId(null);
        }}
      >
        <CreateStandardForm
          standardId={selectedStandardId}
          onClose={() => setIsUpdateDialogOpen(false)}
        />
      </Modal>
      {standardsActions.includes('READ') ? (
        <DataTable columns={Columns} data={standardData?.data.content || []} />
      ) : (
        <div>No permission to view Standards</div>
      )}
    </>
  );
}

export default Standards;

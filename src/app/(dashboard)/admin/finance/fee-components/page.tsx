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
import { Tooltip, TooltipTrigger } from '@radix-ui/react-tooltip';
import { TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { AlertDialog } from '@/components/alertdialogue/alert';
import { FeeComponent } from '@/types/admin/feecomponentTypes';
import { useDeleteFeeComponent } from '@/services/mutation/admin/feecomponent';
import { useViewFeeComponent } from '@/services/queries/admin/feecomponent';
import { CreateFeeComponentForm } from '@/components/forms/createFeeComponentForm';
import { useGetPolicyRules } from '@/services/queries/policyRules/policyRules';

function FeeComponents() {
  const { schoolId, academicYearId } = useSchoolContext();
  const feecomponentData = useViewFeeComponent(schoolId, academicYearId);
  const [selectedFeeComponentId, setSelectedFeeComponentId] = useState<number | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const deleteFeeComponentMutation = useDeleteFeeComponent();

  const [feeComponentActions, setFeeCompoentActions] = useState<string[]>([]);
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
      const feeComponentRules = rules.find((rule: unknown) => rule.resource === 'fee-components');
      if (feeComponentRules) {
        console.log('Matching resource:', feeComponentRules.resource);
        setFeeCompoentActions(feeComponentRules.actions);
      }
    }
  }, [policyRulesActionData]);

  const handleDelete = () => {
    if (selectedFeeComponentId) {
      deleteFeeComponentMutation.mutate({ schoolId, feeComponentId: selectedFeeComponentId });
      // setIsDeleteDialogOpen(false);
      setSelectedFeeComponentId(null);
    }
  };

  const Columns: ColumnDef<FeeComponent>[] = [
    {
      accessorKey: 'feeComponentName',
      header: 'Fee Component Name',
      cell: ({ row }) => <div>{row.getValue('feeComponentName')}</div>,
      enableSorting: true
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => <div>{row.getValue('description')}</div>
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => <div>{row.getValue('amount')}</div>
    },
    {
      accessorKey: 'dueDate',
      header: 'Due date',
      cell: ({ row }) => {
        const date = new Date(row.getValue('dueDate'));
        const formattedDate = date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        });
        return <div>{formattedDate}</div>;
      }
    },
    {
      accessorKey: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        const feecomponent = row.original;
        return (
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedFeeComponentId(feecomponent.feeComponentId);

                      setIsUpdateDialogOpen(true);
                    }}
                  >
                    <Pencil1Icon className="h-4 w-4 me-2" /> Edit
                  </Button>
                </TooltipTrigger>

                <TooltipContent>
                  <p>Update</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {feeComponentActions.includes('DELETE') && (
              <AlertDialog
                title="Confirm Deletion"
                description="Are you sure you want to delete this FeeComponent? This action cannot be undone."
                triggerButtonText=""
                confirmButtonText="Delete"
                cancelButtonText="Cancel"
                onConfirm={handleDelete}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedFeeComponentId(feecomponent.feeComponentId)}
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

  const hasWritePermission = feeComponentActions.includes('WRITE');

  return (
    <>
      <div className="mt-5">
        <div className="mt-5">
          <TitleBar
            title="Fee Component"
            btnLink=""
            btnName={hasWritePermission ? 'Create Fee Component' : undefined}
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
        title="Create a new Fee Component"
        modalSize="max-w-2xl"
        description="Enter the details for the new FeeComponent below."
        triggerButtonText="Create FeeComponent"
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      >
        <CreateFeeComponentForm onClose={() => setIsCreateDialogOpen(false)} />
      </Modal>
      <Modal
        title="Update Fee Component"
        modalSize="max-w-2xl"
        description="Update the details for the FeeComponent below."
        triggerButtonText=""
        open={isUpdateDialogOpen}
        onOpenChange={(open) => {
          setIsUpdateDialogOpen(open);

          if (!open) setSelectedFeeComponentId(null);
        }}
      >
        <CreateFeeComponentForm
          feeComponentId={selectedFeeComponentId}
          onClose={() => setIsUpdateDialogOpen(false)}
        />
      </Modal>
      {feeComponentActions.includes('READ') ? (
        <DataTable columns={Columns} data={feecomponentData?.data?.data || []} />
      ) : (
        <div>No permission to viewFee Compoent</div>
      )}{' '}
    </>
  );
}

export default FeeComponents;

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
import { useViewFeeStructure } from '@/services/queries/admin/feestructure';
import { useDeleteFeeStructure } from '@/services/mutation/admin/feestructure';
import { FeeStructure } from '@/types/admin/feestuctureTypes';
import { CreateFeeStructureForm } from '@/components/forms/createFeeStructureForm';
import { useRouter } from 'next/navigation';
import { Route } from 'lucide-react';
import { useGetPolicyRules } from '@/services/queries/policyRules/policyRules';

function FeeStructures() {
  const { schoolId, academicYearId } = useSchoolContext();
  const feestructureData = useViewFeeStructure(schoolId, academicYearId);
  const [selectedFeeStructureId, setSelectedFeeStructureId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [, setIsDeleteDialogOpen] = useState(false);
  const router = useRouter();
  const [feeStructureActions, setFeeStructureActions] = useState<string[]>([]);
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
      const feeStructureRules = rules.find((rule: unknown) => rule.resource === 'fee-structures');
      if (feeStructureRules) {
        console.log('Matching resource:', feeStructureRules.resource);
        setFeeStructureActions(feeStructureRules.actions);
      }
    }
  }, [policyRulesActionData]);
  const deleteFeeStructureMutation = useDeleteFeeStructure();

  const handleDelete = () => {
    if (selectedFeeStructureId) {
      deleteFeeStructureMutation.mutate({ schoolId, feeStructureId: selectedFeeStructureId });

      setSelectedFeeStructureId(null);
    }
  };

  const handleMapRedirect = (feeStructureId: number) => {
    router.push(`/admin/finance/fees-structure-mapping?feeStructureId=${feeStructureId}`);
  };

  const Columns: ColumnDef<FeeStructure>[] = [
    {
      accessorKey: 'feeStructureName',
      header: 'Fee Structure name',
      cell: ({ row }) => <div>{row.getValue('feeStructureName')}</div>,
      enableSorting: true
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
      accessorKey: 'feeComponents',
      header: 'Fee Component',
      cell: ({ row }) => {
        const feeComponents = row.getValue('feeComponents') as FeeComponent[]; // Assuming FeeComponent is the type of the feeComponents array
        return (
          <div className="bg-slate-100 rounded-lg p-1">
            {feeComponents.map((feeComponent, index) => (
              <div className="border  border-blue-200 rounded m-1 p-1" key={index}>
                <p className="text-[12px] text-blue-400">
                  {index + 1}. {feeComponent.feeComponentName}
                </p>
              </div>
            ))}
          </div>
        );
      }
    },
    {
      accessorKey: 'totalAmount',
      header: 'Amount',
      cell: ({ row }) => <div>{row.getValue('totalAmount')}</div>
    },
    {
      accessorKey: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        const feestructure = row.original;
        return (
          <div className="flex items-center space-x-2">
            <Button size="sm" onClick={() => handleMapRedirect(feestructure.feeStructureId)}>
              <Route className="w-4 h-4 me-2" />
              Fee Structure Mapping
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedFeeStructureId(feestructure.feeStructureId);
                setIsDialogOpen(true);
              }}
            >
              <Pencil1Icon className="h-4 w-4 me-2" /> Edit
            </Button>
            {feeStructureActions.includes('DELETE') && (
              <AlertDialog
                title="Confirm Deletion"
                description="Are you sure you want to delete this feestructure? This action cannot be undone."
                triggerButtonText=""
                confirmButtonText="Delete"
                cancelButtonText="Cancel"
                onConfirm={handleDelete}
                onCancel={() => setIsDeleteDialogOpen(false)}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedFeeStructureId(feestructure.feeStructureId)}
                >
                  <TrashIcon className="h-4 w-4 me-2" /> Delete
                </Button>
              </AlertDialog>
            )}
          </div>
        );
      }
    }
  ];
  const hasWritePermission = feeStructureActions.includes('WRITE');

  return (
    <>
      <div className="mt-5">
        <div className="mt-5">
          <TitleBar
            title="Fee Structure"
            btnLink=""
            btnName={hasWritePermission ? 'Create Fee Structure' : undefined}
            search={false}
            sort={false}
            placeholder="Search..."
            onSearch={() => {}}
            onSort={() => {}}
            modal={true}
            onButtonClick={() => setIsDialogOpen(true)}
          />
        </div>
      </div>
      <Modal
        title={selectedFeeStructureId ? 'Update FeeStructure' : 'Create a new FeeStructure'}
        description={
          selectedFeeStructureId
            ? 'Update the details for the FeeStructure below.'
            : 'Enter the details for the new FeeStructure below.'
        }
        triggerButtonText={selectedFeeStructureId ? 'Update FeeStructure' : 'Create FeeStructure'}
        open={isDialogOpen}
        modalSize="max-w-4xl"
        onOpenChange={setIsDialogOpen}
      >
        <CreateFeeStructureForm
          feeStructureId={selectedFeeStructureId}
          onClose={() => setIsDialogOpen(false)}
        />
      </Modal>
      {feeStructureActions.includes('READ') ? (
        <DataTable columns={Columns} data={feestructureData?.data?.data || []} />
      ) : (
        <div>No permission to view Exam Types</div>
      )}{' '}
    </>
  );
}

export default FeeStructures;

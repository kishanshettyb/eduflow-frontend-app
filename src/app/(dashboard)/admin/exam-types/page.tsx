'use client';

import { useState, useEffect } from 'react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/dataTable/DataTable';
import TitleBar from '@/components/header/titleBar';
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';
import { ColumnDef } from '@tanstack/react-table';
import { ExamType } from '@/types/admin/examtypeTypes';
import { Modal } from '@/components/modals/modal';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { AlertDialog } from '@/components/alertdialogue/alert';
import { useViewExamType } from '@/services/queries/admin/examType';
import { useDeleteExamType } from '@/services/mutation/admin/examType';
import { CreateExamTypeForm } from '@/components/forms/createExamTypeForm';
import { useGetPolicyRules } from '@/services/queries/policyRules/policyRules';

function ExamTypes() {
  const { schoolId, academicYearId } = useSchoolContext();
  const examtypeData = useViewExamType(schoolId, academicYearId);
  const [selectedExamTypeId, setSelectedExamTypeId] = useState<number | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [examTypeActions, setExamTypeActions] = useState<string[]>([]);
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
      const examTypeRules = rules.find((rule: unknown) => rule.resource === 'exam-types');
      if (examTypeRules) {
        console.log('Matching resource:', examTypeRules.resource);
        setExamTypeActions(examTypeRules.actions);
      }
    }
  }, [policyRulesActionData]);

  const deleteExamTypeMutation = useDeleteExamType();

  const handleDelete = () => {
    if (selectedExamTypeId) {
      deleteExamTypeMutation.mutate({ schoolId, examTypeId: selectedExamTypeId });
      setSelectedExamTypeId(null);
    }
  };

  const Columns: ColumnDef<ExamType>[] = [
    {
      accessorKey: 'examNameTitle',
      header: 'Exam Type Name',
      cell: ({ row }) => <div>{row.getValue('examNameTitle')}</div>,
      enableSorting: true
    },
    {
      accessorKey: 'description',
      header: 'Description',

      cell: ({ row }) => (
        <div className="whitespace-normal break-words max-w-xs">{row.getValue('description')}</div>
      )
    },
    {
      accessorKey: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        const examtype = row.original;
        return (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedExamTypeId(examtype.examTypeId);
                setIsUpdateDialogOpen(true);
              }}
            >
              <Pencil1Icon className="h-4 w-4 me-2" />
              Edit
            </Button>
            {examTypeActions.includes('DELETE') && (
              <AlertDialog
                title="Confirm Deletion"
                description="Are you sure you want to delete this examtype? This action cannot be undone."
                triggerButtonText=""
                confirmButtonText="Delete"
                cancelButtonText="Cancel"
                onConfirm={handleDelete}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedExamTypeId(examtype.examTypeId)}
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

  const hasWritePermission = examTypeActions.includes('WRITE');

  return (
    <>
      <div className="mt-5">
        <div className="mt-5">
          <TitleBar
            title="Exam Types"
            btnLink=""
            btnName={hasWritePermission ? 'Create Exam Type' : undefined}
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
        title="Create a new Exam Type"
        description="Enter the details for the new Exam Type below."
        triggerButtonText="Create ExamType"
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      >
        <CreateExamTypeForm onClose={() => setIsCreateDialogOpen(false)} />
      </Modal>
      <Modal
        title="Update Exam Type"
        description="Update the details for the Exam Type below."
        triggerButtonText=""
        open={isUpdateDialogOpen}
        onOpenChange={(open) => {
          setIsUpdateDialogOpen(open);
          if (!open) setSelectedExamTypeId(null);
        }}
      >
        <CreateExamTypeForm
          examTypeId={selectedExamTypeId}
          onClose={() => setIsUpdateDialogOpen(false)}
        />
      </Modal>
      {examTypeActions.includes('READ') ? (
        <DataTable columns={Columns} data={examtypeData?.data?.data || []} />
      ) : (
        <div>No permission to view Exam Types</div>
      )}{' '}
    </>
  );
}

export default ExamTypes;

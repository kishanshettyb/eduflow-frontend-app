'use client';

import { useState, useEffect } from 'react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/dataTable/DataTable';
import TitleBar from '@/components/header/titleBar';
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';
import { ColumnDef } from '@tanstack/react-table';
import { CreateSubjectForm } from '@/components/forms/createSubjectForm';
import { Subject } from '@/types/admin/subjectTypes';
import { Modal } from '@/components/modals/modal';
import { useViewSubject } from '@/services/queries/admin/subject';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { useDeleteSubject } from '@/services/mutation/admin/subject';
import { AlertDialog } from '@/components/alertdialogue/alert';
import { useGetPolicyRules } from '@/services/queries/policyRules/policyRules';

function Subjects() {
  const { schoolId, academicYearId, roles } = useSchoolContext();
  const subjectData = useViewSubject(schoolId, academicYearId);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const deleteSubjectMutation = useDeleteSubject();
  const [subjectActions, setSubjectActions] = useState<string[]>([]);

  const policyRulesActionData = useGetPolicyRules(schoolId, roles);

  useEffect(() => {
    if (policyRulesActionData) {
      const rules = policyRulesActionData.data || [];

      // Filter for announcement resource
      const subjectRules = rules.find((rule: unknown) => rule.resource === 'subjects');
      if (subjectRules) {
        console.log('Matching resource:', subjectRules.resource);
        setSubjectActions(subjectRules.actions);
      }
    }
  }, [policyRulesActionData]);

  const handleDelete = () => {
    if (selectedSubjectId) {
      deleteSubjectMutation.mutate({ schoolId, subjectId: selectedSubjectId });
      setSelectedSubjectId(null);
    }
  };

  const Columns: ColumnDef<Subject>[] = [
    {
      accessorKey: 'subjectName',
      header: 'Subject Name',
      cell: ({ row }) => <div>{row.getValue('subjectName')}</div>,
      enableSorting: true
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => <div>{row.getValue('description')}</div>
    },
    {
      accessorKey: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        const subject = row.original;
        return (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedSubjectId(subject.subjectId);
                setIsUpdateDialogOpen(true);
              }}
            >
              <Pencil1Icon className="h-4 w-4 me-2" />
              Edit
            </Button>

            <AlertDialog
              title="Confirm Deletion"
              description="Are you sure you want to delete this subject? This action cannot be undone."
              triggerButtonText=""
              confirmButtonText="Delete"
              cancelButtonText="Cancel"
              onConfirm={handleDelete}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedSubjectId(subject.subjectId)}
              >
                <span className="sr-only">Delete</span>
                <TrashIcon className="h-4 w-4 me-2" />
                Delete
              </Button>
            </AlertDialog>
          </div>
        );
      }
    }
  ];
  const hasWritePermission = subjectActions.includes('WRITE');

  return (
    <>
      <div className="mt-5">
        <div className="mt-5">
          <TitleBar
            title="Subjects"
            btnLink=""
            btnName={hasWritePermission ? 'Create Subject' : undefined}
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
        title="Create a new Subject"
        description="Enter the details for the new Subject below."
        triggerButtonText="Create Subject"
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      >
        <CreateSubjectForm onClose={() => setIsCreateDialogOpen(false)} />
      </Modal>
      <Modal
        title="Update Subject"
        description="Update the details for the Subject below."
        triggerButtonText=""
        open={isUpdateDialogOpen}
        onOpenChange={(open) => {
          setIsUpdateDialogOpen(open);
          if (!open) setSelectedSubjectId(null);
        }}
      >
        <CreateSubjectForm
          subjectId={selectedSubjectId}
          onClose={() => setIsUpdateDialogOpen(false)}
        />
      </Modal>
      <div className="mb-20">
        {/* <DataTable columns={Columns} data={subjectData?.data?.data || []} /> */}
      </div>
      {subjectActions.includes('READ') ? (
        <DataTable columns={Columns} data={subjectData?.data?.data || []} />
      ) : (
        <div>No permission to view Subjects</div>
      )}{' '}
    </>
  );
}

export default Subjects;

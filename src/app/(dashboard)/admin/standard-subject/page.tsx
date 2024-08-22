'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/dataTable/DataTable';
import TitleBar from '@/components/header/titleBar';
import { TrashIcon } from '@radix-ui/react-icons';
import { ColumnDef } from '@tanstack/react-table';
import { Modal } from '@/components/modals/modal';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { AlertDialog } from '@/components/alertdialogue/alert';
import { useViewStandardSubject } from '@/services/queries/admin/standarSubject';
import { StandardSubject } from '@/types/admin/standardSubjectType';
import { useDeleteStandardSubject } from '@/services/mutation/admin/standardSubject';
import { CreateStandardSubjectForm } from '@/components/forms/createStandardSubjectForm';

function StandardSubjects() {
  const { schoolId, academicYearId } = useSchoolContext();
  const { data: standardSubjectData } = useViewStandardSubject(schoolId, academicYearId);
  const [selectedStandardSubjectId, setSelectedStandardSubjectId] = useState<number | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const [setIsDeleteDialogOpen] = useState(false);
  const deleteStandardSubjectMutation = useDeleteStandardSubject();

  const handleDelete = () => {
    if (selectedStandardSubjectId) {
      deleteStandardSubjectMutation.mutate({
        schoolId,
        standardSubjectId: selectedStandardSubjectId
      });

      setSelectedStandardSubjectId(null);
    }
  };

  const columns: ColumnDef<StandardSubject>[] = [
    {
      accessorKey: 'standardDto.title',
      header: 'Standard',
      cell: ({ row }) => <div>{row.original.standardDto.title}</div>,
      enableSorting: true
    },

    {
      accessorKey: 'subjectTypeDto.subjectTypeTitle',
      header: 'Subject Type',
      cell: ({ row }) => <div>{row.original.subjectTypeDto.subjectTypeTitle}</div>,
      enableSorting: true
    },

    {
      accessorKey: 'subjectDto.subjectName',
      header: 'Subject',
      cell: ({ row }) => <div>{row.original.subjectDto.subjectName}</div>
    },
    {
      accessorKey: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        const standardSubject = row.original;
        return (
          <div className="flex items-center space-x-2">
            <AlertDialog
              title="Confirm Deletion"
              description="Are you sure you want to delete this standard-subject? This action cannot be undone."
              triggerButtonText=""
              confirmButtonText="Delete"
              cancelButtonText="Cancel"
              onConfirm={handleDelete}
              onCancel={() => setIsDeleteDialogOpen(false)}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedStandardSubjectId(standardSubject.standardSubjectId)}
              >
                <span className="sr-only">Delete</span>
                <TrashIcon className="h-4 w-4 me-2" /> Delete
              </Button>
            </AlertDialog>
          </div>
        );
      }
    }
  ];

  return (
    <>
      <div className="mt-5">
        <div className="mt-5">
          <TitleBar
            title="Standard Subjects"
            btnLink=""
            btnName="Create Standard Subject Mapping"
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
        title="Map a Standard Subject"
        description="Enter the details for the new Standard-subject below."
        triggerButtonText="Create Standard-Subject"
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      >
        <CreateStandardSubjectForm onClose={() => setIsCreateDialogOpen(false)} />
      </Modal>

      <DataTable columns={columns} data={standardSubjectData?.data || []} />
    </>
  );
}

export default StandardSubjects;

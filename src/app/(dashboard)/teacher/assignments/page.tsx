'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/dataTable/DataTable';
import TitleBar from '@/components/header/titleBar';
import { ColumnDef } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { useGetAllAssignments } from '@/services/queries/teacher/assignment/assignment';
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { AlertDialog } from '@/components/alertdialogue/alert';
import { Student } from '@/types/admin/studentTypes';
import { useDeleteAssignment } from '@/services/mutation/teacher/assignment/assignment';
import moment from 'moment';
import { useGetPolicyRules } from '@/services/queries/policyRules/policyRules';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { ViewImage } from '@/components/viewfiles/viewImage';
import Image from 'next/image';
import CreateAssignmentForm from '@/components/forms/createAssignmentForm';
import { Modal } from '@/components/modals/modal';
import { MapPin, EllipsisVertical, CircleEllipsis } from 'lucide-react';

function Assignments() {
  const { schoolId, academicYearId } = useSchoolContext();
  const { data } = useGetAllAssignments(schoolId, academicYearId);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | null>(null);
  const [forceDelete, setForceDelete] = useState<boolean>(false);
  const [assignmentActions, setAssignmentActions] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const router = useRouter();
  const deleteAssignmentMutation = useDeleteAssignment();
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

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

  const handleMapRedirect = (assignmentId: number) => {
    router.push(`/teacher/assignments/assignment-map?assignmentId=${assignmentId}`);
  };

  // this is required code for the download assignment attachment

  // const ViewAttachmentComponent = ({ schoolId, attachmentId, attachmentName }) => {
  //   const attachmentData = useViewAttachment(schoolId, attachmentId);

  //   return attachmentData.isLoading ? (
  //     <div>Loading...</div>
  //   ) : attachmentData.isSuccess ? (
  //     <a
  //       className="text-blue-500 hover:text-blue-700"
  //       href={attachmentData.data}
  //       target="_blank"
  //       rel="noopener noreferrer">
  //       {attachmentName}
  //     </a>
  //   ) : (
  //     <div>No File</div>
  //   );
  // };

  const handleDeleteAssignment = (assignmentId, forceDelete) => {
    deleteAssignmentMutation.mutate(
      { schoolId, assignmentId, forceDelete },
      {
        onSuccess: () => {
          setForceDelete(false);
        }
      }
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
      cell: ({ row }) => (
        <HoverCard>
          <HoverCardTrigger>
            <div className="p-1 cursor-pointer border rounded-sm truncate w-[150px]">
              {row.getValue('description')}
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="max-w-xs p-2 overflow-hidden text-ellipsis">
            <div className="whitespace-normal break-words">{row.getValue('description')}</div>
          </HoverCardContent>
        </HoverCard>
      ),
      enableSorting: false
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
      accessorKey: 'attachmentDto',
      header: 'Attachment',
      cell: function CellComponent({ row }) {
        const attachment = row.getValue('attachmentDto');
        const attachmentId = attachment?.attachmentId;
        const contentType = attachment?.contentType;
        const attachmentName = attachment?.attachmentName || 'Download';

        // Construct the download link using the attachmentId
        const downloadLink = attachmentId ? `/api/download/${attachmentId}` : null;

        if (!attachmentId) {
          return (
            <Image alt="default" width={50} height={50} className="rounded-full" src="/man.png" />
          );
        }

        return (
          <a
            href={downloadLink || '#'}
            download={attachmentName}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              if (!downloadLink) {
                e.preventDefault();
                alert('File not available for download.');
              }
            }}
          >
            {contentType?.startsWith('image/') ? (
              <ViewImage
                schoolId={schoolId}
                attachmentId={attachmentId}
                width={50}
                height={50}
                styles="rounded-full w-[50px] h-[50px] object-cover"
                alt={attachmentName}
              />
            ) : (
              <p className="text-blue-500 underline">{attachmentName}</p>
            )}
          </a>
        );
      }
    },
    {
      accessorKey: 'standardDtoList',
      header: 'Mapped Standards',
      cell: ({ row }) => (
        <div>{row.original.standardDtoList?.map((standard) => standard.title).join(', ')}</div>
      )
    },
    {
      accessorKey: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        const assignment = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline">
                <EllipsisVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedAssignmentId(assignment.assignmentId);
                  setIsUpdateDialogOpen(true);
                }}
              >
                <Pencil1Icon className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>

              {assignmentActions.includes('DELETE') && (
                <AlertDialog
                  title="Confirm Deletion"
                  description="Are you sure you want to delete this Assignment? This action cannot be undone."
                  triggerButtonText=""
                  confirmButtonText="Delete"
                  cancelButtonText="Cancel"
                  onConfirm={() => handleDeleteAssignment(assignment.assignmentId, forceDelete)}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedAssignmentId(assignment.assignmentId)}
                  >
                    <TrashIcon className="h-4 w-4 me-2" />
                    Delete
                  </Button>
                </AlertDialog>
              )}
              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => handleMapRedirect(assignment.assignmentId)}>
                <MapPin className="h-4 w-4 mr-2" />
                Map
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() =>
                  router.push(`/teacher/assignments/review?assignmentId=${assignment.assignmentId}`)
                }
              >
                <CircleEllipsis className="h-4 w-4 mr-2" />
                Review
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    }
  ];
  const hasWritePermission = assignmentActions.includes('WRITE');

  return (
    <>
      <div className="mt-5">
        <TitleBar
          title="Assignments"
          btnName={hasWritePermission ? 'Create Assignment' : undefined}
          modal={true}
          onButtonClick={() => setIsCreateDialogOpen(true)}
        />
      </div>
      <Modal
        title="Create a new Assignment"
        description="Enter the details for the new Assignement Type below."
        modalSize="max-w-2xl xl:max-w-[1200px]"
        triggerButtonText="Create Assignement"
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      >
        <CreateAssignmentForm onClose={() => setIsCreateDialogOpen(false)} />
      </Modal>
      <Modal
        title="Update Assignement"
        description="Update the details for the Assignement below."
        triggerButtonText=""
        modalSize="max-w-2xl xl:max-w-[1200px]"
        open={isUpdateDialogOpen}
        onOpenChange={(open) => {
          setIsUpdateDialogOpen(open);
          if (!open) setSelectedAssignmentId(null);
        }}
      >
        <CreateAssignmentForm
          assignmentId={selectedAssignmentId}
          onClose={() => setIsUpdateDialogOpen(false)}
        />
      </Modal>
      {assignmentActions.includes('READ') ? (
        <DataTable columns={Columns} data={data?.data || []} />
      ) : (
        <div>No permission to view Assignments</div>
      )}{' '}
    </>
  );
}

export default Assignments;

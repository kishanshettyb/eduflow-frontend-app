'use client';

import { useState, useEffect } from 'react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/dataTable/DataTable';
import TitleBar from '@/components/header/titleBar';
import { Pencil1Icon, TrashIcon, RocketIcon } from '@radix-ui/react-icons';
import { ColumnDef } from '@tanstack/react-table';
import { Modal } from '@/components/modals/modal';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { AlertDialog } from '@/components/alertdialogue/alert';
import { Announcement } from '@/types/admin/announcementTypes';
import { useViewAnnouncement } from '@/services/queries/admin/announcement';
import Image from 'next/image';
import {
  useDeleteAnnouncement,
  usePublishAnnouncement
} from '@/services/mutation/admin/announcement';
import { CreateAnnouncementForm } from '@/components/forms/createAnnouncementForm';
import { useViewAttachment } from '@/services/queries/attachment/attachment';
import { CarTaxiFrontIcon, Ellipsis, User, UserCog } from 'lucide-react';
import { useGetPolicyRules } from '@/services/queries/policyRules/policyRules';
import moment from 'moment';

function Announcements() {
  const { schoolId, academicYearId } = useSchoolContext();
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState<number | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [announcementActions, setAnnouncementActions] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    const storedRoles = JSON.parse(localStorage.getItem('roles') || '[]');
    const formattedRoles = storedRoles
      .map((role: string) => role.replace('ROLE_', ''))
      .filter((role: string) => role !== 'USER');
    setRoles(formattedRoles);
  }, []);

  const announcementData = useViewAnnouncement(schoolId, academicYearId);
  const policyRulesActionData = useGetPolicyRules(schoolId, roles);
  const deleteAnnouncementMutation = useDeleteAnnouncement();
  const publishAnnouncementMutation = usePublishAnnouncement();

  useEffect(() => {
    if (policyRulesActionData) {
      const rules = policyRulesActionData.data || [];

      // Filter for announcement resource
      const announcementRules = rules.find((rule: unknown) => rule.resource === 'announcements');
      if (announcementRules) {
        console.log('Matching resource:', announcementRules.resource);
        setAnnouncementActions(announcementRules.actions);
      }
    }
  }, [policyRulesActionData]);

  const handleDelete = () => {
    if (selectedAnnouncementId) {
      deleteAnnouncementMutation.mutate({ schoolId, announcementId: selectedAnnouncementId });
      setSelectedAnnouncementId(null);
    }
  };

  const handlePublish = () => {
    if (selectedAnnouncementId) {
      publishAnnouncementMutation.mutate({ schoolId, announcementId: selectedAnnouncementId });
      setSelectedAnnouncementId(null);
    }
  };
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

  const sortedAnnouncementData = announcementData?.data?.data
    ?.slice()
    .sort((a, b) => new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime());

  const Columns: ColumnDef<Announcement>[] = [
    {
      accessorKey: 'announcementTitle',
      header: 'Title',
      cell: ({ row }) => <div>{row.getValue('announcementTitle')}</div>,
      enableSorting: true
    },
    {
      accessorKey: 'createdTime',
      header: 'Announcement Date',
      cell: ({ row }) => <div>{moment(row.getValue('createdTime')).format('DD MMM YYYY')}</div>,
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
      accessorKey: 'targetType',
      header: 'User Type',
      cell: ({ row }) => (
        <div>
          {row.getValue('targetType').includes('User') ? (
            <div className="flex items-center">
              <User className="w-4 h-4 me-2" /> <p>{row.getValue('targetType')}</p>
            </div>
          ) : row.getValue('targetType').includes('GENERAL') ? (
            <div className="flex items-center">
              <Image
                alt={row.getValue('targetType')}
                src="/icons/security.png"
                width="150"
                height="150"
                className="w-4 h-4 me-2"
              />
              <p>{row.getValue('targetType')}</p>
            </div>
          ) : row.getValue('targetType').includes('TEACHER') ? (
            <div className="flex items-center">
              <Image
                alt={row.getValue('targetType')}
                src="/icons/teacher.png"
                width="150"
                height="150"
                className="w-4 h-4 me-2"
              />
              <p>{row.getValue('targetType')}</p>
            </div>
          ) : row.getValue('targetType').includes('STUDENT') ? (
            <div className="flex items-center ">
              <Image
                alt={row.getValue('targetType')}
                src="/icons/student.png"
                width="150"
                height="150"
                className="w-4 h-4 me-2"
              />
              <p>{row.getValue('targetType')}</p>
            </div>
          ) : row.getValue('targetType').includes('House') ? (
            <div className="flex items-center">
              <Image
                alt={row.getValue('targetType')}
                src="/icons/mop.svg"
                width="150"
                height="150"
                className="w-4 h-4 me-2"
              />
              <p>{row.getValue('targetType')}</p>
            </div>
          ) : row.getValue('targetType').includes('Driver') ? (
            <div className="flex items-center">
              <CarTaxiFrontIcon className="w-4 h-4 me-2" /> <p>{row.getValue('targetType')}</p>
            </div>
          ) : row.getValue('targetType').includes('Admin') ? (
            <div className="flex items-center">
              <UserCog className="w-4 h-4 me-2" /> <p>{row.getValue('targetType')}</p>
            </div>
          ) : (
            <div className="flex items-center">
              <Ellipsis className="w-4 h-4 me-2" />
              <p>{row.getValue('targetType')}</p>
            </div>
          )}
        </div>
      )
    },

    {
      accessorKey: 'standardTitleList',
      header: 'Standard',
      cell: ({ row }) => {
        const standardTitles = row.original?.standardTitleList;
        return <div>{standardTitles !== null ? standardTitles?.join(', ') : '-'}</div>;
      }
    },

    {
      accessorKey: 'announcementStatus',
      header: 'Status',
      cell: ({ row }) => (
        <div
          className={`w-[100px] flex justify-center items-center rounded-lg px-2 py-1   border text-xs ${row.original.status === 'ADDED' ? 'text-red-600 border-red-500 bg-red-100' : 'text-green-600 border-green-500 bg-green-100'} capitalize`}
        >
          {row.getValue('announcementStatus')}
        </div>
      )
    },

    {
      accessorKey: 'attachment.attachmentName',
      header: 'Attachment',
      cell: ({ row }) => {
        const attachmentId = row.original.attachment?.attachmentId;
        const attachmentName = row.original.attachment?.attachmentName;

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
      accessorKey: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        const announcement = row.original;
        const isPublished = announcement.announcementStatus === 'PUBLISHED';

        return (
          <div className="flex items-center space-x-2">
            {!isPublished ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedAnnouncementId(announcement.announcementId);
                    setIsUpdateDialogOpen(true);
                  }}
                >
                  <Pencil1Icon className="h-4 w-4 me-2" /> Edit
                </Button>
                {announcementActions.includes('DELETE') && (
                  <AlertDialog
                    title="Confirm Deletion"
                    description="Are you sure you want to delete this announcement? This action cannot be undone."
                    triggerButtonText=""
                    confirmButtonText="Delete"
                    cancelButtonText="Cancel"
                    onConfirm={handleDelete}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedAnnouncementId(announcement.announcementId)}
                    >
                      <TrashIcon className="h-4 w-4 me-2" />
                      Delete
                    </Button>
                  </AlertDialog>
                )}
                {announcementActions.includes('PUBLISH') && (
                  <AlertDialog
                    title="Confirm Publish"
                    description="Are you sure you want to publish this announcement? This action cannot be undone."
                    triggerButtonText=""
                    confirmButtonText="Publish"
                    cancelButtonText="Cancel"
                    onConfirm={handlePublish}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedAnnouncementId(announcement.announcementId)}
                    >
                      <RocketIcon className="h-4 w-4 me-2" />
                      Publish
                    </Button>
                  </AlertDialog>
                )}
              </>
            ) : (
              '-'
            )}
          </div>
        );
      }
    }
  ];
  const hasWritePermission = announcementActions.includes('WRITE');

  return (
    <>
      <div className="mt-5">
        <div className="mt-5">
          <TitleBar
            title="Announcement"
            btnLink=""
            btnName={hasWritePermission ? 'Create Announcement' : undefined}
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
        title="Create a new Announcement"
        description="Enter the details for the new Announcement below."
        triggerButtonText="Create Announcement"
        modalSize="max-w-2xl"
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      >
        <CreateAnnouncementForm onClose={() => setIsCreateDialogOpen(false)} />
      </Modal>
      <Modal
        title="Update Announcement"
        description="Update the details for the Announcement below."
        triggerButtonText=""
        modalSize="max-w-2xl"
        open={isUpdateDialogOpen}
        onOpenChange={(open) => {
          setIsUpdateDialogOpen(open);
          if (!open) setSelectedAnnouncementId(null);
        }}
      >
        <CreateAnnouncementForm
          announcementId={selectedAnnouncementId}
          onClose={() => setIsUpdateDialogOpen(false)}
        />
      </Modal>
      {announcementActions.includes('READ') ? (
        <DataTable columns={Columns} data={sortedAnnouncementData || []} />
      ) : (
        <div>No permission to view Announcements</div>
      )}{' '}
    </>
  );
}

export default Announcements;

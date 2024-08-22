'use client';

import { useState } from 'react';
import * as React from 'react';
import { DataTable } from '@/components/dataTable/DataTable';
import TitleBar from '@/components/header/titleBar';
import { ColumnDef } from '@tanstack/react-table';
import { Modal } from '@/components/modals/modal';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { Role } from '@/types/roleTypes';
import { CreateRoleForm } from '@/components/forms/createRoleForm';
import { useGetAllRole } from '@/services/queries/role';
import { CarTaxiFrontIcon, Ellipsis, KeyRound, User, UserCog } from 'lucide-react';
import Image from 'next/image';

function Roles() {
  const { schoolId } = useSchoolContext();
  const roleData = useGetAllRole(schoolId);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const Columns: ColumnDef<Role>[] = [
    {
      accessorKey: 'roleName',
      header: 'Role Name',
      cell: ({ row }) => (
        <div className="items-start border inline-flex items-center rounded-lg px-4 py-2">
          <KeyRound className="w-4 h-4 me-2" />
          {row.getValue('roleName').replace(/_/g, ' ')}
        </div>
      ),
      enableSorting: true
    },
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <div>
          {row.getValue('title').includes('User') ? (
            <div className="flex items-center">
              <User className="w-4 h-4 me-2" /> <p>{row.getValue('title')}</p>
            </div>
          ) : row.getValue('title').includes('Security') ? (
            <div className="flex items-center">
              <Image
                alt={row.getValue('title')}
                src="/icons/security.png"
                width="150"
                height="150"
                className="w-4 h-4 me-2"
              />
              <p>{row.getValue('title')}</p>
            </div>
          ) : row.getValue('title').includes('Teacher') ? (
            <div className="flex items-center">
              <Image
                alt={row.getValue('title')}
                src="/icons/teacher.png"
                width="150"
                height="150"
                className="w-4 h-4 me-2"
              />
              <p>{row.getValue('title')}</p>
            </div>
          ) : row.getValue('title').includes('Student') ? (
            <div className="flex items-center ">
              <Image
                alt={row.getValue('title')}
                src="/icons/student.png"
                width="150"
                height="150"
                className="w-4 h-4 me-2"
              />
              <p>{row.getValue('title')}</p>
            </div>
          ) : row.getValue('title').includes('House') ? (
            <div className="flex items-center">
              <Image
                alt={row.getValue('title')}
                src="/icons/mop.svg"
                width="150"
                height="150"
                className="w-4 h-4 me-2"
              />
              <p>{row.getValue('title')}</p>
            </div>
          ) : row.getValue('title').includes('Driver') ? (
            <div className="flex items-center">
              <CarTaxiFrontIcon className="w-4 h-4 me-2" /> <p>{row.getValue('title')}</p>
            </div>
          ) : row.getValue('title').includes('Admin') ? (
            <div className="flex items-center">
              <UserCog className="w-4 h-4 me-2" /> <p>{row.getValue('title')}</p>
            </div>
          ) : (
            <div className="flex items-center">
              <Ellipsis className="w-4 h-4 me-2" />
              <p>{row.getValue('title')}</p>
            </div>
          )}
        </div>
      )
    }
  ];

  return (
    <>
      <div className="mt-5">
        <div className="mt-5">
          <TitleBar
            title="Create Roles"
            btnLink=""
            btnName="Create Role"
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
        title="Create a new Role Name"
        description="Enter the details for the new role name below."
        triggerButtonText="Create role name"
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      >
        <CreateRoleForm onClose={() => setIsCreateDialogOpen(false)} />
      </Modal>

      <DataTable columns={Columns} data={roleData?.data?.data || []} />
    </>
  );
}

export default Roles;

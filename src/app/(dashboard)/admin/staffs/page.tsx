'use client';
import React, { useEffect, useState, useCallback } from 'react';
import TitleBar from '@/components/header/titleBar';
import NotFound from '@/components/notfound/notfound';
import ImageCard from '@/components/cards/imageCard';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { useGetAllStaffs } from '@/services/queries/superadmin/admins';
import { useViewAttachment } from '@/services/queries/attachment/attachment';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { DataTable } from '@/components/dataTable/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Staff } from '@/types/admin/staffType';
import { Pencil1Icon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { LayoutGrid, List } from 'lucide-react';
import CustomPagination from '@/components/pagination/custompagination';
import { useGetAllRole } from '@/services/queries/role';
import { useGetSchoolSetting } from '@/services/queries/superadmin/schools';
import { ViewImage } from '@/components/viewfiles/viewImage';
import Image from 'next/image';
function Staffs() {
  const { schoolId } = useSchoolContext();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState('ROLE_TEACHER');
  const [viewMode, setViewMode] = useState('card');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [overallSortOrder, setOverallSortOrder] = useState<'asc' | 'desc'>('asc');
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const { data: schoolSetting } = useGetSchoolSetting(schoolId);
  const [totalRecords, setTotalRecords] = useState(0); // State for total records
  const pageSize = 9;
  const { data: roles, isSuccess: rolesSuccess } = useGetAllRole(schoolId);
  const [hasMounted, setHasMounted] = useState(false);
  console.log(staffs, 'roles check');
  // useGetAllRole;

  const attachmentId = schoolSetting?.data?.schoolSettingDto?.logo.attachmentId;
  const attachmentUrl = useViewAttachment(schoolSetting?.data?.schoolId, attachmentId);

  const logoUrl = attachmentUrl.data;
  const constructPayload = useCallback(() => {
    const filters: unknown = {
      page: currentPage - 1,
      size: pageSize,
      filterCriteria: [],
      sortCriteria: [{ staff: { firstName: overallSortOrder === 'asc' ? 'asc' : 'desc' } }]
    };

    // Adding role filter criteria
    if (selectedRole) {
      filters.filterCriteria.push({
        operation: 'like',
        column: {
          user: {
            roles: {
              roleName: selectedRole
            }
          }
        }
      });
    }

    // Adding search term filter criteria
    if (searchTerm) {
      filters.filterCriteria.push({
        operation: 'like',
        column: {
          staff: {
            firstName: searchTerm
          }
        }
      });
    }

    return filters;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, searchTerm, selectedRole, overallSortOrder]);

  const { data: staffData, isError } = useGetAllStaffs(schoolId, constructPayload());

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const updateData = async () => {
      if (staffData && staffData.data) {
        setStaffs(staffData.data.content);
        setTotalPages(staffData.data.totalPages);
        setTotalRecords(staffData.data.totalElements); // Set total records
      } else {
        setStaffs([]);
        setTotalPages(0);
        setTotalRecords(0);
      }
    };
    updateData();
  }, [staffData]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleSort = (sortOrder: 'asc' | 'desc') => {
    setOverallSortOrder(sortOrder);
  };

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleUpdateClick = (staffId: string) => {
    router.push(`staffs/create?schoolId=${schoolId}&staffId=${staffId}`);
  };

  const ImageCardWithAttachment = ({ item }: { item: Staff }) => {
    const attachmentData = useViewAttachment(
      item.staffDto?.schoolId,
      item.staffDto?.photo?.attachmentId
    );
    const bgImageSrc = attachmentData.isSuccess ? attachmentData.data : null;
    return (
      <ImageCard
        id={item.staffId}
        title={`${item.staffDto.firstName} ${item.staffDto.lastName}`}
        description={item.currentAddress?.place || ''}
        bgImageSrc={bgImageSrc}
        logoSrc={logoUrl}
        name={item.staffDto.firstName}
        email={item.staffDto.email}
        phone={item.staffDto.contactNumber}
        place={item.staffDto.currentAddress?.city || ''}
        cardLink={`${process.env.NEXT_PUBLIC_STAFFS_URL}${item.staffDto.staffId}?schoolId=${item.staffDto?.schoolId}&`}
      />
    );
  };

  const columns: ColumnDef<Staff>[] = [
    {
      accessorKey: 'photo',
      header: 'Profile',
      cell: function CellComponent({ row }) {
        const attachmentId = row.original.staffDto?.photo?.attachmentId;

        if (!attachmentId) {
          return (
            <Image alt="eduflow" width={50} height={50} className="rounded-full" src="/man.png" />
          );
        }

        return (
          <ViewImage
            schoolId={schoolId}
            attachmentId={attachmentId}
            width={40}
            height={40}
            styles="rounded-full object-cover"
            alt="eduflow"
          />
        );
      }
    },
    {
      accessorKey: 'firstName',
      header: 'First Name',
      cell: ({ row }) => row.original.staffDto.firstName,
      enableSorting: true
    },
    {
      accessorKey: 'lastName',
      header: 'Last Name',
      cell: ({ row }) => row.original.staffDto.lastName,
      enableSorting: true
    },
    {
      accessorKey: 'contactNumber',
      header: 'Contact Number',
      cell: ({ row }) => row.original.staffDto.contactNumber,
      enableSorting: true
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => row.original.staffDto.email,
      enableSorting: true
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => (
        <div
          className={`w-[100px] flex justify-center items-center rounded-lg px-2 py-1 border text-xs ${
            row.original.staffDto.isActive
              ? 'text-green-600 border-green-500 bg-green-100'
              : 'text-red-600 border-red-500 bg-red-100'
          } capitalize`}
        >
          {row.original.staffDto.isActive ? 'Active' : 'Inactive'}
        </div>
      ),
      enableSorting: true
    },

    {
      accessorKey: 'Actions',
      enableHiding: false,
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleUpdateClick(row.original.staffDto.staffId)}
        >
          <Pencil1Icon className="w-4 h-4 mr-2" />
          Edit
        </Button>
      )
    }
  ];

  if (!hasMounted) {
    return null;
  }

  return (
    <div className="mt-5">
      <TitleBar
        title="Staffs"
        btnLink="/admin/staffs/create"
        btnName="Create Staff"
        onSearch={handleSearch}
        onSort={handleSort}
        search={true}
        placeholder="Search Staff"
        sort={true}
      />

      {rolesSuccess && (
        <div className="p-4 mb-5 border rounded-2xl ">
          <div className="flex items-center justify-between p-4 space-x-4 border dark:border-slate-900 bg-slate-50 border-slate-100 dark:bg-slate-950 rounded-2xl">
            <div className="w-1/3">
              <div className="flex flex-col space-y-2">
                <label htmlFor="role-select">Select Role</label>
                <Select
                  onValueChange={(value) => {
                    const selectedRole = roles?.data.find(
                      (role) => role.roleId.toString() === value
                    )?.roleName;
                    setSelectedRole(selectedRole || 'ROLE_TEACHER');
                  }}
                  value={selectedRole}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Role">
                      {selectedRole
                        ? roles?.data.find((role) => role.roleName === selectedRole)?.title
                        : 'Select a Role'}
                    </SelectValue>
                  </SelectTrigger>

                  <SelectContent>
                    {Array.isArray(roles?.data) &&
                      roles.data
                        .filter((role) => !['ROLE_USER', 'ROLE_STUDENT'].includes(role.roleName))
                        .map((role) => (
                          <SelectItem key={role.roleId} value={role.roleId.toString()}>
                            {role.title}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-end space-x-4 mt-7">
              <Button
                onClick={() => setViewMode('card')}
                size="sm"
                className={`px-4 py-2 border rounded ${viewMode === 'card' ? 'bg-slate-800 text-white' : 'bg-white text-black hover:text-white'}`}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setViewMode('table')}
                size="sm"
                className={`px-4 py-2 border rounded ${viewMode === 'table' ? 'bg-slate-800 text-white' : 'bg-white text-black hover:text-white'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="p-4 mt-10 border border-slate-100 bg-slate-50 dark:bg-slate-950 dark:border-slate-900 rounded-2xl">
            {schoolId ? (
              <>
                {viewMode === 'card' ? (
                  <div className="flex flex-row flex-wrap justify-between gap-y-10 gap-x-5 md:gap-x-10">
                    {isError ? (
                      <div className="flex justify-center w-full text-center">
                        <NotFound
                          image="/Nodata.svg"
                          title="No staffs found!"
                          description="Please click below button to add staff"
                          btnLink="/admin/staffs/create"
                          btnName="Create Staffs"
                          style={{ width: '100%', height: '100%' }}
                        />
                      </div>
                    ) : staffs.length > 0 ? (
                      staffs.map((item) => (
                        <div
                          key={item.staffId}
                          className="basis-full md:basis-[215px] lg:basis-[230px] xl:basis-60 2xl:basis-60"
                        >
                          <ImageCardWithAttachment item={item} />
                        </div>
                      ))
                    ) : (
                      <div className="flex justify-center w-full text-center">
                        <NotFound
                          image="/Nodata.svg"
                          title="No staffs found!"
                          description="Please click below button to add staff"
                          btnLink="/admin/staffs/create"
                          btnName="Create Staff"
                          style={{ width: '100%', height: '100%' }}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    {isError ? (
                      <div className="flex justify-center w-full text-center">
                        <NotFound
                          image="/Nodata.svg"
                          title="No staffs found!"
                          description="Please click below button to add staff"
                          btnLink="/admin/staffs/create"
                          btnName="Create Staff"
                        />
                      </div>
                    ) : staffs.length > 0 ? (
                      <DataTable columns={columns} data={staffs} />
                    ) : (
                      <div className="flex justify-center w-full text-center">
                        <NotFound
                          image="/Nodata.svg"
                          title="No staffs found!"
                          description="Please click below button to add staff"
                          btnLink="/admin/staffs/create"
                          btnName="Create Staff"
                        />
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="flex justify-center w-full text-center">
                <NotFound
                  image="/Nodata.svg"
                  title="No school selected!"
                  description="Please select a school to view staff"
                  btnLink="/admin/schools"
                  btnName="Select School"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {totalRecords > pageSize && (
        <div className="flex justify-center my-10">
          <div className="w-1/4">
            <CustomPagination
              currentPage={currentPage}
              pageSize={pageSize}
              totalItems={totalRecords}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Staffs;

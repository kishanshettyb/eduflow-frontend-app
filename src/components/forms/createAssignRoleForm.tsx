import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/dataTable/DataTable';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { AlertDialog } from '@/components/alertdialogue/alert';
import { useGetAllStaffs } from '@/services/queries/admin/staff';
import { useAssignRole } from '@/services/mutation/admin/assignrole';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { useGetAllRole, useGetAllRoleByStaff } from '@/services/queries/role';
import { useDeleteAssignRole } from '@/services/mutation/admin/assignrole'; // Add this line if not already imported
import { TrashIcon } from '@radix-ui/react-icons';

const formSchema = z.object({
  staffId: z.string().nonempty({ message: 'Staff is required' }),
  roleId: z.string().nonempty({ message: 'Role is required' })
});

function CreateAssignRoleForm() {
  const { schoolId } = useSchoolContext();
  const { data: staffsData, isLoading: isStaffsLoading } = useGetAllStaffs(schoolId);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { data: rolesData, isLoading: isRolesLoading } = useGetAllRole(schoolId);
  const { data: rolesTableData } = useGetAllRoleByStaff(
    schoolId,
    selectedStaffId ? Number(selectedStaffId) : 0
  );

  const assignRoleMutation = useAssignRole();
  const deleteAssignRoleMutation = useDeleteAssignRole();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      staffId: '',
      roleId: ''
    }
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const payload = {
      schoolId,
      staffId: Number(values.staffId),
      data: [Number(values.roleId)]
    };

    assignRoleMutation.mutate(payload, {
      onSuccess: () => {}
    });
  };

  const handleDelete = () => {
    if (selectedStaffId && selectedRoleId) {
      deleteAssignRoleMutation.mutate({
        schoolId,
        staffId: Number(selectedStaffId),
        roleId: Number(selectedRoleId)
      });
      setSelectedRoleId(null);
      setIsDeleteDialogOpen(false);
    }
  };

  useEffect(() => {
    if (form.watch('staffId')) {
      setSelectedStaffId(form.watch('staffId'));
    }
  }, [form.watch('staffId')]);

  const Columns: ColumnDef[] = [
    {
      accessorKey: 'roleName',
      header: 'Role Name',
      cell: ({ row }) => <div>{row.getValue('roleName')}</div>,
      enableSorting: true
    },
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => <div>{row.getValue('title')}</div>
    },
    {
      accessorKey: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        const role = row.original;
        return (
          <div className="flex items-center space-x-2">
            <AlertDialog
              title="Confirm Deletion"
              description="Are you sure you want to delete this role assignment? This action cannot be undone."
              triggerButtonText=""
              confirmButtonText="Delete"
              cancelButtonText="Cancel"
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
              onConfirm={handleDelete}
            >
              <Button
                variant="outline"
                size="sm"
                disabled={role.roleName === 'ROLE_USER'}
                onClick={() => {
                  setSelectedRoleId(role.roleId);
                  setIsDeleteDialogOpen(true);
                }}
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

  return (
    <>
      <div className="p-4 rounded-2xl shadow-3xl mb-5">
        <Form {...form}>
          <div>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="w-100 mb-3">
                <h2 className="mb-3 uppercase text-slate-400 text-sm">Assign Role:</h2>
              </div>

              <div className="mb-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <FormField
                    control={form.control}
                    name="staffId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Staff</FormLabel>

                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={field.value}
                          disabled={isStaffsLoading}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a Staff" />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            {Array.isArray(staffsData?.data) &&
                              staffsData.data.map((staff) => (
                                <SelectItem key={staff.staffId} value={staff.staffId.toString()}>
                                  {staff.firstName} {staff.lastName}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <FormField
                    control={form.control}
                    name="roleId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Role</FormLabel>

                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          defaultValue={field.value}
                          disabled={isRolesLoading}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a Role" />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            {Array.isArray(rolesData?.data) &&
                              rolesData.data.map((role) => (
                                <SelectItem key={role.roleId} value={role.roleId.toString()}>
                                  {role.title}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-full flex items-end">
                  <Button className="  w-full" type="submit">
                    Assign Role
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </Form>
      </div>

      <div>
        <DataTable columns={Columns} data={rolesTableData?.data || []} />
      </div>
    </>
  );
}

export default CreateAssignRoleForm;

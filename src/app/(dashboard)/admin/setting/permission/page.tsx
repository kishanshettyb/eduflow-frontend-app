'use client';

import { useState, useEffect } from 'react';
import * as React from 'react';
import { DataTable } from '@/components/dataTable/DataTable';
import TitleBar from '@/components/header/titleBar';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { useGetPolicyByRoleName, useGetPolicy } from '@/services/queries/admin/policy';
import { useGetAllRole } from '@/services/queries/role';
import { AlertDialog } from '@/components/alertdialogue/alert';
import { Button } from '@/components/ui/button';
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';
import {
  useEditPolicy,
  useMultiplePolicyUpdate,
  useAssignPolicy,
  useDeletePolicy
} from '@/services/mutation/admin/policy';
import { Modal } from '@/components/modals/modal';

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

function PolicyManagement() {
  const { schoolId } = useSchoolContext();
  const defaultRole = process.env.NEXT_PUBLIC_DEFAULT_ROLE;
  const [selectedRoleTitle, setSelectedRoleTitle] = useState({ defaultRole });
  const [selectedPolicyRuleId, setSelectedPolicyRuleId] = useState<number | null>(null);
  const [isChanged, setIsChanged] = useState(false);
  const [, setIsEditDialogOpen] = useState(false);
  const [isCreatePolicyModalOpen, setIsCreatePolicyModalOpen] = useState(false);
  const [selectedResources, setSelectedResources] = useState<string[]>([]);
  const rolesData = useGetAllRole(schoolId);
  const policyData = useGetPolicyByRoleName(schoolId, selectedRoleTitle);
  const editPolicyMutation = useEditPolicy();
  const multiplePolicyUpdateMutation = useMultiplePolicyUpdate();
  const deletePolicyMutation = useDeletePolicy();
  const assignPolicyMutation = useAssignPolicy();
  const allPoliciesData = useGetPolicy(schoolId);
  const [, setIsDeleteDialogOpen] = useState(false);
  const [checkboxStates, setCheckboxStates] = useState({});

  console.log(allPoliciesData.data, 'allPoliciesData');
  useEffect(() => {
    if (rolesData.data?.data?.length > 0) {
      setSelectedRoleTitle(
        rolesData?.data?.data
          .find((role) => role.title.toUpperCase() === defaultRole)
          ?.title.toUpperCase() || defaultRole
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rolesData.data?.data]);

  useEffect(() => {
    if (policyData.data) {
      const initialStates = policyData.data.data.reduce((acc, policy) => {
        acc[policy.policyRuleId] = {
          READ: policy.actions.includes('READ'),

          WRITE: policy.actions.includes('WRITE'),

          PUBLISH: policy.actions.includes('PUBLISH'),

          DELETE: policy.actions.includes('DELETE')
        };

        return acc;
      }, {});

      setCheckboxStates(initialStates);
    }
  }, [policyData.data]);

  useEffect(() => {
    if (!selectedRoleTitle && rolesData.data?.length > 0) {
      setSelectedRoleTitle(defaultRole);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rolesData.data]);

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRoleTitle(event.target.value.toUpperCase());
  };

  const handleEdit = () => {
    if (selectedPolicyRuleId) {
      editPolicyMutation.mutate(
        { policyRuleId: selectedPolicyRuleId },
        {
          onSuccess: () => {
            policyData.refetch().then((res) => {
              if (res.data?.data) {
                const updatedPolicies = res.data.data;
                const editedPolicyIndex = updatedPolicies.findIndex(
                  (policy) => policy.policyRuleId === selectedPolicyRuleId
                );

                if (editedPolicyIndex !== -1) {
                  const [editedPolicy] = updatedPolicies.splice(editedPolicyIndex, 1);
                  updatedPolicies.unshift(editedPolicy);
                }
              }
            });

            setSelectedPolicyRuleId(null);
            setIsEditDialogOpen(false);
          }
        }
      );
    }
  };

  const handleDelete = () => {
    if (selectedPolicyRuleId) {
      deletePolicyMutation.mutate(
        { schoolId, policyRuleId: selectedPolicyRuleId },
        {
          onSuccess: () => {
            setCheckboxStates((prevState) => {
              const newState = { ...prevState };
              delete newState[selectedPolicyRuleId];
              return newState;
            });
          }
        }
      );
      setSelectedPolicyRuleId(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleUpdate = () => {
    const updatedPolicies = Object.entries(checkboxStates).map(([policyRuleId, actions]) => ({
      policyRuleId: parseInt(policyRuleId),

      type: 'Role',

      subject: selectedRoleTitle,

      resource: 'academic-years',

      schoolId: schoolId,

      actions: Object.entries(actions)

        .filter(([, checked]) => checked)

        .map(([action]) => action)
    }));

    multiplePolicyUpdateMutation.mutate(updatedPolicies);
  };

  const handleCheckboxChange = (policyRuleId, action, resource) => {
    if (resource === 'academic-years' && action === 'READ') {
      return;
    }

    setCheckboxStates((prevState) => ({
      ...prevState,
      [policyRuleId]: {
        ...prevState[policyRuleId],
        [action]: !prevState[policyRuleId][action]
      }
    }));
    setIsChanged(true);
  };

  const handleResourceCheckboxChange = (category, resource) => {
    setSelectedResources((prevSelected) => {
      const categoryResources = prevSelected[category] || [];

      if (categoryResources.includes(resource)) {
        return {
          ...prevSelected,
          [category]: categoryResources.filter((res) => res !== resource)
        };
      } else {
        return {
          ...prevSelected,
          [category]: [...categoryResources, resource]
        };
      }
    });
  };

  const handleAssign = () => {
    const payload = Object.entries(selectedResources).flatMap(([category, resources]) =>
      resources.map((resource) => ({
        type: 'Role',
        feature: category,
        resource: resource, // Single resource string, not an array
        schoolId,
        editable: false,
        actions: ['READ']
      }))
    );

    // Find the roleName based on selectedRoleTitle
    const selectedRole = rolesData.data?.data?.find(
      (role) => role.title.toUpperCase() == selectedRoleTitle
    );
    const roleName = selectedRole ? selectedRole.roleName : '';

    // Send the payload with single string resource
    assignPolicyMutation.mutate({ roleName, data: payload });

    // Reset the state
    setIsCreatePolicyModalOpen(false);
    setSelectedResources([]);
  };

  const columns = [
    {
      accessorKey: 'resource',
      header: 'Resource',
      cell: ({ row }) => <div>{capitalizeFirstLetter(row.getValue('resource'))}</div>
    },

    {
      accessorKey: 'read',
      header: 'Read',
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={checkboxStates[row.original.policyRuleId]?.READ || false}
          onChange={() =>
            handleCheckboxChange(row.original.policyRuleId, 'READ', row.original.resource)
          }
          disabled={row.original.resource === 'academic-years' || !row.original.editable}
        />
      )
    },

    {
      accessorKey: 'write',
      header: 'Write',
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={checkboxStates[row.original.policyRuleId]?.WRITE || false}
          onChange={() => handleCheckboxChange(row.original.policyRuleId, 'WRITE')}
          disabled={!row.original.editable}
        />
      )
    },

    {
      accessorKey: 'publish',
      header: 'Publish',
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={checkboxStates[row.original.policyRuleId]?.PUBLISH || false}
          onChange={() => handleCheckboxChange(row.original.policyRuleId, 'PUBLISH')}
          disabled={!row.original.editable}
        />
      )
    },

    {
      accessorKey: 'delete',
      header: 'Delete',
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={checkboxStates[row.original.policyRuleId]?.DELETE || false}
          onChange={() => handleCheckboxChange(row.original.policyRuleId, 'DELETE')}
          disabled={!row.original.editable}
        />
      )
    },

    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <>
          <div className="flex items-center space-x-2">
            <AlertDialog
              title="Confirm Edit"
              description="Are you sure you want to edit this policy? This action cannot be undone."
              triggerButtonText=""
              confirmButtonText="Edit"
              cancelButtonText="Cancel"
              onConfirm={handleEdit}
              onCancel={() => setIsEditDialogOpen(false)}
            >
              <Button
                variant="outline"
                size="sm"
                disabled={row.original.editable}
                onClick={() => {
                  setSelectedPolicyRuleId(row.original.policyRuleId);
                  setIsEditDialogOpen(true); // Open the dialog
                }}
              >
                <Pencil1Icon className="h-4 w-4 me-2" />
                Edit
              </Button>
            </AlertDialog>
            <AlertDialog
              title="Confirm Delete"
              description="Are you sure you want to delete this policy? This action cannot be undone."
              triggerButtonText=""
              confirmButtonText="Delete"
              cancelButtonText="Cancel"
              onConfirm={handleDelete}
              onCancel={() => setIsDeleteDialogOpen(false)}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedPolicyRuleId(row.original.policyRuleId);
                  setIsDeleteDialogOpen(true); // Open the delete dialog
                }}
              >
                <TrashIcon className="h-4 w-4 me-2" />
                Delete
              </Button>
            </AlertDialog>
          </div>
        </>
      )
    }
  ];

  return (
    <>
      <div className="mt-5">
        <div className="mt-5">
          <TitleBar
            title="Policy Management"
            btnLink=""
            btnName="Create Policy"
            search={false}
            sort={false}
            placeholder="Search..."
            onSearch={() => {}}
            onSort={() => {}}
            modal={true}
            onButtonClick={() => setIsCreatePolicyModalOpen(true)}
          />
        </div>
      </div>

      <div className="flex flex-col w-[300px]">
        <div className="flex items-center justify-between">
          <div>
            <label htmlFor="roleSelect" className="block mb-2 text-sm font-medium text-gray-700">
              Select Role
            </label>

            <select
              id="roleSelect"
              className="block w-full mt-1 mb-5 p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
              value={selectedRoleTitle || ''}
              onChange={handleRoleChange}
            >
              {rolesData.data?.data
                .filter((role) => role.title.toUpperCase() !== 'USER')
                .map((role) => (
                  <option key={role.roleId} value={role.title.toUpperCase()}>
                    {role.title}
                  </option>
                ))}
            </select>
          </div>

          <Button type="button" className="ml-4" onClick={handleUpdate} disabled={!isChanged}>
            Update
          </Button>
        </div>
      </div>

      <DataTable columns={columns} data={policyData?.data?.data || []} />

      <Modal
        title="Create Policy"
        description="Select resources to assign to the policy."
        modalSize="w-full max-w-lg"
        open={isCreatePolicyModalOpen}
        onOpenChange={setIsCreatePolicyModalOpen}
      >
        <div className="flex flex-col">
          {allPoliciesData?.data?.data && Object.entries(allPoliciesData.data.data).length > 0 ? (
            Object.entries(allPoliciesData.data.data).map(([category, resources]) => (
              <div key={category} className="mb-4">
                <h3 className="text-lg font-semibold mb-2">{category}</h3>
                {Array.isArray(resources) && resources.length > 0 ? (
                  resources.map((resource) => (
                    <div key={resource} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        checked={selectedResources[category]?.includes(resource) || false}
                        onChange={() => handleResourceCheckboxChange(category, resource)}
                      />
                      <span className="ml-2">{resource}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500">No resources available</div>
                )}
              </div>
            ))
          ) : (
            <div className="text-gray-500">Loading resources...</div>
          )}

          <Button type="button" onClick={handleAssign}>
            Assign
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default PolicyManagement;

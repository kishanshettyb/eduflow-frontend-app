'use client';
import React, { useState, useEffect } from 'react';
import TitleBar from '@/components/header/titleBar';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { useGetAllRole } from '@/services/queries/role';
import { useGetFeatures, useGetAllFeatures } from '@/services/queries/policyRules/policyRules';
import { Switch } from '@/components/ui/switch';
import { useUpdateFeatureStatus } from '@/services/mutation/features';

function FeaturesManagement() {
  const { schoolId } = useSchoolContext();
  const defaultRole = process.env.NEXT_PUBLIC_DEFAULT_ROLE;
  const [selectedRoleTitle, setSelectedRoleTitle] = useState({ defaultRole });
  const [parentFeatures, setParentFeatures] = useState<unknown[]>([]);
  const [activeParents, setActiveParents] = useState<Record<string, boolean>>({});
  const [activeChildren, setActiveChildren] = useState<Record<string, Record<string, boolean>>>({});
  const [enabledFeatures, setEnabledFeatures] = useState<Record<string, string[]>>({}); // Store enabled features by parent

  const rolesData = useGetAllRole(schoolId);
  const { data: roleFeaturesData } = useGetFeatures(schoolId, selectedRoleTitle);
  const { data: featuresData } = useGetAllFeatures(schoolId);
  console.log(featuresData, 'featuresData');
  const updateFeatureMutation = useUpdateFeatureStatus();
  useEffect(() => {
    if (rolesData.data?.data?.length > 0) {
      setSelectedRoleTitle(
        rolesData.data.data
          .find((role) => role.title.toUpperCase() === defaultRole)
          ?.title.toUpperCase() || defaultRole
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rolesData.data?.data]);

  useEffect(() => {
    if (featuresData && roleFeaturesData) {
      const parents = featuresData;
      setParentFeatures(parents);

      const initialActiveParents = parents.reduce(
        (acc, parent) => {
          // Check if the parent exists in roleFeaturesData
          const matchingParent = roleFeaturesData.find(
            (roleFeature) => roleFeature.key === parent.key
          );
          acc[parent.key] = !!matchingParent; // Enable if matching parent is found
          return acc;
        },
        {} as Record<string, boolean>
      );

      const initialActiveChildren = parents.reduce(
        (acc, parent) => {
          const matchingParent = roleFeaturesData.find(
            (roleFeature) => roleFeature.key === parent.key
          );
          acc[parent.key] = parent.menu.reduce(
            (childAcc, child) => {
              // Check if the child exists in roleFeaturesData under the same parent
              const matchingChild = matchingParent?.menu.find(
                (roleChild) => roleChild.key === child.key
              );
              childAcc[child.key] = !!matchingChild; // Enable if matching child is found
              return childAcc;
            },
            {} as Record<string, boolean>
          );
          return acc;
        },
        {} as Record<string, Record<string, boolean>>
      );

      setActiveParents(initialActiveParents);
      setActiveChildren(initialActiveChildren);

      // Initialize enabled features
      const initialEnabledFeatures = parents.reduce(
        (acc, parent) => {
          const matchingParent = roleFeaturesData.find(
            (roleFeature) => roleFeature.key === parent.key
          );
          if (matchingParent) {
            acc[parent.key] = matchingParent.menu.map((child) => child.name);
          }
          return acc;
        },
        {} as Record<string, string[]>
      );
      setEnabledFeatures(initialEnabledFeatures);
    }
  }, [featuresData, roleFeaturesData]);

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRoleTitle(event.target.value.toUpperCase());
  };

  const handleParentSwitchChange = (parentKey: string) => {
    setActiveParents((prev) => {
      const newActiveParents = {
        ...prev,
        [parentKey]: !prev[parentKey]
      };

      // Update child features when parent is toggled off
      const updatedChildren = { ...activeChildren };
      if (!newActiveParents[parentKey]) {
        updatedChildren[parentKey] = Object.keys(updatedChildren[parentKey] || {}).reduce(
          (acc, childKey) => {
            acc[childKey] = false;
            return acc;
          },
          {} as Record<string, boolean>
        );
      } else if (!updatedChildren[parentKey]) {
        // If no children are active for this parent, initialize all children as false
        updatedChildren[parentKey] = parentFeatures
          .find((p) => p.key === parentKey)
          ?.menu.reduce(
            (acc, child) => {
              acc[child.key] = false;
              return acc;
            },
            {} as Record<string, boolean>
          );
      }

      setActiveChildren(updatedChildren);

      // Update enabled features based on parent switch
      const updatedEnabledFeatures = { ...enabledFeatures };

      if (!newActiveParents[parentKey]) {
        // If the parent is disabled, remove all associated children from enabled features
        delete updatedEnabledFeatures[parentKey];
      } else {
        // Enable all children for this parent
        const childFeatures =
          parentFeatures.find((p) => p.key === parentKey)?.menu.map((child) => child.name) || [];
        updatedEnabledFeatures[parentKey] = childFeatures;
      }

      setEnabledFeatures(updatedEnabledFeatures);

      return newActiveParents;
    });
  };

  const handleChildSwitchChange = (parentKey: string, childKey: string, childName: string) => {
    setActiveChildren((prev) => {
      const newActiveChildren = {
        ...prev,
        [parentKey]: {
          ...prev[parentKey],
          [childKey]: !prev[parentKey][childKey] // Toggle the child switch
        }
      };

      // Update enabled features based on child switch
      const updatedEnabledFeatures = { ...enabledFeatures };

      if (newActiveChildren[parentKey][childKey]) {
        // If the child is enabled, add it to enabled features
        if (!updatedEnabledFeatures[parentKey]) {
          updatedEnabledFeatures[parentKey] = [];
        }
        if (!updatedEnabledFeatures[parentKey].includes(childName)) {
          updatedEnabledFeatures[parentKey].push(childName);
        }
      } else {
        // If the child is disabled, remove it from enabled features
        updatedEnabledFeatures[parentKey] = updatedEnabledFeatures[parentKey]?.filter(
          (name) => name !== childName
        );

        // If no children are enabled for the parent, remove the parent from enabled features
        if (updatedEnabledFeatures[parentKey]?.length === 0) {
          delete updatedEnabledFeatures[parentKey];
        }
      }

      setEnabledFeatures(updatedEnabledFeatures);

      return newActiveChildren;
    });
  };

  const handleSubmit = () => {
    // Construct the payload with enabled features
    const payload = Object.keys(activeParents).reduce((acc, parentKey) => {
      const parentFeature = parentFeatures.find((parent) => parent.key === parentKey);
      const isParentActive = activeParents[parentKey]; // Check if the parent switch is enabled
      const menuPresent = parentFeature?.menu && parentFeature.menu.length > 0;

      if (isParentActive) {
        if (!menuPresent) {
          // If the parent feature has no menu and the switch is enabled, include it in the payload
          acc.push({
            parent: '', // Set parent as null if menu is not present
            name: parentFeature?.name,
            roleName: selectedRoleTitle
          });
        } else {
          // Include only the enabled children if the menu is present
          const enabledChildren = activeChildren[parentKey]
            ? Object.keys(activeChildren[parentKey]).filter(
                (childKey) => activeChildren[parentKey][childKey]
              )
            : [];

          enabledChildren.forEach((childKey) => {
            const childFeature = parentFeature?.menu.find((child) => child.key === childKey);

            if (childFeature) {
              acc.push({
                schoolId,
                parent: parentKey,
                name: childFeature.name,
                roleName: selectedRoleTitle
              });
            }
          });
        }
      }

      return acc;
    }, [] as unknown[]);

    // Send the payload directly
    // updateFeatureMutation.mutate(payload);
    updateFeatureMutation.mutate({
      schoolId: schoolId,
      data: payload
    });
  };

  return (
    <>
      <div className="mt-5">
        <TitleBar
          title="Features Management"
          btnLink=""
          btnName="Update Feature"
          search={false}
          sort={false}
          placeholder="Search..."
          onSearch={() => {}}
          onSort={() => {}}
          modal={true}
          onButtonClick={() => handleSubmit()}
        />
      </div>
      <div className="p-6 bg-white dark:bg-slate-900 border rounded-lg shadow-3xl mb-52">
        <div className="mb-6">
          <label
            htmlFor="roleSelect"
            className="block mb-1 text-md font-semibold text-gray-800 dark:text-gray-200"
          >
            Select Role
          </label>
          <select
            id="roleSelect"
            className="block w-1/6 p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 bg-white dark:bg-slate-900"
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
        <div className="space-y-4">
          {parentFeatures.map((parentFeature) => (
            <div
              key={parentFeature.key}
              className="pb-4 bg-white dark:bg-slate-950 shadow-md border rounded-2xl border-gray-200 dark:border-slate-900"
            >
              <div className="flex items-center justify-between border border-t-0   border-x-0 rounded-t-2xl  p-4 mb-4">
                <div className="flex items-center ">
                  <Switch
                    checked={activeParents[parentFeature.key]}
                    onCheckedChange={() => handleParentSwitchChange(parentFeature.key)}
                    className="mr-4"
                  />
                  <span className="text-lg font-semibold text-gray-900 dark:text-slate-200">
                    {parentFeature.name}
                  </span>
                </div>
                <div className="flex-shrink-0">
                  <span className="text-sm text-gray-600">{parentFeature.description}</span>
                </div>
              </div>
              {activeParents[parentFeature.key] &&
                parentFeature.menu &&
                parentFeature.menu.length > 0 && (
                  <ul className="px-20 space-y-2">
                    {parentFeature.menu.map((childFeature: unknown) => (
                      <li
                        key={childFeature.key}
                        className="flex items-center border p-2 rounded-xl text-gray-700"
                      >
                        <Switch
                          checked={activeChildren[parentFeature.key]?.[childFeature.key] || false}
                          onCheckedChange={() =>
                            handleChildSwitchChange(
                              parentFeature.key,
                              childFeature.key,
                              childFeature.name
                            )
                          }
                          className="mr-4"
                        />
                        <span className="text-sm dark:text-slate-400">{childFeature.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default FeaturesManagement;

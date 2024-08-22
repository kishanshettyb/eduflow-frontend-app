import React from 'react';
import { useGetSingleStaff } from '@/services/queries/superadmin/admins';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { Input } from '@/components/ui/input'; // Assuming you have an Input component in your UI library

export default function ProfileDisplay() {
  const { schoolId, staffId } = useSchoolContext();
  const { data: staffdata, isLoading, isError } = useGetSingleStaff(schoolId, staffId);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading profile</div>;

  if (!staffdata || !staffdata.data) return <div>No profile data available</div>;

  const staff = staffdata.data;

  return (
    <div className="mt-5 p-10 border bg-white dark:bg-slate-900 rounded-2xl ">
      <h2 className="text-xl font-semibold mb-4">Profile Display</h2>
      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-x-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300">First Name</label>
            <Input
              value={staff.firstName}
              readOnly
              className="w-full border-2 p-2 rounded-md bg-gray-100 dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Last Name</label>
            <Input
              value={staff.lastName}
              readOnly
              className="w-full border-2 p-2 rounded-md bg-gray-100 dark:bg-gray-700"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Email</label>
            <Input
              value={staff.email}
              readOnly
              className="w-full border-2 p-2 rounded-md bg-gray-100 dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Contact Number</label>
            <Input
              value={staff.contactNumber}
              readOnly
              className="w-full border-2 p-2 rounded-md bg-gray-100 dark:bg-gray-700"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Gender</label>
            <Input
              value={staff.gender}
              readOnly
              className="w-full border-2 p-2 rounded-md bg-gray-100 dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Date of Birth</label>
            <Input
              value={staff.dateOfBirth}
              readOnly
              className="w-full border-2 p-2 rounded-md bg-gray-100 dark:bg-gray-700"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Employment Status</label>
            <Input
              value={staff.employmentStatus}
              readOnly
              className="w-full border-2 p-2 rounded-md bg-gray-100 dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Joining Date</label>
            <Input
              value={staff.joiningDate}
              readOnly
              className="w-full border-2 p-2 rounded-md bg-gray-100 dark:bg-gray-700"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Department</label>
            <Input
              value={staff.departmentDto?.departmentName ?? 'N/A'}
              readOnly
              className="w-full border-2 p-2 rounded-md bg-gray-100 dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Role</label>
            <Input
              value={staff.roleDto?.roleName ?? 'N/A'}
              readOnly
              className="w-full border-2 p-2 rounded-md bg-gray-100 dark:bg-gray-700"
            />
          </div>
        </div>
        {/* Add more fields as needed */}
      </form>
    </div>
  );
}

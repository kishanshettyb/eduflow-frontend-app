'use client';

import React, { useEffect, useState } from 'react';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import {
  useGetEnrollmentIdStudentDetailes,
  useGetFeeStructures,
  useGetSingleStudentFeesPaymentDetailes
} from '@/services/queries/admin/feePayment';
import { useSearchParams } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/dataTable/DataTable';
import { FeesPayment } from '@/types/admin/feestuctureTypes';
import TitleBar from '@/components/header/titleBar';
import { Student } from '@/types/admin/studentTypes';
import moment from 'moment';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/modals/modal';
import { Layers } from 'lucide-react';

const SingleStudentFeesPaymentDetailes = () => {
  const search = useSearchParams();
  const { schoolId, academicYearId } = useSchoolContext();

  const enrollmentId = search?.get('enrollmentId') as string;
  const [students, setStudents] = useState<Student[]>([]);
  const [isFeeStructureModalOpen, setIsFeeStructureModalOpen] = useState(false);

  const { data, isLoading, isError } = useGetSingleStudentFeesPaymentDetailes(
    schoolId,
    academicYearId,
    enrollmentId
  );
  const { data: enrollmentIdStudentDetailes } = useGetEnrollmentIdStudentDetailes(
    schoolId,
    enrollmentId
  );

  const getAllFeeStructure = useGetFeeStructures(schoolId, enrollmentId, academicYearId);
  const feeStructure = getAllFeeStructure.data?.data;

  useEffect(() => {
    if (enrollmentIdStudentDetailes && enrollmentIdStudentDetailes.data) {
      setStudents(enrollmentIdStudentDetailes.data);
    } else {
      setStudents([]);
    }
  }, [enrollmentIdStudentDetailes]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !data) {
    return <div>Error loading payment details.</div>;
  }

  let totalDueAmount = 0;
  const paymentDetails = data.data;

  if (feeStructure !== undefined) {
    feeStructure.forEach((paymentDetail) => {
      paymentDetail.feeComponents.forEach((feeComponent) => {
        totalDueAmount += feeComponent.dueAmount;
      });
    });
  }

  const columns: ColumnDef<FeesPayment>[] = [
    {
      accessorKey: 'startTime',
      header: 'Date',
      cell: ({ row }) => <div>{moment(row.getValue('createdTime')).format('DD-MMMM-YYYY')}</div>
    },
    {
      accessorKey: 'feePaymentId',
      header: 'Payment ID',
      cell: ({ row }) => row.getValue('feePaymentId'),
      enableSorting: true
    },
    {
      accessorKey: 'invoiceId',
      header: 'Invoice ID',
      cell: ({ row }) => row.getValue('invoiceId'),
      enableSorting: true
    },
    {
      accessorKey: 'totalFee',
      header: 'Total Fee',
      cell: ({ row }) => row.getValue('totalFee'),
      enableSorting: true
    },
    {
      accessorKey: 'paidFee',
      header: 'Paid Fee',
      cell: ({ row }) => row.getValue('paidFee'),
      enableSorting: true
    },
    {
      accessorKey: 'paymentType',
      header: 'Payment Type',
      cell: ({ row }) => row.getValue('paymentType'),
      enableSorting: true
    },
    {
      accessorKey: 'paymentStatus',
      header: 'Payment Status',
      cell: ({ row }) => row.getValue('paymentStatus'),
      enableSorting: true
    }
  ];

  return (
    <div className="mt-5">
      <TitleBar title="Student Fees Transaction" />
      <div className="w-full bg-white shadow-3xl rounded-2xl border mb-10">
        <div className="">
          <div className="border border-x-0 border-t-0  p-4 border-b-slate-200 flex items-center justify-between">
            <div>
              <p className="text-xl font-semibold">Student Details</p>
            </div>
            <div>
              <Button onClick={() => setIsFeeStructureModalOpen(true)}>View Fee Structure</Button>
            </div>
          </div>
          <div className="mb-4  p-4">
            <p>
              <span className="font-semibold text-slate-600">Student Name:</span>{' '}
              {students && students.studentDto ? (
                <>
                  {students.studentDto.firstName} {students.studentDto.lastName}
                </>
              ) : (
                'Student name loading...'
              )}
            </p>
            <p>
              <span className="font-semibold text-slate-600">Standard:</span>{' '}
              {students && students.standardDto ? students.standardDto.title : ''}
            </p>
            <p>
              <span className="font-semibold text-slate-600">Due Amount:</span> {totalDueAmount}
            </p>
            <p>
              <span className="font-semibold text-slate-600">Phone Number:</span>{' '}
              {students && students.studentDto ? students.studentDto.contactNumber : ''}
            </p>
            <p>
              <span className="font-semibold text-slate-600">Email:</span>{' '}
              {students && students.studentDto ? students.studentDto.email : ''}
            </p>
            <p>
              <span className="font-semibold text-slate-600">Father Name:</span>{' '}
              {students && students.studentDto ? students.studentDto.fatherName : ''}
            </p>
            <p>
              <span className="font-semibold text-slate-600">Mother Name:</span>{' '}
              {students && students.studentDto ? students.studentDto.motherName : ''}
            </p>
            <p>
              <span className="font-semibold text-slate-600">Parent Contact Number:</span>{' '}
              {students && students.studentDto ? students.studentDto.parentContactNumber : ''}
            </p>
          </div>
        </div>
      </div>
      <DataTable columns={columns} data={paymentDetails} />

      <Modal
        title="Fee Structure Details"
        description="Details of the fee structure components."
        modalSize="max-w-2xl"
        open={isFeeStructureModalOpen}
        onOpenChange={setIsFeeStructureModalOpen}
      >
        <div className="p-4 space-y-8">
          {feeStructure?.map((fee) => (
            <div key={fee.feeStructureId} className="mb-8">
              <p>
                <span className="font-bold">Total Amount:</span> {fee.totalAmount}
              </p>
              <p>
                <span className="font-bold">Due Date:</span>{' '}
                {moment(fee.dueDate).format('DD-MMMM-YYYY')}
              </p>
              <div className="mt-6">
                <div className="flex items-center mb-4 bg-gray-200 p-3 rounded-md shadow-sm">
                  <Layers className="w-6 h-6 mr-2 text-blue-500" />
                  <span className="font-bold text-xl">{fee.feeStructureName}</span>
                </div>
                <table className="w-full table-auto border-collapse border border-gray-300 mt-2">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">
                        Name
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">
                        Amount
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">
                        Due Amount
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">
                        Paid Amount
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {fee.feeComponents.map((component) => (
                      <tr
                        key={component.feeComponentId}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="border border-gray-300 px-4 py-2">
                          {component.feeComponentName}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">{component.amount}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          <span className="text-red-600">{component.dueAmount}</span>
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <span className="text-green-600">{component.paidAmount}</span>
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {component.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default SingleStudentFeesPaymentDetailes;

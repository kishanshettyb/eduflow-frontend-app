'use client';
import React, { useState } from 'react';
import { useGetStudentFeeStructure } from '@/services/queries/admin/feestructure';
import { Receipt } from 'lucide-react';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/modals/modal';
import { MakeFeePayment } from '@/components/forms/makeFeePaymentForm';
import TitleBar from '@/components/header/titleBar';

const FeeDetails = () => {
  const { schoolId, enrollmentId, academicYearId } = useSchoolContext();
  const [isDialogOpen, setDialogOpen] = useState(false);

  const getAllFeeStructure = useGetStudentFeeStructure(schoolId, enrollmentId, academicYearId);
  const feeStructure = getAllFeeStructure.data?.data;
  let totalDueAmount = 0;

  if (feeStructure) {
    feeStructure.forEach((feeStruct) => {
      feeStruct.feeComponents.forEach((feeComponent) => {
        totalDueAmount += feeComponent.dueAmount;
      });
    });
  }

  const handleModalClose = () => {
    setDialogOpen(false);
    setTimeout(() => {
      setDialogOpen(true);
    }, 600000);
  };

  return (
    <>
      <div className="bg-white p-4 flex flex-col min-h-screen dark:bg-slate-900">
        <TitleBar title="Fees-details" />
        <div className="mb-5 mt-2 bg-white border h-auto  shadow-lg rounded-2xl p-4 dark:bg-slate-900">
          {feeStructure?.map((item) => (
            <div key={item.feeStructureId} className="mb-4">
              <div className="bg-slate-100 border border-slate-200 p-2 rounded-2xl dark:bg-slate-900">
                <div className="bg-white p-2 mb-2 flex flex-row items-center justify-start rounded-xl border dark:bg-slate-900">
                  <Receipt size={20} />
                  <span className="text-lg font-semibold ml-3">
                    {item.feeStructureName} {item.feeStructureId}
                  </span>
                </div>
                <div>
                  <div className="flex flex-row flex-wrap justify-between p-2 w-full">
                    <div className="w-3/5 flex flex-row justify-start">
                      <span className="font-semibold">Fee</span>
                    </div>
                    <div className="w-1/5 flex flex-row justify-end">
                      <span className="font-semibold">Paid</span>
                    </div>
                    <div className="w-1/5 flex flex-row justify-end">
                      <span className="font-semibold">Due</span>
                    </div>
                  </div>
                  {item.feeComponents.map((component, index) => (
                    <div
                      key={component.feeComponentId}
                      className="flex border rounded border-slate-100 bg-white flex-row justify-between p-2 w-full dark:bg-slate-900"
                    >
                      <div className="w-3/5 flex flex-wrap flex-row justify-start">
                        <span>
                          {index + 1}. {component.feeComponentName} - ₹{component.amount}
                        </span>
                      </div>
                      <div className="w-1/5 flex flex-row justify-end">
                        <span>{component.paidAmount}</span>
                      </div>
                      <div className="w-1/5 flex flex-row justify-end">
                        <span className="text-red-600">{component.dueAmount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <div className="flex flex-row justify-between border  p-2 rounded-xl">
            <div>
              <span className="text-2xl font-bold">Total</span>
            </div>
            <div>
              <span className="text-2xl font-bold">{totalDueAmount}</span>
            </div>
          </div>
        </div>
        <Button
          onClick={() => {
            setDialogOpen(true);
          }}
        >
          <span className="font-semibold">Pay Now</span>
        </Button>
      </div>
      <Modal
        title="Make Fee Payment"
        description="Add the details for the fee below."
        modalSize="max-w-6xl"
        open={isDialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
        }}
      >
        <MakeFeePayment onClose={handleModalClose} enrollmentId={enrollmentId} />
      </Modal>
    </>
  );
};

export default FeeDetails;

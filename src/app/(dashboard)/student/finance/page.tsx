'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGetStudentFeeStructure } from '@/services/queries/admin/feestructure';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import TitleBar from '@/components/header/titleBar';
import PaymentHistory from '@/components/forms/PaymentHistory';
import { Button } from '@/components/ui/button';

const Fees = () => {
  const router = useRouter();
  const { schoolId, academicYearId, enrollmentId } = useSchoolContext();
  const getAllFeeStructure = useGetStudentFeeStructure(schoolId, enrollmentId, academicYearId);
  const [totalDueAmount, setTotalDueAmount] = useState<number>(0);

  useEffect(() => {
    if (getAllFeeStructure) {
      let totalDue = 0;
      getAllFeeStructure.data?.data.forEach((feeStruct) => {
        feeStruct.feeComponents.forEach((feeComponent) => {
          totalDue += feeComponent.dueAmount;
        });
      });
      setTotalDueAmount(totalDue);
    }
  }, [getAllFeeStructure]);

  return (
    <>
      <TitleBar title="Fee Payments" />
      <div className="flex flex-1 p-4 bg-slate-50 dark:bg-slate-900">
        <div className="w-full p-4 mb-5 bg-white shadow rounded-2xl dark:bg-slate-800">
          <div className="w-full">
            {getAllFeeStructure &&
              getAllFeeStructure.data?.data.map((feeStruct) => (
                <div
                  key={feeStruct.feeStructureId}
                  className="p-4 mb-4 bg-gray-100 rounded-lg shadow dark:bg-slate-900"
                >
                  <h3 className="mb-2 text-xl font-bold">{feeStruct.feeStructureName}</h3>
                  <p className="mb-1 text-sm">
                    Due Date: {new Date(feeStruct.dueDate).toLocaleDateString()}
                  </p>
                  <p className="mb-1 text-sm">Total Amount: ₹ {feeStruct.totalAmount}</p>
                  <div className="mt-2">
                    <h4 className="mb-2 text-lg font-semibold">Fee Components:</h4>
                    {feeStruct.feeComponents.map((feeComponent) => (
                      <div
                        key={feeComponent.feeComponentId}
                        className="mb-2 p-2 bg-white border rounded-md dark:bg-slate-900"
                      >
                        <p className="mb-1 font-medium">{feeComponent.feeComponentName}</p>
                        <p className="mb-1 text-sm">Description: {feeComponent.description}</p>
                        <p className="mb-1 text-sm">Amount: ₹ {feeComponent.amount}</p>
                        <p className="mb-1 text-sm">Due Amount: ₹ {feeComponent.dueAmount}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
          <div className="flex flex-col items-start mb-4">
            <p className="mb-1 text-xl font-semibold text-red-500">Total Due</p>
            <p className="text-3xl font-bold">₹ {totalDueAmount}/-</p>
          </div>
          {totalDueAmount !== 0 ? (
            <div className="w-full mb-4">
              <Button
                className="w-full"
                onClick={() => router.push('/student/finance/fees-details')}
              >
                <p className="font-semibold">Make Payment</p>
              </Button>
            </div>
          ) : (
            <div className="w-full mb-4">
              <Button onClick={() => router.push('/fee-structure')} className="w-full">
                <p className="font-semibold">Show Fee Structure</p>
              </Button>
            </div>
          )}
        </div>
      </div>
      <PaymentHistory />
    </>
  );
};

export default Fees;

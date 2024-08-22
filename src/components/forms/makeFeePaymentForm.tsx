'use client';
import React, { useEffect, useState } from 'react';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { useGetEnrollmentFeesPayment } from '@/services/queries/admin/feePayment';
import { FeesPayment } from '@/types/admin/feestuctureTypes';
import { DataTable } from '@/components/dataTable/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { FormProvider, useForm, SubmitHandler } from 'react-hook-form';
import { useCreateFeePayment, useUpdateOnlinePayment } from '@/services/mutation/admin/fee';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';

type UpdateOnlinePaymentPayload = {
  paymentId?: string;
  orderId?: string;
  signature?: string;
  status: string;
  feePaymentId: string;
  schoolId?: string;
  description?: string;
  source?: string;
  step?: string;
  reason?: string;
  code?: string;
};

type CreateAddFeePaymentProps = {
  enrollmentId?: number | null;
  onClose: () => void;
};

type FeePaymentFormData = {
  paymentMethod: string;
};

export const MakeFeePayment: React.FC<CreateAddFeePaymentProps> = ({ onClose, enrollmentId }) => {
  const { schoolId, academicYearId } = useSchoolContext();
  const router = useRouter();
  const [feePaymentData, setFeePaymentData] = useState<{ [key: number]: FeesPayment[] }>({});
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [payingAmounts, setPayingAmounts] = useState<{ [key: number]: number }>({});
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [, setFeeStructureId] = useState<number | null>(null);
  const [feeStructureNames, setFeeStructureNames] = useState<{ [key: number]: string }>({});
  const selectedValue = 'ONLINE';

  const [errorMessages, setErrorMessages] = useState<{ [key: string]: string }>({});

  const [isLoading, setIsLoading] = useState(false);
  const createFeePaymentMutation = useCreateFeePayment();
  const { data: addFeePaymentData } = useGetEnrollmentFeesPayment(
    schoolId,
    academicYearId,
    enrollmentId
  );
  const updateOnlinePayment = useUpdateOnlinePayment();

  useEffect(() => {
    if (addFeePaymentData && addFeePaymentData.data) {
      const transformedData = addFeePaymentData.data.reduce((acc, feePayment) => {
        const currentFeeStructureId = feePayment.feeStructureId;
        setFeeStructureId(currentFeeStructureId);
        setFeeStructureNames((prevNames) => ({
          ...prevNames,
          [currentFeeStructureId]: feePayment.feeStructureName
        }));

        acc[currentFeeStructureId] = feePayment.feeComponents.map((component) => ({
          feeComponentId: component.feeComponentId,
          feeComponentName: component.feeComponentName,
          amount: component.amount,
          dueAmount: component.dueAmount,
          paidAmount: component.paidAmount,
          feeStructureId: currentFeeStructureId
        }));

        return acc;
      }, {});
      setFeePaymentData(transformedData);
    }
  }, [addFeePaymentData]);

  useEffect(() => {
    const totalAmount = Object.values(payingAmounts).reduce((total, amount) => total + amount, 0);
    setTotalAmount(totalAmount);
  }, [payingAmounts]);

  useEffect(() => {
    if (createFeePaymentMutation.isSuccess) {
      onClose();
    }
  }, [createFeePaymentMutation.isSuccess, onClose]);

  const handleCheckboxChange = (feeComponentId: number, checked: boolean) => {
    setSelectedRows((prevSelectedRows) => {
      const updatedSelectedRows = new Set(prevSelectedRows);
      if (checked) {
        updatedSelectedRows.add(feeComponentId);
      } else {
        updatedSelectedRows.delete(feeComponentId);
        setPayingAmounts((prevAmounts) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [feeComponentId]: _, ...remainingAmounts } = prevAmounts;
          return remainingAmounts;
        });
      }
      return updatedSelectedRows;
    });
  };

  const onSubmit: SubmitHandler<FeePaymentFormData> = async () => {
    setIsLoading(true);

    const feePaymentDetails = Object.entries(feePaymentData).flatMap(
      ([feeStructureId, components]) =>
        components
          .filter((component) => selectedRows.has(component.feeComponentId))
          .map((component) => ({
            feeStructureId: Number(feeStructureId),
            feeComponentId: component.feeComponentId,
            paidFee: payingAmounts[component.feeComponentId] || 0,
            comment: 'Payment'
          }))
    );

    const totalAmountToPay = Object.values(payingAmounts).reduce(
      (total, amount) => total + amount,
      0
    );

    const payload = {
      schoolId: schoolId,
      enrollmentId: enrollmentId!,
      academicYearId: academicYearId!,
      paymentType: selectedValue,
      feePaymentDetails
    };

    const formData = new FormData();
    formData.append(
      'feePaymentDto',
      new Blob([JSON.stringify(payload)], {
        type: 'application/json'
      })
    );

    try {
      const response = await createFeePaymentMutation.mutateAsync(formData);
      const feePaymentId = response.data.feePaymentId;
      const schoolName = response.data.schoolName;
      const schoolId = response.data.schoolId;
      const onlinePaymentDto = response.data.onlinePaymentDto;

      if (selectedValue === 'ONLINE' && onlinePaymentDto && onlinePaymentDto.orderId) {
        const orderId = onlinePaymentDto.orderId;
        const keyId = onlinePaymentDto.keyId;
        openRazorpayModal(orderId, totalAmountToPay, feePaymentId, keyId, schoolName, schoolId);
        onClose();
      }

      setIsLoading(false);
      console.log(feePaymentId, 'feePaymentId from post');
    } catch (error) {
      setIsLoading(false);
      console.error('Error in onSubmit:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openRazorpayModal = async (
    orderId: string,
    amount: number,
    feePaymentId: string,
    keyId: string,
    schoolName: string,
    schoolId: string // Ensure schoolId is included
  ) => {
    // const router = useRouter();
    // const updateOnlinePayment = useUpdateOnlinePayment();

    const options = {
      key: keyId,
      amount: amount * 100,
      currency: 'INR',
      name: schoolName,
      description: 'Fee Payment',
      order_id: orderId,
      handler: async function (response: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      }) {
        try {
          const updatePayload: UpdateOnlinePaymentPayload = {
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
            status: 'Success',
            feePaymentId: feePaymentId,
            schoolId: schoolId
          };
          await updateOnlinePayment.mutateAsync(updatePayload);
          router.push('/student/finance');
        } catch (error) {
          console.error('Error updating payment status:', error);
        }
      },
      prefill: {
        name: 'Student Name',
        email: 'student@example.com',
        contact: '9999999999'
      },
      theme: {
        color: '#3399cc'
      }
    };

    const rzp1 = new Razorpay(options);
    rzp1.open();

    rzp1.on('payment.failed', async function (response) {
      const errorPayload: UpdateOnlinePaymentPayload = {
        status: 'Failed',
        feePaymentId: feePaymentId,
        schoolId: schoolId,
        description: response.error.description,
        source: response.error.source,
        step: response.error.step,
        reason: response.error.reason,
        orderId: response.error.metadata.order_id,
        paymentId: response.error.metadata.payment_id,
        code: response.error.code
      };

      try {
        await updateOnlinePayment.mutateAsync(errorPayload);
        // Optionally handle further UI updates or navigation
      } catch (error) {
        console.error('Error updating payment failure status:', error);
      }
    });
  };
  const handlePayingAmountChange = (feeComponentId: number, value: string, maxAmount: number) => {
    const numericValue = Number(value);
    if (isNaN(numericValue) || numericValue < 0 || numericValue > maxAmount) {
      setErrorMessages((prevErrors) => ({
        ...prevErrors,
        [feeComponentId]: 'Cannot enter amount more than due amount'
      }));
    } else {
      setErrorMessages((prevErrors) => ({
        ...prevErrors,
        [feeComponentId]: ''
      }));
      setPayingAmounts((prevAmounts) => ({
        ...prevAmounts,
        [feeComponentId]: numericValue
      }));
    }
  };

  const columns: ColumnDef<FeesPayment>[] = [
    {
      id: 'select',
      header: 'Select',
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={selectedRows.has(row.original.feeComponentId)}
          onChange={(e) => handleCheckboxChange(row.original.feeComponentId, e.target.checked)}
          className="form-checkbox"
        />
      ),
      enableSorting: false
    },
    {
      accessorKey: 'feeComponentName',
      header: 'Fee Component Name',
      cell: ({ row }) => row.getValue('feeComponentName'),
      enableSorting: true
    },
    {
      accessorKey: 'amount',
      header: 'Total Amount',
      cell: ({ row }) => row.getValue('amount'),
      enableSorting: true
    },
    {
      accessorKey: 'paidAmount',
      header: 'Paid Amount',
      cell: ({ row }) => <p className="text-green-600">{row.getValue('paidAmount')}</p>,
      enableSorting: true
    },
    {
      accessorKey: 'dueAmount',
      header: 'Due Amount',
      cell: ({ row }) => {
        const dueamount = row.getValue('dueAmount');
        return (
          <>
            {dueamount == '0' ? (
              <p>No Dues</p>
            ) : (
              <p className="text-red-600">{row.getValue('dueAmount')}</p>
            )}
          </>
        );
      },
      enableSorting: true
    },
    {
      id: 'payingAmount',
      header: 'Paying Amount',
      cell: ({ row }) => (
        <div>
          <input
            ref={(input) => input && input.focus()}
            type="text"
            value={payingAmounts[row.original.feeComponentId] || ''}
            onChange={(e) => {
              handlePayingAmountChange(
                row.original.feeComponentId,
                e.target.value,
                row.original.dueAmount
              );
            }}
            disabled={!selectedRows.has(row.original.feeComponentId)}
            className="border border-gray-300 rounded px-3 py-1 outline-none focus:border-blue-500"
          />
          {errorMessages[row.original.feeComponentId] && (
            <p className="text-red-600 mt-1">{errorMessages[row.original.feeComponentId]}</p>
          )}
        </div>
      ),
      enableSorting: false
    }
  ];
  const methods = useForm<FeePaymentFormData>();

  return (
    <FormProvider {...methods}>
      <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" />
      <form onSubmit={methods.handleSubmit(onSubmit)} encType="multipart/form-data">
        <div className="flex flex-col">
          <div className="overflow-x-auto">
            {Object.entries(feePaymentData).map(([feeStructureId, feeComponents]) => (
              <div key={feeStructureId}>
                <div className="mb-5 bg-slate-100 p-4 border-slate-400 rounded-2xl dark:bg-slate-900">
                  <h2 className="text-md  font-semibold mb-3">
                    {feeStructureNames[feeStructureId]}
                  </h2>
                  <DataTable
                    data={feeComponents}
                    columns={columns}
                    showSearchAndPagination={false}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="border  mb-5 p-4 bg-slate-100 border-slate-200 rounded-2xl shadow-3xl dark:bg-slate-900">
            <div className="flex justify-between items-center">
              <div className="flex justify-start flex-row items-center">
                <div>
                  <h2 className="text-2xl  font-semibold">Total Amount: </h2>
                </div>
                <div>
                  <h2 className=" text-2xl font-bold">{totalAmount}</h2>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button type="submit">Make Online Payment</Button>
          </div>
          {isLoading && (
            <div className="fixed top-0 left-0 w-full h-full bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
              <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          )}
        </div>
      </form>
    </FormProvider>
  );
};

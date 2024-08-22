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
import { CalendarIcon } from 'lucide-react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '../ui/calendar';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { chequePaymentSchema } from './schema/chequefeePaymentSchema';
import moment from 'moment';
import { useRouter } from 'next/navigation';

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

const formSchema = chequePaymentSchema;

export const CreateAddFeePayment: React.FC<CreateAddFeePaymentProps> = ({
  onClose,
  enrollmentId
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      chequeAmount: '',
      chequeDate: new Date(),
      chequeStatus: 'ISSUED',
      bankName: '',
      bankIFSCCode: '',
      accountHolderName: '',
      accountNumber: '',
      micrCode: '',
      attachment: undefined
    }
  });

  const { schoolId, academicYearId } = useSchoolContext();
  const router = useRouter();
  const [feePaymentData, setFeePaymentData] = useState<{ [key: number]: FeesPayment[] }>({});
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [payingAmounts, setPayingAmounts] = useState<{ [key: number]: number }>({});
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [selectedValue, setSelectedValue] = useState('');
  const [, setFeeStructureId] = useState<number | null>(null);
  const [feeStructureNames, setFeeStructureNames] = useState<{ [key: number]: string }>({});
  const [showChequeFields, setShowChequeFields] = useState(false);
  const [attachmentFileName, setAttachmentFileName] = useState<string | null>(null);
  const [errorMessages, setErrorMessages] = useState<{ [key: string]: string }>({});

  const [, setIsLoading] = useState(false);
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

  const isPaymentButtonEnabled = () => {
    return Array.from(selectedRows).some((feeComponentId) => {
      const amount = payingAmounts[feeComponentId];
      return amount && amount > 0;
    });
  };

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

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedValue(value);
    setShowChequeFields(value === 'CHEQUE');
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

    let payload: unknown;

    if (selectedValue === 'CHEQUE') {
      const chequeDetailsDto = {
        schoolId: schoolId,
        chequeAmount: form.getValues('chequeAmount'),
        chequeDate: moment(form.getValues('chequeDate')).format('YYYY-MM-DD'),
        chequeStatus: form.getValues('chequeStatus'),
        bankName: form.getValues('bankName'),
        bankIFSCCode: form.getValues('bankIFSCCode'),
        accountHolderName: form.getValues('accountHolderName'),
        accountNumber: form.getValues('accountNumber'),
        micrCode: form.getValues('micrCode'),
        chequeNumber: form.getValues('chequeNumber')
      };

      payload = {
        schoolId: schoolId,
        enrollmentId: enrollmentId!,
        academicYearId: academicYearId!,
        paymentType: selectedValue,
        feePaymentDetails,
        chequeDetailsDto
      };
    } else {
      payload = {
        schoolId: schoolId,
        enrollmentId: enrollmentId!,
        academicYearId: academicYearId!,
        paymentType: selectedValue,
        feePaymentDetails
      };
    }

    const formData = new FormData();
    formData.append(
      'feePaymentDto',
      new Blob([JSON.stringify(payload)], {
        type: 'application/json'
      })
    );

    if (selectedValue === 'CHEQUE' && form.getValues('attachment')) {
      formData.append('file', form.getValues('attachment') as Blob);
    }

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
      } else if (selectedValue === 'CASH' || selectedValue === 'CHEQUE') {
        onClose();
        console.log('Payment details submitted successfully.');
        router.push(`/admin/finance/fee-payments/thankyou-page?feePaymentId=${feePaymentId}`);
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

  // const useUpdateOnlinePayment = () => {
  //   return useMutation((payload: UpdateOnlinePaymentPayload) => updateOnlinePayment(payload));
  // };

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
          router.push(`/admin/finance/fee-payments/thankyou-page?feePaymentId=${feePaymentId}`);
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
                <div className="mb-5 bg-slate-100 p-4 border-slate-400 rounded-2xl">
                  <h2 className="text-md text-slate-700 font-semibold mb-3">
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
          <div className="border  mb-5 p-4 bg-slate-100 border-slate-200 rounded-2xl shadow-3xl">
            <div className="flex justify-between items-center">
              <div className="flex justify-start flex-row items-center">
                <div>
                  <h2 className="text-2xl  text-slate-800 font-semibold">Total Amount: </h2>
                </div>
                <div>
                  <h2 className=" text-2xl text-slate-800  font-bold">{totalAmount}</h2>
                </div>
              </div>

              <div className="flex justify-start flex-col">
                <div className="mb-2">
                  <label htmlFor="paymentMethod">Payment Method</label>
                </div>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  onChange={handleSelectChange}
                  value={selectedValue}
                  className="w-[300px] p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="" disabled>
                    Select Payment Method
                  </option>
                  <option value="ONLINE">Online</option>
                  <option value="CASH">Cash</option>
                  <option value="CHEQUE">Cheque</option>
                </select>
              </div>
            </div>
          </div>
          {showChequeFields && (
            <>
              <div className="border border-slate-200 rounded-2xl p-4">
                <div className="w-100 mb-3">
                  <h2 className="mb-3 uppercase text-slate-400 text-sm">Cheque Details:</h2>
                </div>
                <div className="border border-dashed border-slate-200 p-4 rounded-2xl bg-slate-100 mb-5">
                  <FormField
                    control={form.control}
                    name="attachment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Upload Cheque image here</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <Input
                              type="file"
                              accept=".pdf, .jpg, .jpeg, .png"
                              onChange={(e) => {
                                const file = e.target.files ? e.target.files[0] : null;
                                field.onChange(file);
                                setAttachmentFileName(file ? file.name : null);
                              }}
                            />
                            {attachmentFileName && (
                              <span className="ml-2 text-sm">{attachmentFileName}</span>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <div className="mb-5 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <FormField
                        control={form.control}
                        name="chequeAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Cheque Amount<span className="text-red-600">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Cheque Amount"
                                {...field}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/[^0-9]/g, '');
                                  field.onChange(value);
                                }}
                                onBlur={() => {
                                  const chequeAmount = parseFloat(field.value || '0');
                                  if (chequeAmount < totalAmount) {
                                    alert(`Cheque amount cannot be less than ${totalAmount}.`);
                                    form.setValue('chequeAmount', totalAmount.toString());
                                  }
                                }}
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div>
                      <FormField
                        control={form.control}
                        name="chequeNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Cheque Number<span className="text-red-600">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Cheque Number"
                                {...field}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
                                  field.onChange(value);
                                }}
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <FormField
                        control={form.control}
                        name="chequeDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Cheque Date<span className="text-red-600">*</span>
                            </FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => field.onChange(new Date())}
                                  >
                                    {field.value
                                      ? moment(field.value).format('DD/MM/YYYY')
                                      : 'Pick a date'}
                                    <CalendarIcon className="ml-2 h-4 w-4" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={(date) => field.onChange(date)}
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <FormField
                        control={form.control}
                        name="chequeStatus"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Cheque Status<span className="text-red-600">*</span>
                            </FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={(value) => field.onChange(value)}
                                defaultValue={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="ISSUED">Issued</SelectItem>
                                  <SelectItem value="CLEARED">Cleared</SelectItem>
                                  <SelectItem value="RETURNED">Returned</SelectItem>
                                  <SelectItem value="STOPPED">Stopped</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div className="mb-5 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <FormField
                        control={form.control}
                        name="bankName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Bank Name<span className="text-red-600">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Bank Name" {...field} />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <FormField
                        control={form.control}
                        name="bankIFSCCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Bank IFSC<span className="text-red-600">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Bank IFSC"
                                {...field}
                                onChange={(e) => {
                                  const value = e.target.value
                                    .toUpperCase()
                                    .replace(/[^A-Z0-9]/g, '');
                                  if (value.length <= 11) {
                                    field.onChange(value);
                                  }
                                }}
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div>
                      <FormField
                        control={form.control}
                        name="accountHolderName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Account Holder Name<span className="text-red-600">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Account Holder Name" {...field} />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <FormField
                        control={form.control}
                        name="accountNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Account Number<span className="text-red-600">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Account Number"
                                {...field}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 16);
                                  field.onChange(value);
                                }}
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div>
                      <FormField
                        control={form.control}
                        name="micrCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              MICR Code<span className="text-red-600">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="MICR Code"
                                {...field}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 9);
                                  field.onChange(value);
                                }}
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              className={`px-4 py-2 rounded ${
                isPaymentButtonEnabled()
                  ? 'bg-slate-900 text-white hover:bg-slate-800 cursor-pointer'
                  : 'bg-gray-400 text-gray-700 cursor-not-allowed'
              }`}
              disabled={!isPaymentButtonEnabled()}
            >
              Make{' '}
              {selectedValue === 'ONLINE' ? (
                <span>an Online</span>
              ) : (
                <span className="lowercase">{selectedValue}</span>
              )}{' '}
              Payment
            </button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

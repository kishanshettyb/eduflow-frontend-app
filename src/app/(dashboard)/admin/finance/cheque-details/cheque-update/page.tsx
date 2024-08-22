'use client';
import React, { useState } from 'react';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { chequePaymentSchemaa } from '@/components/forms/schema/chequefeePaymentSchema';
import moment from 'moment';
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
import { Calendar } from '@/components/ui/calendar';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetUpdateChequeDetailes } from '@/services/queries/admin/feePayment';
import { useSearchParams } from 'next/navigation';
import { useUpdateChequePayment } from '@/services/mutation/admin/fee';
import { useRouter } from 'next/navigation';
import { useViewAttachment } from '@/services/queries/attachment/attachment';
import TitleBar from '@/components/header/titleBar';

type ChequeFormData = z.infer<typeof chequePaymentSchemaa>;

const ChequeUpdate: React.FC = () => {
  const form = useForm<ChequeFormData>({
    resolver: zodResolver(chequePaymentSchemaa),
    defaultValues: {
      chequeAmount: '',
      chequeDate: new Date(),
      chequeStatus: '',
      bankName: '',
      bankIFSCCode: '',
      accountHolderName: '',
      accountNumber: '',
      chequeDetailsId: '',
      micrCode: '',
      attachment: undefined
    }
  });
  const { schoolId, academicYearId } = useSchoolContext();
  const searchParams = useSearchParams();
  const router = useRouter();
  const feePaymentId = searchParams?.get('feePaymentId');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachmentId, setAttachmentId] = useState<string | null>(null);

  const { data: UpdateChequeDetailesData } = useGetUpdateChequeDetailes(schoolId, feePaymentId);
  const { data: viewAttachment } = useViewAttachment(schoolId, attachmentId);
  console.log(viewAttachment, 'viewAttachment');

  const updateChequePayment = useUpdateChequePayment();
  console.log(UpdateChequeDetailesData, 'UpdateChequeDetailesData');
  React.useEffect(() => {
    if (UpdateChequeDetailesData) {
      setAttachmentId(
        UpdateChequeDetailesData?.data.chequeDetailsDto?.attachmentDto?.attachmentId ?? null
      );
      form.reset({
        chequeAmount: String(UpdateChequeDetailesData?.data.chequeDetailsDto?.chequeAmount ?? ''),
        chequeNumber: UpdateChequeDetailesData?.data.chequeDetailsDto?.chequeNumber ?? '',
        chequeDate: moment(UpdateChequeDetailesData?.data.chequeDetailsDto?.chequeDate).toDate(),
        chequeStatus: UpdateChequeDetailesData?.data.chequeDetailsDto?.chequeStatus ?? '',
        bankName: UpdateChequeDetailesData?.data.chequeDetailsDto?.bankName ?? '',
        bankIFSCCode: UpdateChequeDetailesData?.data.chequeDetailsDto?.bankIFSCCode ?? '',
        accountHolderName: UpdateChequeDetailesData?.data.chequeDetailsDto?.accountHolderName ?? '',
        accountNumber: String(UpdateChequeDetailesData?.data.chequeDetailsDto?.accountNumber ?? ''),
        micrCode: UpdateChequeDetailesData?.data.chequeDetailsDto?.micrCode ?? '',
        chequeDetailsId: UpdateChequeDetailesData?.data.chequeDetailsDto?.chequeDetailsId ?? '',
        attachment: null
      });
    }
  }, [UpdateChequeDetailesData]);

  const onSubmit: SubmitHandler<ChequeFormData> = async (data) => {
    try {
      setIsSubmitting(true);
      const payload = {
        schoolId: schoolId,
        academicYearId: academicYearId,
        feePaymentId: feePaymentId!,
        chequeDetailsId: data.chequeDetailsId,
        chequeStatus: data.chequeStatus
      };

      const formData = new FormData();
      formData.append(
        'chequeDetailsDto',
        new Blob([JSON.stringify(payload)], {
          type: 'application/json'
        })
      );

      if (data.attachment) {
        formData.append('attachment', data.attachment);
      }

      await updateChequePayment.mutateAsync(formData);
      console.log('Cheque payment updated successfully');
      router.push('/admin/fees/fee-history');
    } catch (error) {
      console.error('Failed to update cheque payment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewAttachment = () => {
    if (viewAttachment) {
      console.log(viewAttachment);
      window.open(viewAttachment, '_blank');
    }
  };

  return (
    <>
      <TitleBar title="Cheque Update" />

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} encType="multipart/form-data">
          <div className="border border-slate-200 rounded-2xl p-4">
            <h2 className="mb-3 uppercase text-slate-400 text-sm">Cheque Details:</h2>
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
                          <Input placeholder="Cheque Amount" {...field} readOnly />
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
                          <Input placeholder="Cheque Number" {...field} readOnly />
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
                              <Button variant="outline" className="w-full justify-start" disabled>
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
                            onValueChange={field.onChange}
                            value={field.value}
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
                          <Input placeholder="Bank Name" {...field} readOnly />
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
                          Bank IFSC Code<span className="text-red-600">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Bank IFSC Code" {...field} readOnly />
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
                          <Input placeholder="Account Holder Name" {...field} readOnly />
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
                          <Input placeholder="Account Number" {...field} readOnly />
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
                          <Input placeholder="MICR Code" {...field} readOnly />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end mr-6 space-x-4 -mt-4">
              <Button type="button" onClick={handleViewAttachment}>
                View Attachment
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update'}
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default ChequeUpdate;

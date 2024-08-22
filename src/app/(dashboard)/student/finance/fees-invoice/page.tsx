'use client';
import moment from 'moment';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { useGetFeesPaymentDetails } from '@/services/queries/admin/feePayment';
import { useRouter, useSearchParams } from 'next/navigation';
import DownloadInvoiceFile from '@/components/download/DownloadInvoice';
import TitleBar from '@/components/header/titleBar';

const DownloadInvoice = () => {
  const router = useRouter();
  const search = useSearchParams();
  const id = search?.get('id');
  const name = search?.get('name');
  const { schoolId } = useSchoolContext();
  const { data: paymentDetails } = useGetFeesPaymentDetails(schoolId, id as string);
  const details = paymentDetails?.data;

  const handleViewDetails = () => {
    if (details) {
      router.push(`/cheque-details/${details.feePaymentId}`);
    }
  };

  return (
    <div>
      <TitleBar title="Fees-invoice" />
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg dark:bg-slate-900">
        <h2 className="text-2xl font-semibold mb-4">Invoice Details</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex">
            <span>Date:</span>
            <span className="font-semibold">
              {moment(details?.createdTime).format('DD-MMMM-YYYY')}
            </span>
          </div>
          <div className="flex justify-end">
            <span>Invoice No:</span>
            <span className="font-semibold">{details?.invoiceId}</span>
          </div>
        </div>
        <div className="border rounded-lg border-gray-300 p-4 mb-4">
          <div className="flex justify-between border-b pb-2 mb-2">
            <span>Paid:</span>
            <span className="font-semibold">{details?.paidFee}</span>
          </div>
          <div className="flex justify-between border-b pb-2 mb-2">
            <span>Status:</span>
            <span
              className={`font-semibold ${details?.paymentStatus == null ? 'text-red-600' : 'text-green-600'}`}
            >
              {details?.paymentStatus == null ? 'Failed' : details?.paymentStatus}
            </span>
          </div>
          <div className="flex justify-between items-center border-b pb-2 mb-2">
            <span>Payment Mode:</span>
            <span className="font-semibold">{details?.paymentType}</span>
            {details?.paymentType === 'CHEQUE' && (
              <>
                <span className="text-xs text-blue-500 capitalize">
                  ({details?.chequeDetailsDto.chequeStatus})
                </span>
                <button
                  onClick={handleViewDetails}
                  className="ml-2 bg-blue-200 p-1 px-2 rounded-lg text-blue-600 text-xs"
                >
                  View Details
                </button>
              </>
            )}
          </div>
          <div className="flex flex-col">
            <span>Items:</span>
            <div className="mt-2">
              <div className="grid grid-cols-3 border-b border-gray-300 py-2">
                <span className="font-semibold">SL</span>
                <span className="font-semibold">Item</span>
                <span className="font-semibold">Amount</span>
              </div>
              {details?.feePaymentDetails.map((item, index) => (
                <div className="grid grid-cols-3 border-b border-gray-300 py-2" key={index}>
                  <span>{index + 1}</span>
                  <span>{item.feeComponentDto.feeComponentName}</span>
                  <span>{item.paidFee}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {details?.paymentStatus == null ? null : (
          <DownloadInvoiceFile fileName={name as string} feePaymentId={id as string} />
        )}
      </div>
    </div>
  );
};

export default DownloadInvoice;

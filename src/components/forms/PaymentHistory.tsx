import React, { useEffect, useState } from 'react';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { useGetSingleStudentFeesPaymentDetails } from '@/services/queries/admin/feestructure';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { CircleEllipsis, Download, EllipsisVertical } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/dataTable/DataTable';
import { FeesPayment } from '@/types/admin/feestuctureTypes';
import { useGetPDFFeesPaymentDetailes } from '@/services/queries/admin/feePayment';

const PaymentHistory = () => {
  const router = useRouter();
  const { schoolId, academicYearId, enrollmentId } = useSchoolContext();
  const [selectedFeePaymentId, setSelectedFeePaymentId] = useState<number | null>(null);
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [, setTotalPages] = useState(0);
  const pageSize = 9;
  const [paymentHistorys, setPaymentHistory] = useState<FeesPayment[]>([]);

  const getAllPaymentHistory = useGetSingleStudentFeesPaymentDetails(
    schoolId,
    academicYearId,
    enrollmentId
  );
  const paymentHistory = getAllPaymentHistory;
  console.log(paymentHistorys, 'paymentHistory');
  useEffect(() => {
    setLoading(true);
    if (paymentHistory && paymentHistory.data) {
      const history = paymentHistory.data?.data || [];
      setPaymentHistory(history);
      setTotalPages(Math.ceil(paymentHistory.data.totalElements / pageSize));
    } else {
      setPaymentHistory([]);
      setTotalPages(0);
    }
    setLoading(false);
  }, [paymentHistory]);

  const { data: pdfBlob, refetch: fetchPDF } = useGetPDFFeesPaymentDetailes(
    schoolId,
    selectedFeePaymentId,
    academicYearId,
    Number(selectedEnrollmentId)
  );

  if (getAllPaymentHistory.isError) {
    return (
      <div className="bg-white p-4 shadow rounded-2xl dark:bg-slate-900">
        <div className="py-4 flex flex-row bg-slate-50 px-2 rounded justify-between border-b border-b-slate-200 dark:bg-slate-900">
          <div>
            <p className="font-semibold">Date</p>
          </div>
          <div>
            <p className="font-semibold">Payment Mode</p>
          </div>
          <div>
            <p className="font-semibold">Paid Amount</p>
          </div>
        </div>
        <div className="flex items-center justify-center p-4">
          <p>Sorry, no payment history found.</p>
        </div>
      </div>
    );
  }

  const handleDownloadPDF = async (feePaymentId: number, enrollmentId: number) => {
    try {
      setSelectedFeePaymentId(feePaymentId);
      setSelectedEnrollmentId(enrollmentId);

      await fetchPDF();
      if (pdfBlob) {
        const url = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Receipt.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        console.error('PDF Blob is null.');
      }
    } catch (error) {
      console.error('PDF download failed:', error);
    }
  };

  const columns: ColumnDef<FeesPayment>[] = [
    {
      accessorKey: 'invoiceId',
      header: 'Invoice ID',
      cell: ({ row }) => row.getValue('invoiceId'),
      enableSorting: true
    },
    {
      accessorKey: 'feePaymentId',
      header: 'Payment Id',
      cell: ({ row }) => (
        <HoverCard>
          <HoverCardTrigger>
            <div className="p-1 cursor-pointer border rounded-sm truncate w-[100px]">
              {row.getValue('feePaymentId')}
            </div>
          </HoverCardTrigger>
          <HoverCardContent>{row.getValue('feePaymentId')}</HoverCardContent>
        </HoverCard>
      ),
      enableSorting: false
    },
    {
      accessorKey: 'createdTime',
      header: 'Paid Date',
      cell: ({ row }) => {
        const createdTime = new Date(row.original.createdTime);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return createdTime.toLocaleDateString('en-US', options);
      },
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
      cell: ({ row }) => <span className="text-green-500">{row.getValue('paidFee')}</span>,
      enableSorting: true
    },
    {
      accessorKey: 'paymentStatus',
      header: 'Payment Status',
      cell: ({ row }) => {
        const status = row.getValue('paymentStatus');
        return (
          <div
            className={`w-[100px] flex justify-center items-center rounded-lg px-2 py-1   border text-xs ${status == 'FAILED' ? 'text-red-600 border-red-500 bg-red-100' : 'text-green-600 border-green-500 bg-green-100'} capitalize`}
          >
            {status}
          </div>
        );
      },
      enableSorting: true
    },
    {
      accessorKey: 'paymentType',
      header: 'Payment Type',
      cell: ({ row }) => row.getValue('paymentType'),
      enableSorting: true
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const paymentStatus = row.getValue('paymentStatus');

        // Retrieve enrollmentId from local storage
        const enrollmentId = localStorage.getItem('enrollmentId') || row.original.enrollmentId;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline">
                <EllipsisVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() =>
                  router.push(
                    `/student/finance/cheque-details/fees-details?enrollmentId=${enrollmentId}`
                  )
                }
              >
                <CircleEllipsis className="w-4 h-4 mr-2" />
                More Details
              </DropdownMenuItem>

              {paymentStatus !== 'FAILED' && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleDownloadPDF(row.original.feePaymentId, enrollmentId)}
                  >
                    <Download className="w-4 h-4 mr-2" /> Download Receipt
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    }

    // {
    //   accessorKey: 'actions',
    //   header: 'Actions',
    //   cell: ({ row }) => {
    //     const paymentStatus = row.getValue('paymentStatus');
    //     const enrollmentId = row.original.enrollmentId;
    //     return (
    //       <DropdownMenu>
    //         <DropdownMenuTrigger>
    //           <Button variant="outline">
    //             <EllipsisVertical className="w-4 h-4" />
    //           </Button>
    //         </DropdownMenuTrigger>
    //         <DropdownMenuContent>
    //           <DropdownMenuItem
    //             onClick={() =>
    //               router.push(
    //                 `/student/finance/cheque-details/fees-details?enrollmentId=${row.original.enrollmentId}`
    //               )
    //             }>
    //             <CircleEllipsis className="w-4 h-4 mr-2" />
    //             More Details
    //           </DropdownMenuItem>

    //           {paymentStatus !== 'FAILED' && (
    //             <>
    //               <DropdownMenuSeparator />
    //               <DropdownMenuItem
    //                 onClick={() =>
    //                   handleDownloadPDF(row.original.feePaymentId, row.original.enrollmentId)
    //                 }>
    //                 <Download className="w-4 h-4 mr-2" /> Download Receipt
    //               </DropdownMenuItem>
    //             </>
    //           )}
    //         </DropdownMenuContent>
    //       </DropdownMenu>
    //     );
    //   }
    // }
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Payment History</h2>
      <DataTable columns={columns} data={paymentHistorys} loading={loading} />
    </div>
  );
};

export default PaymentHistory;

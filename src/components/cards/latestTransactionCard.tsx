import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '../dataTable/DataTable';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { CircleEllipsis, Download, EllipsisVertical, RefreshCcw } from 'lucide-react';
import { FeesPayment } from '@/types/admin/feestuctureTypes';
import { useGetAllPaymentHistory } from '@/services/queries/admin/feePayment';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { useRouter } from 'next/navigation';
import moment from 'moment';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

function LatestTransactionCard() {
  const router = useRouter();
  const { schoolId } = useSchoolContext();
  const [paymentHistory, setPaymentHistory] = useState<FeesPayment[]>([]);
  const payload = {
    page: 0,
    size: 5,
    sortOrder: 'asc',
    filterCriteria: [
      {
        operation: 'like',
        column: {
          school: {
            schoolId: schoolId
          }
        }
      }
    ]
  };
  const { data: paymentHistoryData, isSuccess } = useGetAllPaymentHistory(schoolId, payload);

  useEffect(() => {
    if (isSuccess && paymentHistoryData?.data?.content) {
      const history = paymentHistoryData.data.content;
      if (JSON.stringify(history) !== JSON.stringify(paymentHistory)) {
        setPaymentHistory(history);
      }
    }
  }, [isSuccess, paymentHistoryData, paymentHistory]);

  const columns = [
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
      cell: ({ row }) => <div>{moment(row.getValue('createdTime')).format('DD MMM YYYY')}</div>,
      enableSorting: true
    },
    {
      accessorKey: 'studentName',
      header: 'Student Name',
      cell: ({ row }) => row.getValue('studentName'),
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
                    `/admin/finance/cheque-details/fees-details?enrollmentId=${row.original.enrollmentId}`
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
                    onClick={() =>
                      handleDownloadPDF(row.original.feePaymentId, row.original.enrollmentId)
                    }
                  >
                    <Download className="w-4 h-4 mr-2" /> Download Receipt
                  </DropdownMenuItem>
                </>
              )}
              {row.getValue('paymentType') === 'CHEQUE' && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() =>
                      router.push(
                        `/admin/finance/cheque-details/cheque-update?feePaymentId=${row.original.feePaymentId}`
                      )
                    }
                  >
                    <RefreshCcw className="w-4 h-4 mr-2" /> Update
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableSorting: false
    }
  ];

  return (
    <>
      {paymentHistory.length !== 0 ? (
        <div className="">
          <h2 className="mb-2 text-xl text-slate-700 font-semibold dark:text-slate-400">
            Latest Transactions
          </h2>
          <DataTable
            columns={columns}
            data={paymentHistory}
            exportData={true}
            exportDataName="transaction-history"
            dataColumns={true}
          />
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
}

export default LatestTransactionCard;

'use client';
import CustomPagination from '@/components/pagination/custompagination';
import React, { useCallback, useEffect, useState } from 'react';
import TitleBar from '@/components/header/titleBar';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/dataTable/DataTable';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { CircleEllipsis, Download, EllipsisVertical, RefreshCcw } from 'lucide-react';
import { FeesPayment } from '@/types/admin/feestuctureTypes';
import { Modal } from '@/components/modals/modal';
import {
  useGetAllPaymentHistory,
  useGetPDFFeesPaymentDetailes
} from '@/services/queries/admin/feePayment';
import { useGetPolicyRules } from '@/services/queries/policyRules/policyRules';
import { useRouter } from 'next/navigation';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

function PaymentHistory() {
  const router = useRouter();
  const { schoolId, academicYearId } = useSchoolContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [overallSortOrder, setOverallSortOrder] = useState<'asc' | 'desc'>('asc');
  const [paymentHistory, setPaymentHistory] = useState<FeesPayment[]>([]);
  const [selectedFeePaymentId, setSelectedFeePaymentId] = useState<number | null>(null);
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDescription] = useState('');
  const [paymentTypeFilter, setPaymentTypeFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 9;
  const [, setPaymentHistoryActions] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    const storedRoles = JSON.parse(localStorage.getItem('roles') || '[]');
    const formattedRoles = storedRoles
      .map((role: string) => role.replace('ROLE_', ''))
      .filter((role: string) => role !== 'USER');
    setRoles(formattedRoles);
  }, []);

  const policyRulesActionData = useGetPolicyRules(schoolId, roles);

  useEffect(() => {
    if (policyRulesActionData) {
      const rules = policyRulesActionData.data || [];

      // Filter for announcement resource
      const paymentHistoryRules = rules.find((rule: unknown) => rule.resource === 'cheque-details');
      if (paymentHistoryRules) {
        console.log('Matching resource:', paymentHistoryRules.resource);
        setPaymentHistoryActions(paymentHistoryRules.actions);
      }
    }
  }, [policyRulesActionData]);

  const { data: pdfBlob, refetch: fetchPDF } = useGetPDFFeesPaymentDetailes(
    schoolId,
    selectedFeePaymentId,
    academicYearId,
    Number(selectedEnrollmentId)
  );

  const constructPayload = useCallback(() => {
    const filterCriteria = [
      ...(searchTerm ? [{ operation: 'like', column: { studentName: searchTerm } }] : []),
      ...(paymentTypeFilter && paymentTypeFilter !== 'all'
        ? [{ operation: 'like', column: { paymentType: paymentTypeFilter } }]
        : []),
      {
        operation: 'equals',
        column: {
          academicYear: {
            academicYearId: academicYearId
          }
        }
      }
    ];

    return {
      page: currentPage - 1,
      size: pageSize,
      sortCriteria: [{ createdTime: overallSortOrder === 'asc' ? 'asc' : 'desc' }],
      filterCriteria: filterCriteria
    };
  }, [searchTerm, paymentTypeFilter, currentPage, overallSortOrder, academicYearId]);

  const { data: paymentHistoryData } = useGetAllPaymentHistory(schoolId, constructPayload());

  useEffect(() => {
    setLoading(true);
    if (paymentHistoryData && paymentHistoryData.data) {
      const history = paymentHistoryData.data.content || [];
      setPaymentHistory(history);
      setTotalPages(Math.ceil(paymentHistoryData.data.totalElements / pageSize));
    } else {
      setPaymentHistory([]);
      setTotalPages(0);
    }
    setLoading(false);
  }, [paymentHistoryData]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleSort = (sortOrder: 'asc' | 'desc') => {
    setOverallSortOrder(sortOrder);
  };

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

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
      }
    }
  ];

  return (
    <>
      <TitleBar
        title="Payment History"
        onSearch={handleSearch}
        placeholder="Search By Student Name"
        onSort={handleSort}
        search={true}
        sort={true}
      />
      <div className="p-4">
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="border border-gray-300 p-2 rounded-md"
          />
          <Select
            value={paymentTypeFilter || 'all'}
            onValueChange={(value) => setPaymentTypeFilter(value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Payment Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Card">Card</SelectItem>
                <SelectItem value="Cheque">Cheque</SelectItem>
                <SelectItem value="Online">Online</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <DataTable columns={columns} data={paymentHistory} loading={loading} />
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
      <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <div className="p-4">{modalDescription}</div>
      </Modal>
    </>
  );
}

export default PaymentHistory;

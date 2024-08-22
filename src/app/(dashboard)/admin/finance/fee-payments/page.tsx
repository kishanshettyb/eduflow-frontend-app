'use client';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { useGetAllStandards, useSectionByStandard } from '@/services/queries/admin/standard';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import 'react-day-picker/dist/style.css';
import { useGetAllAssignedFeePayment } from '@/services/queries/admin/feePayment';
import { DataTable } from '@/components/dataTable/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { FeesPayment } from '@/types/admin/feestuctureTypes';
import { examSchema } from '@/components/forms/schema/examSchema';
import TitleBar from '@/components/header/titleBar';
import { Modal } from '@/components/modals/modal';
import { CreateAddFeePayment } from '@/components/forms/createAddFeePayment';
import { useGetPolicyRules } from '@/services/queries/policyRules/policyRules';

function FeePayment() {
  const { schoolId, academicYearId } = useSchoolContext();
  const [selectedStandard, setSelectedStandard] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [feePaymentData, setFeePaymentData] = useState<FeesPayment[]>([]);
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState<number | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const { data: standardsData, refetch: refetchStandards } = useGetAllStandards(
    schoolId,
    academicYearId
  );
  const { data: sectionsData, refetch: refetchSections } = useSectionByStandard(
    schoolId,
    academicYearId,
    selectedStandard
  );

  const { data: assignedFeePaymentData } = useGetAllAssignedFeePayment(
    schoolId,
    academicYearId,
    selectedStandard ? [selectedStandard] : [],
    selectedSection ? [selectedSection] : []
  );

  const [feePaymentsActions, setFeePaymentActions] = useState<string[]>([]);
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
      const feePaymentsRules = rules.find((rule: unknown) => rule.resource === 'fee-payments');
      if (feePaymentsRules) {
        console.log('Matching resource:', feePaymentsRules.resource);
        setFeePaymentActions(feePaymentsRules.actions);
      }
    }
  }, [policyRulesActionData]);

  useEffect(() => {
    if (assignedFeePaymentData && assignedFeePaymentData.data) {
      setFeePaymentData(assignedFeePaymentData.data);
    }
  }, [assignedFeePaymentData]);

  const formSchema = examSchema.extend({
    startTime: z.string().nonempty('Start Time is required'),
    endTime: z.string().optional()
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      standards: '',
      sections: ''
    }
  });

  useEffect(() => {
    refetchStandards();
  }, [academicYearId, refetchStandards]);

  useEffect(() => {
    refetchSections();
  }, [selectedStandard, academicYearId, refetchSections]);

  useEffect(() => {
    form.setValue('sections', '');
    setSelectedSection('');
  }, [selectedStandard, form]);

  const columns: ColumnDef<FeesPayment>[] = [
    {
      accessorKey: 'title',
      header: 'Standard',
      cell: ({ row }) => row.getValue('title'),
      enableSorting: true
    },
    {
      accessorKey: 'firstName',
      header: 'Student Name',
      cell: ({ row }) => {
        const firstName = row.getValue('firstName');
        const lastName = row.original.lastName;
        return `${firstName} ${lastName}`;
      },
      enableSorting: true
    },
    {
      accessorKey: 'totalAmount',
      header: 'Total Amount',
      cell: ({ row }) => row.getValue('totalAmount'),
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
      accessorKey: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        const enrollment = row.original;

        const due = row.getValue('dueAmount');

        return (
          <div className="flex justify-center items-center gap-x-4">
            {due == '0' ? (
              <Button variant="ghost" disabled>
                No dues
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="px-4 py-2 border rounded bg-slate-900 text-white hover:bg-slate-800 hover:text-white"
                onClick={() => {
                  setSelectedEnrollmentId(enrollment.enrollmentId);
                  setDialogOpen(true);
                }}
              >
                Pay Now
              </Button>
            )}

            {/* <Button variant="outline" size="sm">
              View Details
            </Button> */}
          </div>
        );
      }
    }
  ];

  const handleModalClose = () => {
    setDialogOpen(false);
    setTimeout(() => {
      setDialogOpen(true);
    }, 600000);
  };

  return (
    <>
      <div className="mt-5">
        <TitleBar title="Fee Payment" />
      </div>
      <div className="w-full p-4 border rounded-2xl bg-white shadow-3xl mb-5">
        <Form {...form}>
          <form>
            <div className="mb-5 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <FormField
                  control={form.control}
                  name="standards"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Standard<span className="text-red-600">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedStandard(value);
                        }}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a Standard" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.isArray(standardsData?.data) && standardsData.data.length > 0 ? (
                            standardsData.data.map((standard) => (
                              <SelectItem key={standard} value={standard}>
                                {standard}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem disabled>No standards available</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormField
                  control={form.control}
                  name="sections"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Section<span className="text-red-600">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedSection(value);
                        }}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Section" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {sectionsData?.data?.length > 0 ? (
                            sectionsData?.data.map((section) => (
                              <SelectItem key={section} value={section}>
                                {section}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem disabled>No sections available</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>
      </div>
      {feePaymentsActions.includes('READ') ? (
        <DataTable columns={columns} data={feePaymentData} />
      ) : (
        <div>No permission to view Exam Types</div>
      )}{' '}
      <Modal
        title="Add Fee Payment"
        description="Add the details for the fee below."
        modalSize="max-w-6xl"
        open={isDialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setSelectedEnrollmentId(null);
        }}
      >
        <CreateAddFeePayment onClose={handleModalClose} enrollmentId={selectedEnrollmentId} />
      </Modal>
    </>
  );
}

export default FeePayment;

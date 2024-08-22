'use client';

import { useEffect, useState } from 'react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/dataTable/DataTable';
import TitleBar from '@/components/header/titleBar';
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';
import { ColumnDef } from '@tanstack/react-table';
import { Modal } from '@/components/modals/modal';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { AlertDialog } from '@/components/alertdialogue/alert';
import { CreateExamForm } from '@/components/forms/createExamForm';
import { useConductExam, useDeleteExam } from '@/services/mutation/exam';
import { Exam } from '@/types/examTypes';
import moment from 'moment';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from '@/components/ui/select';
import { FormProvider, useForm } from 'react-hook-form';
import { useGetAllExamType } from '@/services/queries/admin/examType';
import { useGetAllStandards, useSectionByStandard } from '@/services/queries/admin/standard';
import { useGetAllExamPagination } from '@/services/queries/exam';
import { useGetPolicyRules } from '@/services/queries/policyRules/policyRules';
import useStorage from '@/hooks/storage';

function Exams() {
  const storage = useStorage();
  const { schoolId, academicYearId, staffId } = useSchoolContext();
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedStandard, setSelectedStandard] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [examActions, setExamActions] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const { data: examtypes } = useGetAllExamType(schoolId, academicYearId);
  const { data: standardsData, refetch: refetchStandards } = useGetAllStandards(
    schoolId,
    academicYearId
  );
  const { data: sectionsData } = useSectionByStandard(schoolId, academicYearId, selectedStandard);

  useEffect(() => {
    const storedRoles = JSON.parse(storage.getItem('roles', 'local') || '[]');
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
      const examRules = rules.find((rule: unknown) => rule.resource === 'exams');
      if (examRules) {
        console.log('Matching resource:', examRules.resource);
        setExamActions(examRules.actions);
      }
    }
  }, [policyRulesActionData]);

  const deleteExamMutation = useDeleteExam();
  const conductExamMutation = useConductExam();

  const form = useForm({
    defaultValues: {
      examType: '',
      standard: '',
      section: ''
    }
  });
  useEffect(() => {
    refetchStandards();
  }, [academicYearId, refetchStandards]);
  const payload = {
    page: '0',
    size: '10',
    sortCriteria: [
      {
        school: {
          schoolId: schoolId?.toString()
        }
      }
    ],
    filterCriteria: [
      {
        operation: 'equals',
        column: {
          examType: {
            examTypeId: form.watch('examType')
          }
        }
      },
      {
        operation: 'equals',
        column: {
          standardSubject: {
            standard: {
              standard: selectedStandard
            }
          }
        }
      },
      {
        operation: 'equals',
        column: {
          standardSubject: {
            standard: {
              section: selectedSection
            }
          }
        }
      },
      {
        operation: 'equals',
        column: {
          standardSubject: {
            academicYear: {
              academicYearId: academicYearId?.toString()
            }
          }
        }
      }
    ]
  };

  const { data: examData } = useGetAllExamPagination(schoolId, payload);

  const handleDelete = () => {
    if (selectedExamId) {
      deleteExamMutation.mutate({ schoolId, examId: selectedExamId });
      setSelectedExamId(null);
    }
  };

  const handleConduct = () => {
    if (selectedExamId) {
      conductExamMutation.mutate({ schoolId, examId: selectedExamId, staffId });
      setSelectedExamId(null);
    }
  };

  const Columns: ColumnDef<Exam>[] = [
    {
      accessorKey: 'examTypeDto.examNameTitle',
      header: 'Exam Name',
      cell: ({ row }) => <div>{row.original.examTypeDto.examNameTitle}</div>,
      enableSorting: true
    },
    {
      accessorKey: 'standardSubjectDto.standardDto.title',
      header: 'Standard',
      cell: ({ row }) => <div>{row.original.standardSubjectDto?.standardDto.title}</div>,
      enableSorting: true
    },
    {
      accessorKey: 'standardSubjectDto.subjectDto.subjectName',
      header: 'Subject',
      cell: ({ row }) => <div>{row.original.standardSubjectDto?.subjectDto.subjectName}</div>
    },
    {
      accessorKey: 'standardSubjectDto.subjectTypeDto.subjectTypeTitle',
      header: 'Subject Type',
      cell: ({ row }) => (
        <div>{row.original.standardSubjectDto?.subjectTypeDto.subjectTypeTitle}</div>
      )
    },
    {
      accessorKey: 'minMarks',
      header: 'MinMarks',
      cell: ({ row }) => <div>{row.getValue('minMarks')}</div>
    },
    {
      accessorKey: 'maxMarks',
      header: 'MaxMarks',
      cell: ({ row }) => <div>{row.getValue('maxMarks')}</div>
    },
    {
      accessorKey: 'examDate',
      header: 'Exam Date',
      cell: ({ row }) => <div>{moment(row.getValue('examDate')).format('DD MMM YYYY')}</div>
    },
    {
      accessorKey: 'startTime',
      header: 'Start Time',
      cell: ({ row }) => (
        <div>{moment(row.getValue('startTime'), 'HH:mm:ss').format('hh:mm:ss A')}</div>
      )
    },
    {
      accessorKey: 'endTime',
      header: 'End Time',
      cell: ({ row }) => (
        <div>{moment(row.getValue('endTime'), 'HH:mm:ss').format('hh:mm:ss A')}</div>
      )
    },
    {
      accessorKey: 'Status',
      header: 'Status',
      cell: ({ row }) => {
        let borderColor, textColor;

        switch (row.original.status) {
          case 'NOT_CONDUCTED':
            borderColor = 'border-red-500';
            textColor = 'text-red-500';
            break;
          case 'CONDUCTED':
            borderColor = 'border-yellow-500';
            textColor = 'text-yellow-500';
            break;
          case 'VERIFIED':
            borderColor = 'border-blue-500';
            textColor = 'text-blue-500';
            break;
          case 'PUBLISHED':
            borderColor = 'border-purple-500';
            textColor = 'text-purple-500';
            break;
          default:
            borderColor = 'border-green-500';
            textColor = 'text-green-500';
        }

        return (
          <div
            className={`w-[120px] capitalize border flex justify-center items-center text-xs rounded-lg px-2 py-1 ${borderColor} ${textColor}`}
          >
            {row.original.status.toLowerCase().replace(/_/g, ' ')}
          </div>
        );
      }
    },

    {
      accessorKey: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        const exam = row.original;
        const isConducted =
          exam.status === 'CONDUCTED' ||
          exam.status === 'EVALUATED' ||
          exam.status === 'VERIFIED' ||
          exam.status === 'PUBLISHED';

        const isFutureExam = moment(exam.examDate).isAfter(moment());

        return (
          <div className="flex items-center space-x-2">
            {!isConducted && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedExamId(exam.examId);
                  setIsUpdateDialogOpen(true);
                }}
              >
                <Pencil1Icon className="w-4 h-4 me-2" />
                Edit
              </Button>
            )}
            {!isConducted && (
              <>
                {examActions.includes('DELETE') && (
                  <AlertDialog
                    title="Confirm Deletion"
                    description="Are you sure you want to delete this exam? This action cannot be undone."
                    triggerButtonText=""
                    confirmButtonText="Delete"
                    cancelButtonText="Cancel"
                    onConfirm={handleDelete}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedExamId(exam.examId)}
                    >
                      <TrashIcon className="w-4 h-4 me-2" />
                      Delete
                    </Button>
                  </AlertDialog>
                )}
                {!isFutureExam && (
                  <AlertDialog
                    title="Confirm Conduct"
                    description="Are you sure you want to Conduct this Exam? This action cannot be undone."
                    triggerButtonText=""
                    confirmButtonText="Conduct"
                    cancelButtonText="Cancel"
                    onConfirm={handleConduct}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedExamId(exam.examId)}
                    >
                      <Pencil1Icon className="w-4 h-4 me-2" />
                      Conduct
                    </Button>
                  </AlertDialog>
                )}
              </>
            )}
          </div>
        );
      }
    }
  ];

  const hasWritePermission = examActions.includes('WRITE');

  return (
    <FormProvider {...form}>
      <div className="mt-5">
        <div className="mt-5">
          <TitleBar
            title="Exams"
            btnLink=""
            btnName={hasWritePermission ? 'Create Exam' : undefined}
            search={false}
            sort={false}
            placeholder="Search..."
            onSearch={() => {}}
            onSort={() => {}}
            modal={true}
            onButtonClick={() => setIsCreateDialogOpen(true)}
          />
        </div>
      </div>

      <Modal
        title="Create a new Exam"
        description="Enter the details for the new Exam below."
        triggerButtonText="Create Exam"
        modalSize="max-w-2xl xl:max-w-[1200px]"
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      >
        <CreateExamForm onClose={() => setIsCreateDialogOpen(false)} />
      </Modal>

      <Modal
        title="Update Exam"
        description="Update the details for the Exam below."
        triggerButtonText=""
        modalSize="max-w-2xl xl:max-w-[1200px]"
        open={isUpdateDialogOpen}
        onOpenChange={(open) => {
          setIsUpdateDialogOpen(open);
          if (!open) setSelectedExamId(null);
        }}
      >
        {selectedExamId && (
          <CreateExamForm examId={selectedExamId} onClose={() => setIsUpdateDialogOpen(false)} />
        )}
      </Modal>

      <div>
        <form>
          <div className="grid grid-cols-1 gap-4 p-4 mb-5 border bg-slate-50 rounded-2xl md:grid-cols-3">
            <div>
              <FormField
                control={form.control}
                name="examType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select ExamType</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a ExamType" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {examtypes?.data?.map((item) => (
                          <SelectItem key={item.examTypeId} value={item.examTypeId.toString()}>
                            {item.examNameTitle}
                          </SelectItem>
                        ))}
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
                        {standardsData?.data?.length > 0 ? (
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
                        {sectionsData?.data?.map((section) => (
                          <SelectItem key={section} value={section}>
                            {section}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </div>

      <div className="mt-4">
        {examActions.includes('READ') ? (
          <DataTable
            columns={Columns}
            data={examData?.data?.content || []}
            exportData={true}
            exportDataName="Exam-Details"
            dataColumns={true}
          />
        ) : (
          <div>No permission to view AcademicYears</div>
        )}{' '}
      </div>
    </FormProvider>
  );
}
export default Exams;

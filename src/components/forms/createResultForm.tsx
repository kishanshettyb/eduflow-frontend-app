import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '../ui/checkbox';
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
import { DataTable } from '@/components/dataTable/DataTable';
import {
  useGetAllResultPagination,
  useGetAllResultTable
} from '@/services/queries/teacher/result/result';
import { format, isFuture } from 'date-fns';
import {
  usePublishResult,
  useUpdateResult,
  useVerifyResult
} from '@/services/mutation/teacher/result/result';
import moment from 'moment';

const formSchema = z.object({
  examType: z.string().nonempty('Exam Type is required'),
  standards: z.string().nonempty('Standard is required'),
  sections: z.string().nonempty('Section is required'),
  subject: z.string().nonempty('Subject is required'),
  subjectType: z.string().nonempty('Subject Type is required')
});

type CreateResultFormProps = {
  onClose: () => void;
};

const getUniqueItems = (items, key) => {
  const uniqueItems = new Set();
  return items.filter((item) => {
    const value = key(item);
    if (uniqueItems.has(value)) {
      return false;
    }
    uniqueItems.add(value);
    return true;
  });
};

export const CreateResultForm: React.FC<CreateResultFormProps> = () => {
  const { schoolId, academicYearId } = useSchoolContext();
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [selectedStandard, setSelectedStandard] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [selectedExamType, setSelectedExamType] = useState<string>('');
  const [selectedSubjectTypeId, setSelectedSubjectTypeId] = useState<number | null>(null);
  const [allVerified, setAllVerified] = useState<boolean>(false);

  const [, setAllAdded] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<{ [key: number]: boolean }>({});

  const publishResult = usePublishResult();
  const verifyResult = useVerifyResult();
  const updateResult = useUpdateResult();
  const { data: examtypesData } = useGetAllResultPagination(schoolId, {
    page: '0',
    size: '10',
    sortCriteria: [],
    filterCriteria: [
      {
        operation: 'equals',
        column: {
          school: {
            schoolId: schoolId
          }
        }
      },
      {
        operation: 'equals',
        column: {
          enrollment: {
            academicYear: {
              academicYearId: academicYearId
            }
          }
        }
      }
    ]
  });

  const { data: standardsData } = useGetAllResultPagination(schoolId, {
    page: '0',
    size: '10',
    sortCriteria: [],
    filterCriteria: [
      {
        operation: 'equals',
        column: {
          school: {
            schoolId: schoolId
          }
        }
      },
      {
        operation: 'equals',
        column: {
          exam: {
            examType: {
              examTypeId: selectedExamType
            }
          }
        }
      },
      {
        operation: 'equals',
        column: {
          enrollment: {
            academicYear: {
              academicYearId: academicYearId
            }
          }
        }
      }
    ]
  });
  const { data: sectionsData } = useGetAllResultPagination(schoolId, {
    page: '0',
    size: '10',
    sortCriteria: [],
    filterCriteria: [
      {
        operation: 'equals',
        column: {
          school: {
            schoolId: schoolId
          }
        }
      },
      {
        operation: 'equals',
        column: {
          exam: {
            examType: {
              examTypeId: selectedExamType
            }
          }
        }
      },
      {
        operation: 'equals',
        column: {
          enrollment: {
            academicYear: {
              academicYearId: academicYearId
            },
            standard: {
              standard: selectedStandard
            }
          }
        }
      }
    ]
  });

  const { data: subjectTypedata } = useGetAllResultPagination(schoolId, {
    page: '0',
    size: '10',
    sortCriteria: [],
    filterCriteria: [
      {
        operation: 'equals',
        column: {
          school: {
            schoolId: schoolId
          }
        }
      },
      {
        operation: 'equals',
        column: {
          exam: {
            examType: {
              examTypeId: selectedExamType
            }
          }
        }
      },
      {
        operation: 'equals',
        column: {
          enrollment: {
            academicYear: {
              academicYearId: academicYearId
            },
            standard: {
              standard: selectedStandard,
              section: selectedSection
            }
          }
        }
      }
    ]
  });

  const { data: subjectData } = useGetAllResultPagination(schoolId, {
    page: '0',
    size: '10',
    sortCriteria: [],
    filterCriteria: [
      {
        operation: 'equals',
        column: {
          school: {
            schoolId: schoolId
          }
        }
      },
      {
        operation: 'equals',
        column: {
          exam: {
            examType: {
              examTypeId: selectedExamType
            }
          }
        }
      },
      {
        operation: 'equals',
        column: {
          exam: {
            standardSubject: {
              subjectType: {
                subjectTypeId: selectedSubjectTypeId
              }
            }
          }
        }
      },
      {
        operation: 'equals',
        column: {
          enrollment: {
            academicYear: {
              academicYearId: academicYearId
            },
            standard: {
              standard: selectedStandard,
              section: selectedSection
            }
          }
        }
      }
    ]
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      examType: '',
      standards: '',
      sections: '',
      subject: '',
      subjectType: ''
    }
  });

  useEffect(() => {
    setSelectedSection('');
    setSelectedSubjectId(null);
  }, [selectedStandard]);

  useEffect(() => {
    setSelectedSubjectId(null);
  }, [selectedSection]);

  const { data: resultData, refetch } = useGetAllResultTable(
    schoolId,
    selectedExamType,
    selectedStandard,
    selectedSection,
    selectedSubjectId,
    academicYearId,
    selectedSubjectTypeId
  );

  useEffect(() => {
    form.reset({
      examType: selectedExamType,
      standards: selectedStandard,
      sections: selectedSection,
      subject: selectedSubjectId?.toString() || '',
      subjectType: selectedSubjectTypeId?.toString() || ''
    });

    setSelectedRows({});
  }, [selectedSubjectId]);

  useEffect(() => {
    if (resultData) {
      setAllVerified(resultData.data.every((item) => item.allVerified));
      setAllAdded(resultData.data.every((item) => item.status === 'ADDED' || 'EVALUATED'));
    }
  }, [resultData]);

  const handleVerify = () => {
    const isEnabled = Object.keys(selectedRows).some((index) => {
      const rowIndex = parseInt(index);
      const rowData = resultData?.data[rowIndex];
      return rowData && rowData.status === 'EVALUATED' && selectedRows[index];
    });

    if (isEnabled) {
      const payload = Object.keys(selectedRows)
        .filter((index) => selectedRows[index])
        .map((index) => ({
          resultId: resultData?.data[index].resultId.toString()
        }));

      verifyResult.mutate({
        schoolId: schoolId,
        examTypeId: selectedExamType,
        standard: selectedStandard,
        section: selectedSection,
        subjectId: selectedSubjectId,
        subjectTypeId: selectedSubjectTypeId,
        data: payload
      });

      setSelectedRows({});
    }
  };

  const handlePublish = () => {
    publishResult.mutate({
      schoolId: schoolId,
      examTypeId: selectedExamType,
      standard: selectedStandard,
      section: selectedSection
    });

    setSelectedRows({});
  };

  const handleRowSelect = (rowIndex: number, isSelected: boolean) => {
    setSelectedRows((prev) => ({ ...prev, [rowIndex]: isSelected }));
  };

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      const newSelectedRows = {};
      resultData?.data.forEach((_, index) => {
        newSelectedRows[index] = true;
      });
      setSelectedRows(newSelectedRows);
    } else {
      setSelectedRows({});
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    setSelectedExamType(values.examType);
    setSelectedStandard(values.standards);
    setSelectedSection(values.sections);
    setSelectedSubjectId(Number(values.subject));
    setSelectedSubjectTypeId(Number(values.subjectType));

    const payload = Object.keys(selectedRows)
      .filter((index) => selectedRows[index])
      .map((index) => {
        const rowIndex = parseInt(index);
        const item = resultData?.data[rowIndex];
        return {
          resultId: item.resultId,
          score: form.getValues(`resultData.${rowIndex}.score`) || item.score,
          remarks: form.getValues(`resultData.${rowIndex}.remarks`) || item.remarks,
          resultAnnouncementDate: format(new Date(), 'yyyy-MM-dd')
        };
      });

    updateResult.mutate({
      schoolId: schoolId,
      data: payload
    });

    refetch();
    setSelectedRows({});
  }

  const disableUpdateButton = Object.keys(selectedRows).some((index) => {
    const rowIndex = parseInt(index);
    const rowData = resultData?.data[rowIndex];
    return (
      rowData && (rowData.status === 'PUBLISHED' || isFuture(new Date(rowData.examDto.examDate)))
    );
  });

  const Columns: ColumnDef[] = [
    {
      id: 'select',
      header: () => (
        <Checkbox
          checked={Object.keys(selectedRows).length === resultData?.data.length}
          onCheckedChange={(isSelected) => handleSelectAll(isSelected as boolean)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={selectedRows[row.index]}
          onCheckedChange={(isSelected) => handleRowSelect(row.index, isSelected as boolean)}
        />
      )
    },
    {
      accessorKey: 'studentDto.firstName',
      header: 'Student Name',
      cell: ({ row }) => <div>{row.original.studentDto?.firstName}</div>,
      enableSorting: true
    },
    {
      accessorKey: 'examDto.standardSubjectDto.subjectDto.subjectName',
      header: 'Subject',
      cell: ({ row }) => (
        <div>{row.original.examDto.standardSubjectDto?.subjectDto.subjectName}</div>
      ),
      enableSorting: true
    },
    {
      accessorKey: 'examDto.examDate',
      header: 'Exam Date',
      cell: ({ row }) => (
        <div>{moment(row.getValue('row.original.examDto.examDate')).format('DD MMM YYYY')}</div>
      )
    },
    {
      accessorKey: 'examDto.standardSubjectDto.standardDto.standard',
      header: 'Standard',
      cell: ({ row }) => <div>{row.original.examDto.standardSubjectDto.standardDto.standard}</div>
    },
    {
      accessorKey: 'examDto.standardSubjectDto.standardDto.section',
      header: 'Section',
      cell: ({ row }) => <div>{row.original.examDto.standardSubjectDto.standardDto.section}</div>
    },
    {
      accessorKey: 'examDto.examTypeDto.examNameTitle',
      header: 'Exam Type',
      cell: ({ row }) => <div>{row.original.examDto.examTypeDto.examNameTitle}</div>
    },
    {
      accessorKey: 'examDto.minMarks',
      header: 'Min Marks',
      cell: ({ row }) => <div>{row.original.examDto.minMarks}</div>
    },
    {
      accessorKey: 'examDto.maxMarks',
      header: 'Max Marks',
      cell: ({ row }) => <div>{row.original.examDto.maxMarks}</div>
    },
    {
      accessorKey: 'score',
      header: 'Score',
      cell: ({ row }) => (
        <Controller
          name={`resultData.${row.index}.score`}
          control={form.control}
          render={({ field }) => (
            <Input
              className="w-40"
              type="text"
              size="sm"
              {...field}
              value={field.value ?? row.original.score}
              onChange={(e) => field.onChange(e.target.value)}
              disabled={
                isFuture(new Date(row.original.examDto.examDate)) ||
                row.original.status === 'PUBLISHED' ||
                !selectedRows[row.index]
              }
            />
          )}
        />
      ),
      enableSorting: false
    },
    {
      accessorKey: 'remarks',
      header: 'Remarks',
      cell: ({ row }) => (
        <Controller
          name={`resultData.${row.index}.remarks`}
          control={form.control}
          render={({ field }) => (
            <Input
              type="text"
              className="w-40"
              size="sm"
              {...field}
              value={field.value ?? row.original.remarks}
              onChange={(e) => field.onChange(e.target.value)}
              disabled={
                isFuture(new Date(row.original.examDto.examDate)) ||
                row.original.status === 'PUBLISHED' ||
                !selectedRows[row.index]
              }
            />
          )}
        />
      ),
      enableSorting: false
    },
    {
      accessorKey: 'grade',
      header: 'Grade',
      cell: ({ row }) => <div>{row.getValue('grade')}</div>
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <div>{row.getValue('status')}</div>
    }
  ];

  const uniqueStandards = getUniqueItems(
    standardsData?.data?.content || [],
    (item) => item.examDto.standardSubjectDto.standardDto.standard
  );
  const uniqueExamTypes = getUniqueItems(
    examtypesData?.data?.content || [],
    (item) => item.examDto.examTypeDto.examNameTitle
  );
  const uniqueSections = getUniqueItems(
    sectionsData?.data?.content || [],
    (item) => item.examDto.standardSubjectDto.standardDto.standard.section
  );
  const uniqueSubjectTypes = getUniqueItems(
    subjectTypedata?.data?.content || [],
    (item) => item.examDto.standardSubjectDto.subjectTypeDto.subjectTypeTitle
  );
  const uniqueSubjects = getUniqueItems(
    subjectData?.data?.content || [],
    (item) => item.examDto.standardSubjectDto.subjectDto.subjectName
  );

  return (
    <div>
      <div className="border p-4 shadow-3xl rounded-2xl mb-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
              <div>
                <FormField
                  control={form.control}
                  name="examType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Exam Type<span className="text-red-600">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedExamType(value);
                        }}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a Exam type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {uniqueExamTypes.map((item) => (
                            <SelectItem
                              key={item.examDto.examTypeDto.examTypeId}
                              value={item.examDto.examTypeDto.examTypeId?.toString()}
                            >
                              {item.examDto.examTypeDto.examNameTitle}
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
                          {uniqueStandards.map((item) => (
                            <SelectItem
                              key={item.examDto.standardSubjectDto.standardDto.standard}
                              value={item.examDto.standardSubjectDto.standardDto.standard}
                            >
                              {item.examDto.standardSubjectDto.standardDto.standard}
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
                          {uniqueSections.map((item) => (
                            <SelectItem
                              key={item.examDto.standardSubjectDto.standardDto.section}
                              value={item.examDto.standardSubjectDto.standardDto.section}
                            >
                              {item.examDto.standardSubjectDto.standardDto.section}
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
                  name="subjectType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Subject Type<span className="text-red-600">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedSubjectTypeId(Number(value)); // Update the selected subject type ID
                        }}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Subject Type" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          {uniqueSubjectTypes.map((item) => (
                            <SelectItem
                              key={item.examDto.standardSubjectDto.subjectTypeDto.subjectTypeId} // Corrected access to item
                              value={item.examDto.standardSubjectDto.subjectTypeDto.subjectTypeId.toString()} // Ensure no typo in the property
                            >
                              {item.examDto.standardSubjectDto.subjectTypeDto.subjectTypeTitle}
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
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Subject<span className="text-red-600">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedSubjectId(Number(value)); // Update the selected subject type ID
                        }}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Subject" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          {uniqueSubjects.map((item) => (
                            <SelectItem
                              key={item.examDto.standardSubjectDto.subjectDto.subjectId} // Corrected access to item
                              value={item.examDto.standardSubjectDto.subjectDto.subjectId.toString()} // Ensure no typo in the property
                            >
                              {item.examDto.standardSubjectDto.subjectDto.subjectName}
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

            <div className="flex flex-wrap w-full gap-2 justify-end">
              <Button
                type="submit"
                disabled={!Object.values(selectedRows).includes(true) || disableUpdateButton}
              >
                Update
              </Button>

              <Button
                type="button"
                onClick={handleVerify}
                disabled={
                  !Object.keys(selectedRows).some((index) => {
                    const rowIndex = parseInt(index);
                    const rowData = resultData?.data[rowIndex];
                    return rowData && rowData.status === 'EVALUATED' && selectedRows[index];
                  })
                }
                className="disabled:opacity-50"
              >
                Verify
              </Button>

              <Button
                disabled={!allVerified}
                type="button"
                onClick={handlePublish}
                className="disabled:opacity-50"
              >
                Publish
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <DataTable columns={Columns} data={resultData?.data || []} />
    </div>
  );
};

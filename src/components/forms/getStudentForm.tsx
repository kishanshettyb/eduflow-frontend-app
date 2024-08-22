'use client';

import { useState, useEffect } from 'react';
import * as React from 'react';
import { DataTable } from '@/components/dataTable/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Checkbox } from '../ui/checkbox';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { useGetAllStandards, useSectionByStandard } from '@/services/queries/admin/standard';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { useFilteredStudents, useGetNotEnrolledStudent } from '@/services/queries/admin/student';
import { Student } from '@/types/admin/studentTypes';
import { Pencil1Icon } from '@radix-ui/react-icons';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { usePromoteStudent } from '@/services/mutation/admin/enrollment';
import { useGetStudentPromote } from '@/services/queries/admin/enrollment';
import { ViewImage } from '../viewfiles/viewImage';

const formSchema = z.object({
  isActive: z.string().min(1, {
    message: 'Please select a status.'
  }),
  standards: z.string().min(1, {
    message: 'Please select a standard.'
  }),
  sectionId: z.string().min(1, {
    message: 'Please select a section.'
  })
});

function StudentForm() {
  const { schoolId, academicYearId } = useSchoolContext();
  const router = useRouter();
  const { data: standardsData, refetch: refetchStandards } = useGetAllStandards(
    schoolId,
    academicYearId
  );
  console.log(standardsData, 'standardsData');
  const [selectedStandard, setSelectedStandard] = useState('');
  const { data: sectionData, refetch: refetchSections } = useSectionByStandard(
    schoolId,
    academicYearId,
    selectedStandard
  );
  const [isDropdownDisabled, setIsDropdownDisabled] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const { data: notEnrolledStudents, refetch: refetchNotEnrolledStudents } =
    useGetNotEnrolledStudent(schoolId);
  const [isEnrollButtonDisabled, setIsEnrollButtonDisabled] = useState(true);
  const promoteStudentMutation = usePromoteStudent();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isActive: 'active',
      standards: '',
      sectionId: ''
    }
  });

  useEffect(() => {
    refetchStandards();
  }, [academicYearId, refetchStandards]);

  useEffect(() => {
    refetchSections();
  }, [selectedStandard, academicYearId, refetchSections]);

  const studentData = useFilteredStudents(
    schoolId,
    academicYearId,
    form.watch('isActive') === 'notEnrolled' ? null : form.watch('isActive'),
    form.watch('standards'),
    form.watch('sectionId')
  );

  const { data: promotedStudents, refetch: refetchPromotedStudents } = useGetStudentPromote(
    schoolId,
    {
      page: '0',
      size: '10',
      sortCriteria: [],
      filterCriteria: [
        {
          operation: 'like',
          column: {
            status: 'PROMOTED'
          }
        },
        {
          operation: 'equals',
          column: {
            standard: {
              standard: form.watch('standards')
            }
          }
        },
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
            standard: {
              section: form.watch('sectionId')
            }
          }
        }
      ]
    }
  );
  useEffect(() => {
    if (studentData?.data) {
      setStudents(studentData.data);
    } else if (studentData?.error) {
      // Handle the error case, you can show a toast or log the error
      console.error('Error fetching students:', studentData.error.message);
    }
  }, [studentData]);

  useEffect(() => {
    if (standardsData && standardsData.length > 0) {
      const initialStandard = standardsData[0];
      setSelectedStandard(initialStandard);
      form.setValue('standards', initialStandard);
    }
  }, [standardsData, form]);

  useEffect(() => {
    if (form.watch('isActive') === 'notEnrolled') {
      setIsDropdownDisabled(true); // Disable dropdowns when status is "notEnrolled"
      refetchNotEnrolledStudents(); // Refetch not enrolled students when status is "Not Enrolled"
    } else if (form.watch('isActive') === 'PROMOTED') {
      setIsDropdownDisabled(false); // Enable dropdowns when status is not "notEnrolled"
      refetchPromotedStudents(); // Refetch promoted students when status is "PROMOTED"
    } else {
      setIsDropdownDisabled(false); // Enable dropdowns for other statuses
    }
  }, [form.watch('isActive'), refetchNotEnrolledStudents, refetchPromotedStudents]);

  const handleStatusChange = (selectedStatus: string) => {
    form.setValue('isActive', selectedStatus);

    // Clear standard and section fields when the status changes
    form.setValue('standards', '');
    form.setValue('sectionId', '');

    // Update the state to disable/enable dropdowns
    setIsDropdownDisabled(selectedStatus === 'notEnrolled');
  };

  const handlePromoteClick = (studentId: string) => {
    const payload = {
      schoolId,
      academicYearId,
      isActive: true,
      standardDto: {
        standard: form.watch('standards'),
        section: form.watch('sectionId')
      },
      status: 'PROMOTED'
    };

    promoteStudentMutation.mutate({ studentId, payload });
  };

  const handleStandardChange = (selectedStandard: string) => {
    setSelectedStandard(selectedStandard);
    form.setValue('standards', selectedStandard);
    form.setValue('sectionId', ''); // Reset sectionId when standard changes
  };

  const handleSectionChange = (selectedSection: string) => {
    form.setValue('sectionId', selectedSection);
  };
  const [selectedRows, setSelectedRows] = useState<Record<number, boolean>>({});

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      const newSelectedRows = students.reduce(
        (acc, student, index) => {
          acc[index] = true;
          return acc;
        },
        {} as Record<number, boolean>
      );
      setSelectedRows(newSelectedRows);
    } else {
      setSelectedRows({});
    }
  };

  const handleRowSelect = (index: number, isSelected: boolean) => {
    setSelectedRows((prevSelectedRows) => ({
      ...prevSelectedRows,
      [index]: isSelected
    }));
  };

  useEffect(() => {
    // Enable or disable the "Enroll" button based on the selection of checkboxes
    const isAnyRowSelected = Object.values(selectedRows).some((isSelected) => isSelected);
    setIsEnrollButtonDisabled(!isAnyRowSelected);
  }, [selectedRows]);

  const columnsForPromoted: ColumnDef<Student>[] = [
    {
      id: 'select',
      header: () => (
        <Checkbox
          checked={Object.keys(selectedRows).length === students.length}
          onCheckedChange={(isSelected) => handleSelectAll(isSelected as boolean)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={!!selectedRows[row.index]}
          onCheckedChange={(isSelected) => handleRowSelect(row.index, isSelected as boolean)}
        />
      )
    },

    {
      accessorKey: 'photo',
      header: 'Profile',
      cell: function CellComponent({ row }) {
        const attachmentId = row.getValue('photo')?.attachmentId;

        if (!attachmentId) {
          return (
            <Image alt="eduflow" width={50} height={50} className="rounded-full" src="/man.png" />
          );
        }

        return (
          <ViewImage
            schoolId={schoolId}
            attachmentId={attachmentId}
            width={50}
            height={50}
            styles="rounded-full w-[50px] h-[50px] object-cover"
            alt="eduflow"
          />
        );
      }
    },
    {
      accessorKey: 'studentDto.firstName',
      header: 'First Name',
      cell: ({ row }) => <div>{row.original.studentDto?.firstName}</div>,
      enableSorting: true
    },
    {
      accessorKey: 'studentDto.lastName',
      header: 'Last Name',
      cell: ({ row }) => <div>{row.original.studentDto?.lastName}</div>,
      enableSorting: true
    },
    {
      accessorKey: 'standardDto.title',
      header: 'Standard & Section',
      cell: ({ row }) => <div>{row.original.standardDto?.title}</div>,
      enableSorting: true
    },
    {
      accessorKey: 'studentDto.contactNumber',
      header: 'Contact Number',
      cell: ({ row }) => <div>{row.original.studentDto?.contactNumber}</div>,
      enableSorting: true
    },
    {
      accessorKey: 'studentDto.email',
      header: 'Email',
      cell: ({ row }) => <div>{row.original.studentDto?.email}</div>,
      enableSorting: true
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => (
        <div>
          {row.getValue('isActive') ? (
            <div className="flex items-center justify-center px-2 py-1 border border-green-500 rounded">
              <p className="text-green-500 text-[12px]">Active</p>
            </div>
          ) : (
            <div className="flex items-center justify-center px-2 py-1 border border-red-500 rounded">
              <p className="text-red-500 text-[12px]">Inactive</p>
            </div>
          )}
        </div>
      ),
      enableSorting: true
    }
  ];
  const columnsForNotEnrolled: ColumnDef<Student>[] = [
    {
      accessorKey: 'photo',
      header: 'Profile',
      cell: function CellComponent({ row }) {
        const attachmentId = row.original.studentDto?.photo?.attachmentId;

        if (!attachmentId) {
          return (
            <Image alt="eduflow" width={50} height={50} className="rounded-full" src="/man.png" />
          );
        }

        return (
          <ViewImage
            schoolId={schoolId}
            attachmentId={attachmentId}
            width={50}
            height={50}
            styles="rounded-full"
            alt="eduflow"
          />
        );
      }
    },
    {
      accessorKey: 'firstName',
      header: 'First Name',
      cell: ({ row }) => <div>{row.getValue('firstName')}</div>,
      enableSorting: true
    },
    {
      accessorKey: 'lastName',
      header: 'Last Name',
      cell: ({ row }) => <div>{row.getValue('lastName')}</div>,
      enableSorting: true
    },
    {
      accessorKey: 'enrollmentStudentDto.standardSection',
      header: 'Standard & Section',
      cell: ({ row }) => <div>{row.original.enrollmentStudentDto?.standardSection}</div>,
      enableSorting: true
    },
    {
      accessorKey: 'contactNumber',
      header: 'Contact Number',
      cell: ({ row }) => <div>{row.getValue('contactNumber')}</div>,
      enableSorting: true
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => <div>{row.getValue('email')}</div>,
      enableSorting: true
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => (
        <div>
          {row.getValue('isActive') ? (
            <div className="flex items-center justify-center px-2 py-1 border border-green-500 rounded">
              <p className="text-green-500 text-[12px]">Active</p>
            </div>
          ) : (
            <div className="flex items-center justify-center px-2 py-1 border border-red-500 rounded">
              <p className="text-red-500 text-[12px]">Inactive</p>
            </div>
          )}
        </div>
      ),
      enableSorting: true
    },
    {
      accessorKey: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        const student = row.original;
        const isActive = student.isActive;
        const isNotEnrolled = form.watch('isActive') === 'notEnrolled';

        return (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleUpdateClick(student.studentId)}
            >
              <Pencil1Icon className="w-4 h-4 me-2" />
              Edit
            </Button>
            {isActive && !isNotEnrolled && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePromoteClick(student.studentId)}
              >
                {/* Add your promote icon here */}
                <span className="w-4 h-4 me-2">📈</span>
                Promote
              </Button>
            )}
          </div>
        );
      }
    }
  ];

  const columnsForActive: ColumnDef<Student>[] = [
    {
      accessorKey: 'photo',
      header: 'Profile',
      cell: function CellComponent({ row }) {
        const attachmentId = row.original.studentDto?.photo?.attachmentId;

        if (!attachmentId) {
          return (
            <Image alt="eduflow" width={50} height={50} className="rounded-full" src="/man.png" />
          );
        }

        return (
          <ViewImage
            schoolId={schoolId}
            attachmentId={attachmentId}
            width={40}
            height={40}
            styles="rounded-full object-cover"
            alt="eduflow"
          />
        );
      }
    },
    {
      accessorKey: 'studentDto.firstName',
      header: 'First Name',
      cell: ({ row }) => <div>{row.original.studentDto?.firstName}</div>,
      enableSorting: true
    },
    {
      accessorKey: 'studentDto.lastName',
      header: 'Last Name',
      cell: ({ row }) => <div>{row.original.studentDto?.lastName}</div>,
      enableSorting: true
    },
    {
      accessorKey: 'studentDto.enrollmentStudentDto.standardSection',
      header: 'Standard & Section',
      cell: ({ row }) => <div>{row.original.studentDto.enrollmentStudentDto?.standardSection}</div>,
      enableSorting: true
    },
    {
      accessorKey: 'studentDto.contactNumber',
      header: 'Contact Number',
      cell: ({ row }) => <div>{row.original.studentDto?.contactNumber}</div>,
      enableSorting: true
    },
    {
      accessorKey: 'studentDto.email',
      header: 'Email',
      cell: ({ row }) => <div>{row.original.studentDto?.email}</div>,
      enableSorting: true
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => (
        <div>
          {row.getValue('isActive') ? (
            <div className="flex items-center justify-center px-2 py-1 border border-green-500 rounded">
              <p className="text-green-500 text-[12px]">Active</p>
            </div>
          ) : (
            <div className="flex items-center justify-center px-2 py-1 border border-red-500 rounded">
              <p className="text-red-500 text-[12px]">Inactive</p>
            </div>
          )}
        </div>
      ),
      enableSorting: true
    },
    {
      accessorKey: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        const student = row.original;
        const isActive = student.isActive;
        const isNotEnrolled = form.watch('isActive') === 'notEnrolled';
        const enablePromotion = student.standardDto?.enablePromotion; // Check enablePromotion property
        const selectedStandard = form.watch('standards');
        const selectedSection = form.watch('sectionId');
        const studentStandard = student.standardDto?.standard;
        const studentSection = student.standardDto?.section;

        // Show button only if the student's standard and section match the selected ones
        const showPromoteButton =
          studentStandard === selectedStandard && studentSection === selectedSection;

        return (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleUpdateClick(student.studentId)}
            >
              <Pencil1Icon className="w-4 h-4 me-2" />
              Edit
            </Button>
            {isActive &&
              !isNotEnrolled &&
              enablePromotion &&
              showPromoteButton && ( // Show button only if enablePromotion is true and standard/section match
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePromoteClick(student.studentId)}
                >
                  <span className="h-4 w-4 me-2">📈</span>
                  Promote
                </Button>
              )}
          </div>
        );
      }
    }
  ];

  const columns = (() => {
    const isActive = form.watch('isActive');
    if (isActive === 'notEnrolled') {
      return columnsForNotEnrolled;
    } else if (isActive === 'inactive') {
      return columnsForNotEnrolled;
    } else if (isActive === 'active') {
      return columnsForActive;
    } else {
      return columnsForPromoted;
    }
  })();

  const handleUpdateClick = (studentId: string) => {
    router.push(`addStudent?studentId=${studentId}`);
  };

  const handleEnroll = (studentIds: string[]) => {
    if (studentIds.length === 0) {
      // Optionally handle the case when no students are selected
      console.warn('No students selected');
      return;
    }

    // Redirect to the promote page with the selected student IDs
    router.push(`/admin/promote?studentIds=${studentIds.join(',')}`);
  };

  return (
    <div>
      <Form {...form}>
        <div className="p-4 mb-5 border rounded-2xl shadow-3xl">
          <div className="w-4/5">
            <div className="flex flex-wrap items-end gap-4">
              <div className="w-[180px]">
                <FormField
                  control={form.control}
                  name="isActive"
                  render={() => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={handleStatusChange}
                        defaultValue={form.getValues('isActive')}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Is Active (Enrolled)</SelectItem>
                          <SelectItem value="notEnrolled">Is Active (Not Enrolled)</SelectItem>
                          <SelectItem value="false">Inactive</SelectItem>
                          <SelectItem value="PROMOTED">Promoted</SelectItem>{' '}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-[180px]">
                <FormField
                  control={form.control}
                  name="standards"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Standard<span className="text-red-600">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={handleStandardChange}
                        value={field.value}
                        disabled={isDropdownDisabled}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Standard" />
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
              <div className="w-[180px]">
                <FormField
                  control={form.control}
                  name="sectionId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Section<span className="text-red-600">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={handleSectionChange}
                        value={field.value}
                        disabled={isDropdownDisabled}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Section" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {sectionData?.data.map((section) => (
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
              <div className="w-[180px]">
                <Button
                  className="w-[180px]"
                  type="button"
                  disabled={Object.keys(selectedRows).length === 0 || isEnrollButtonDisabled} // Disable button if no students are selected
                  onClick={() => {
                    const selectedStudentIds = Object.entries(selectedRows)
                      .filter(([isSelected]) => isSelected)
                      .map(([index]) => students[index].studentId);

                    handleEnroll(selectedStudentIds);
                  }}
                >
                  Enroll
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Form>

      {form.watch('isActive') === 'notEnrolled' ? (
        <DataTable columns={columns} data={notEnrolledStudents.data || []} />
      ) : form.watch('isActive') === 'active' ? (
        <DataTable columns={columns} data={students} />
      ) : form.watch('isActive') === 'PROMOTED' ? (
        <DataTable columns={columns} data={promotedStudents?.data?.content || []} />
      ) : (
        <div>
          <p>No In Active Students Present</p>
        </div>
      )}
    </div>
  );
}

export default StudentForm;

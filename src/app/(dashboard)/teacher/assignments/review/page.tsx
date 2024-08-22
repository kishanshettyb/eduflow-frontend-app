'use client';

import { DataTable } from '@/components/dataTable/DataTable';
import TitleBar from '@/components/header/titleBar';
import { ColumnDef } from '@tanstack/react-table';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import {
  useGetAllStandardSubject,
  useGetAllAssignmentReview
} from '@/services/queries/teacher/assignment/assignment';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/modals/modal';
import { AssignmentReviewForm } from '@/components/forms/AssignmentReviewForm';
import { Student } from '@/types/admin/studentTypes';
import { useViewAttachment } from '@/services/queries/attachment/attachment';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

function AssignmentReview() {
  const { schoolId, academicYearId } = useSchoolContext();
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<number | null>(null);
  const [buttonTextMap, setButtonTextMap] = useState<Record<number, string>>({});

  // States for dropdown filters
  const [selectedStandardId, setSelectedStandardId] = useState<string | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  // Fetch standards and subjects
  const { data: standardData } = useGetAllStandardSubject(schoolId, {
    page: '0',
    size: '10',
    sortCriteria: [{ standards: { title: 'asc' } }],
    filterCriteria: [
      {
        operation: 'equals',
        column: { subject: { academicYear: { academicYearId: academicYearId } } }
      }
    ]
  });

  const { data: subjectData } = useGetAllStandardSubject(schoolId, {
    page: '0',
    size: '10',
    sortCriteria: [{ subject: { subjectName: 'asc' } }],
    filterCriteria: [
      {
        operation: 'equals',
        column: { subject: { academicYear: { academicYearId: academicYearId } } }
      },
      { operation: 'equals', column: { standards: { standardId: selectedStandardId || '' } } }
    ]
  });
  const { data: assignmentsData } = useGetAllStandardSubject(schoolId, {
    page: '0',
    size: '10',
    sortCriteria: [{ title: 'asc' }],
    filterCriteria: [
      {
        operation: 'equals',
        column: { subject: { academicYear: { academicYearId: academicYearId } } }
      },
      {
        operation: 'equals',
        column: { subject: { schoolId: schoolId } }
      },
      {
        operation: 'equals',
        column: { standards: { standardId: selectedStandardId || '' } }
      },
      {
        operation: 'equals',
        column: { subject: { subjectId: selectedSubjectId || '' } }
      }
    ]
  });

  const uniqueStandards = Array.from(
    new Map(
      standardData?.data?.content.flatMap((standard) =>
        standard.standardDtoList.map((standardDto) => [standardDto.standardId, standardDto])
      )
    ).values()
  );

  // Filter to get unique subjects
  const uniqueSubjects = Array.from(
    new Map(subjectData?.data?.content.map((subject) => [subject.subjectId, subject])).values()
  );

  // Filter to get unique assignments
  const uniqueAssignments = Array.from(
    new Map(
      assignmentsData?.data?.content.map((assignment) => [assignment.assignmentId, assignment])
    ).values()
  );
  // Fetch assignments based on selected standard and subject
  const assignmentReviewPayload = {
    page: '0',
    size: '10',
    sortCriteria: [{ submissionDate: 'asc' }],
    filterCriteria: [
      {
        operation: 'equals',
        column: {
          enrollment: {
            school: { schoolId: schoolId }
          }
        }
      },
      {
        operation: 'equals',
        column: {
          enrollment: {
            academicYear: { academicYearId: academicYearId }
          }
        }
      },
      {
        operation: 'equals',
        column: {
          assignment: {
            standards: { standardId: selectedStandardId || '' }
          }
        }
      },
      {
        operation: 'equals',
        column: {
          assignment: {
            subject: { subjectId: selectedSubjectId || '' }
          }
        }
      },
      {
        operation: 'equals',
        column: {
          assignment: {
            assignmentId: selectedAssignmentId || ''
          }
        }
      }
    ]
  };

  const { data: assignmentData } = useGetAllAssignmentReview(schoolId, assignmentReviewPayload);

  const ViewAttachmentComponent = ({ schoolId, attachmentId, attachmentName }) => {
    const attachmentData = useViewAttachment(schoolId, attachmentId);

    return attachmentData.isLoading ? (
      <div>Loading...</div>
    ) : attachmentData.isSuccess ? (
      <a
        className="text-blue-500 hover:text-blue-700"
        href={attachmentData.data}
        target="_blank"
        rel="noopener noreferrer"
      >
        {attachmentName}
      </a>
    ) : (
      <div>No File</div>
    );
  };

  const Columns: ColumnDef<Student>[] = [
    {
      accessorKey: 'assignmentDto.standardDtoList.title',
      header: 'Standard',
      cell: ({ row }) => <div>{row.original.assignmentDto?.standardDtoList?.[0]?.title}</div>
    },
    {
      accessorKey: 'assignmentDto.subjectName',
      header: 'Subject',
      cell: ({ row }) => <div>{row.original.assignmentDto?.subjectName}</div>
    },
    {
      accessorKey: 'assignmentDto.title',
      header: 'Assignment Title',
      cell: ({ row }) => <div>{row.original.assignmentDto?.title}</div>
    },
    {
      accessorKey: 'studentDto',
      header: 'Student Name',
      cell: ({ row }) => (
        <div>{`${row.original.studentDto?.firstName ?? ''} ${row.original.studentDto?.lastName ?? ''}`}</div>
      )
    },
    {
      accessorKey: 'submissionDate',
      header: 'Submission Date',
      cell: ({ row }) => <div>{row.getValue('submissionDate')}</div>
    },
    {
      accessorKey: 'assignmentDto.attachmentDto',
      header: 'Assignment',
      cell: ({ row }) => {
        const attachment = row.original.assignmentDto?.attachmentDto;
        return attachment ? (
          <ViewAttachmentComponent
            schoolId={schoolId}
            attachmentId={attachment.attachmentId}
            attachmentName={attachment.attachmentName}
          />
        ) : (
          <div>No File</div>
        );
      }
    },
    {
      accessorKey: 'attachments',
      header: 'Student Attachments',
      cell: ({ row }) => {
        const attachments = row.original.attachments || [];
        return attachments.map((attachment) => (
          <ViewAttachmentComponent
            key={attachment.attachmentId}
            schoolId={schoolId}
            attachmentId={attachment.attachmentId}
            attachmentName={attachment.attachmentName}
          />
        ));
      }
    },
    {
      accessorKey: 'comments',
      header: 'Comments',
      cell: ({ row }) => <div>{row.getValue('comments')}</div>
    },
    {
      accessorKey: 'grade',
      header: 'Grade',
      cell: ({ row }) => <div>{row.getValue('grade')}</div>
    },
    {
      accessorKey: 'feedback',
      header: 'Feedback',
      cell: ({ row }) => <div>{row.getValue('feedback')}</div>
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status');
        return <div className={status === 'GRADED' ? 'text-green-600' : ''}>{status}</div>;
      }
    },
    {
      accessorKey: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        const submission = row.original;
        const isGraded = submission.status === 'GRADED';
        const buttonText = isGraded ? 'Update' : 'Review';

        return (
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              onClick={() => {
                setSelectedSubmissionId(submission.assignmentSubmissionId);
                setIsReviewDialogOpen(true);
                setButtonTextMap((prev) => ({
                  ...prev,
                  [submission.assignmentSubmissionId]: buttonText // Set text based on status
                }));
              }}
            >
              {buttonTextMap[submission.assignmentSubmissionId] || buttonText}
            </Button>
          </div>
        );
      }
    }
  ];

  return (
    <>
      <div className="mt-5">
        <TitleBar title="Assignment Review" />
      </div>

      <div className="flex flex-wrap border bg-slate-50 dark:bg-slate-950 rounded-2xl p-4 shadow-3xl items-end gap-4">
        <div className="w-[180px]">
          <label className="block mb-2 font-semibold">
            Standard <span className="text-red-600">*</span>
          </label>
          <Select
            onValueChange={(value) => {
              setSelectedStandardId(value);
              setSelectedSubjectId(null);
            }}
            value={selectedStandardId || ''}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a Standard" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {uniqueStandards.map((standardDto) => (
                  <SelectItem key={standardDto.standardId} value={standardDto.standardId}>
                    {standardDto.title}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="w-[180px]">
          <label className="block mb-2 font-semibold">
            Subject <span className="text-red-600">*</span>
          </label>
          <Select
            onValueChange={(value) => {
              setSelectedSubjectId(value);
            }}
            value={selectedSubjectId || ''}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {uniqueSubjects.map((subject) => (
                  <SelectItem key={subject.subjectId} value={subject.subjectId}>
                    {subject.subjectName}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="w-[180px]">
          <label className="block mb-2 font-semibold">
            Assignment Title <span className="text-red-600">*</span>
          </label>
          <Select
            onValueChange={(value) => setSelectedAssignmentId(value)}
            value={selectedAssignmentId || ''}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an Assignment" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {uniqueAssignments.map((assignment) => (
                  <SelectItem key={assignment.assignmentId} value={assignment.assignmentId}>
                    {assignment.title}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-8">
        <DataTable columns={Columns} data={assignmentData?.data?.content ?? []} />
      </div>

      <Modal
        title={selectedSubmissionId ? 'Update Assignment Review' : 'Add Assignment Review'}
        open={isReviewDialogOpen}
        onOpenChange={(isOpen) => {
          setIsReviewDialogOpen(isOpen);
          if (!isOpen) {
            setButtonTextMap((prev) => ({
              ...prev,
              [selectedSubmissionId || -1]: 'Review' // Reset button text for the specific row
            }));
          }
        }}
      >
        <AssignmentReviewForm
          submissionId={selectedSubmissionId}
          onClose={() => setIsReviewDialogOpen(false)}
        />
      </Modal>
    </>
  );
}

export default AssignmentReview;

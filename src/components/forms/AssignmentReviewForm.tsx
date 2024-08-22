'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '../ui/textarea';
import { assignmentReviewSchema } from './schema/assignmentReviewSchema';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { useUpdateReviewAssignment } from '@/services/mutation/teacher/assignment/assignment'; // Ensure to import useGetSingleAssignmentsSubmittions
import { ReloadIcon } from '@radix-ui/react-icons';
import { useGetSingleAssignmentsSubmittions } from '@/services/queries/teacher/assignment/assignment';

type AssignmentReviewFormProps = {
  submissionId?: number | null;
  onClose: () => void;
};

const formSchema = assignmentReviewSchema;

export const AssignmentReviewForm: React.FC<AssignmentReviewFormProps> = ({
  submissionId,
  onClose
}) => {
  const { schoolId } = useSchoolContext();
  const updateAssignmentReviewMutation = useUpdateReviewAssignment();
  const { data: submissionData } = useGetSingleAssignmentsSubmittions(schoolId, submissionId);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      feedback: submissionData?.data?.feedback || '',
      grade: submissionData?.data?.grade || ''
    }
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const updateData = {
      feedback: values.feedback,
      grade: values.grade,
      schoolId,
      assignmentSubmissionId: submissionId
    };

    updateAssignmentReviewMutation.mutate(updateData, {
      onSuccess: () => {
        onClose();
      },
      onError: (error) => {
        console.error('Update failed', error);
        // Optionally show an error message to the user
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="w-100 mb-3">
          <h2 className="mb-3 uppercase text-slate-400 text-sm">Assignment Review:</h2>
        </div>

        <div className="mb-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FormField
              control={form.control}
              name="feedback"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Feedback<span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea placeholder="Provide feedback" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormField
              control={form.control}
              name="grade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Grade<span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Grade" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={updateAssignmentReviewMutation.isPending}
            aria-disabled={updateAssignmentReviewMutation.isPending}
          >
            {updateAssignmentReviewMutation.isPending ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Please wait...
              </>
            ) : (
              'Submit'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

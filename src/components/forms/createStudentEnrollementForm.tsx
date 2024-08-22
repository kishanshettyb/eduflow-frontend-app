'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Select from 'react-select';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { useGetGroupSubjectTypes } from '@/services/queries/admin/standarSubject';
import { useCreateCEnrollment, useUpdateEnrollment } from '@/services/mutation/admin/enrollment';
import { useSearchParams } from 'next/navigation';
import { useGetAllStandards, useSectionByStandard } from '@/services/queries/admin/standard';
import { useGetSingleStudent } from '@/services/queries/admin/student';
import { useGetStudentEnrollment } from '@/services/queries/admin/enrollment';

const formSchema = z.object({
  standards: z.string().min(1, {
    message: 'Please select a standard.'
  }),
  sections: z.string().min(1, {
    message: 'Please select a section.'
  }),
  language1: z.number().min(1, {
    message: 'Please select a Language-1 subject.'
  }),
  language2: z.number().min(1, {
    message: 'Please select a Language-2 subject.'
  }),
  core: z.number().array().optional(),
  additional: z.number().array().optional()
});

function EnrollmentForm({ studentId }) {
  const searchParams = useSearchParams();
  const id = searchParams?.get('studentId');
  const { schoolId, academicYearId } = useSchoolContext();

  const { data: singleStudentData } = useGetSingleStudent(schoolId, id);
  const { data: standardsData } = useGetAllStandards(schoolId, academicYearId);

  const [selectedStandard, setSelectedStandard] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const { data: sectionsData } = useSectionByStandard(schoolId, academicYearId, selectedStandard);

  const { data: subjectTypesData } = useGetGroupSubjectTypes(
    schoolId,
    academicYearId,
    selectedStandard,
    selectedSection
  );
  const enrollmentId = singleStudentData?.data?.enrollmentStudentDto?.enrollmentId;
  const createEnrollmentMutate = useCreateCEnrollment();
  const updateEnrollmentMutate = useUpdateEnrollment();
  const { data: singleStudentEnrollmentData } = useGetStudentEnrollment(
    schoolId,
    id,
    academicYearId
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      standards: '',
      sections: '',
      language1: '',
      language2: '',
      core: [],
      additional: []
    }
  });

  // Set all core options selected when subjectTypesData changes
  useEffect(() => {
    if (subjectTypesData?.data['Core']) {
      form.setValue(
        'core',
        subjectTypesData.data['Core'].map((subject) => subject.subjectDto.subjectId)
      );
    }
  }, [subjectTypesData, form]);

  // Pre-fill the form fields if the student already has an enrollment
  useEffect(() => {
    if (singleStudentData?.data?.enrollmentStudentDto && enrollmentId) {
      const enrollment = singleStudentData.data?.enrollmentStudentDto;
      const [standard, section] = enrollment.standardSection.split('');
      setSelectedStandard(standard);
      setSelectedSection(section);
      form.setValue('standards', standard);
      form.setValue('sections', section);
    }
  }, [enrollmentId, singleStudentData, form]);

  // Pre-fill the form fields with the student's existing enrollment data
  useEffect(() => {
    if (singleStudentEnrollmentData) {
      const enrollment = singleStudentEnrollmentData.data;
      setSelectedStandard(enrollment?.standardDto.standard);
      setSelectedSection(enrollment?.standardDto.section);
      form.setValue('standards', enrollment?.standardDto.standard);
      form.setValue('sections', enrollment?.standardDto.section);
      form.setValue(
        'language1',
        enrollment?.enrollmentSubjectDtosMap['Language-1']?.[0]?.subjectId || ''
      );
      form.setValue(
        'language2',
        enrollment?.enrollmentSubjectDtosMap['Language-2']?.[0]?.subjectId || ''
      );
      form.setValue(
        'core',
        enrollment?.enrollmentSubjectDtosMap['Core']?.map((subject) => subject.subjectId) || []
      );
      form.setValue(
        'additional',
        enrollment?.enrollmentSubjectDtosMap['Additional']?.map((subject) => subject.subjectId) ||
          []
      );
    }
  }, [singleStudentEnrollmentData, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const subjects = {
      [values.language1]: 'Language-1',
      [values.language2]: 'Language-2',
      ...values.additional.reduce((acc, subjectId) => {
        acc[subjectId] = 'Additional';
        return acc;
      }, {})
    };

    const payload = {
      schoolId,
      studentId: studentId,
      enrollmentId: enrollmentId,
      academicYearId,
      status: 'ACTIVE',
      isActive: true,
      standardDto: {
        standard: values.standards,
        section: values.sections
      },
      subjects
    };

    const mutation = enrollmentId ? updateEnrollmentMutate : createEnrollmentMutate;
    mutation.mutate(payload);
  }

  function handleStandardChange(option) {
    setSelectedStandard(option.value);
    setSelectedSection('');
    form.reset({
      standards: option.value,
      sections: '',
      language1: '',
      language2: '',
      core: [],
      additional: []
    });
  }

  function handleSectionChange(option) {
    setSelectedSection(option.value);
    form.setValue('sections', option.value);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
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
                  <FormControl>
                    <Select
                      className="dark:text-slate-900"
                      options={standardsData?.data?.map((standard) => ({
                        value: standard,
                        label: standard
                      }))}
                      onChange={(option) => {
                        field.onChange(option.value);
                        handleStandardChange(option);
                      }}
                      value={field.value ? { value: field.value, label: field.value } : null}
                    />
                  </FormControl>
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
                  <FormControl>
                    <Select
                      className="dark:text-slate-900"
                      options={sectionsData?.data?.map((section) => ({
                        value: section,
                        label: section
                      }))}
                      onChange={(option) => {
                        field.onChange(option.value);
                        handleSectionChange(option);
                      }}
                      value={field.value ? { value: field.value, label: field.value } : null}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name="language1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Language-1<span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Select
                      className="dark:text-slate-900"
                      options={subjectTypesData?.data['Language-1']?.map((subject) => ({
                        value: subject.subjectDto.subjectId,
                        label: subject.subjectDto.subjectName
                      }))}
                      onChange={(option) => field.onChange(option.value)}
                      value={
                        field.value
                          ? {
                              value: field.value,
                              label: subjectTypesData?.data['Language-1']?.find(
                                (subject) => subject.subjectDto.subjectId === field.value
                              )?.subjectDto.subjectName
                            }
                          : null
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Language-2 Dropdown */}
          <div>
            <FormField
              control={form.control}
              name="language2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Language-2<span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Select
                      className="dark:text-slate-900"
                      options={subjectTypesData?.data['Language-2']?.map((subject) => ({
                        value: subject.subjectDto.subjectId,
                        label: subject.subjectDto.subjectName
                      }))}
                      onChange={(option) => field.onChange(option.value)}
                      value={
                        field.value
                          ? {
                              value: field.value,
                              label: subjectTypesData?.data['Language-2']?.find(
                                (subject) => subject.subjectDto.subjectId === field.value
                              )?.subjectDto.subjectName
                            }
                          : null
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormField
              control={form.control}
              name="core"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Core<span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Select
                      className="dark:text-slate-900"
                      isMulti
                      options={subjectTypesData?.data['Core']?.map((subject) => ({
                        value: subject.subjectDto.subjectId,
                        label: subject.subjectDto.subjectName
                      }))}
                      value={field.value?.map((value) => ({
                        value: value,
                        label: subjectTypesData?.data['Core']?.find(
                          (subject) => subject.subjectDto.subjectId === value
                        )?.subjectDto.subjectName
                      }))}
                      isDisabled={true} // Disable the dropdown
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name="additional"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Subjects</FormLabel>
                  <FormControl>
                    <Select
                      className="dark:text-slate-900"
                      options={subjectTypesData?.data['Additional']?.map((subject) => ({
                        value: subject.subjectDto.subjectId,
                        label: subject.subjectDto.subjectName
                      }))}
                      isMulti
                      onChange={(options) => field.onChange(options.map((option) => option.value))}
                      value={
                        field.value?.map((value) => ({
                          value,
                          label: subjectTypesData?.data['Additional']?.find(
                            (subject) => subject.subjectDto.subjectId === value
                          )?.subjectDto.subjectName
                        })) || []
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex items-center justify-end space-x-2">
          <Button type="submit">{enrollmentId ? 'Update Enrollment' : 'Create Enrollment'}</Button>
        </div>
      </form>
    </Form>
  );
}

export default EnrollmentForm;
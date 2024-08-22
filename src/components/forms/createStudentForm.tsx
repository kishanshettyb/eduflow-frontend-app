'use client';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';

import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Calendar } from '../ui/calendar';
import { studentSchema } from './schema/studentSchema';
import { useSearchParams } from 'next/navigation';
import { useCreateStudent, useUpdateStudent } from '@/services/mutation/admin/student';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { useGetSingleStudent } from '@/services/queries/admin/student';
import { ReloadIcon } from '@radix-ui/react-icons';
import 'react-day-picker/dist/style.css';
import moment from 'moment';

type CreateStudentFormProps = {
  selectedFile: File | null;
  // eslint-disable-next-line no-unused-vars
  onSuccess: (studentId: number) => void;
  deleteAttachment: boolean;
};
const formSchema = studentSchema;

export const CreateStudentForm: React.FC<CreateStudentFormProps> = ({
  selectedFile,
  deleteAttachment,
  onSuccess
}) => {
  const { schoolId } = useSchoolContext();
  const searchParams = useSearchParams();
  const id = searchParams?.get('studentId');
  const { data: singleStudentData, error: singleStudentError } = useGetSingleStudent(schoolId, id);
  const [sameAddress, setSameAddress] = useState(true);
  const createStudentMutation = useCreateStudent();
  const updateStudentMutation = useUpdateStudent();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      contactNumber: '',
      gender: '',
      isActive: 'true',
      dateOfBirth: '',
      admissionDate: new Date(),
      parentContactNumber: '',
      fatherName: '',
      motherName: '',
      emergencyContact: '',
      emergencyContactName: '',
      currentAddress: {
        streetName: '',
        city: '',
        state: '',
        pinCode: '',
        country: ''
      },
      permanentAddress: {
        streetName: '',
        city: '',
        state: '',
        pinCode: '',
        country: ''
      }
    }
  });

  const currentAddress = useWatch({
    control: form.control,
    name: 'currentAddress'
  });

  useEffect(() => {
    if (singleStudentData && !singleStudentError) {
      const student = singleStudentData.data;
      form.reset({
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        contactNumber: student.contactNumber.toString(),
        dateOfBirth: new Date(student.dateOfBirth),
        fatherName: student.fatherName,
        motherName: student.motherName,
        parentContactNumber: student.parentContactNumber.toString(),
        emergencyContact: student.emergencyContact.toString(),
        emergencyContactName: student.emergencyContactName,
        bloodGroup: student.bloodGroup,
        gender: student.gender.toLowerCase(),
        isActive: student.isActive,
        admissionDate: new Date(student.admissionDate),

        currentAddress: {
          streetName: student.currentAddress.streetName,
          city: student.currentAddress.city,
          state: student.currentAddress.state,
          pinCode: student.currentAddress.pinCode.toString(),
          country: student.currentAddress.country
        },
        permanentAddress: {
          streetName: student.permanentAddress.streetName,
          city: student.permanentAddress.city,
          state: student.permanentAddress.state,
          pinCode: student.permanentAddress.pinCode.toString(),
          country: student.permanentAddress.country
        }
      });
    }
  }, [singleStudentData, singleStudentError, form]);

  useEffect(() => {
    if (sameAddress) {
      form.setValue('permanentAddress', currentAddress);
    }
  }, [currentAddress, sameAddress, form]);

  const handleCheckboxChange = (checked: boolean) => {
    setSameAddress(checked);
    if (checked) {
      form.setValue('permanentAddress', currentAddress);
    } else {
      form.setValue('permanentAddress', {
        streetName: '',
        city: '',
        state: '',
        pinCode: '',
        country: ''
      });
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    const student = {
      studentId: id,
      schoolId: schoolId,
      firstName: values.firstName,
      lastName: values.lastName,
      bloodGroup: values.bloodGroup,
      email: values.email,
      contactNumber: values.contactNumber.toString(),
      dateOfBirth: format(values.dateOfBirth, 'yyyy-MM-dd'),
      gender: values.gender,
      admissionDate: format(values.admissionDate, 'yyyy-MM-dd'),
      isActive: values.isActive,
      parentContactNumber: values.parentContactNumber.toString(),
      fatherName: values.fatherName,
      motherName: values.motherName,
      emergencyContact: values.emergencyContact.toString(),
      emergencyContactName: values.emergencyContactName,
      currentAddress: values.currentAddress,
      permanentAddress: values.permanentAddress,
      deleteAttachment
    };

    formData.append(
      'studentDto',
      new Blob([JSON.stringify(student)], {
        type: 'application/json'
      })
    );

    if (selectedFile) {
      formData.append('file', selectedFile);
    }

    const mutation = id && !singleStudentError ? updateStudentMutation : createStudentMutation;

    mutation.mutate(formData, {
      onSuccess: (response) => {
        const newstudentId = response.studentId;
        onSuccess(newstudentId);
        // Ensure the form does not reset or clear
      },
      onError: (error) => {
        console.error('Error in onSubmit:', error);
      }
    });
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="w-100 mb-3">
            <h2 className="mb-3 uppercase text-slate-400 text-sm">Basic Details:</h2>
          </div>
          <div className="mb-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <FormField
                className="w-full"
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      First Name<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="First Name"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^A-Za-z]/g, '');
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Last Name <span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Last Name"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^A-Za-z]/g, '');
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Phone<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Phone"
                        {...field}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                          if (value.length > 10) {
                            value = value.slice(0, 10); // Limit to 10 digits
                          }
                          field.onChange(value.toString()); // Convert value to string before setting
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Date of birth<span className="text-red-600">*</span>
                    </FormLabel>
                    <Popover className="w-[400px]">
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <Calendar
                          mode="single"
                          selected={field.value || new Date()}
                          onSelect={field.onChange}
                          captionLayout="dropdown"
                          fromYear={moment().year() - 118}
                          toYear={moment().year()}
                          disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-xs text-red-600" />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="fatherName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Father Name<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Father Name"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Remove leading numbers
                          if (/^\d/.test(value)) {
                            field.onChange(value.replace(/^\d+/, ''));
                          } else {
                            field.onChange(value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="motherName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Mother Name<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Mother Name"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Remove leading numbers
                          if (/^\d/.test(value)) {
                            field.onChange(value.replace(/^\d+/, ''));
                          } else {
                            field.onChange(value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="parentContactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Parent Contact<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Phone"
                        {...field}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                          if (value.length > 10) {
                            value = value.slice(0, 10); // Limit to 10 digits
                          }
                          field.onChange(value.toString()); // Convert value to string before setting
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormField
                control={form.control}
                name="emergencyContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Emergency Contact<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Emergency Contact"
                        {...field}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                          if (value.length > 10) {
                            value = value.slice(0, 10); // Limit to 10 digits
                          }
                          field.onChange(value.toString()); // Convert value to string before setting
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="emergencyContactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Emergency Contact Name<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Emergency Contact Name"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Remove leading numbers
                          if (/^\d/.test(value)) {
                            field.onChange(value.replace(/^\d+/, ''));
                          } else {
                            field.onChange(value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="bloodGroup"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Blood Group<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Blood Group" {...field} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormField
                control={form.control}
                name="admissionDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Admission Date<span className="text-red-600">*</span>
                    </FormLabel>
                    <Popover className="w-[400px]">
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <Calendar
                          mode="single"
                          selected={field.value || new Date()}
                          onSelect={field.onChange}
                          captionLayout="dropdown"
                          fromYear={moment().year() - 118}
                          toYear={moment().year()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-xs text-red-600" />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>
                      Gender<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>
                      isActive<span className="text-red-600">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">True</SelectItem>
                        <SelectItem value="false">False</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="w-100 mb-5">
            <h2 className="mb-3  uppercase text-slate-400 text-sm">Current Address:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormField
                  className="w-full"
                  control={form.control}
                  name="currentAddress.streetName" // Corrected field name
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Street Name<span className="text-red-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Building & Street Name" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  className="w-full"
                  control={form.control}
                  name="currentAddress.city" // Corrected field name
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        City<span className="text-red-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <FormField
                  className="w-full"
                  control={form.control}
                  name="currentAddress.pinCode" // Corrected field name
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Pincode<span className="text-red-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Pincode"
                          {...field}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                            if (value.length > 6) {
                              value = value.slice(0, 6); // Limit to 6 digits
                            }
                            field.onChange(value.toString()); // Convert value to string before setting
                          }}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  className="w-full"
                  control={form.control}
                  name="currentAddress.state" // Corrected field name
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        State<span className="text-red-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="State" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  className="w-full"
                  control={form.control}
                  name="currentAddress.country" // Corrected field name
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Country<span className="text-red-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Country" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <h2 className="mb-3  uppercase text-slate-400 text-sm">Permanent Address:</h2>
          <div className="flex items-center space-x-2 mb-5">
            <Checkbox id="terms" checked={sameAddress} onCheckedChange={handleCheckboxChange} />
            <label
              htmlFor="terms"
              className="text-sm font-medium text-slate-800 dark:text-slate-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Current Address same as Permanent Address:
            </label>
          </div>
          <div className={`${sameAddress ? 'w-100 mb-5  hidden' : 'w-100 mb-5 block'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormField
                  className="w-full"
                  control={form.control}
                  name="permanentAddress.streetName" // Corrected field name
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Street Name<span className="text-red-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Building & Street Name" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  className="w-full"
                  control={form.control}
                  name="permanentAddress.city" // Corrected field name
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        City<span className="text-red-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <FormField
                  className="w-full"
                  control={form.control}
                  name="permanentAddress.pinCode" // Corrected field name
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Pincode<span className="text-red-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Pincode"
                          {...field}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                            if (value.length > 6) {
                              value = value.slice(0, 6); // Limit to 6 digits
                            }
                            field.onChange(value.toString()); // Convert value to string before setting
                          }}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  className="w-full"
                  control={form.control}
                  name="permanentAddress.state" // Corrected field name
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        State<span className="text-red-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="State" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  className="w-full"
                  control={form.control}
                  name="permanentAddress.country" // Corrected field name
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Country<span className="text-red-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Country" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end space-x-2">
            <Button
              type="submit"
              disabled={createStudentMutation.isPending || updateStudentMutation.isPending}
            >
              {(createStudentMutation.isPending || updateStudentMutation.isPending) && (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Please wait...
                </>
              )}
              {!createStudentMutation.isPending &&
                !updateStudentMutation.isPending &&
                (id && !singleStudentError ? 'Save & Next' : 'Save Student & Next')}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

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
import { useSearchParams } from 'next/navigation';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { ReloadIcon } from '@radix-ui/react-icons';
import { staffschema } from './schema/staffSchema';
import { useGetSingleStaff } from '@/services/queries/superadmin/admins';
import { useGetAllDepartments } from '@/services/queries/superadmin/departments';
import { useCreateAdmin, useUpdateAdmin } from '@/services/mutation/superadmin/admin';
import moment from 'moment';

type CreateStaffFormProps = {
  selectedFile: File | null;
  // eslint-disable-next-line no-unused-vars
  onSuccess: (staffId: number) => void;
};

const formSchema = staffschema;
const calculateDefaultDOB = () => {
  const today = new Date();
  const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  return eighteenYearsAgo;
};

export const CreateStaffInfoForm: React.FC<CreateStaffFormProps> = ({
  selectedFile,
  onSuccess
}) => {
  const [sameAddress, setSameAddress] = useState(true);
  const { schoolId } = useSchoolContext();
  const searchParams = useSearchParams();
  const id = searchParams?.get('staffId');
  const { data: singleStaffData, error: singleStaffError } = useGetSingleStaff(schoolId, id);
  const { data: departmentsData } = useGetAllDepartments(schoolId);
  const createStaffMutation = useCreateAdmin();
  const updateStaffMutation = useUpdateAdmin();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      contactNumber: '',
      gender: '',
      employmentStatus: 'ACTIVE',
      staffType: '',
      departmentId: '',
      joiningDate: new Date(),
      dateOfBirth: calculateDefaultDOB(),
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

  const [staffTypes] = useState([
    { value: 'ROLE_TEACHER', label: 'TEACHER' },
    { value: 'ROLE_SECURITY', label: 'SECURITY' },
    { value: 'ROLE_HOUSE_KEEPING', label: 'HOUSE_KEEPING' },
    { value: 'ROLE_DRIVER', label: 'DRIVER' }
  ]);

  useEffect(() => {
    if (singleStaffData && !singleStaffError) {
      const staff = singleStaffData.data;
      form.reset({
        firstName: staff.firstName,
        lastName: staff.lastName,
        email: staff.email,
        contactNumber: staff.contactNumber.toString(),
        dateOfBirth: new Date(staff.dateOfBirth),
        gender: staff.gender,
        employmentStatus: staff.employmentStatus,
        departmentId: staff.departmentId.toString(),
        staffType: staff.staffType,
        joiningDate: new Date(staff.joiningDate),
        fatherName: staff.fatherName,
        motherName: staff.motherName,
        emergencyContact: staff.emergencyContact.toString(),
        emergencyContactName: staff.emergencyContactName,
        currentAddress: {
          streetName: staff.currentAddress.streetName,
          city: staff.currentAddress.city,
          state: staff.currentAddress.state,
          pinCode: staff.currentAddress.pinCode.toString(),
          country: staff.currentAddress.country
        },
        permanentAddress: {
          streetName: staff.permanentAddress.streetName,
          city: staff.permanentAddress.city,
          state: staff.permanentAddress.state,
          pinCode: staff.permanentAddress.pinCode.toString(),
          country: staff.permanentAddress.country
        }
      });
    }
  }, [singleStaffData, singleStaffError, form]);

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
  function onSubmit(values: z.infer<typeof formStaffSchema>) {
    const formData = new FormData();
    const staffs = {
      schoolId: schoolId,
      staffId: id,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      contactNumber: values.contactNumber.toString(),
      dateOfBirth: format(values.dateOfBirth, 'yyyy-MM-dd'),
      gender: values.gender,
      employmentStatus: values.employmentStatus,
      departmentId: values.departmentId,
      staffType: values.staffType,
      joiningDate: format(values.joiningDate, 'yyyy-MM-dd'),
      fatherName: values.fatherName,
      motherName: values.motherName,
      emergencyContact: values.emergencyContact.toString(),
      emergencyContactName: values.emergencyContactName,
      currentAddress: values.currentAddress,
      permanentAddress: values.permanentAddress
    };

    formData.append(
      'staffDto',
      new Blob([JSON.stringify(staffs)], {
        type: 'application/json'
      })
    );

    if (selectedFile) {
      formData.append('file', selectedFile);
    }

    const mutation = id && !singleStaffError ? updateStaffMutation : createStaffMutation;

    mutation.mutate(formData, {
      onSuccess: (response) => {
        const newstaffId = response.staffId;
        onSuccess(newstaffId);
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
                          let value = e.target.value.replace(/\D/g, '');
                          if (value.length > 10) {
                            value = value.slice(0, 10);
                          }
                          field.onChange(value.toString());
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
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          captionLayout="dropdown-buttons"
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
                  <FormItem>
                    <FormLabel>
                      Gender<span className="text-red-600">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormField
                className="w-full"
                control={form.control}
                name="fatherName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Father Name<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Father Name" {...field} />
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
                      Mother Name <span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Mother Name" {...field} />
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
                          let value = e.target.value.replace(/\D/g, '');
                          if (value.length > 10) {
                            value = value.slice(0, 10);
                          }
                          field.onChange(value.toString());
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
                name="staffType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Staff Type<span className="text-red-600">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Staff Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {staffTypes.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
          </div>
          <div className="w-100 mb-5">
            <h2 className="mb-3  uppercase text-slate-400 text-sm">Employment Details:</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <FormField
                  control={form.control}
                  name="employmentStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Employment Status<span className="text-red-600">*</span>
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
                          <SelectItem value="ACTIVE">Active</SelectItem>
                          <SelectItem value="IN_ACTIVE">Inactive</SelectItem>
                          <SelectItem value="SUSPENDED">Suspended</SelectItem>
                          <SelectItem value="SABBATICAL">Sabbatical</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="departmentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Department<span className="text-red-600">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departmentsData?.data.map((department) => (
                            <SelectItem
                              key={department.departmentId}
                              value={department.departmentId.toString()}
                            >
                              {department.departmentName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="joiningDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Joining Date<span className="text-red-600">*</span>
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
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            captionLayout="dropdown-buttons"
                            fromYear={2000}
                            toYear={2024}
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
            </div>
          </div>

          <div className="w-100 mb-5">
            <h2 className="mb-3  uppercase text-slate-400 text-sm">Current Address:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormField
                  className="w-full"
                  control={form.control}
                  name="currentAddress.streetName"
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
                  name="currentAddress.city"
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
                  name="currentAddress.pinCode"
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
                  name="currentAddress.state"
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
                  name="currentAddress.country"
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
              className="text-sm font-medium text-slate-800 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Current Address same as Permanent Address
            </label>
          </div>
          <div className={`${sameAddress ? 'w-100 mb-5  hidden' : 'w-100 mb-5 block'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormField
                  className="w-full"
                  control={form.control}
                  name="permanentAddress.streetName"
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
                  name="permanentAddress.city"
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
                  name="permanentAddress.pinCode"
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
                            let value = e.target.value.replace(/\D/g, '');
                            if (value.length > 6) {
                              value = value.slice(0, 6);
                            }
                            field.onChange(value.toString());
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
                  name="permanentAddress.state"
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
                  name="permanentAddress.country"
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
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={createStaffMutation.isPending || updateStaffMutation.isPending}
            >
              {(createStaffMutation.isPending || updateStaffMutation.isPending) && (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Please wait...
                </>
              )}
              {!createStaffMutation.isPending &&
                !updateStaffMutation.isPending &&
                (id && !singleStaffError ? 'Update ' : 'Create ')}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

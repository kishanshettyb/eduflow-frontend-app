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
import { useRouter, useSearchParams } from 'next/navigation';
import { useGetSingleAdmin } from '@/services/queries/superadmin/admins';
import { useEffect, useState } from 'react';
import { Calendar } from '../ui/calendar';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useGetAllDepartments } from '@/services/queries/superadmin/departments';
import { useCreateAdmin, useUpdateAdmin } from '@/services/mutation/superadmin/admin';
import { adminSchema } from './schema/adminSchema';
import moment from 'moment';
import 'react-day-picker/dist/style.css';

type CreateAdminFormProps = {
  selectedFile: File | null;
};
const formSchema = adminSchema;

export const CreateAdminForm: React.FC<CreateAdminFormProps> = ({ selectedFile }) => {
  const searchParams = useSearchParams();
  const id = searchParams.get('staffId');
  const schoolId = searchParams.get('schoolId');
  const [sameAddress, setSameAddress] = useState(true);
  const router = useRouter();
  const { data: singleAdminData, error: singleAdminError } = useGetSingleAdmin(schoolId, id);
  const { data: departmentsData } = useGetAllDepartments(schoolId);

  const createAdminMutation = useCreateAdmin();
  const updateAdminMutation = useUpdateAdmin();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      contactNumber: '',
      gender: '',
      employmentStatus: 'ACTIVE',
      departmentId: '',
      joiningDate: null,
      dateOfBirth: null,
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
    if (singleAdminData && !singleAdminError) {
      const admin = singleAdminData.data;
      form.reset({
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        contactNumber: admin.contactNumber.toString(),
        dateOfBirth: new Date(admin.dateOfBirth),
        gender: admin.gender,
        employmentStatus: admin.employmentStatus,
        departmentId: admin.departmentId,
        joiningDate: new Date(admin.joiningDate),
        fatherName: admin.fatherName,
        motherName: admin.motherName,
        emergencyContact: admin.emergencyContact.toString(),
        emergencyContactName: admin.emergencyContactName,
        currentAddress: {
          streetName: admin.currentAddress.streetName,
          city: admin.currentAddress.city,
          state: admin.currentAddress.state,
          pinCode: admin.currentAddress.pinCode.toString(),
          country: admin.currentAddress.country
        },
        permanentAddress: {
          streetName: admin.permanentAddress.streetName,
          city: admin.permanentAddress.city,
          state: admin.permanentAddress.state,
          pinCode: admin.permanentAddress.pinCode.toString(),
          country: admin.permanentAddress.country
        }
      });
    }
  }, [singleAdminData, singleAdminError, form]);

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
      joiningDate: format(values.joiningDate, 'yyyy-MM-dd'),
      fatherName: values.fatherName,
      motherName: values.motherName,
      emergencyContact: values.emergencyContact.toString(),
      emergencyContactName: values.emergencyContactName,
      staffType: 'ROLE_ADMIN',
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

    const mutation = id && !singleAdminError ? updateAdminMutation : createAdminMutation;
    mutation.mutate(formData, {
      onSuccess: () => {
        router.push(`/superadmin/admins?schoolId=${schoolId}`);
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
                          const value = e.target.value.replace(/[^A-Za-z\s]/g, '');
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
                          const value = e.target.value.replace(/[^A-Za-z\s]/g, '');
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
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          captionLayout="dropdown-buttons"
                          fromYear={moment().year() - 118}
                          toYear={moment().year() - 18}
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
                      <Input
                        placeholder="Father Name"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^A-Za-z\s]/g, '');
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
                name="motherName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Mother Name <span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Mother Name"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^A-Za-z\s]/g, '');
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
                name="emergencyContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Emergency Mobile No.<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Emergency Mobile No."
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
                      Emergency Contact <span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Emergency Contact"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^A-Za-z\s]/g, '');
                          field.onChange(value);
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
                        <Input
                          placeholder="City"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^A-Za-z\s]/g, '');
                            field.onChange(value);
                          }}
                        />
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
                        <Input
                          placeholder="State"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^A-Za-z\s]/g, '');
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
                  className="w-full"
                  control={form.control}
                  name="currentAddress.country" // Corrected field name
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Country<span className="text-red-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Country"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^A-Za-z\s]/g, '');
                            field.onChange(value);
                          }}
                        />
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
              className="text-sm font-medium text-slate-800 dark:text-slate-400 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={createAdminMutation.isPending || updateAdminMutation.isPending}
            >
              {(createAdminMutation.isPending || updateAdminMutation.isPending) && (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Please wait...
                </>
              )}
              {!createAdminMutation.isPending &&
                !updateAdminMutation.isPending &&
                (id && !singleAdminError ? 'Update Admin' : 'Create Admin')}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

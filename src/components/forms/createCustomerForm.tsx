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
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { customerSchema } from './schema/customerSchema';
import { useGetSingleCustomer } from '@/services/queries/superadmin/cutomer';
import { Calendar } from '../ui/calendar';
import { ReloadIcon } from '@radix-ui/react-icons';
import 'react-day-picker/dist/style.css';
import { useCreateCustomer, useUpdateCustomer } from '@/services/mutation/superadmin/customer';
const formSchema = customerSchema;
type CreateCustomerFormProps = {
  selectedFile: File | null;
};
export const CreateCustomerForm: React.FC<CreateCustomerFormProps> = ({ selectedFile }) => {
  const searchParams = useSearchParams();
  const id = searchParams.get('customerId');
  const { data: singleCustomerData, error: singleCustomerError } = useGetSingleCustomer(id);
  const createCustomerMutation = useCreateCustomer();
  const updateCustomerMutation = useUpdateCustomer();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      mobileNumber: '',
      dateOfBirth: '',
      gstNumber: '',
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
  const [sameAddress, setSameAddress] = useState(true);
  const currentAddress = useWatch({
    control: form.control,
    name: 'currentAddress'
  });
  useEffect(() => {
    if (singleCustomerData && !singleCustomerError) {
      const customer = singleCustomerData.data;
      form.reset({
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        mobileNumber: customer.mobileNumber.toString(),
        dateOfBirth: new Date(customer.dateOfBirth),
        gstNumber: customer.gstNumber,
        currentAddress: {
          streetName: customer.currentAddress.streetName,
          city: customer.currentAddress.city,
          state: customer.currentAddress.state,
          pinCode: customer.currentAddress.pinCode.toString(),
          country: customer.currentAddress.country
        },
        permanentAddress: {
          streetName: customer.permanentAddress.streetName,
          city: customer.permanentAddress.city,
          state: customer.permanentAddress.state,
          pinCode: customer.permanentAddress.pinCode.toString(),
          country: customer.permanentAddress.country
        }
      });
    }
  }, [singleCustomerData, singleCustomerError, form]);

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
    const customer = {
      customerId: id,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      mobileNumber: values.mobileNumber.toString(),
      dateOfBirth: values.dateOfBirth,
      gstNumber: values.gstNumber,
      currentAddress: values.currentAddress,
      permanentAddress: values.permanentAddress
    };

    formData.append(
      'customerDto',
      new Blob([JSON.stringify(customer)], {
        type: 'application/json'
      })
    );

    if (selectedFile) {
      formData.append('file', selectedFile);
    }

    const mutation = id && !singleCustomerError ? updateCustomerMutation : createCustomerMutation;
    mutation.mutate(formData);
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="w-100 mb-3">
            <h2 className="mb-3 uppercase text-slate-400 text-sm">Basic Details:</h2>
          </div>
          <div className="mb-5 grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4">
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
                name="mobileNumber"
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
                name="gstNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GST</FormLabel>
                    <FormControl>
                      <Input placeholder="Eg. 12ABCDE3456F7G8H9" {...field} />
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
                      Date of Incorporation<span className="text-red-600">*</span>
                    </FormLabel>
                    <Popover className="w-auto">
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
                          selected={field.value}
                          onSelect={field.onChange}
                          captionLayout="dropdown"
                          fromYear={2024 - 118}
                          toYear={2030}
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
          <div className="w-100 mb-5">
            <h2 className="mb-3  uppercase text-slate-400 text-sm">Current Address:</h2>
            <div className="grid grid-cols-1 mb-5  gap-4">
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
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-4">
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
              Current Address same as Permanent Address
            </label>
          </div>
          <div className={`${sameAddress ? 'w-100 mb-5  hidden' : 'w-100 mb-5 block'}`}>
            <div className="grid grid-cols-1 mb-5   gap-4">
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
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-4">
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

          <div className="w-100 mb-3"></div>
          <div className="flex items-center justify-end space-x-2">
            <Button
              type="submit"
              disabled={createCustomerMutation.isPending || updateCustomerMutation.isPending}
            >
              {(createCustomerMutation.isPending || updateCustomerMutation.isPending) && (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Please wait...
                </>
              )}
              {!createCustomerMutation.isPending &&
                !updateCustomerMutation.isPending &&
                (id && !singleCustomerError ? 'Update Institution' : 'Create Institution')}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

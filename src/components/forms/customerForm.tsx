'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Check, Loader2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useCreateCustomer } from '@/services/mutation/customer';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { customerSchema } from './schema/customerSchema';

// Customer Schema
const formSchema = customerSchema;

function CustomerForm() {
  const createCustomerMutation = useCreateCustomer();
  const [sameAddress, setSameAddress] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: ''
    }
  });

  //  ----- Start Address  check ------ //
  const currentAddress = useWatch({
    control: form.control,
    name: 'currentAddress'
  });

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
  //  ----- End Address  check ------ //

  function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    const customer = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      mobileNumber: values.mobileNumber,
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
    formData.append('file', customer.photo || '');
    createCustomerMutation.mutate(formData);
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
                      <Input placeholder="First Name" {...field} />
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
                      <Input placeholder="Last Name" {...field} />
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
                      <Input placeholder="Phone" {...field} />
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
                      <Input placeholder="GST" {...field} />
                    </FormControl>
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
                    <Popover>
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
                          disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* Address */}
          <div className="w-100 mb-5">
            <h2 className="mb-3 uppercase text-slate-400 text-sm">Communication Address:</h2>
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
                        <Input placeholder="Pincode" {...field} />
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
          {/* Submit Button */}
          <h2 className="mb-3 uppercase text-slate-400 text-sm">Registered Address:</h2>
          <div className="flex items-center space-x-2 mb-5">
            <Checkbox id="terms" onCheckedChange={handleCheckboxChange} />
            <label
              htmlFor="terms"
              className="text-xs font-medium text-slate-800 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Registered Address same as Communication Address
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
                        <Input placeholder="Pincode" {...field} />
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
            <Button className="w-1/3" size="lg" type="submit">
              <Loader2 className="mr-2 h-4 w-4 animate-spin hidden" />
              <Check className="me-3 h-5 w-5" />
              {/* {id ? 'Update' : 'Create'} */}
              Create
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}

export default CustomerForm;

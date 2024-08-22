'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { customerSchema } from './schema/customerSchema';
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
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';

const formSchema = customerSchema;

export function BasicForm() {
  const createCustomerMutation = useCreateCustomer();
  const [address, setAddress] = useState({
    city: '',
    state: '',
    country: '',
    streetName: '',
    pincode: ''
  });
  const [isCheckedAddress, setIsCheckedAddress] = useState(false);
  const checkHandler = () => {
    setIsCheckedAddress(!isCheckedAddress);
  };
  const cityChangeHandler = (e) => {
    if (isCheckedAddress) {
      setAddress({
        ...address,
        city: e.target.value
      });
      console.log(e.target.name);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      mobileNumber: '',
      dateOfBirth: '',
      permanentAddress: {
        streetName: '',
        city: '',
        state: '',
        pinCode: '',
        country: ''
      },
      currentAddress: {
        streetName: '',
        city: '',
        state: '',
        pinCode: '',
        country: ''
      }
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    const customers = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      mobileNumber: values.mobileNumber,
      dateOfBirth: values.dateOfBirth,
      currentAddress: values.currentAddress,
      permanentAddress: values.permanentAddress
    };

    formData.append(
      'customerDto',
      new Blob([JSON.stringify(customers)], {
        type: 'application/json'
      })
    );
    formData.append('file', '');

    createCustomerMutation.mutate(formData);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
        encType="multipart/form-data"
      >
        {/* Baisc Details */}
        <div className="w-100 mb-3">
          <h2 className="mb-3 uppercase text-slate-400 text-sm">Basic Details:</h2>
        </div>
        <div className="mb-5 grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <FormMessage className="text-xs opacity-75  dark:opacity-100 font-normal" />
              </FormItem>
            )}
          />
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
                <FormMessage className="text-xs font-normal opacity-75" />
              </FormItem>
            )}
          />

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
                <FormMessage className="text-xs opacity-75  dark:opacity-100 font-normal" />
              </FormItem>
            )}
          />
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
                <FormMessage className="text-xs opacity-75  dark:opacity-100 font-normal" />
              </FormItem>
            )}
          />
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
                <FormMessage className="text-xs opacity-75  dark:opacity-100 font-normal" />
              </FormItem>
            )}
          />
        </div>
        {/* Address */}
        <div className="w-100 mb-3">
          <h2 className="mb-3 uppercase text-slate-400 text-sm">Communication Address:</h2>
        </div>
        <div className="mb-5 grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <FormMessage className="text-xs opacity-75  dark:opacity-100 font-normal" />
              </FormItem>
            )}
          />
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
                  <Input placeholder="City" {...field} onKeyUp={(e) => cityChangeHandler(e)} />
                </FormControl>
                <FormMessage className="text-xs opacity-75  dark:opacity-100 font-normal" />
              </FormItem>
            )}
          />
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
                  <Input placeholder="Pincode" {...field} onKeyUp={(e) => cityChangeHandler(e)} />
                </FormControl>
                <FormMessage className="text-xs opacity-75  dark:opacity-100 font-normal" />
              </FormItem>
            )}
          />
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
                <FormMessage className="text-xs opacity-75  dark:opacity-100 font-normal" />
              </FormItem>
            )}
          />
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
                <FormMessage className="text-xs opacity-75  dark:opacity-100 font-normal" />
              </FormItem>
            )}
          />
        </div>
        <div className="flex items-center space-x-2 mb-5">
          <label
            className="relative flex items-center py-3 rounded-full cursor-pointer"
            htmlFor="ripple-on"
            data-ripple-dark="true"
          >
            <input
              type="checkbox"
              id="checkbox"
              checked={isCheckedAddress}
              onChange={checkHandler}
              className="before:content[''] peer relative h-4 w-4 cursor-pointer appearance-none rounded border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-8 before:w-8 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:bg-gray-950 checked:before:bg-gray-950 hover:before:opacity-10"
            />
            <span className="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                viewBox="0 0 20 20"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </span>
          </label>
          <label
            htmlFor="checkbox"
            className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Registered Address same as Communication Address
          </label>
        </div>
        {/* Registered Address */}
        <div className={`${isCheckedAddress ? 'hidden1 w-100 mb-3' : 'block w-100 mb-3'}`}>
          <h2 className="mb-3 uppercase text-slate-400 text-sm">Registered Address:</h2>
        </div>
        <div
          className={`${isCheckedAddress ? 'hidden1 mb-5 grid grid-cols-1 md:grid-cols-3 gap-4  ' : 'block mb-5 grid grid-cols-1 md:grid-cols-3 gap-4'}`}
        >
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
                  <Input
                    placeholder="Building & Street Name"
                    {...field}
                    value={address.streetName}
                  />
                </FormControl>
                <FormMessage className="text-xs opacity-75  dark:opacity-100 font-normal" />
              </FormItem>
            )}
          />
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
                  <Input placeholder="City" {...field} value={address.city} />
                </FormControl>
                <FormMessage className="text-xs opacity-75  dark:opacity-100 font-normal" />
              </FormItem>
            )}
          />
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
                  <Input placeholder="Pincode" {...field} value={address.pincode} />
                </FormControl>
                <FormMessage className="text-xs opacity-75  dark:opacity-100 font-normal" />
              </FormItem>
            )}
          />
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
                  <Input placeholder="State" {...field} value={address.state} />
                </FormControl>
                <FormMessage className="text-xs opacity-75  dark:opacity-100 font-normal" />
              </FormItem>
            )}
          />
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
                  <Input placeholder="Country" {...field} value={address.counrtry} />
                </FormControl>
                <FormMessage className="text-xs opacity-75  dark:opacity-100 font-normal" />
              </FormItem>
            )}
          />
        </div>
        {/* Submit Button */}
        <div className="flex justify-end">
          <Button className="w-1/3" size="lg" type="submit">
            <Loader2 className="mr-2 h-4 w-4 animate-spin hidden" />
            Create
          </Button>
        </div>
      </form>
    </Form>
  );
}

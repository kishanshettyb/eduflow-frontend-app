'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useCheckUniqueCode, useGetSingleSchool } from '@/services/queries/superadmin/schools';
import { useCreateSchool, useUpdateSchool } from '@/services/mutation/superadmin/school';
import { schoolSchema } from './schema/schoolSchema';
import { useGetAllCustomers } from '@/services/queries/superadmin/cutomer';
import { ReloadIcon } from '@radix-ui/react-icons';
import { Modal } from '../modals/modal';

const formSchema = schoolSchema;

type CreateSchoolFormProps = {
  selectedFile: File | null;
};

export const CreateSchoolForm: React.FC<CreateSchoolFormProps> = ({ selectedFile }) => {
  const searchParams = useSearchParams();
  const id = searchParams.get('schoolId');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: singleSchoolData, error: singleSchoolError } = useGetSingleSchool(id);
  const { data: customersData, isLoading: isCustomersLoading } = useGetAllCustomers();
  const createSchoolMutation = useCreateSchool();
  const updateSchoolMutation = useUpdateSchool();
  const router = useRouter();
  const [uniqueCodeError, setUniqueCodeError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      schoolName: '',
      emailId: '',
      contactNumber: '',
      customerId: '',
      contactPerson: '',
      uniqueCode: '',
      description: '',
      address: {
        streetName: '',
        city: '',
        state: '',
        pinCode: '',
        country: ''
      }
    }
  });

  useEffect(() => {
    if (singleSchoolData && !singleSchoolError) {
      const school = singleSchoolData.data;
      form.reset({
        schoolName: school.schoolName,
        emailId: school.emailId,
        customerId: school.customerId,
        contactNumber: school.contactNumber.toString(),
        contactPerson: school.contactPerson,
        uniqueCode: school.uniqueCode,
        address: {
          streetName: school.address.streetName,
          city: school.address.city,
          state: school.address.state,
          pinCode: school.address.pinCode.toString(),
          country: school.address.country
        },
        description: school.description
      });
    }
  }, [singleSchoolData, singleSchoolError, form]);

  useEffect(() => {
    if (!isCustomersLoading && (!customersData || customersData.data.length === 0)) {
      setIsModalOpen(true); // Open the modal if no customers are found
    }
  }, [isCustomersLoading, customersData]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    const schoolData = {
      schoolId: id,
      schoolName: values.schoolName,
      customerId: values.customerId,
      emailId: values.emailId,
      contactNumber: values.contactNumber.toString(),
      contactPerson: values.contactPerson,
      uniqueCode: values.uniqueCode,
      description: values.description,
      address: values.address
    };

    formData.append(
      'schoolDto',
      new Blob([JSON.stringify(schoolData)], { type: 'application/json' })
    );
    if (selectedFile) formData.append('file', selectedFile);

    const mutation = id ? updateSchoolMutation : createSchoolMutation;
    mutation.mutate(formData);
  };

  const uniqueCode = form.watch('uniqueCode');
  const { data: uniqueCodeData, error: uniqueCodeCheckError } = useCheckUniqueCode(uniqueCode);

  useEffect(() => {
    if (uniqueCodeCheckError) {
      setUniqueCodeError('Unique code already taken');
    } else {
      setUniqueCodeError(null);
    }
  }, [uniqueCodeCheckError]);

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
                control={form.control}
                name="schoolName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      School Name<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="School Name"
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
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Institution</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an Institution" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.isArray(customersData?.data) &&
                          customersData.data.map((item) => (
                            <SelectItem key={item.customerId} value={item.customerId.toString()}>
                              {item.firstName} {item.lastName}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormField
                control={form.control}
                name="emailId"
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
                name="contactPerson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Contact Person<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Contact Person"
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

            <div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Description<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Description" {...field} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="uniqueCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Unique Code<span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Unique Code"
                      {...field}
                      onChange={(e) => {
                        let value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
                        if (value.length > 3) {
                          value = value.slice(0, 3);
                        }
                        field.onChange(value);
                      }}
                      disabled={!!id}
                    />
                  </FormControl>
                  {!id && uniqueCodeError && (
                    <FormMessage className="text-xs text-red-600">{uniqueCodeError}</FormMessage>
                  )}
                  {uniqueCodeData && !uniqueCodeError && (
                    <FormMessage className="text-xs text-green-600">
                      Unique code available
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
          </div>

          <div className="w-100 mb-5">
            <h2 className="mb-3 uppercase text-slate-400 text-sm">Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormField
                  control={form.control}
                  name="address.streetName"
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
                  control={form.control}
                  name="address.city"
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
                  control={form.control}
                  name="address.pinCode"
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
                  control={form.control}
                  name="address.state"
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
                  control={form.control}
                  name="address.country"
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

          <div className="w-100 mb-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={createSchoolMutation.isPending || updateSchoolMutation.isPending}
            >
              {(createSchoolMutation.isPending || updateSchoolMutation.isPending) && (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Please wait...
                </>
              )}
              {!createSchoolMutation.isPending &&
                !updateSchoolMutation.isPending &&
                (id && !singleSchoolError ? 'Update School' : 'Create School')}
            </Button>
          </div>
        </form>
      </Form>
      <Modal
        title="No Institutions Available"
        description="There are no Institutions available. Please add a Institution before proceeding."
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      >
        <Button
          onClick={() => {
            setIsModalOpen(false);
            router.push('/superadmin/customers/create');
          }}
        >
          Add Institution
        </Button>
      </Modal>
    </>
  );
};

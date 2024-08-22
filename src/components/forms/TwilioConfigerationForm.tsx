'use client';
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
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';

import 'react-day-picker/dist/style.css';
import {
  useCreateConfigeration,
  useUpdateConfigeration
} from '@/services/mutation/configeration/configeration';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { twilioSchema } from './schema/twilioSchema';
import { useGetAllConfigeration } from '@/services/queries/configeration/configeration';
import { toast } from '@/components/ui/use-toast';
import { Eye, EyeOff } from 'lucide-react';

const formSchema = twilioSchema;

function CreateTwilioConfigurationForm() {
  const { schoolId } = useSchoolContext();
  const createConfigurationMutation = useCreateConfigeration();
  const updateConfigurationMutation = useUpdateConfigeration();
  const { data: configurations } = useGetAllConfigeration(schoolId);
  const [existingConfiguration, setExistingConfiguration] = useState(null);
  const [showAuthToken, setShowAuthToken] = useState(false);
  const [isEditing, setIsEditing] = useState(true); // Set to true by default

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountSid: '',
      authToken: '',
      phoneNumber: ''
    }
  });

  useEffect(() => {
    if (configurations) {
      const twilioConfig = configurations?.data.find(
        (config) => config.type === 'sms' && config.subType === 'twilio'
      );
      if (twilioConfig) {
        const value = JSON.parse(twilioConfig.value);
        form.reset({
          accountSid: value.accountSid,
          authToken: value.authToken,
          phoneNumber: value.phoneNumber
        });
        setExistingConfiguration(twilioConfig);
        setIsEditing(false); // Disable editing if existing configuration is found
      }
    }
  }, [configurations, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const configuration = {
      schoolId: schoolId,
      subType: 'twilio',
      type: 'sms',
      isEncoded: false,
      value: JSON.stringify({
        accountSid: values.accountSid,
        authToken: values.authToken,
        phoneNumber: values.phoneNumber
      })
    };

    if (existingConfiguration) {
      updateConfigurationMutation.mutate(
        {
          ...configuration,
          configurationSettingsId: existingConfiguration.configurationSettingsId
        },
        {
          onSuccess: () => {
            toast({
              variant: 'default',
              title: 'Configuration updated successfully'
            });
            setIsEditing(false);
          },
          onError: (error) => {
            toast({
              variant: 'destructive',
              title: 'Failed to update configuration',
              description: error.response?.data?.message || 'An error occurred'
            });
          }
        }
      );
    } else {
      createConfigurationMutation.mutate(configuration, {
        onSuccess: () => {
          toast({
            variant: 'default',
            title: 'Configuration created successfully'
          });
          setIsEditing(false);
        },
        onError: (error) => {
          toast({
            variant: 'destructive',
            title: 'Failed to create configuration',
            description: error.response?.data?.message || 'An error occurred'
          });
        }
      });
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mb-5 grid grid-cols-1 gap-4">
            <div>
              <FormField
                className="w-full"
                control={form.control}
                name="accountSid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Account SID<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Account SID" {...field} disabled={!isEditing} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="mb-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FormField
                className="w-full"
                control={form.control}
                name="authToken"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Auth Token<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showAuthToken ? 'text' : 'password'}
                          placeholder="Auth Token"
                          {...field}
                          disabled={!isEditing}
                        />
                        <button
                          type="button"
                          onClick={() => setShowAuthToken(!showAuthToken)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3"
                          disabled={!isEditing}
                        >
                          {showAuthToken ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Phone Number<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Phone Number" {...field} disabled={!isEditing} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex items-center justify-end space-x-2">
            {isEditing && <Button type="submit">Save</Button>}
            {!isEditing && (
              <Button type="button" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            )}
          </div>
        </form>
      </Form>
    </>
  );
}

export default CreateTwilioConfigurationForm;

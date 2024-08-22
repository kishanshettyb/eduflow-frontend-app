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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';

import 'react-day-picker/dist/style.css';
import { cloudinarySchema } from '@/components/forms/schema/cloudinarySchema';
import {
  useCreateConfigeration,
  useUpdateConfigeration
} from '@/services/mutation/configeration/configeration';
import { useGetAllConfigeration } from '@/services/queries/configeration/configeration';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { toast } from '../ui/use-toast';
import { Eye, EyeOff } from 'lucide-react';

const formSchema = cloudinarySchema;

function CreateCloudinaryConfigerationForm() {
  const { schoolId } = useSchoolContext();
  const { data: configurations } = useGetAllConfigeration(schoolId);
  const createConfigurationMutation = useCreateConfigeration();
  const updateConfigurationMutation = useUpdateConfigeration();

  const [existingConfiguration, setExistingConfiguration] = useState(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showApiSecret, setShowApiSecret] = useState(false);
  const [isEditing, setIsEditing] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cloudName: '',
      apiKey: '',
      apiSecret: '',
      secret: 'true'
    }
  });

  useEffect(() => {
    if (configurations) {
      const cloudinaryConfig = configurations?.data.find(
        (config) => config.type === 'storage' && config.subType === 'cloudinary'
      );
      if (cloudinaryConfig) {
        const value = JSON.parse(cloudinaryConfig.value);
        form.reset({
          cloudName: value.cloudName,
          apiKey: value.apiKey,
          apiSecret: value.apiSecret,
          secret: value.secret.toString()
        });
        setExistingConfiguration(cloudinaryConfig);
        setIsEditing(false);
      }
    }
  }, [configurations, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const configuration = {
      schoolId: schoolId,
      subType: 'cloudinary',
      type: 'storage',
      isEncoded: false,
      value: JSON.stringify({
        cloudName: values.cloudName,
        apiKey: values.apiKey,
        apiSecret: values.apiSecret,
        secret: values.secret === 'true'
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
          <div className="mb-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FormField
                className="w-full"
                control={form.control}
                name="cloudName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Cloud Name<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Cloud Name"
                        {...field}
                        disabled={existingConfiguration ? !isEditing : false}
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
                name="apiKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      API Key<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showApiKey ? 'text' : 'password'}
                          placeholder="API Key"
                          {...field}
                          disabled={existingConfiguration ? !isEditing : false}
                        />
                        <button
                          type="button"
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3"
                          disabled={existingConfiguration ? !isEditing : false}
                        >
                          {showApiKey ? <EyeOff size={20} /> : <Eye size={20} />}
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
                name="apiSecret"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      API Secret<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showApiSecret ? 'text' : 'password'}
                          placeholder="API Secret"
                          {...field}
                          disabled={existingConfiguration ? !isEditing : false}
                        />
                        <button
                          type="button"
                          onClick={() => setShowApiSecret(!showApiSecret)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3"
                          disabled={existingConfiguration ? !isEditing : false}
                        >
                          {showApiSecret ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="secret"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Secret<span className="text-red-600">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                    disabled={existingConfiguration ? !isEditing : false}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Secret" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="default">Select Secret</SelectItem>
                      <SelectItem value="true">True</SelectItem>
                      <SelectItem value="false">False</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
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

export default CreateCloudinaryConfigerationForm;

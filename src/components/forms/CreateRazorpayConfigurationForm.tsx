import React, { useEffect, useState } from 'react';
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
import {
  useCreateConfigeration,
  useUpdateConfigeration
} from '@/services/mutation/configeration/configeration';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { razorpaySchema } from './schema/razorpaySchema';
import { useGetAllConfigeration } from '@/services/queries/configeration/configeration';
import { toast } from '@/components/ui/use-toast';
import { Eye, EyeOff } from 'lucide-react';

const formSchema = razorpaySchema;

function CreateRazorpayConfigurationForm() {
  const createConfigurationMutation = useCreateConfigeration();
  const updateConfigurationMutation = useUpdateConfigeration();

  const { schoolId } = useSchoolContext();
  const { data: configurations } = useGetAllConfigeration(schoolId);
  const [existingConfiguration, setExistingConfiguration] = useState(null);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [isEditing, setIsEditing] = useState(true); // Set to true by default

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      keyId: '',
      secretKey: ''
    }
  });

  useEffect(() => {
    if (configurations) {
      const razorPayConfig = configurations?.data.find(
        (config) => config.type === 'payment' && config.subType === 'razorPay'
      );
      if (razorPayConfig) {
        const value = JSON.parse(razorPayConfig.value);
        form.reset({
          keyId: value.keyId,
          secretKey: value.secretKey
        });
        setExistingConfiguration(razorPayConfig);
        setIsEditing(false); // Disable editing if existing configuration is found
      }
    }
  }, [configurations, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const configuration = {
      schoolId: schoolId,
      subType: 'razorPay',
      type: 'payment',
      isEncoded: false,
      value: JSON.stringify({
        keyId: values.keyId,
        secretKey: values.secretKey
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
                name="keyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Key ID<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Key ID" {...field} disabled={!isEditing} />
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
                name="secretKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Secret Key<span className="text-red-600">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showSecretKey ? 'text' : 'password'}
                          placeholder="Secret Key"
                          {...field}
                          disabled={!isEditing}
                        />
                        <button
                          type="button"
                          onClick={() => setShowSecretKey(!showSecretKey)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3"
                          disabled={!isEditing}
                        >
                          {showSecretKey ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
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

export default CreateRazorpayConfigurationForm;

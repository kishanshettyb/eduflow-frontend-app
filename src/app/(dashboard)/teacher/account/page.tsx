// Import necessary dependencies and components
'use client';
import TitleBar from '@/components/header/titleBar';
import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Database, Fingerprint, Mail, User } from 'lucide-react';
import ChangePassword from '@/components/forms/changePassword';
import { Switch } from '@/components/ui/switch';
import Image from 'next/image';
import PlanCard from '@/components/cards/planCard';
import SettingNotificationCard from '@/components/cards/settingNotificationCard';
import SchoolSettingForm from '@/components/forms/schoolSettingForm';
import CreateTwilioConfigerationForm from '@/components/forms/TwilioConfigerationForm';
import CreateCloudinaryConfigerationForm from '@/components/forms/CloudinaryConfigurationForm';
import CreateRazorpayConfigurationForm from '@/components/forms/CreateRazorpayConfigurationForm';
import {
  useCreateConfigeration,
  useUpdateConfigeration
} from '@/services/mutation/configeration/configeration';
import { useSchoolContext } from '@/lib/provider/schoolContext';
import { useGetAllConfigeration } from '@/services/queries/configeration/configeration';
import StaffProfile from '@/components/forms/staffProfile';
import useStorage from '@/hooks/storage';

// Define the Account component
export default function Account() {
  const { schoolId } = useSchoolContext();
  const storage = useStorage();
  const [isTwilioEnabled, setIsTwilioEnabled] = React.useState(false);
  const [isCloudinaryEnabled, setIsCloudinaryEnabled] = React.useState(false);
  const [isRazorpayEnabled, setIsRazorpayEnabled] = React.useState(false);

  const createConfigurationMutation = useCreateConfigeration();
  const updateConfigurationMutation = useUpdateConfigeration();

  const { data: configurations } = useGetAllConfigeration(schoolId);

  // Effect to update state based on fetched configurations
  React.useEffect(() => {
    if (configurations) {
      configurations?.data.forEach((config) => {
        if (config.subType === 'twilio' && config.type === 'settings') {
          setIsTwilioEnabled(JSON.parse(config.value).enabled);
        } else if (config.subType === 'cloudinary' && config.type === 'settings') {
          setIsCloudinaryEnabled(JSON.parse(config.value).enabled);
        } else if (config.subType === 'razorpay' && config.type === 'settings') {
          setIsRazorpayEnabled(JSON.parse(config.value).enabled);
        }
      });
    }
  }, [configurations]);

  const fetchStaffId = (): string | null => {
    // Get staffId from localStorage
    const staffId = storage.getItem('staffId', 'local');
    return staffId;
  };

  // Usage
  const staffId = fetchStaffId();

  // Handle switch changes
  const handleSwitchChange = (provider, setEnabled) => {
    return () => {
      const newEnabledState = !provider.enabled;
      setEnabled(newEnabledState);

      const existingConfig = configurations?.data.find(
        (config) => config.subType === provider.subType && config.type === 'settings'
      );

      const configuration = {
        schoolId: schoolId,
        type: 'settings',
        subType: provider.subType,
        isEncoded: false,
        value: JSON.stringify({
          enabled: newEnabledState,
          providerName: provider.providerName
        })
      };

      if (existingConfig) {
        updateConfigurationMutation.mutate({
          ...configuration,
          configurationSettingsId: existingConfig.configurationSettingsId
        });
      } else {
        createConfigurationMutation.mutate(configuration);
      }
    };
  };

  // Render the component
  return (
    <div>
      <div className="mt-5">
        <TitleBar title="Account Settings" />
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="flex w-full border-b">
            <TabsTrigger
              className="flex-1 text-center border-b-2 border-transparent hover:border-b-slate-900"
              value="general"
            >
              <User className="w-4 h-4 me-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger
              className="flex-1 text-center border-b-2 border-transparent hover:border-b-slate-900"
              value="notifications"
            >
              <User className="w-4 h-4 me-2" />
              Notification
            </TabsTrigger>
            <TabsTrigger
              className="flex-1 text-center border-b-2 border-transparent hover:border-b-slate-900"
              value="security"
            >
              <Fingerprint className="w-4 h-4 me-2" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Tabs defaultValue="profile" className="flex justify-start gap-x-10">
              <div className="w-full border border-slate rounded-2xl p-5 shadow-3xl">
                <TabsContent value="profile">
                  <div className="my-5">
                    <StaffProfile schoolId={schoolId} staffId={staffId} />
                  </div>
                </TabsContent>
                <TabsContent value="school">
                  <div className="p-4 mt-5 border bg-white dark:bg-slate-900 rounded-2xl">
                    <div className="flex justify-between items-center">
                      <SchoolSettingForm />
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </TabsContent>
          <TabsContent value="notifications">
            <SettingNotificationCard />
          </TabsContent>
          <TabsContent value="advanced">
            <div className="mt-5 p-10 border bg-white dark:bg-slate-900 rounded-2xl ">
              <Tabs defaultValue="sms" className="flex justify-start gap-x-10">
                <div className="w-auto h-[220px] flex-row bg-slate-50 rounded-xl gap-y-10 px-3 pt-10 dark:bg-slate-500">
                  <TabsList className="flex-col w-[200px] gap-y-5 mt-5 my-3 ">
                    <TabsTrigger className="w-full border" value="sms">
                      <Mail className="w-4 h-4 me-2" /> SMS
                    </TabsTrigger>
                    <TabsTrigger className="w-full border" value="storage">
                      <Database className="w-4 h-4 me-2" /> Storage
                    </TabsTrigger>
                    <TabsTrigger className="w-full border" value="payments">
                      <CreditCard className="w-4 h-4 me-2" /> Payment Gateways
                    </TabsTrigger>
                  </TabsList>
                </div>
                <div className="w-full border border-slate rounded-2xl p-5 shadow-3xl">
                  <TabsContent value="sms">
                    <div className="my-5">
                      <div className="p-4 mt-5 border bg-white dark:bg-slate-900 rounded-2xl">
                        <div className="flex justify-between items-center">
                          <div>
                            <Image
                              src="/other/twilio-logo.png"
                              width="150"
                              height="150"
                              alt="twilio"
                              className="object-contain"
                            />
                          </div>
                          <div>
                            <Switch
                              checked={isTwilioEnabled}
                              onCheckedChange={handleSwitchChange(
                                {
                                  subType: 'twilio',
                                  providerName: 'twilio',
                                  enabled: isTwilioEnabled
                                },
                                setIsTwilioEnabled
                              )}
                            />
                          </div>
                        </div>
                        {isTwilioEnabled && (
                          <div className="my-5">
                            <CreateTwilioConfigerationForm />
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="storage">
                    <div className="p-4 mt-5 border bg-white dark:bg-slate-900 rounded-2xl">
                      <div className="flex justify-between items-center">
                        <div>
                          <Image
                            src="/other/cloudinary-logo.png"
                            width="100"
                            height="100"
                            alt="Cloudinary"
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <Switch
                            checked={isCloudinaryEnabled}
                            onCheckedChange={handleSwitchChange(
                              {
                                subType: 'cloudinary',
                                providerName: 'cloudinary',
                                enabled: isCloudinaryEnabled
                              },
                              setIsCloudinaryEnabled
                            )}
                          />
                        </div>
                      </div>
                      {isCloudinaryEnabled && (
                        <div className="my-5">
                          <CreateCloudinaryConfigerationForm />
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="payments">
                    <div className="p-4 mt-5 border bg-white dark:bg-slate-900 rounded-2xl">
                      <div className="flex justify-between items-center">
                        <div>
                          <Image
                            src="/other/razorpay-logo.png"
                            width="100"
                            height="100"
                            alt="Razorpay"
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <Switch
                            checked={isRazorpayEnabled}
                            onCheckedChange={handleSwitchChange(
                              {
                                subType: 'razorpay',
                                providerName: 'razorpay',
                                enabled: isRazorpayEnabled
                              },
                              setIsRazorpayEnabled
                            )}
                          />
                        </div>
                      </div>
                      {isRazorpayEnabled && (
                        <div className="my-5">
                          <CreateRazorpayConfigurationForm />
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </TabsContent>
          <TabsContent value="security">
            <ChangePassword />
          </TabsContent>
          <TabsContent value="billing">
            <PlanCard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

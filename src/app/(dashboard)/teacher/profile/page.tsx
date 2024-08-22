'use client';
import TitleBar from '@/components/header/titleBar';
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Fingerprint, User } from 'lucide-react';
import SettingNotificationCard from '@/components/cards/settingNotificationCard';
import ChangePassword from '@/components/forms/changePassword';
import ProfileDisplay from '@/components/forms/profileDisplay';

function TeacherProfilePage() {
  return (
    <>
      <div className="mt-5">
        <TitleBar title="Profile Page" />
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="flex justify-center border-b-2 pb-2 mb-5">
            <TabsTrigger value="general" className="flex-1">
              <User className="w-4 h-4 me-2" />
              General
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex-1">
              <User className="w-4 h-4 me-2" />
              Notification
            </TabsTrigger>
            <TabsTrigger value="security" className="flex-1">
              <Fingerprint className="w-4 h-4 me-2" />
              Security
            </TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <div className="mt-5 p-10 border bg-white dark:bg-slate-900 rounded-2xl flex ">
              <Tabs defaultValue="profile" className="flex gap-x-10 w-full">
                <div className="mt-5 p-10 border bg-white dark:bg-slate-900 rounded-2xl">
                  <TabsList className="flex flex-col gap-y-5">
                    <TabsTrigger className="w-full border p-2" value="profile">
                      <User className="w-4 h-4 me-2" />
                      <img
                        src="/path/to/your/user/image.jpg"
                        alt="User Image"
                        className="w-10 h-10 rounded-full mr-2"
                      />
                      Profile
                    </TabsTrigger>
                  </TabsList>
                </div>
                <div>
                  <TabsContent value="profile">
                    <div className="my-5">
                      <ProfileDisplay />
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </TabsContent>
          <TabsContent value="notifications">
            <div className="mt-5 p-10 border bg-white dark:bg-slate-900 rounded-2xl">
              <SettingNotificationCard />
            </div>
          </TabsContent>
          <TabsContent value="security">
            <div className="mt-5 p-10 border bg-white dark:bg-slate-900 rounded-2xl">
              <ChangePassword />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

export default TeacherProfilePage;

import React from 'react';
import { Switch } from '@/components/ui/switch';

function SettingNotificationCard() {
  return (
    <div className="mt-5 p-4  border bg-white shadow-3xl rounded-2xl w-3/5 dark:bg-slate-900 ">
      <div className="dark:bg-slate-900 ">
        <h2 className="text-xl font-semibold mb-3">Activity</h2>
        <div className="flex justify-between mb-5 bg-white border border-slate-200 px-4 py-3 rounded-lg items-center dark:bg-slate-900">
          <div>
            <p className="text-sm">News and announcements</p>
          </div>
          <div>
            <Switch />
          </div>
        </div>
        <div className="flex justify-between mb-3 bg-white border border-slate-200 px-4 py-3 rounded-lg items-center dark:bg-slate-900">
          <div>
            <p className="text-sm">Weekly product updates</p>
          </div>
          <div>
            <Switch />
          </div>
        </div>
        <div className="flex justify-between mb-5 bg-white border border-slate-200 px-4 py-3 rounded-lg items-center dark:bg-slate-900">
          <div>
            <p className="text-sm">Email Notifications</p>
          </div>
          <div>
            <Switch />
          </div>
        </div>
        <h2 className="text-xl font-semibold mb-5">Application</h2>
        <div className="flex justify-between mb-5 bg-white border border-slate-200 px-4 py-3 rounded-lg items-center dark:bg-slate-900">
          <div>
            <p className="text-sm">News and announcements</p>
          </div>
          <div>
            <Switch />
          </div>
        </div>
        <div className="flex justify-between mb-5 bg-white border border-slate-200 px-4 py-3 rounded-lg items-center dark:bg-slate-900">
          <div>
            <p className="text-sm">Weekly product updates</p>
          </div>
          <div>
            <Switch />
          </div>
        </div>
        <div className="flex justify-between mb-5 bg-white border border-slate-200 px-4 py-3 rounded-lg items-center dark:bg-slate-900">
          <div>
            <p className="text-sm">Email Notifications</p>
          </div>
          <div>
            <Switch />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingNotificationCard;

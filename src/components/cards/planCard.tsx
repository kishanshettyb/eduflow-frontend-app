import { Book, Crown, Gem } from 'lucide-react';
import React from 'react';

function PlanCard() {
  return (
    <div className="mt-5 border bg-white dark:bg-slate-900 rounded-2xl w-3/5 ">
      <div className="grid grid-cols-3 gap-4 p-4">
        <div className="bg-white border border-slate-300 rounded-xl p-4 opacity-50 pointer-events-none cursor-not-allowed dark:bg-slate-900">
          <Book className="text-blue-600 opacity-90 w-10 h-10 my-5 " />
          <h2 className="text-md">Basic</h2>
          <h3 className="text-2xl font-semibold">Free</h3>
        </div>
        <div className="bg-white border border-slate-300 rounded-xl p-4 cursor-pointer dark:bg-slate-900">
          <Gem className="text-blue-600 opacity-90 w-10 h-10 my-5" />
          <h2 className="text-md">Starter</h2>
          <h3 className="text-2xl font-semibold">$29 /month</h3>
        </div>
        <div className="bg-white border border-slate-300 rounded-xl p-4 cursor-pointer dark:bg-slate-900">
          <Crown className="text-blue-600 opacity-90 w-10 h-10 my-5" />
          <h2 className="text-md">Premium</h2>
          <h3 className="text-2xl font-semibold">$49 /month</h3>
        </div>
      </div>
      <div className="my-5 border border-dashed border-top-slate-600 border-x-0 border-b-0">
        <div className=" m-5 rounded-2xl border-x-0 border-b-0   bg-white border border-slate-100 shadow dark:bg-slate-800">
          <div className="flex justify-between border p-4 border-b-slate-100 border-x-0 border-t-0 ">
            <div className="w-1/4">
              <p className="font-semibold">Plan</p>
            </div>
            <div className="w-3/4">
              <p>Premium</p>
            </div>
          </div>
          <div className="flex justify-between border p-4 border-b-slate-100 border-x-0 border-t-0">
            <div className="w-1/4">
              <p className="font-semibold">Payment Method</p>
            </div>
            <div className="w-3/4">
              <p>Online</p>
            </div>
          </div>
          <div className="flex justify-between border p-4 border-b-slate-100 border-x-0 border-t-0">
            <div className="w-1/4">
              <p className="font-semibold">Billing Address</p>
            </div>
            <div className="w-3/4">
              <p>#10/1 4th Main 5th cross BSK3rd staage Banglore - 560085</p>
            </div>
          </div>
          <div className="flex justify-between border p-4 border-b-slate-100 border-x-0 border-t-0">
            <div className="w-1/4">
              <p className="font-semibold">Billing Phone</p>
            </div>
            <div className="w-3/4">
              <p>+91 9999999999</p>
            </div>
          </div>
          <div className="flex justify-between   p-4  ">
            <div className="w-1/4">
              <p className="font-semibold">Billing Email</p>
            </div>
            <div className="w-3/4">
              <p>info@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlanCard;

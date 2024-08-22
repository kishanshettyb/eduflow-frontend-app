'use client';
import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TitleBar from '@/components/header/titleBar';
import { NewBarChart } from '@/components/charts/newBarChart';
import { NewPieChart } from '@/components/charts/newPieChart';
import LatestTransactionCard from '@/components/cards/latestTransactionCard';
import { PaymentPieChart } from '@/components/charts/PaymentPieChart';
import { FeeRemainingAmountCollection } from '@/components/charts/FeeRemainingAmountCollection';
import { FeeCollectionBarChart } from '@/components/charts/feeCollectionsBarChart';
import { FeeCollectionChart } from '@/components/charts/FeeCollectionChart';
import { FeeStatusPieChart } from '@/components/charts/FeeStatusPieChart';

const feeData = [
  { standard: '1st Grade', remainingFee: 5000 },
  { standard: '2nd Grade', remainingFee: 4200 },
  { standard: '3rd Grade', remainingFee: 3200 },
  { standard: '4th Grade', remainingFee: 3800 },
  { standard: '5th Grade', remainingFee: 2000 }
];

const feeConfig = {
  remainingFee: {
    label: 'Remaining Fee',
    color: '#FF6347'
  }
};
const chartData = [
  { year: '2019-18', Std1A: 30500, Std1B: 60000, Std2A: 80000, Std2B: 77909 },
  { year: '2020-19', Std1A: 23700, Std1B: 42000, Std2A: 82000, Std2B: 77909 },
  { year: '2021-22', Std1A: 73000, Std1B: 99000, Std2A: 89000, Std2B: 77909 },
  { year: '2022-23', Std1A: 20900, Std1B: 33000, Std2A: 83000, Std2B: 77909 },
  { year: '2023-24', Std1A: 21400, Std1B: 24000, Std2A: 84000, Std2B: 77909 }
];

const chartConfig = {
  Std1A: {
    label: 'Std1A',
    color: 'hsl(var(--chart-1))'
  },
  Std1B: {
    label: 'Std1B',
    color: 'hsl(var(--chart-2))'
  },
  Std2A: {
    label: 'Std1B',
    color: 'hsl(var(--chart-3))'
  },
  Std2B: {
    label: 'Std1B',
    color: 'hsl(var(--chart-4))'
  }
};

const StandardReportChart = () => {
  return (
    <div>
      <TitleBar title="Reports" />
      <div className="h-full border border-slate-200 dark:border-slate-800 rounded-2xl p-4 mb-[50px]">
        <Tabs defaultValue="finance" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="finance">Finance</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="admissions">Admissions</TabsTrigger>
          </TabsList>
          <TabsContent value="finance">
            <div className="bg-slate-100 dark:bg-slate-800 my-5 rounded-xl p-4">
              <div className="my-5 flex justify-end">
                <div>
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select  Academic Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Select Academic Year</SelectLabel>
                        <SelectItem value="2023-24">2023-2024</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid w-full gap-5 grid-cols-2">
                <div>
                  <FeeCollectionBarChart
                    title="Fee Collection Overview"
                    description="Academic Years 2019-2024"
                    data={chartData}
                    config={chartConfig}
                    trendingText="Trending up by"
                    trendingValue="5.2% this year"
                    chartFooterDesc="Showing total fee collection for the last 5 years"
                  />
                </div>

                <div>
                  <NewBarChart />
                </div>
                <div>
                  <FeeStatusPieChart />
                </div>
                <div>
                  <FeeRemainingAmountCollection
                    title="Student Fee Defaulters"
                    description="Showing the remaining fee collection across different grades"
                    data={feeData}
                    config={feeConfig}
                    trendingText="Trending down by"
                    trendingValue="10%"
                    chartFooterDesc="Showing the remaining fee for the current academic year"
                  />
                </div>

                <div>
                  <FeeCollectionChart />
                </div>
                <div>
                  <PaymentPieChart />
                </div>
              </div>
            </div>
            <div className="grid w-full gap-5 grid-cols-1">
              <LatestTransactionCard />
            </div>
          </TabsContent>
          <TabsContent value="attendance">
            <p>attendance</p>
          </TabsContent>
          <TabsContent value="results">
            <p>results</p>
          </TabsContent>
          <TabsContent value="admissions">
            <p>admissions</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StandardReportChart;

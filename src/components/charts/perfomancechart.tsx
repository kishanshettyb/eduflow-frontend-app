import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const data = [
  { name: 'Jan', Performance: 20 },
  { name: 'Feb', Performance: 40 },
  { name: 'Mar', Performance: 30 },
  { name: 'Apr', Performance: 50 },
  { name: 'May', Performance: 60 },
  { name: 'Jun', Performance: 70 }
];

const PerformanceChart = () => {
  return (
    <div>
      <div>
        <h2 className="text-xl text-slate-800 font-semibold">Student Performance</h2>
      </div>

      <div className="w-72 mx-auto p-5 border border-gray-200 rounded-lg shadow-lg">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis hide />
            <Tooltip />
            <Line type="monotone" dataKey="Performance" stroke="#3b82f6" fill="#3b82f6" />
          </LineChart>
        </ResponsiveContainer>
        <div className="text-center mt-2">
          <h2 className="text-2xl font-bold">40%</h2>
          <p>Your productivity is 40 higher compared to last month</p>
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;

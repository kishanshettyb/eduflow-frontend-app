'use client';
import React from 'react';
import { useGetTotalNumberCustomers } from '@/services/queries/superadmin/cutomer';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF']; // Array of colors for the pie chart

function DashboardCards() {
  const { data, isLoading, isError } = useGetTotalNumberCustomers();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching total number of customers</div>;
  }

  // Data for the pie chart. Recharts expects data in the format of an array of objects, where each object has a "name" and "value" field.
  const pieChartData = [{ name: 'Total Customers', value: data }];

  return (
    <div className="flex justify-center gap-4">
      {/* Card for displaying the pie chart */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2">Customer Distribution</h3>
        <PieChart width={400} height={300}>
          <Pie
            data={pieChartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {/* Dynamically generate pie chart sectors with different colors */}
            {pieChartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

      {/* Card for displaying the total number of customers */}
      <div className="flex justify-center">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Total Number of Customers</h3>
          <p className="text-2xl font-bold">{data}</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardCards;

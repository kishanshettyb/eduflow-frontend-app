'use client';
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const ReusableLineChart = ({
  width = 500,
  height = 600,
  data = [],
  lineKeys = [],
  colors = [],
  margin = { top: 5, right: 30, left: 20, bottom: 5 }
}) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart width={width} height={height} data={data} margin={margin}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {lineKeys.map((key, index) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={colors[index]}
            activeDot={{ r: 8 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ReusableLineChart;

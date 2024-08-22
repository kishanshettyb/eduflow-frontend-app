'use client';
import React from 'react';
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const ReusableBarChart = ({
  width = 500,
  height = 300,
  data = [],
  barKeys = [],
  colors = [],
  margin = { top: 5, right: 30, left: 20, bottom: 5 }
}) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart width={width} height={height} data={data} margin={margin}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {barKeys.map((key, index) => (
          <Bar
            key={key}
            dataKey={key}
            fill={colors[index]}
            activeBar={<Rectangle fill="black" stroke="black" />}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ReusableBarChart;

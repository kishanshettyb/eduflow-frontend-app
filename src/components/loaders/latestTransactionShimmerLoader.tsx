import React from 'react';

const LatestTransactionShimmerLoader = () => {
  return (
    <div className="w-full p-4 border rounded-2xl bg-white">
      <h2 className="mb-4 font-semibold text-md text-slate-800">Latest Transactions</h2>
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex items-center space-x-4 animate-pulse">
            <div className="w-1/6 h-6 bg-gray-200 rounded"></div>
            <div className="w-1/6 h-6 bg-gray-200 rounded"></div>
            <div className="w-1/6 h-6 bg-gray-200 rounded"></div>
            <div className="w-1/6 h-6 bg-gray-200 rounded"></div>
            <div className="w-1/6 h-6 bg-gray-200 rounded"></div>
            <div className="w-1/6 h-6 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestTransactionShimmerLoader;

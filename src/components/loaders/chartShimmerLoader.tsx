import React from 'react';

const ChartShimmerLoader = () => {
  return (
    <div>
      <div className="flex justify-between items-center animate-pulse">
        <div className="h-6 bg-gray-300 rounded w-1/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/6"></div>
      </div>
      <p className="h-4 bg-gray-300 rounded w-1/3 mt-2 animate-pulse"></p>
      <div className="flex mt-4">
        <div className="w-1/2 h-64 bg-gray-300 rounded-full animate-pulse"></div>
        <div className="w-1/2 flex flex-col justify-center ml-4">
          <div className="flex items-center mb-4 animate-pulse">
            <div className="w-2 h-8 mr-2 bg-gray-300"></div>
            <div className="w-full">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
          <div className="flex items-center mb-4 animate-pulse">
            <div className="w-2 h-8 mr-2 bg-gray-300"></div>
            <div className="w-full">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartShimmerLoader;

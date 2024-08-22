import React from 'react';

const BannerShimmerLoader = () => {
  return (
    <div className="relative bg-gray-100 shadow-lg rounded-2xl overflow-hidden animate-pulse">
      <div className="w-full h-[300px] bg-gray-300"></div>
      <div className="absolute left-10 top-10 p-4 rounded-2xl bg-white bg-opacity-75 backdrop-blur-md shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="w-[100px] h-[100px] bg-gray-300 rounded-full"></div>
        </div>
        <div className="mt-4">
          <div className="w-3/4 h-6 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default BannerShimmerLoader;

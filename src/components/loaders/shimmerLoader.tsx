import React from 'react';

function ShimmerLoader({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse flex justify-center items-center ${className}`}>
      <div className="h-24 w-24 bg-gray-300 rounded-full"></div>
    </div>
  );
}

export default ShimmerLoader;

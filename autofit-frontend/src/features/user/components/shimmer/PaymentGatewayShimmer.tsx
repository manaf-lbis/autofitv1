import React from "react";

const Shimmer: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-gray-200 rounded h-6 w-3/4 mb-2"></div>
      <div className="bg-gray-200 rounded h-4 w-full mb-2"></div>
      <div className="bg-gray-200 rounded h-4 w-5/6"></div>
    </div>
  );
};

export default Shimmer;
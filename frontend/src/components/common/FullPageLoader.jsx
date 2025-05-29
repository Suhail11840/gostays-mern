import React from 'react';
import { FiLoader } from 'react-icons/fi'; // A good default loader icon

const FullPageLoader = ({ message = "Loading, please wait..." }) => {
  return (
    <div 
      className="fixed inset-0 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center z-[200] text-center p-4"
      role="status" // Accessibility
      aria-live="polite" // Accessibility
    >
      <FiLoader className="animate-spin text-primary text-5xl md:text-6xl mb-5" />
      <p className="text-neutral-darkest text-lg font-medium font-display tracking-wide">
        {message}
      </p>
    </div>
  );
};

// Inline loader for smaller loading states within components
export const InlineLoader = ({ size = "text-3xl", color = "text-primary", className = "" }) => {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <FiLoader className={`animate-spin ${color} ${size}`} />
    </div>
  );
};

// Skeleton loader for content placeholders
export const SkeletonBlock = ({ height = 'h-8', width = 'w-full', className = '' }) => {
    return (
        <div className={`bg-neutral-light animate-pulseHalka rounded-md ${height} ${width} ${className}`}></div>
    );
};


export default FullPageLoader;
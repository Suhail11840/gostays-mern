import React from 'react';
import { FiLoader } from 'react-icons/fi'; // Or any other loader icon you prefer

const FullPageLoader = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-75 backdrop-blur-sm flex flex-col items-center justify-center z-[100]">
      <FiLoader className="animate-spin text-primary text-5xl md:text-6xl mb-4" />
      <p className="text-neutral-darkest text-lg font-medium">{message}</p>
    </div>
  );
};

// A simpler, non-overlay loader for inline use if needed
export const InlineLoader = ({ size = "text-3xl", color = "text-primary" }) => {
  return (
    <div className="flex justify-center items-center py-4">
      <FiLoader className={`animate-spin ${color} ${size}`} />
    </div>
  );
};

export default FullPageLoader;
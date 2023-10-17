import React from 'react';
import { twMerge } from 'tailwind-merge';

const Button = ({ value, onClick, loading, className }) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={twMerge(
        `bg-gray-800 text-gray-200 p-2 rounded-md w-full ${className}`
      )}
    >
      {loading ? 'Loading...' : value}
    </button>
  );
};

export default Button;

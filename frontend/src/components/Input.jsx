import React from 'react';
import { twMerge } from 'tailwind-merge';

const Input = ({ value, onChange, placeholder, type = 'text', className }) => {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      className={twMerge(
        `border-2 border-gray-900 rounded-md p-1 block w-[300px] mb-2 px-2 py-2 outline-none ${className}`
      )}
    />
  );
};

export default Input;

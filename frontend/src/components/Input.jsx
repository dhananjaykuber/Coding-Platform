import React from 'react';

const Input = ({ value, onChange, placeholder, type = 'text' }) => {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      className="border-2 border-gray-900 rounded-md p-1 block w-[300px] mb-2 px-2 py-2 outline-none"
    />
  );
};

export default Input;

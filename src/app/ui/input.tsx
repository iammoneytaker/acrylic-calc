import React from 'react';

interface InputProps {
  type?: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  id,
  value,
  onChange,
  required = false,
}) => {
  return (
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full border border-gray-300 rounded px-2 py-1"
    />
  );
};

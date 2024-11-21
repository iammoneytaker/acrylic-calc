import React from 'react';

interface NewInputProps {
  type?: string;
  id: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

export const NewInput: React.FC<NewInputProps> = ({
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
      className="w-full border border-gray-300 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
    />
  );
};

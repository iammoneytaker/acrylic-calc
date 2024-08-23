import React from 'react';

interface Option {
  value: number;
  label: string;
}

interface SelectProps {
  id: string;
  value: number;
  onValueChange: (value: string) => void;
  options: Option[];
}

export const Select: React.FC<SelectProps> = ({
  id,
  value,
  onValueChange,
  options,
}) => {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className="w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

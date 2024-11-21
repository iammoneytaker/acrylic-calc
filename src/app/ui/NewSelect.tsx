import React from 'react';

interface Option {
  value: string; // string으로 변경
  label: string;
}

interface NewSelectProps {
  id: string;
  value: string; // string으로 변경
  onValueChange: (value: string) => void;
  options: Option[];
}

export const NewSelect: React.FC<NewSelectProps> = ({
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
      className="w-full border border-gray-300 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

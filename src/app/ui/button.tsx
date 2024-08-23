import React from 'react';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  type = 'button',
  children,
}) => {
  return (
    <button type={type} className="bg-blue-500 text-white rounded px-4 py-2">
      {children}
    </button>
  );
};

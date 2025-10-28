import React from 'react';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  ariaLabel?: string;
};

export function Input({ className = '', ariaLabel, ...props }: InputProps) {
  const base = 'block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';
  return <input aria-label={ariaLabel} {...props} className={[base, className].join(' ')} />;
}


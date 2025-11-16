
import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ children, ...props }) => {
  const baseClasses = "block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-white";
  return (
    <select {...props} className={`${baseClasses} ${props.className || ''}`}>
      {children}
    </select>
  );
};

export default Select;

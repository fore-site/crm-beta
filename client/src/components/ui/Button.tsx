
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactElement;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  leftIcon,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';

  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/20 focus:ring-primary',
    secondary: 'bg-secondary text-primary-dark hover:bg-secondary-dark focus:ring-secondary-dark',
    accent: 'bg-accent text-white hover:bg-accent-dark shadow-lg shadow-accent/20 focus:ring-accent',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20 focus:ring-red-500',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-primary',
    outline: 'bg-transparent border-2 border-slate-200 text-slate-700 hover:border-primary hover:text-primary hover:bg-primary/5'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${props.className || ''}`}
      {...props}
    >
      {leftIcon && <span className="mr-2 -ml-1">{leftIcon}</span>}
      {children}
    </button>
  );
};

export default Button;
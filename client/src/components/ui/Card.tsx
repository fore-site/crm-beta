
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  const interactiveClasses = onClick 
    ? 'cursor-pointer hover:shadow-xl hover:-translate-y-1 dark:hover:border-slate-600 transition-all duration-300' 
    : '';

  return (
    <div 
      onClick={onClick} 
      className={`bg-white dark:bg-slate-800 rounded-xl shadow-md dark:shadow-none dark:border dark:border-slate-700 overflow-hidden ${interactiveClasses} ${className}`}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {children}
    </div>
  );
};

export default Card;
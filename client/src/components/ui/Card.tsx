import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  const interactiveClasses = onClick 
    ? 'cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300' 
    : '';

  return (
    <div 
      onClick={onClick} 
      className={`
        relative overflow-hidden
        bg-white dark:bg-[#1e1b2e]
        shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-black/40
        rounded-3xl
        border-none
        ${interactiveClasses} 
        ${className}
      `}
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
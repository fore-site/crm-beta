import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  const interactiveClasses = onClick 
    ? 'cursor-pointer hover:border-indigo-300/50 dark:hover:border-indigo-500/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300' 
    : '';

  return (
    <div 
      onClick={onClick} 
      className={`
        relative overflow-hidden
        bg-white/60 dark:bg-slate-900/60 
        backdrop-blur-xl 
        border border-slate-200/60 dark:border-slate-800/60 
        shadow-sm dark:shadow-black/20
        rounded-2xl 
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
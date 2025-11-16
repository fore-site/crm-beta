
import React, { useContext } from 'react';
import { AppContext } from '../../App';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useContext(AppContext);

  return (
     <div className="relative group flex justify-center">
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            {theme === 'light' ? (
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            )}
        </button>
        <span className="absolute left-full ml-4 px-2 py-1 text-sm bg-slate-800 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none hidden lg:block whitespace-nowrap"
            style={{ top: '50%', transform: 'translateY(-50%)' }}
        >
            Switch Theme
        </span>
    </div>
  );
};

export default ThemeToggle;

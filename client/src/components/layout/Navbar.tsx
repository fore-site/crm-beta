
import React, { useState, useContext } from 'react';
import { ICONS, PAGES } from '../../constants';
import { AppContext } from '../../App';
import ToggleSwitch from '../ui/ToggleSwitch';
import ThemeToggle from '../ui/ThemeToggle';

const Navbar: React.FC = () => {
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  const { currency, setCurrency, currentPage, navigateTo } = useContext(AppContext);

  const NavContent = () => (
    <div className="flex flex-col h-full p-2">
      <nav className="space-y-2">
        {PAGES.map((page) => (
          <button
            key={page}
            onClick={() => {
              navigateTo({ page });
              setMobileNavOpen(false);
            }}
            className={`group relative flex items-center justify-start lg:justify-center w-full px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out ${
              currentPage === page
                ? 'bg-primary text-white'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            {ICONS[page]}
            <span className="ml-4 lg:hidden">
              {page}
            </span>
            <span className="absolute left-full ml-4 px-2 py-1 text-sm bg-slate-800 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none hidden lg:block"
              style={{ top: '50%', transform: 'translateY(-50%)' }}
            >
              {page}
            </span>
          </button>
        ))}
      </nav>
      <div className="mt-auto p-2 space-y-4">
         <div className="relative group flex items-center justify-center space-x-2">
          <span className={`text-lg font-medium lg:hidden ${currency === 'NGN' ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400'}`}>₦</span>
          <ToggleSwitch
            checked={currency === 'USD'}
            onChange={(checked) => setCurrency(checked ? 'USD' : 'NGN')}
          />
          <span className={`text-lg font-medium lg:hidden ${currency === 'USD' ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400'}`}>$</span>
           <span className="absolute left-full ml-4 px-2 py-1 text-sm bg-slate-800 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none hidden lg:block whitespace-nowrap"
              style={{ top: '50%', transform: 'translateY(-50%)' }}
            >
              Switch Currency
            </span>
        </div>
        <ThemeToggle />
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile/Tablet Header */}
      <div className="lg:hidden flex justify-between items-center p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20">
        <h1 className="text-xl font-bold text-primary">Roware</h1>
        <button onClick={() => setMobileNavOpen(!isMobileNavOpen)} className="text-slate-600 dark:text-slate-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
      
      {/* Mobile/Tablet Collapsible Nav */}
      <div className={`lg:hidden fixed top-0 left-0 h-full bg-white dark:bg-slate-900 z-30 transition-transform duration-300 ease-in-out ${isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'} w-64 shadow-lg flex flex-col`}>
        <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-800">
          <h1 className="text-xl font-bold text-primary">Roware</h1>
          <button onClick={() => setMobileNavOpen(false)} className="text-slate-500 dark:text-slate-400">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="flex-1">
          <NavContent />
        </div>
      </div>
      {isMobileNavOpen && <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20" onClick={() => setMobileNavOpen(false)}></div>}


      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 w-20 z-10">
        <div className="flex items-center justify-center h-20 border-b border-slate-200 dark:border-slate-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 21V7h4a4 4 0 010 8H8" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15l4 6" />
          </svg>
        </div>
        <div className="flex-1 overflow-y-auto">
          <NavContent />
        </div>
      </aside>
    </>
  );
};

export default Navbar;

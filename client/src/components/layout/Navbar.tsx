
import React, { useState, useContext, memo } from 'react';
import { ICONS, PAGES } from '../../constants';
import { AppContext } from '../../App';
import ToggleSwitch from '../ui/ToggleSwitch';
import ThemeToggle from '../ui/ThemeToggle';

interface NavContentProps {
  onNavigate?: () => void;
}

// Content for the Mobile Drawer (Full details)
const MobileNavContent = memo(({ onNavigate }: NavContentProps) => {
  const { currency, setCurrency, currentPage, navigateTo } = useContext(AppContext);

  return (
    <div className="flex flex-col h-full p-6">
      <nav className="space-y-2 flex-1">
        {PAGES.map((page) => {
            const isActive = currentPage === page;
            return (
                <button
                    key={page}
                    onClick={() => {
                        navigateTo({ page });
                        if (onNavigate) onNavigate();
                    }}
                    className={`group relative flex items-center w-full p-3 rounded-xl transition-all duration-300 ease-out ${
                    isActive
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-slate-800/50 hover:text-indigo-600 dark:hover:text-indigo-400'
                    }`}
                >
                    <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                        {ICONS[page]}
                    </div>
                    
                    <span className={`ml-3 font-bold text-sm tracking-wide ${isActive ? 'text-white' : ''}`}>
                        {page}
                    </span>
                </button>
            );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800/50 space-y-6">
         <div className="relative group flex items-center justify-center space-x-3 bg-slate-100/50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className={`text-xs font-bold transition-colors ${currency === 'NGN' ? 'text-indigo-600' : 'text-slate-400'}`}>₦</span>
          <ToggleSwitch
            checked={currency === 'USD'}
            onChange={(checked) => setCurrency(checked ? 'USD' : 'NGN')}
          />
          <span className={`text-xs font-bold transition-colors ${currency === 'USD' ? 'text-indigo-600' : 'text-slate-400'}`}>$</span>
        </div>
        <div className="flex justify-center">
            <ThemeToggle />
        </div>
      </div>
    </div>
  );
});

// Content for the Desktop Sidebar (Thin, Icon-only)
const DesktopSidebar = memo(() => {
  const { currency, setCurrency, currentPage, navigateTo } = useContext(AppContext);

  return (
    <div className="hidden lg:flex flex-col items-center fixed left-0 top-0 h-screen w-20 bg-slate-900 dark:bg-black border-r border-slate-800 z-50 py-8 transition-all duration-300">
       {/* Logo */}
       <div className="mb-10">
         <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/40">
           R
         </div>
       </div>

       {/* Navigation Icons */}
       <nav className="flex-1 w-full space-y-4 px-4 flex flex-col items-center">
         {PAGES.map((page) => {
            const isActive = currentPage === page;
            return (
                <button
                    key={page}
                    onClick={() => navigateTo({ page })}
                    className={`group relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 ${
                        isActive
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                    title={page}
                >
                    <div className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                        {ICONS[page]}
                    </div>
                    
                    {/* Tooltip (optional visual indicator) */}
                    {!isActive && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                            {page}
                        </div>
                    )}
                </button>
            );
         })}
       </nav>

       {/* Bottom Actions */}
       <div className="mt-auto space-y-6 flex flex-col items-center w-full">
          {/* Compact Currency Toggle */}
          <button 
            onClick={() => setCurrency(currency === 'USD' ? 'NGN' : 'USD')}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-slate-300 hover:bg-indigo-600 hover:text-white transition-all duration-300 font-bold text-xs border border-slate-700 hover:border-indigo-500"
            title={`Current: ${currency}. Click to switch.`}
          >
             {currency}
          </button>

          <div className="text-slate-400 hover:text-white transition-colors">
             <ThemeToggle />
          </div>
       </div>
    </div>
  );
});

const Navbar: React.FC = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* --- Desktop View --- */}
      <DesktopSidebar />

      {/* --- Mobile View --- */}
      {/* Floating Action Button (Only visible on < lg) */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-5 left-5 z-40 p-3 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl active:scale-95 transition-all duration-300 group text-slate-700 dark:text-slate-200"
        aria-label="Open Navigation"
      >
         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>

      {/* Mobile Drawer */}
      <div className={`lg:hidden fixed inset-y-0 left-0 w-80 bg-white/90 dark:bg-[#0F172A]/95 backdrop-blur-2xl z-50 shadow-2xl transform transition-transform duration-500 cubic-bezier(0.19, 1, 0.22, 1) border-r border-slate-200/50 dark:border-slate-700/50 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-6 border-b border-slate-200/50 dark:border-slate-800/50">
             <div className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20">R</div>
                <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">Roware</h1>
            </div>
            <button onClick={() => setIsMobileOpen(false)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
        
        <div className="h-[calc(100vh-89px)] overflow-y-auto scrollbar-hide">
           <MobileNavContent onNavigate={() => setIsMobileOpen(false)} />
        </div>
      </div>

      {/* Backdrop for Mobile Drawer */}
      {isMobileOpen && (
        <div
            className="lg:hidden fixed inset-0 bg-slate-900/20 dark:bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
            onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;

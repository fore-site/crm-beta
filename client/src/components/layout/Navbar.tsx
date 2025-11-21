
import React, { useState, useContext, memo } from 'react';
import { ICONS, PAGES } from '../../constants';
import { AppContext } from '../../App';
import ToggleSwitch from '../ui/ToggleSwitch';
import ThemeToggle from '../ui/ThemeToggle';

interface NavContentProps {
  mobile?: boolean;
  onNavigate?: () => void;
}

const NavContent = memo(({ mobile: _mobile, onNavigate }: NavContentProps) => {
  const { currency, setCurrency, currentPage, navigateTo } = useContext(AppContext);

  return (
    <div className="flex flex-col h-full p-4">
      <nav className="space-y-3 flex-1">
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
                        : 'text-slate-500 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-slate-800/50 hover:text-indigo-600 dark:hover:text-indigo-400'
                    }`}
                >
                    <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                        {ICONS[page]}
                    </div>
                    
                    <span className={`ml-3 font-bold text-sm tracking-wide lg:hidden ${isActive ? 'text-white' : ''}`}>
                        {page}
                    </span>
                    
                    {/* Desktop Tooltip */}
                    <span className="absolute left-full ml-5 px-3 py-2 text-xs font-bold bg-slate-900 text-white rounded-lg opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none hidden lg:block whitespace-nowrap z-50 shadow-xl border border-slate-800">
                        {page}
                        <span className="absolute top-1/2 -left-1 -mt-1 border-4 border-transparent border-r-slate-900"></span>
                    </span>
                </button>
            );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-200/50 dark:border-slate-800/50 space-y-6">
         <div className="relative group flex items-center justify-center space-x-3 bg-slate-100/50 dark:bg-slate-900/50 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
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

const Navbar: React.FC = () => {
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden flex justify-between items-center p-4 bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30">
        <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/30">R</div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">Roware</h1>
        </div>
        <button 
            onClick={() => setMobileNavOpen(!isMobileNavOpen)} 
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
      
      {/* Mobile Nav Drawer */}
      <div className={`lg:hidden fixed inset-y-0 left-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl z-40 transition-transform duration-300 cubic-bezier(0.16, 1, 0.3, 1) ${isMobileNavOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'} w-72 flex flex-col border-r border-slate-200 dark:border-slate-800`}>
        <div className="flex justify-between items-center p-5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">R</div>
                <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">Roware</h1>
            </div>
          <button onClick={() => setMobileNavOpen(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <NavContent mobile onNavigate={() => setMobileNavOpen(false)} />
        </div>
      </div>
      
      {/* Backdrop */}
      {isMobileNavOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-slate-900/20 dark:bg-black/50 backdrop-blur-sm z-30 animate-fade-in" 
            onClick={() => setMobileNavOpen(false)}
        ></div>
      )}


      {/* Desktop Floating Rail */}
      <aside className="hidden lg:flex flex-col w-24 z-20 h-screen sticky top-0 py-4 pl-4">
        <div className="flex-1 flex flex-col bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-2xl shadow-slate-200/50 dark:shadow-black/20 overflow-hidden">
            <div className="flex items-center justify-center h-24">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-indigo-500/30">
                    R
                </div>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-hide">
            <NavContent />
            </div>
        </div>
      </aside>
    </>
  );
};

export default Navbar;

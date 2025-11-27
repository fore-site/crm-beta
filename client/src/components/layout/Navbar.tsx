
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
    <div className="flex flex-col h-full p-6 bg-white dark:bg-[#1e1b2e]">
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
                    className={`group relative flex items-center w-full p-4 rounded-2xl transition-all duration-300 ease-out ${
                    isActive
                        ? 'bg-primary/10 text-primary dark:bg-accent/10 dark:text-accent'
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 hover:text-primary dark:hover:bg-white/5'
                    }`}
                >
                    <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                        {ICONS[page]}
                    </div>
                    
                    <span className={`ml-4 font-bold text-sm tracking-wide ${isActive ? 'text-primary dark:text-accent' : ''}`}>
                        {page}
                    </span>
                </button>
            );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-100 dark:border-white/5 space-y-6">
         <div className="relative group flex items-center justify-center space-x-3 bg-slate-50 dark:bg-black/20 p-2.5 rounded-xl border border-slate-100 dark:border-white/5">
          <span className={`text-xs font-bold transition-colors ${currency === 'NGN' ? 'text-primary' : 'text-slate-400'}`}>₦</span>
          <ToggleSwitch
            checked={currency === 'USD'}
            onChange={(checked) => setCurrency(checked ? 'USD' : 'NGN')}
          />
          <span className={`text-xs font-bold transition-colors ${currency === 'USD' ? 'text-primary' : 'text-slate-400'}`}>$</span>
        </div>
        <div className="flex justify-center">
            <ThemeToggle />
        </div>
      </div>
    </div>
  );
});

// Content for the Desktop Sidebar (Collapsible)
const DesktopSidebar = memo(() => {
  const { currency, setCurrency, currentPage, navigateTo, isSidebarCollapsed, toggleSidebar } = useContext(AppContext);

  return (
    <div 
        className={`hidden lg:flex flex-col fixed left-0 top-0 h-screen bg-primary dark:bg-[#161321] z-50 py-6 transition-all duration-300 ease-in-out shadow-2xl shadow-primary/20
        ${isSidebarCollapsed ? 'w-20 items-center' : 'w-64 items-stretch px-4'}
        `}
    >
       {/* Top Header: Logo & Collapse Button */}
       <div className={`flex items-center mb-8 ${isSidebarCollapsed ? 'flex-col space-y-4' : 'justify-between px-2'}`}>
         {/* Logo */}
         <div className="flex items-center space-x-3">
            <div className={`
                flex items-center justify-center text-white font-extrabold text-xl border border-white/20 bg-white/10 rounded-xl transition-all duration-300
                ${isSidebarCollapsed ? 'w-10 h-10' : 'w-10 h-10'}
            `}>
                R
            </div>
            {/* App Name - Fades out when collapsed */}
            <div className={`overflow-hidden transition-all duration-300 ${isSidebarCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                <span className="text-white font-bold text-lg tracking-tight whitespace-nowrap">Roware</span>
            </div>
         </div>

         {/* Collapse Toggle Button */}
         <button 
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
         >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
         </button>
       </div>

       {/* Navigation Links */}
       <nav className="flex-1 w-full space-y-2">
         {PAGES.map((page) => {
            const isActive = currentPage === page;
            return (
                <button
                    key={page}
                    onClick={() => navigateTo({ page })}
                    className={`
                        group relative flex items-center rounded-xl transition-all duration-300
                        ${isSidebarCollapsed ? 'justify-center w-12 h-12 mx-auto' : 'w-full px-4 py-3'}
                        ${isActive 
                            ? 'bg-white/10 text-accent shadow-inner' 
                            : 'text-white/70 hover:text-white hover:bg-white/5'}
                    `}
                    title={isSidebarCollapsed ? page : ''}
                >
                    <div className={`flex-shrink-0 transition-transform duration-200 ${isActive && isSidebarCollapsed ? 'scale-110' : 'group-hover:scale-110'}`}>
                        {ICONS[page]}
                    </div>
                    
                    {/* Text Label (Hidden when collapsed) */}
                    <span className={`
                        ml-3 font-medium text-sm whitespace-nowrap transition-all duration-300 origin-left
                        ${isSidebarCollapsed ? 'w-0 opacity-0 overflow-hidden scale-0' : 'w-auto opacity-100 scale-100'}
                    `}>
                        {page}
                    </span>
                    
                    {/* Floating Tooltip (Only visible when collapsed) */}
                    {isSidebarCollapsed && (
                        <div className="absolute left-full ml-4 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-50">
                            {page}
                        </div>
                    )}
                </button>
            );
         })}
       </nav>

       {/* Bottom Actions */}
       <div className={`mt-auto space-y-4 flex flex-col ${isSidebarCollapsed ? 'items-center' : 'px-2'}`}>
          {/* Currency Toggle */}
          <button 
            onClick={() => setCurrency(currency === 'USD' ? 'NGN' : 'USD')}
            className={`
                flex items-center rounded-xl bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 border border-white/10
                ${isSidebarCollapsed ? 'justify-center w-10 h-10' : 'px-4 py-3 justify-between w-full'}
            `}
            title={isSidebarCollapsed ? `Current: ${currency}` : ''}
          >
             <span className="font-bold text-xs">{currency}</span>
             {!isSidebarCollapsed && <span className="text-xs opacity-50">Switch Currency</span>}
          </button>

          {/* Theme Toggle Wrapper */}
          <div className={`text-white/70 hover:text-white transition-colors ${!isSidebarCollapsed && 'w-full flex justify-center'}`}>
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
        className="lg:hidden fixed top-5 left-5 z-40 p-3 rounded-2xl bg-white dark:bg-[#1e1b2e] shadow-lg shadow-slate-200/50 dark:shadow-black/40 text-primary dark:text-white"
        aria-label="Open Navigation"
      >
         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>

      {/* Mobile Drawer */}
      <div className={`lg:hidden fixed inset-y-0 left-0 w-80 bg-white dark:bg-[#161321] z-50 shadow-2xl transform transition-transform duration-500 cubic-bezier(0.19, 1, 0.22, 1) ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/5">
             <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20">R</div>
                <h1 className="text-2xl font-extrabold tracking-tight text-primary dark:text-white">Roware</h1>
            </div>
            <button onClick={() => setIsMobileOpen(false)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-400">
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
            className="lg:hidden fixed inset-0 bg-primary-dark/40 dark:bg-black/80 backdrop-blur-sm z-40 animate-fade-in"
            onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;

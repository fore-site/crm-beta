
import React, { useState, useContext, memo } from 'react';
import { ICONS, PAGES } from '../../constants';
import { AppContext } from '../../App';

interface NavContentProps {
  onNavigate?: () => void;
}

// Content for the Mobile Drawer (Styled to match Desktop Sidebar)
const MobileNavContent = memo(({ onNavigate }: NavContentProps) => {
  const { currency, setCurrency, currentPage, navigateTo } = useContext(AppContext);

  return (
    <div className="flex flex-col h-full py-6 px-4 bg-primary">
      <nav className="space-y-2 flex-1 mt-4">
        {PAGES.map((page) => {
            const isActive = currentPage === page;
            return (
                <button
                    key={page}
                    onClick={() => {
                        navigateTo({ page });
                        if (onNavigate) onNavigate();
                    }}
                    className={`group relative flex items-center w-full px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive
                        ? 'bg-white/10 text-accent shadow-inner'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                >
                    <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                        {ICONS[page]}
                    </div>
                    
                    <span className="ml-4 font-medium text-sm tracking-wide">
                        {page}
                    </span>
                </button>
            );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/10 space-y-4">
         <button 
            onClick={() => setCurrency(currency === 'USD' ? 'NGN' : 'USD')}
            className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 border border-white/10"
         >
             <span className="font-bold text-xs">{currency}</span>
             <span className="text-xs opacity-50">Switch Currency</span>
         </button>
      </div>
    </div>
  );
});

// Content for the Desktop Sidebar (Collapsible)
const DesktopSidebar = memo(() => {
  const { currency, setCurrency, currentPage, navigateTo, isSidebarCollapsed, toggleSidebar } = useContext(AppContext);

  return (
    <div 
        className={`hidden lg:flex flex-col fixed left-0 top-0 h-screen bg-primary z-50 py-6 transition-all duration-300 ease-in-out shadow-2xl shadow-primary/20
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
      
      {/* Fixed Top Banner (Only visible on < lg) */}
      <div className="lg:hidden w-full h-16 bg-primary z-40 flex items-center justify-between px-4 shadow-md">
         {/* Logo */}
         <div className="flex items-center space-x-3">
            <div className="w-9 h-9 flex items-center justify-center text-white font-extrabold text-xl border border-white/20 bg-white/10 rounded-xl">
                R
            </div>
            <span className="text-white font-bold text-lg tracking-tight">Roware</span>
         </div>

         {/* Hamburger Button */}
         <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 rounded-xl text-white hover:bg-white/10 transition-colors focus:outline-none"
            aria-label="Open Navigation"
         >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
         </button>
      </div>

      {/* Mobile Drawer */}
      <div className={`lg:hidden fixed inset-y-0 left-0 w-64 bg-primary z-50 shadow-2xl transform transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1) ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full overflow-y-auto scrollbar-hide">
           <MobileNavContent onNavigate={() => setIsMobileOpen(false)} />
        </div>
      </div>

      {/* Backdrop for Mobile Drawer */}
      {isMobileOpen && (
        <div
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
            onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
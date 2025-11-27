
import React, { useContext } from 'react';
import Navbar from './Navbar';
import { AppContext } from '../../App';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { navigationHistory, handleBack, isSidebarCollapsed } = useContext(AppContext);
  const showBackButton = navigationHistory.length > 1;

  return (
    <>
      <Navbar />
      <main 
        className={`
            flex-1 p-4 lg:pt-8 lg:pr-8
            transition-all duration-300 ease-in-out scrollbar-thin
            ${isSidebarCollapsed ? 'lg:pl-28' : 'lg:pl-72'}
        `}
      >
        {showBackButton && (
          <div className="mb-4">
            <button
              onClick={handleBack}
              className="flex items-center text-sm font-medium text-slate-600 hover:text-primary transition-colors"
              aria-label="Go back to previous page"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="ml-1">Back</span>
            </button>
          </div>
        )}
        {children}
      </main>
    </>
  );
};

export default Layout;
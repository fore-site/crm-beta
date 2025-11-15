
import React from 'react';
import Navbar from './Navbar';
import { Page } from '../../types';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  goBack: () => void;
  historyLength: number;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, setCurrentPage, goBack, historyLength }) => {
  return (
    <>
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="flex items-center space-x-4 mb-6">
            {historyLength > 1 && (
                <button onClick={goBack} className="p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Go back">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>
            )}
            <h1 className="text-3xl font-bold text-gray-900">{currentPage}</h1>
        </div>
        {children}
      </main>
    </>
  );
};

export default Layout;

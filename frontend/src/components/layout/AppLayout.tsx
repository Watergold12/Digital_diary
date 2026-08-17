import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MobileNavbar } from './MobileNavbar';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0 scroll-smooth">
          <div className="max-w-5xl mx-auto w-full p-4 md:p-8">
            <Outlet />
          </div>
        </main>
      </div>

      <MobileNavbar />
    </div>
  );
};

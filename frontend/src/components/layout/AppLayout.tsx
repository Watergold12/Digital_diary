import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MobileNavbar } from './MobileNavbar';
import { useSettings } from '../../hooks/useSettings';

export const AppLayout: React.FC = () => {
  // Initialize settings/theme on app load
  useSettings();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <div className="flex flex-1 relative">
        <Sidebar />
        
        {/* Main Content Area */}
        <main className="flex-1 pb-20 md:pb-0 scroll-smooth">
          <div className="max-w-5xl mx-auto w-full p-4 md:p-8">
            <Outlet />
          </div>
        </main>
      </div>

      <MobileNavbar />
    </div>
  );
};

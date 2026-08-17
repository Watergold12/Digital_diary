import React from 'react';
import { BookMarked, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  return (
    <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
      <Link to="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
        <BookMarked size={24} className="stroke-[2.5]" />
        <span className="font-semibold text-lg tracking-tight text-main">Journal</span>
      </Link>
      
      <div className="flex items-center gap-4">
        {/* Placeholder for user profile or other global actions */}
        <button className="text-secondary hover:text-primary transition-colors focus:outline-none">
          <UserCircle size={24} />
        </button>
      </div>
    </header>
  );
};

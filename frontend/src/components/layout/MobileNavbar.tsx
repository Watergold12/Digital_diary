import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Tags, Search, Settings } from 'lucide-react';
import { cn } from '../../utils/cn';

const mobileNavItems = [
  { name: 'Home', path: '/', icon: LayoutDashboard },
  { name: 'Diary', path: '/diary', icon: BookOpen },
  { name: 'Tags', path: '/tags', icon: Tags },
  { name: 'Search', path: '/search', icon: Search },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export const MobileNavbar: React.FC = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface border-t border-border flex items-center justify-around px-2 pb-safe z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      {mobileNavItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
              isActive ? "text-primary" : "text-secondary"
            )
          }
        >
          <item.icon size={20} strokeWidth={2.5} />
          <span className="text-[10px] font-medium">{item.name}</span>
        </NavLink>
      ))}
    </nav>
  );
};

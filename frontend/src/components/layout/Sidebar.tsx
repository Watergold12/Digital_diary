import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Tags, Search, Settings, PenLine } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Diary', path: '/diary', icon: BookOpen },
  { name: 'Tags', path: '/tags', icon: Tags },
  { name: 'Search', path: '/search', icon: Search },
];

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <aside className="hidden md:flex flex-col w-64 h-[calc(100vh-64px)] border-r border-border bg-background p-4 sticky top-16 overflow-y-auto">
      <div className="mb-8 px-2">
        <Button 
          variant="primary" 
          className="w-full flex justify-center gap-2"
          onClick={() => navigate('/diary/new')}
        >
          <PenLine size={18} />
          New Entry
        </Button>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-secondary-bg text-primary" 
                  : "text-secondary hover:bg-secondary-bg hover:text-main"
              )
            }
          >
            <item.icon size={20} />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-border">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              isActive 
                ? "bg-secondary-bg text-primary" 
                : "text-secondary hover:bg-secondary-bg hover:text-main"
            )
          }
        >
          <Settings size={20} />
          Settings
        </NavLink>
      </div>
    </aside>
  );
};

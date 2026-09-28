import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Tags, Search, Settings, PenLine, LogOut, Sparkles } from 'lucide-react';
import { AIAssistantModal } from '../ui/AIAssistantModal';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Diary', path: '/diary', icon: BookOpen },
  { name: 'Tags', path: '/tags', icon: Tags },
  { name: 'Search', path: '/search', icon: Search },
];

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isAIModalOpen, setIsAIModalOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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

      <div className="mt-auto pt-4 border-t border-border space-y-1">
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
        <button
          onClick={() => setIsAIModalOpen(true)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
        >
          <Sparkles size={20} />
          Ask AI
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-danger hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut size={20} />
          Sign out
        </button>
      </div>
      <AIAssistantModal isOpen={isAIModalOpen} onClose={() => setIsAIModalOpen(false)} />
    </aside>
  );
};

import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: 'left' | 'right';
}

export const Dropdown: React.FC<DropdownProps> = ({ trigger, children, align = 'left' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>
      
      {isOpen && (
        <div 
          className={cn(
            "absolute z-10 mt-2 w-48 rounded-md bg-surface shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in zoom-in-95 duration-100",
            align === 'right' ? "right-0 origin-top-right" : "left-0 origin-top-left"
          )}
        >
          <div className="py-1" role="menu" onClick={() => setIsOpen(false)}>
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

interface DropdownItemProps {
  onClick: () => void;
  children: ReactNode;
  icon?: ReactNode;
  destructive?: boolean;
}

export const DropdownItem: React.FC<DropdownItemProps> = ({ onClick, children, icon, destructive }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left flex items-center px-4 py-2 text-sm transition-colors",
        destructive 
          ? "text-danger hover:bg-red-50" 
          : "text-main hover:bg-secondary-bg"
      )}
      role="menuitem"
    >
      {icon && <span className="mr-2.5">{icon}</span>}
      {children}
    </button>
  );
};

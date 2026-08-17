import React from 'react';
import { Tag } from '../../types/tag';
import { cn } from '../../utils/cn';

interface TagBadgeProps {
  tag: Tag;
  className?: string;
  onClick?: (tag: Tag) => void;
  onRemove?: (tag: Tag) => void;
}

export const TagBadge: React.FC<TagBadgeProps> = ({ tag, className, onClick, onRemove }) => {
  const isClickable = !!onClick;
  
  // Map tag colors to CSS variables defined in index.css
  const colorMap: Record<string, { bg: string, text: string, hover: string }> = {
    lavender: { bg: 'bg-[var(--color-tag-lavender)]', text: 'text-indigo-900', hover: 'hover:bg-indigo-200' },
    blue: { bg: 'bg-[var(--color-tag-blue)]', text: 'text-blue-900', hover: 'hover:bg-blue-200' },
    green: { bg: 'bg-[var(--color-tag-green)]', text: 'text-green-900', hover: 'hover:bg-green-200' },
    yellow: { bg: 'bg-[var(--color-tag-yellow)]', text: 'text-yellow-900', hover: 'hover:bg-yellow-200' },
    pink: { bg: 'bg-[var(--color-tag-pink)]', text: 'text-pink-900', hover: 'hover:bg-pink-200' },
  };

  const style = colorMap[tag.color] || colorMap.lavender;

  return (
    <span
      onClick={() => isClickable && onClick(tag)}
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors",
        style.bg,
        style.text,
        isClickable && "cursor-pointer " + style.hover,
        className
      )}
    >
      {tag.name}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(tag);
          }}
          className={cn(
            "ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full hover:bg-black/10 focus:outline-none transition-colors",
            style.text
          )}
        >
          <span className="sr-only">Remove {tag.name}</span>
          <svg viewBox="0 0 14 14" className="h-2.5 w-2.5 stroke-current" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4l6 6m0-6l-6 6" />
          </svg>
        </button>
      )}
    </span>
  );
};

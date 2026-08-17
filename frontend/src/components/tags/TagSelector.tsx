import React, { useState } from 'react';
import { Tag } from '../../types/tag';
import { TagBadge } from './TagBadge';
import { Plus } from 'lucide-react';

interface TagSelectorProps {
  availableTags: Tag[];
  selectedTags: Tag[];
  onSelect: (tag: Tag) => void;
  onRemove: (tag: Tag) => void;
}

export const TagSelector: React.FC<TagSelectorProps> = ({ availableTags, selectedTags, onSelect, onRemove }) => {
  const [isOpen, setIsOpen] = useState(false);

  const unselectedTags = availableTags.filter(
    (tag) => !selectedTags.some((selected) => selected.id === tag.id)
  );

  return (
    <div className="flex flex-wrap items-center gap-2 relative">
      {selectedTags.map((tag) => (
        <TagBadge key={tag.id} tag={tag} onRemove={() => onRemove(tag)} />
      ))}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-bg text-secondary hover:bg-secondary-bg/80 transition-colors"
        >
          <Plus size={14} /> Add Tag
        </button>
        
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <div className="absolute top-full left-0 mt-1 z-20 w-48 rounded-md bg-surface shadow-lg ring-1 ring-black ring-opacity-5 p-2 animate-in fade-in zoom-in-95 duration-100">
              {unselectedTags.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {unselectedTags.map((tag) => (
                    <TagBadge
                      key={tag.id}
                      tag={tag}
                      onClick={() => {
                        onSelect(tag);
                        setIsOpen(false);
                      }}
                      className="w-full justify-start cursor-pointer hover:opacity-80"
                    />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-secondary text-center py-2">No more tags available</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

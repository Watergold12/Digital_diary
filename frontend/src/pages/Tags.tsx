import React from 'react';
import { useTags } from '../hooks/useTags';
import { useDiary } from '../hooks/useDiary';
import { TagBadge } from '../components/tags/TagBadge';

export const Tags: React.FC = () => {
  const { tags } = useTags();
  const { entries } = useDiary();

  const getEntryCount = (tagId: string) => {
    return entries.filter(e => e.tags.some(t => t.id === tagId)).length;
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-main">Tags</h1>
        <p className="text-secondary mt-1">Organize your thoughts by topics</p>
      </header>

      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-gray-50/50">
          <h2 className="text-sm font-semibold text-secondary uppercase tracking-wider">Your tags</h2>
        </div>
        
        {tags.length === 0 ? (
          <div className="p-8 text-center text-secondary">
            No tags created yet.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {tags.map((tag) => (
              <li key={tag.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <TagBadge tag={tag} className="text-sm px-3 py-1" />
                </div>
                <div className="text-secondary text-sm font-medium">
                  {getEntryCount(tag.id)} {getEntryCount(tag.id) === 1 ? 'entry' : 'entries'}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

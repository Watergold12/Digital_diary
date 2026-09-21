import React, { useState, useMemo } from 'react';
import { useDiary } from '../hooks/useDiary';
import { DiaryCard } from '../components/diary/DiaryCard';
import { Input } from '../components/ui/Input';
import { Search as SearchIcon } from 'lucide-react';

export const Search: React.FC = () => {
  const { entries, isLoading } = useDiary();
  const [query, setQuery] = useState('');

  const filteredEntries = useMemo(() => {
    if (!query.trim()) return [];
    
    const lowerQuery = query.toLowerCase();
    return entries.filter(entry => 
      entry.title.toLowerCase().includes(lowerQuery) ||
      entry.content.toLowerCase().includes(lowerQuery) ||
      entry.tags.some(tag => tag.name.toLowerCase().includes(lowerQuery))
    );
  }, [entries, query]);

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-main mb-6">Search</h1>
        <div className="relative max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon size={20} className="text-secondary" />
          </div>
          <Input
            autoFocus
            type="text"
            placeholder="Search your diary by title, content, or tags..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 h-12 text-base"
          />
        </div>
      </header>

      {query.trim() && (
        <section>
          <h2 className="text-sm font-semibold text-secondary mb-4 uppercase tracking-wider">
            {filteredEntries.length} {filteredEntries.length === 1 ? 'Result' : 'Results'}
          </h2>
          
          {filteredEntries.length === 0 ? (
            <div className="py-12 text-center text-secondary bg-surface rounded-xl border border-border">
              No entries found for "{query}". Try different keywords.
            </div>
          ) : (
             <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredEntries.map((entry) => (
                <DiaryCard key={entry.id} entry={entry} />
              ))}
            </div>
          )}
        </section>
      )}

      {!query.trim() && !isLoading && (
        <div className="py-16 text-center text-secondary/60">
          <SearchIcon size={48} className="mx-auto mb-4 opacity-20" />
          <p className="text-lg">Start typing to search your diary</p>
        </div>
      )}
    </div>
  );
};

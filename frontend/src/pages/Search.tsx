import React, { useState, useEffect } from 'react';
import { DiaryCard } from '../components/diary/DiaryCard';
import { Input } from '../components/ui/Input';
import { Search as SearchIcon } from 'lucide-react';
import { entriesApi } from '../api/entries';
import { DiaryEntry } from '../types/diary';

export const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [filteredEntries, setFilteredEntries] = useState<DiaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setFilteredEntries([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsLoading(true);
        const results = await entriesApi.getEntries(query.trim());
        setFilteredEntries(results);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }, 300); // debounce

    return () => clearTimeout(timer);
  }, [query]);

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
          <h2 className="text-sm font-semibold text-secondary mb-4 uppercase tracking-wider flex items-center gap-2">
            {isLoading ? 'Searching...' : `${filteredEntries.length} ${filteredEntries.length === 1 ? 'Result' : 'Results'}`}
          </h2>
          
          {filteredEntries.length === 0 && !isLoading ? (
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

      {!query.trim() && (
        <div className="py-16 text-center text-secondary/60">
          <SearchIcon size={48} className="mx-auto mb-4 opacity-20" />
          <p className="text-lg">Start typing to search your diary on the server</p>
        </div>
      )}
    </div>
  );
};

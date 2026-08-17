import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTags } from '../hooks/useTags';
import { useDiary } from '../hooks/useDiary';
import { DiaryCard } from '../components/diary/DiaryCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { TagBadge } from '../components/tags/TagBadge';
import { ArrowLeft, Search as SearchIcon } from 'lucide-react';

export const TagFilteredEntries: React.FC = () => {
  const { tagId } = useParams<{ tagId: string }>();
  const { tags, isLoading: isTagsLoading } = useTags();
  const { entries, isLoading: isEntriesLoading } = useDiary();
  const [query, setQuery] = useState('');

  const tag = useMemo(() => tags.find(t => t.id === tagId), [tags, tagId]);

  const filteredEntries = useMemo(() => {
    if (!tag) return [];
    
    const entriesWithTag = entries.filter(e => e.tags.some(t => t.id === tagId));
    
    if (!query.trim()) return entriesWithTag;
    
    const lowerQuery = query.toLowerCase();
    return entriesWithTag.filter(entry => 
      entry.title.toLowerCase().includes(lowerQuery) ||
      entry.content.toLowerCase().includes(lowerQuery)
    );
  }, [entries, tagId, tag, query]);

  if (isTagsLoading || isEntriesLoading) {
    return (
      <div className="max-w-5xl mx-auto animate-pulse space-y-8">
        <div className="h-6 w-24 bg-gray-200 rounded" />
        <div className="h-10 w-1/3 bg-gray-200 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {[...Array(3)].map((_, i) => <div key={i} className="h-48 bg-gray-200 rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (!tag) {
    return (
      <div className="max-w-4xl mx-auto animate-in fade-in duration-500 text-center py-16">
        <h1 className="text-3xl font-bold text-main mb-4">Tag not found</h1>
        <p className="text-secondary mb-8">This tag may have been deleted or no longer exists.</p>
        <Link to="/tags">
          <Button variant="primary">
            <ArrowLeft size={16} className="mr-2" /> Back to Tags
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
      <nav className="mb-6">
        <Link 
          to="/tags"
          className="inline-flex items-center gap-2 text-secondary hover:text-main transition-colors font-medium"
        >
          <ArrowLeft size={18} />
          Back to Tags
        </Link>
      </nav>

      <header className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <h1 className="text-3xl font-bold text-main">Tag:</h1>
          <TagBadge tag={tag} className="text-sm px-3 py-1" />
        </div>
        <p className="text-secondary font-medium uppercase tracking-wider text-sm mt-2">
          {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'}
        </p>

        {/* Search within tag */}
        <div className="mt-6 relative max-w-xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon size={18} className="text-secondary" />
          </div>
          <Input
            type="text"
            placeholder={`Search within ${tag.name}...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </header>

      {filteredEntries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-surface border border-border rounded-xl">
          <div className="bg-secondary-bg p-4 rounded-full mb-6">
            <SearchIcon size={32} className="text-primary opacity-50" />
          </div>
          <h3 className="text-xl font-semibold text-main mb-2">No entries found.</h3>
          <p className="text-secondary max-w-md mb-8">
            {query.trim() 
              ? `No entries match "${query}" in this tag.` 
              : `You haven't added any diary entries to this tag yet.`}
          </p>
          {!query.trim() && (
            <Link to="/diary/new">
              <Button variant="primary">
                Create New Entry
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredEntries.map((entry) => (
            <DiaryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { useDiary } from '../hooks/useDiary';
import { DiaryCard } from '../components/diary/DiaryCard';
import { EmptyDiaryState } from '../components/diary/EmptyDiaryState';

export const Diary: React.FC = () => {
  const { entries, isLoading } = useDiary();

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-10 bg-gray-200 rounded w-1/4" />
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => <div key={i} className="h-48 bg-gray-200 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-main">All Entries</h1>
        <p className="text-secondary mt-1">A chronological view of your memories</p>
      </header>

      {entries.length === 0 ? (
        <EmptyDiaryState />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {entries.map((entry) => (
            <DiaryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
};

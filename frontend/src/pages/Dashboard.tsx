import React from 'react';
import { useDiary } from '../hooks/useDiary';
import { useTags } from '../hooks/useTags';
import { DiaryCard } from '../components/diary/DiaryCard';
import { EmptyDiaryState } from '../components/diary/EmptyDiaryState';
import { formatDate } from '../utils/date';

export const Dashboard: React.FC = () => {
  const { entries, isLoading } = useDiary();
  const { tags } = useTags();

  const thisMonthEntries = entries.filter((e) => {
    const date = new Date(e.date);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  });

  if (isLoading) {
    return <div className="animate-pulse space-y-8">
      <div className="h-20 bg-gray-200 rounded-xl" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-gray-200 rounded-xl" />)}
      </div>
      <div className="h-64 bg-gray-200 rounded-xl" />
    </div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-main">Good evening</h1>
        <p className="text-secondary mt-1">{formatDate(new Date().toISOString())}</p>
      </header>

      {/* Quick Statistics */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface p-4 rounded-xl border border-border shadow-sm">
          <p className="text-secondary text-sm font-medium mb-1">Total Entries</p>
          <p className="text-2xl font-bold text-main">{entries.length}</p>
        </div>
        <div className="bg-surface p-4 rounded-xl border border-border shadow-sm">
          <p className="text-secondary text-sm font-medium mb-1">This Month</p>
          <p className="text-2xl font-bold text-main">{thisMonthEntries.length}</p>
        </div>
        <div className="bg-surface p-4 rounded-xl border border-border shadow-sm">
          <p className="text-secondary text-sm font-medium mb-1">Total Tags</p>
          <p className="text-2xl font-bold text-main">{tags.length}</p>
        </div>
        <div className="bg-surface p-4 rounded-xl border border-border shadow-sm">
          <p className="text-secondary text-sm font-medium mb-1">Latest Activity</p>
          <p className="text-lg font-bold text-main mt-1 truncate">
            {entries.length > 0 ? entries[0].title : 'None'}
          </p>
        </div>
      </section>

      {/* Recent Entries */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-main">Recent Entries</h2>
        </div>
        
        {entries.length === 0 ? (
          <EmptyDiaryState />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
            {entries.slice(0, 6).map((entry) => (
              <DiaryCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

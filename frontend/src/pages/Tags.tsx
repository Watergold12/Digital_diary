import React, { useState } from 'react';
import { useTags } from '../hooks/useTags';
import { useDiary } from '../hooks/useDiary';
import { TagBadge } from '../components/tags/TagBadge';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Tag } from '../types/tag';

const COLORS = ['lavender', 'blue', 'green', 'yellow', 'pink'] as const;

export const Tags: React.FC = () => {
  const { tags, addTag } = useTags();
  const { entries } = useDiary();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState<Tag['color']>('lavender');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getEntryCount = (tagId: string) => {
    return entries.filter(e => e.tags.some(t => t.id === tagId)).length;
  };

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    
    setIsSubmitting(true);
    try {
      await addTag({ name: newTagName.trim(), color: newTagColor });
      setIsModalOpen(false);
      setNewTagName('');
      setNewTagColor('lavender');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500 pb-12">
      <header className="mb-8 flex items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-main">Tags</h1>
          <p className="text-secondary mt-1">Organize your thoughts by topics</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary/10 hover:bg-primary/20 text-primary p-2 rounded-full transition-colors flex items-center justify-center shrink-0"
          aria-label="Add new tag"
        >
          <Plus size={24} />
        </button>
      </header>

      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-secondary-bg/50 flex justify-between items-center">
          <h2 className="text-sm font-semibold text-secondary uppercase tracking-wider">Your tags</h2>
        </div>
        
        {tags.length === 0 ? (
          <div className="p-8 text-center text-secondary">
            No tags created yet.
            <div className="mt-4">
              <Button variant="outline" onClick={() => setIsModalOpen(true)}>
                Create your first tag
              </Button>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border flex flex-col">
            {tags.map((tag) => (
              <Link 
                key={tag.id} 
                to={`/tags/${tag.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-secondary-bg/50 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <TagBadge tag={tag} className="text-sm px-3 py-1 group-hover:scale-105 transition-transform" />
                </div>
                <div className="text-secondary text-sm font-medium flex items-center gap-2 group-hover:text-primary transition-colors">
                  <span>{getEntryCount(tag.id)} {getEntryCount(tag.id) === 1 ? 'entry' : 'entries'}</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Tag">
        <form onSubmit={handleCreateTag} className="space-y-6 mt-4">
          <Input 
            label="Tag Name" 
            placeholder="e.g., Ideas, Work, Important..." 
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            required
            autoFocus
          />
          
          <div>
            <label className="block text-sm font-medium text-main mb-3">Color</label>
            <div className="flex flex-wrap gap-3">
              {COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setNewTagColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform ${newTagColor === color ? 'border-primary scale-110' : 'border-transparent hover:scale-105'}`}
                >
                  {/* Using standard tag backgrounds logic manually or just basic tailwind classes for the preview */}
                  <div className={`w-full h-full rounded-full bg-tag-${color}-bg`}></div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={!newTagName.trim() || isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Tag'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

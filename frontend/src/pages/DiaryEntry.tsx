import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import type { DiaryEntry as DiaryEntryType } from '../types/diary';
import { api } from '../services/api';
import { useDiary } from '../hooks/useDiary';
import { formatDate } from '../utils/date';
import { TagBadge } from '../components/tags/TagBadge';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';

export const DiaryEntry: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { removeEntry } = useDiary();
  
  const [entry, setEntry] = useState<DiaryEntryType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchEntry = async () => {
      if (!id) return;
      try {
        const data = await api.getEntryById(id);
        if (data) {
          setEntry(data);
        } else {
          navigate('/diary');
        }
      } catch (error) {
        navigate('/diary');
      } finally {
        setIsLoading(false);
      }
    };
    fetchEntry();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!id) return;
    try {
      setIsDeleting(true);
      await removeEntry(id);
      setIsDeleteDialogOpen(false);
      navigate('/diary');
    } catch (error) {
      console.error(error);
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <div className="max-w-3xl mx-auto animate-pulse space-y-6">
      <div className="h-6 w-24 bg-gray-200 rounded" />
      <div className="h-10 w-3/4 bg-gray-200 rounded" />
      <div className="flex gap-2">
        <div className="h-6 w-16 bg-gray-200 rounded-full" />
        <div className="h-6 w-16 bg-gray-200 rounded-full" />
      </div>
      <div className="space-y-3 pt-6 border-t border-border">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
      </div>
    </div>;
  }

  if (!entry) return null;

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-300">
      <nav className="flex items-center justify-between mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-secondary hover:text-main transition-colors font-medium"
        >
          <ArrowLeft size={18} />
          Back
        </button>
        
        <div className="flex items-center gap-3">
          <Link 
            to={`/diary/${entry.id}/edit`}
            className="flex items-center gap-2 text-secondary hover:text-primary transition-colors p-2 rounded-md hover:bg-gray-100"
          >
            <Pencil size={18} />
            <span className="hidden sm:inline">Edit</span>
          </Link>
          <button 
            onClick={() => setIsDeleteDialogOpen(true)}
            className="flex items-center gap-2 text-secondary hover:text-danger transition-colors p-2 rounded-md hover:bg-red-50"
          >
            <Trash2 size={18} />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      </nav>

      <article>
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-main mb-4 leading-tight">
            {entry.title}
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-secondary">
            <time className="font-medium text-main/80">
              {formatDate(entry.date)}
            </time>
            {entry.tags.length > 0 && (
              <>
                <span className="hidden sm:inline text-border">•</span>
                <div className="flex flex-wrap gap-2">
                  {entry.tags.map((tag) => (
                    <TagBadge key={tag.id} tag={tag} />
                  ))}
                </div>
              </>
            )}
          </div>
        </header>

        <div className="prose prose-lg max-w-none text-main/90 font-serif leading-relaxed whitespace-pre-wrap pt-8 border-t border-border/60">
          {entry.content}
        </div>
      </article>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Entry"
        message="Are you sure you want to delete this diary entry? This action cannot be undone."
        confirmText="Delete"
        isDestructive
        isLoading={isDeleting}
      />
    </div>
  );
};

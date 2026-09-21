import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag } from '../../types/tag';
import { DiaryEntry } from '../../types/diary';
import { Input, Textarea } from '../ui/Input';
import { Button } from '../ui/Button';
import { TagSelector } from '../tags/TagSelector';
import { useTags } from '../../hooks/useTags';
import { ArrowLeft } from 'lucide-react';

interface DiaryEditorProps {
  initialData?: Partial<DiaryEntry>;
  onSubmit: (data: Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  isSubmitting: boolean;
  title: string;
}

export const DiaryEditor: React.FC<DiaryEditorProps> = ({ initialData, onSubmit, isSubmitting, title }) => {
  const navigate = useNavigate();
  const { tags: availableTags } = useTags();
  
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    date: initialData?.date || new Date().toISOString(),
    tags: initialData?.tags || [] as Tag[],
  });

  const [errors, setErrors] = useState<{ title?: string; content?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { title?: string; content?: string } = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.content.trim()) newErrors.content = 'Content is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    await onSubmit(formData);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-secondary hover:text-main transition-colors mb-6 font-medium"
      >
        <ArrowLeft size={18} />
        Back
      </button>
      
      <h1 className="text-2xl font-bold text-main mb-8">{title}</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-surface p-6 sm:p-8 rounded-xl border border-border">
        <Input
          label="Title"
          placeholder="What happened today?"
          value={formData.title}
          onChange={(e) => {
            setFormData({ ...formData, title: e.target.value });
            if (errors.title) setErrors({ ...errors, title: undefined });
          }}
          error={errors.title}
          className="text-lg font-medium"
        />
        
        <div>
          <label className="block text-sm font-medium text-main mb-2">Tags</label>
          <TagSelector
            availableTags={availableTags}
            selectedTags={formData.tags}
            onSelect={(tag) => setFormData({ ...formData, tags: [...formData.tags, tag] })}
            onRemove={(tag) => setFormData({ ...formData, tags: formData.tags.filter((t) => t.id !== tag.id) })}
          />
        </div>
        
        <Textarea
          label="Content"
          placeholder="Write about your day..."
          value={formData.content}
          onChange={(e) => {
            setFormData({ ...formData, content: e.target.value });
            if (errors.content) setErrors({ ...errors, content: undefined });
          }}
          error={errors.content}
          className="min-h-[300px] font-serif text-base leading-relaxed resize-y"
        />
        
        <div className="flex justify-end gap-3 pt-4 border-t border-border mt-8">
          <Button type="button" variant="ghost" onClick={() => navigate(-1)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Save Entry
          </Button>
        </div>
      </form>
    </div>
  );
};

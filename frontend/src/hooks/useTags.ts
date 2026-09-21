import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { Tag } from '../types/tag';
import { useToast } from '../components/ui/Toast';

export const useTags = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchTags = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await api.getTags();
      setTags(data);
      setError(null);
    } catch (err) {
      setError('Failed to load tags');
      toast('Failed to load tags', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const addTag = async (tagData: Omit<Tag, 'id'>) => {
    try {
      const newTag = await api.createTag(tagData);
      setTags((prev) => [...prev, newTag]);
      toast('Tag created successfully', 'success');
      return newTag;
    } catch (err) {
      toast('Failed to create tag', 'error');
      throw err;
    }
  };

  const removeTag = async (id: string) => {
    try {
      await api.deleteTag(id);
      setTags((prev) => prev.filter((t) => t.id !== id));
      toast('Tag deleted', 'success');
    } catch (err) {
      toast('Failed to delete tag', 'error');
      throw err;
    }
  };

  return { tags, isLoading, error, addTag, removeTag, refreshTags: fetchTags };
};

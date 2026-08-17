import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { DiaryEntry } from '../types/diary';
import { useToast } from '../components/ui/Toast';

export const useDiary = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchEntries = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await api.getEntries();
      setEntries(data);
      setError(null);
    } catch (err) {
      setError('Failed to load entries');
      toast('Failed to load entries', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const addEntry = async (entryData: Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newEntry = await api.createEntry(entryData);
      setEntries((prev) => [newEntry, ...prev]);
      toast('Entry saved', 'success');
      return newEntry;
    } catch (err) {
      toast('Failed to save entry', 'error');
      throw err;
    }
  };

  const editEntry = async (id: string, entryData: Partial<Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      const updatedEntry = await api.updateEntry(id, entryData);
      setEntries((prev) => prev.map((e) => (e.id === id ? updatedEntry : e)));
      toast('Entry updated', 'success');
      return updatedEntry;
    } catch (err) {
      toast('Failed to update entry', 'error');
      throw err;
    }
  };

  const removeEntry = async (id: string) => {
    try {
      await api.deleteEntry(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
      toast('Entry deleted', 'success');
    } catch (err) {
      toast('Failed to delete entry', 'error');
      throw err;
    }
  };

  const clearAllEntries = async () => {
    try {
      await api.deleteAllEntries();
      setEntries([]);
      toast('All entries deleted', 'success');
    } catch (err) {
      toast('Failed to delete entries', 'error');
      throw err;
    }
  };

  return { entries, isLoading, error, addEntry, editEntry, removeEntry, clearAllEntries, refreshEntries: fetchEntries };
};

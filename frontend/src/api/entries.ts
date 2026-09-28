import { DiaryEntry } from '../types/diary';
import { apiClient } from './client';

export const entriesApi = {
  getEntries: async (): Promise<DiaryEntry[]> => {
    const backendEntries = await apiClient.get<any[]>('/api/entries');
    return backendEntries.map(e => ({
      ...e,
      date: e.created_at,
      createdAt: e.created_at,
      updatedAt: e.updated_at,
    }));
  },

  getEntryById: async (id: string): Promise<DiaryEntry | null> => {
    try {
      const e = await apiClient.get<any>(`/api/entries/${id}`);
      return {
        ...e,
        date: e.created_at,
        createdAt: e.created_at,
        updatedAt: e.updated_at,
      };
    } catch (error) {
      return null;
    }
  },

  createEntry: async (entryData: Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt' | 'date'>): Promise<DiaryEntry> => {
    const payload = {
      title: entryData.title,
      content: entryData.content,
      mood: entryData.mood,
      tag_ids: entryData.tags ? entryData.tags.map((t: any) => t.id) : [],
    };
    const e = await apiClient.post<any>('/api/entries', payload);
    return {
      ...e,
      date: e.created_at,
      createdAt: e.created_at,
      updatedAt: e.updated_at,
    };
  },

  updateEntry: async (id: string, entryData: Partial<Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt' | 'date'>>): Promise<DiaryEntry> => {
    const payload: any = { ...entryData };
    if (entryData.tags !== undefined) {
      payload.tag_ids = entryData.tags.map((t: any) => t.id);
      delete payload.tags;
    }
    const e = await apiClient.put<any>(`/api/entries/${id}`, payload);
    return {
      ...e,
      date: e.created_at,
      createdAt: e.created_at,
      updatedAt: e.updated_at,
    };
  },

  deleteEntry: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/entries/${id}`);
  },

  deleteAllEntries: async (): Promise<void> => {
    const entries = await entriesApi.getEntries();
    for (const e of entries) {
      await entriesApi.deleteEntry(e.id);
    }
  }
};

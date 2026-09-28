import { Tag } from '../types/tag';
import { apiClient } from './client';

export const tagsApi = {
  getTags: async (): Promise<Tag[]> => {
    return await apiClient.get<Tag[]>('/api/tags');
  },

  createTag: async (tagData: Omit<Tag, 'id'>): Promise<Tag> => {
    return await apiClient.post<Tag>('/api/tags', tagData);
  },
  
  updateTag: async (id: string, tagData: Partial<Omit<Tag, 'id'>>): Promise<Tag> => {
    return await apiClient.put<Tag>(`/api/tags/${id}`, tagData);
  },

  deleteTag: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/tags/${id}`);
  },
};

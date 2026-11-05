import { apiClient } from './client';
import { AppSettings } from '../types/settings';

export const settingsApi = {
  getSettings: async (): Promise<AppSettings> => {
    const data = await apiClient.get<AppSettings>('/api/settings');
    return data;
  },

  updateSettings: async (settings: Partial<AppSettings>): Promise<AppSettings> => {
    const data = await apiClient.put<AppSettings>('/api/settings', settings);
    return data;
  }
};

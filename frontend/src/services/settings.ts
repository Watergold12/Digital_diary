import { AppSettings, defaultSettings } from '../types/settings';

const SETTINGS_KEY = 'diary_app_settings';

export const settingsService = {
  getSettings(): AppSettings {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        // Merge with defaults in case new fields were added
        const parsed = JSON.parse(stored);
        return {
          profile: { ...defaultSettings.profile, ...(parsed.profile || {}) },
          appearance: { ...defaultSettings.appearance, ...(parsed.appearance || {}) },
          diaryPreferences: { ...defaultSettings.diaryPreferences, ...(parsed.diaryPreferences || {}) },
          notifications: { ...defaultSettings.notifications, ...(parsed.notifications || {}) },
        };
      }
    } catch (e) {
      console.error('Failed to parse settings', e);
    }
    return defaultSettings;
  },

  saveSettings(settings: AppSettings): void {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  },

  resetSettings(): void {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
  }
};

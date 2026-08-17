import { useState, useEffect } from 'react';
import { AppSettings } from '../types/settings';
import { settingsService } from '../services/settings';
import { useToast } from '../components/ui/Toast';

export const useSettings = () => {
  const [settings, setSettings] = useState<AppSettings>(settingsService.getSettings());
  const { toast } = useToast();

  useEffect(() => {
    // Optionally apply theme directly here or let a root component handle it.
    const root = window.document.documentElement;
    const theme = settings.appearance.theme;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // system
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [settings.appearance.theme]);

  const updateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    settingsService.saveSettings(newSettings);
  };

  const updateProfile = (profile: AppSettings['profile']) => {
    const next = { ...settings, profile };
    updateSettings(next);
    toast('Profile updated successfully', 'success');
  };

  const updateAppearance = (appearance: AppSettings['appearance']) => {
    const next = { ...settings, appearance };
    updateSettings(next);
  };

  const updateDiaryPreferences = (diaryPreferences: AppSettings['diaryPreferences']) => {
    const next = { ...settings, diaryPreferences };
    updateSettings(next);
  };

  const updateNotifications = (notifications: AppSettings['notifications']) => {
    const next = { ...settings, notifications };
    updateSettings(next);
  };

  const resetSettings = () => {
    settingsService.resetSettings();
    setSettings(settingsService.getSettings());
    toast('Preferences reset to default', 'info');
  };

  return {
    settings,
    updateProfile,
    updateAppearance,
    updateDiaryPreferences,
    updateNotifications,
    resetSettings
  };
};

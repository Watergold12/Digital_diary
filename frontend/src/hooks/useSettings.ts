import { useState, useEffect } from 'react';
import { AppSettings, defaultSettings } from '../types/settings';
import { settingsApi } from '../api/settings';
import { useToast } from '../components/ui/Toast';

export const useSettings = () => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;
    
    const loadSettings = async () => {
      try {
        const data = await settingsApi.getSettings();
        if (mounted) {
          setSettings(data);
        }
      } catch (err) {
        console.error('Failed to load settings', err);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };
    
    loadSettings();
    
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const applyTheme = () => {
      const root = window.document.documentElement;
      const theme = settings.appearance.theme;
      
      if (theme === 'dark') {
        root.classList.add('dark');
      } else if (theme === 'light') {
        root.classList.remove('dark');
      } else {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    };

    applyTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (settings.appearance.theme === 'system') {
        applyTheme();
      }
    };
    
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [settings.appearance.theme]);

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    try {
      // Optimistic update
      setSettings(prev => ({ ...prev, ...newSettings }));
      // API call
      const updated = await settingsApi.updateSettings(newSettings);
      setSettings(updated);
    } catch (err) {
      console.error('Failed to update settings', err);
      toast('Failed to save settings', 'error');
    }
  };

  const updateProfile = (profile: AppSettings['profile']) => {
    updateSettings({ profile });
    toast('Profile updated successfully', 'success');
  };

  const updateAppearance = (appearance: AppSettings['appearance']) => {
    updateSettings({ appearance });
  };

  const updateDiaryPreferences = (diaryPreferences: AppSettings['diaryPreferences']) => {
    updateSettings({ diaryPreferences });
  };

  const updateNotifications = (notifications: AppSettings['notifications']) => {
    updateSettings({ notifications });
  };

  const resetSettings = async () => {
    // Reset to defaults by sending default values, minus the profile which shouldn't be overridden with defaults
    const defaultsToRestore = {
      appearance: defaultSettings.appearance,
      diaryPreferences: defaultSettings.diaryPreferences,
      notifications: defaultSettings.notifications
    };
    await updateSettings(defaultsToRestore);
    toast('Preferences reset to default', 'info');
  };

  return {
    settings,
    isLoading,
    updateProfile,
    updateAppearance,
    updateDiaryPreferences,
    updateNotifications,
    resetSettings
  };
};

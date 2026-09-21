export type Theme = 'light' | 'dark' | 'system';
export type DefaultEntryView = 'list' | 'grid';

export interface UserProfile {
  displayName: string;
  email: string;
  avatarUrl?: string;
}

export interface AppSettings {
  profile: UserProfile;
  appearance: {
    theme: Theme;
  };
  diaryPreferences: {
    defaultEntryView: DefaultEntryView;
    confirmBeforeDelete: boolean;
    showEntryPreview: boolean;
  };
  notifications: {
    entryReminders: boolean;
    tagNotifications: boolean;
  };
}

export const defaultSettings: AppSettings = {
  profile: {
    displayName: 'Your Name',
    email: 'your@email.com',
  },
  appearance: {
    theme: 'system',
  },
  diaryPreferences: {
    defaultEntryView: 'list',
    confirmBeforeDelete: true,
    showEntryPreview: true,
  },
  notifications: {
    entryReminders: true,
    tagNotifications: false,
  },
};

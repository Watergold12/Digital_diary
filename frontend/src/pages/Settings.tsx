import React, { useState } from 'react';
import { useSettings } from '../hooks/useSettings';
import { useDiary } from '../hooks/useDiary';
import { useTags } from '../hooks/useTags';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Switch } from '../components/ui/Switch';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { UserCircle, Download, Trash2, RefreshCw } from 'lucide-react';
import { Theme, DefaultEntryView } from '../types/settings';

export const Settings: React.FC = () => {
  const { 
    settings, 
    updateProfile, 
    updateAppearance, 
    updateDiaryPreferences, 
    updateNotifications, 
    resetSettings 
  } = useSettings();
  
  const { entries, clearAllEntries } = useDiary();
  const { tags } = useTags();

  // Profile Form State
  const [profileForm, setProfileForm] = useState(settings.profile);

  // Dialog States
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profileForm);
  };

  const handleExport = () => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      entries,
      tags,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diary_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    resetSettings();
    setProfileForm(settings.profile); // Will actually be old settings here, but effect or component re-render handles it
    setIsResetDialogOpen(false);
    // Force form sync after reset
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleDeleteAll = async () => {
    setIsDeleting(true);
    try {
      await clearAllEntries();
      setIsDeleteDialogOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500 pb-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-main">Settings</h1>
        <p className="text-secondary mt-1">Manage your application preferences</p>
      </header>

      <div className="space-y-8">
        {/* Profile Section */}
        <section className="bg-surface rounded-xl border border-border overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-border bg-secondary-bg/50">
            <h2 className="text-sm font-semibold text-secondary uppercase tracking-wider">Profile</h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 rounded-full bg-secondary-bg flex items-center justify-center text-primary">
                  {profileForm.avatarUrl ? (
                    <img src={profileForm.avatarUrl} alt="Avatar" className="h-full w-full rounded-full object-cover" />
                  ) : (
                    <UserCircle size={40} />
                  )}
                </div>
                <Button type="button" variant="outline" size="sm">
                  Change Avatar
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input 
                  label="Display Name" 
                  value={profileForm.displayName} 
                  onChange={(e) => setProfileForm({ ...profileForm, displayName: e.target.value })}
                />
                <Input 
                  label="Email" 
                  type="email"
                  value={profileForm.email} 
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" variant="primary">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </section>

        {/* Appearance Section */}
        <section className="bg-surface rounded-xl border border-border overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-border bg-secondary-bg/50">
            <h2 className="text-sm font-semibold text-secondary uppercase tracking-wider">Appearance</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-main mb-3">Theme</label>
                <div className="flex flex-wrap gap-3">
                  {(['light', 'dark', 'system'] as Theme[]).map((t) => (
                    <label key={t} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="theme" 
                        value={t} 
                        checked={settings.appearance.theme === t}
                        onChange={(e) => updateAppearance({ theme: e.target.value as Theme })}
                        className="text-primary focus:ring-primary h-4 w-4"
                      />
                      <span className="text-sm text-main capitalize">{t}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Diary Preferences Section */}
        <section className="bg-surface rounded-xl border border-border overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-border bg-secondary-bg/50">
            <h2 className="text-sm font-semibold text-secondary uppercase tracking-wider">Diary Preferences</h2>
          </div>
          <div className="p-6 space-y-2">
            <div className="pb-4 mb-4 border-b border-border">
              <label className="block text-sm font-medium text-main mb-3">Default Entry View</label>
              <select 
                value={settings.diaryPreferences.defaultEntryView}
                onChange={(e) => updateDiaryPreferences({ ...settings.diaryPreferences, defaultEntryView: e.target.value as DefaultEntryView })}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-border bg-surface text-main focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md border shadow-sm"
              >
                <option value="list">List</option>
                <option value="grid">Grid</option>
              </select>
            </div>
            
            <Switch 
              label="Confirm before deleting diary entries" 
              checked={settings.diaryPreferences.confirmBeforeDelete}
              onChange={(checked) => updateDiaryPreferences({ ...settings.diaryPreferences, confirmBeforeDelete: checked })}
            />
            
            <Switch 
              label="Show diary entry previews" 
              checked={settings.diaryPreferences.showEntryPreview}
              onChange={(checked) => updateDiaryPreferences({ ...settings.diaryPreferences, showEntryPreview: checked })}
            />
          </div>
        </section>

        {/* Notifications Section */}
        <section className="bg-surface rounded-xl border border-border overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-border bg-secondary-bg/50">
            <h2 className="text-sm font-semibold text-secondary uppercase tracking-wider">Notifications</h2>
          </div>
          <div className="p-6 space-y-2">
            <Switch 
              label="Entry reminders" 
              checked={settings.notifications.entryReminders}
              onChange={(checked) => updateNotifications({ ...settings.notifications, entryReminders: checked })}
            />
            <Switch 
              label="Tag-related notifications" 
              checked={settings.notifications.tagNotifications}
              onChange={(checked) => updateNotifications({ ...settings.notifications, tagNotifications: checked })}
            />
          </div>
        </section>

        {/* Data Section */}
        <section className="bg-surface rounded-xl border border-border overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-border bg-secondary-bg/50">
            <h2 className="text-sm font-semibold text-secondary uppercase tracking-wider">Data</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-main">Export Diary</p>
                <p className="text-xs text-secondary mt-1">Download all your entries and tags as a JSON file.</p>
              </div>
              <Button variant="outline" onClick={handleExport} className="whitespace-nowrap flex items-center gap-2">
                <Download size={16} /> Export Diary
              </Button>
            </div>
            
            <div className="pt-6 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-main">Clear Local Preferences</p>
                <p className="text-xs text-secondary mt-1">Reset all settings to default. Does not delete diary entries.</p>
              </div>
              <Button variant="outline" onClick={() => setIsResetDialogOpen(true)} className="whitespace-nowrap flex items-center gap-2">
                <RefreshCw size={16} /> Reset Preferences
              </Button>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="bg-red-50/50 rounded-xl border border-red-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-red-200 bg-red-50">
            <h2 className="text-sm font-semibold text-red-800 uppercase tracking-wider">Danger Zone</h2>
          </div>
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-red-900">Delete All Diary Entries</p>
                <p className="text-xs text-red-700 mt-1">Permanently remove all diary entries from the application. This cannot be undone.</p>
              </div>
              <Button variant="danger" onClick={() => setIsDeleteDialogOpen(true)} className="whitespace-nowrap flex items-center gap-2">
                <Trash2 size={16} /> Delete All Entries
              </Button>
            </div>
          </div>
        </section>

      </div>

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={isResetDialogOpen}
        onClose={() => setIsResetDialogOpen(false)}
        onConfirm={handleReset}
        title="Reset Preferences"
        message="Are you sure you want to reset all settings to their defaults? Your diary entries and tags will not be affected."
        confirmText="Reset"
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteAll}
        title="Delete All Entries"
        message="Are you absolutely sure you want to delete all your diary entries? This action is permanent and cannot be undone."
        confirmText="Delete All Entries"
        isDestructive
        isLoading={isDeleting}
      />
    </div>
  );
};

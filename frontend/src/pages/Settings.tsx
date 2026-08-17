import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

export const Settings: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-main">Settings</h1>
        <p className="text-secondary mt-1">Manage your application preferences</p>
      </header>

      <div className="bg-surface rounded-xl border border-border p-8 flex flex-col items-center justify-center text-center min-h-[400px]">
        <div className="bg-secondary-bg p-4 rounded-full mb-6">
          <SettingsIcon size={32} className="text-secondary" />
        </div>
        <h3 className="text-xl font-semibold text-main mb-2">Settings are coming soon</h3>
        <p className="text-secondary max-w-md">
          We're working on bringing you theme customization, export options, and sync settings in a future update.
        </p>
      </div>
    </div>
  );
};

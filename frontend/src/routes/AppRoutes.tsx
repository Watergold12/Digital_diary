import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { Dashboard } from '../pages/Dashboard';
import { DiaryEntry } from '../pages/DiaryEntry';
import { NewEntry } from '../pages/NewEntry';
import { EditEntry } from '../pages/EditEntry';
import { Diary } from '../pages/Diary';
import { Tags } from '../pages/Tags';
import { TagFilteredEntries } from '../pages/TagFilteredEntries';
import { Search } from '../pages/Search';
import { Settings } from '../pages/Settings';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="diary" element={<Diary />} />
        <Route path="diary/new" element={<NewEntry />} />
        <Route path="diary/:id" element={<DiaryEntry />} />
        <Route path="diary/:id/edit" element={<EditEntry />} />
        <Route path="tags" element={<Tags />} />
        <Route path="tags/:tagId" element={<TagFilteredEntries />} />
        <Route path="search" element={<Search />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

import { Tag } from './tag';

export type Mood = 'happy' | 'neutral' | 'sad' | 'excited' | 'anxious' | 'calm';

export interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  date: string; // ISO format
  tags: Tag[];
  mood?: Mood;
  createdAt: string;
  updatedAt: string;
}

import { DiaryEntry } from '../types/diary';
import { Tag } from '../types/tag';
import { generateId } from '../utils/formatting';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Initial seed data
const defaultTags: Tag[] = [
  { id: '1', name: 'Personal', color: 'lavender' },
  { id: '2', name: 'Work', color: 'blue' },
  { id: '3', name: 'Travel', color: 'green' },
  { id: '4', name: 'Ideas', color: 'yellow' },
  { id: '5', name: 'Health', color: 'pink' },
];

const defaultEntries: DiaryEntry[] = [
  {
    id: '101',
    title: 'Sunday at the Beach',
    content: 'Today was surprisingly peaceful. I spent most of the afternoon near the water. The weather was perfect, not too hot, and there was a gentle breeze. I finally started reading that book I bought last month. It feels good to disconnect for a while.',
    date: new Date().toISOString(),
    tags: [defaultTags[0], defaultTags[2]],
    mood: 'calm',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '102',
    title: 'Project Kickoff',
    content: 'We finally had the kickoff meeting for the new project. Im excited but also a bit anxious about the deadlines. The team seems capable, though. We spent most of the time discussing the architecture and the initial milestones. Need to start drafting the technical specs tomorrow.',
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    tags: [defaultTags[1]],
    mood: 'excited',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  }
];

// Initialize localStorage
if (!localStorage.getItem('diary_tags')) {
  localStorage.setItem('diary_tags', JSON.stringify(defaultTags));
}
if (!localStorage.getItem('diary_entries')) {
  localStorage.setItem('diary_entries', JSON.stringify(defaultEntries));
}

// API Service
export const api = {
  // Tags
  async getTags(): Promise<Tag[]> {
    await delay(300);
    return JSON.parse(localStorage.getItem('diary_tags') || '[]');
  },

  async createTag(tagData: Omit<Tag, 'id'>): Promise<Tag> {
    await delay(300);
    const tags = await this.getTags();
    const newTag: Tag = { ...tagData, id: generateId() };
    localStorage.setItem('diary_tags', JSON.stringify([...tags, newTag]));
    return newTag;
  },

  async deleteTag(id: string): Promise<void> {
    await delay(300);
    const tags = await this.getTags();
    localStorage.setItem('diary_tags', JSON.stringify(tags.filter((t) => t.id !== id)));
    // Also remove tag from entries
    const entries = await this.getEntries();
    const updatedEntries = entries.map(entry => ({
      ...entry,
      tags: entry.tags.filter(t => t.id !== id)
    }));
    localStorage.setItem('diary_entries', JSON.stringify(updatedEntries));
  },

  // Entries
  async getEntries(): Promise<DiaryEntry[]> {
    await delay(400);
    const entries = JSON.parse(localStorage.getItem('diary_entries') || '[]');
    // Sort by date descending
    return entries.sort((a: DiaryEntry, b: DiaryEntry) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async getEntryById(id: string): Promise<DiaryEntry | null> {
    await delay(200);
    const entries = await this.getEntries();
    return entries.find((e) => e.id === id) || null;
  },

  async createEntry(entryData: Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<DiaryEntry> {
    await delay(400);
    const entries = await this.getEntries();
    const newEntry: DiaryEntry = {
      ...entryData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem('diary_entries', JSON.stringify([newEntry, ...entries]));
    return newEntry;
  },

  async updateEntry(id: string, entryData: Partial<Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt'>>): Promise<DiaryEntry> {
    await delay(400);
    const entries = await this.getEntries();
    const index = entries.findIndex((e) => e.id === id);
    if (index === -1) throw new Error('Entry not found');
    
    const updatedEntry: DiaryEntry = {
      ...entries[index],
      ...entryData,
      updatedAt: new Date().toISOString(),
    };
    entries[index] = updatedEntry;
    localStorage.setItem('diary_entries', JSON.stringify(entries));
    return updatedEntry;
  },

  async deleteEntry(id: string): Promise<void> {
    await delay(300);
    const entries = await this.getEntries();
    localStorage.setItem('diary_entries', JSON.stringify(entries.filter((e) => e.id !== id)));
  }
};

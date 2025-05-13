
/**
 * Local storage utilities for persisting app data
 */

// Types for our app data
export type Mood = 'joyful' | 'peaceful' | 'hopeful' | 'content' | 'neutral' | 'anxious' | 'sad' | 'stressed' | 'angry' | 'overwhelmed';

export type MoodEmoji = {
  [key in Mood]: string;
};

export const moodEmojis: MoodEmoji = {
  joyful: '😊',
  peaceful: '😌',
  hopeful: '🙏',
  content: '🥰',
  neutral: '😐',
  anxious: '😟',
  sad: '😢',
  stressed: '😫',
  angry: '😠',
  overwhelmed: '😩'
};

export type PrayerStatus = 'praying' | 'answered' | 'waiting';

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  mood: Mood;
  verse?: {
    text: string;
    reference: string;
  };
  createdAt: number;
}

export interface Prayer {
  id: string;
  content: string;
  status: PrayerStatus;
  createdAt: number;
  updatedAt: number;
}

// Save a journal entry to local storage
export function saveJournalEntry(entry: JournalEntry): void {
  const entries = getJournalEntries();
  
  // Check if entry already exists
  const existingIndex = entries.findIndex(e => e.id === entry.id);
  
  if (existingIndex >= 0) {
    // Update existing entry
    entries[existingIndex] = entry;
  } else {
    // Add new entry
    entries.push(entry);
  }
  
  localStorage.setItem('journal_entries', JSON.stringify(entries));
}

// Get all journal entries from local storage
export function getJournalEntries(): JournalEntry[] {
  const entriesJson = localStorage.getItem('journal_entries');
  
  if (!entriesJson) {
    return [];
  }
  
  try {
    return JSON.parse(entriesJson);
  } catch (error) {
    console.error('Failed to parse journal entries:', error);
    return [];
  }
}

// Get a specific journal entry by ID
export function getJournalEntryById(id: string): JournalEntry | undefined {
  const entries = getJournalEntries();
  return entries.find(entry => entry.id === id);
}

// Delete a journal entry by ID
export function deleteJournalEntry(id: string): void {
  const entries = getJournalEntries();
  const updatedEntries = entries.filter(entry => entry.id !== id);
  localStorage.setItem('journal_entries', JSON.stringify(updatedEntries));
}

// Save a prayer to local storage
export function savePrayer(prayer: Prayer): void {
  const prayers = getPrayers();
  
  // Check if prayer already exists
  const existingIndex = prayers.findIndex(p => p.id === prayer.id);
  
  if (existingIndex >= 0) {
    // Update existing prayer
    prayers[existingIndex] = {
      ...prayer,
      updatedAt: Date.now()
    };
  } else {
    // Add new prayer
    prayers.push(prayer);
  }
  
  localStorage.setItem('prayers', JSON.stringify(prayers));
}

// Get all prayers from local storage
export function getPrayers(): Prayer[] {
  const prayersJson = localStorage.getItem('prayers');
  
  if (!prayersJson) {
    return [];
  }
  
  try {
    return JSON.parse(prayersJson);
  } catch (error) {
    console.error('Failed to parse prayers:', error);
    return [];
  }
}

// Update prayer status
export function updatePrayerStatus(id: string, status: PrayerStatus): void {
  const prayers = getPrayers();
  const prayerIndex = prayers.findIndex(p => p.id === id);
  
  if (prayerIndex >= 0) {
    prayers[prayerIndex].status = status;
    prayers[prayerIndex].updatedAt = Date.now();
    localStorage.setItem('prayers', JSON.stringify(prayers));
  }
}

// Delete a prayer by ID
export function deletePrayer(id: string): void {
  const prayers = getPrayers();
  const updatedPrayers = prayers.filter(prayer => prayer.id !== id);
  localStorage.setItem('prayers', JSON.stringify(updatedPrayers));
}

// Generate a unique ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

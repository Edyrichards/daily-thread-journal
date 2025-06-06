
import { JournalEntry, Prayer, generateId } from './storage';

// Enhanced types for better organization
export interface EnhancedJournalEntry extends JournalEntry {
  tags: string[];
  category: 'devotion' | 'prayer' | 'gratitude' | 'study' | 'general';
  wordCount: number;
  readingTime: number; // in minutes
  lastModified: number;
  template?: string;
}

export interface PrayerAnswer {
  id: string;
  prayerId: string;
  answer: string;
  dateAnswered: number;
  howAnswered: 'yes' | 'no' | 'wait' | 'different';
}

export interface SpiritualMilestone {
  id: string;
  title: string;
  description: string;
  date: number;
  type: 'baptism' | 'salvation' | 'calling' | 'growth' | 'ministry' | 'other';
  isPrivate: boolean;
}

// Enhanced journal entry functions
export function saveEnhancedJournalEntry(entry: EnhancedJournalEntry): void {
  const entries = getEnhancedJournalEntries();
  const existingIndex = entries.findIndex(e => e.id === entry.id);
  
  // Calculate reading time (average 200 words per minute)
  entry.wordCount = entry.content.split(/\s+/).length;
  entry.readingTime = Math.max(1, Math.ceil(entry.wordCount / 200));
  entry.lastModified = Date.now();
  
  if (existingIndex >= 0) {
    entries[existingIndex] = entry;
  } else {
    entries.push(entry);
  }
  
  localStorage.setItem('enhanced_journal_entries', JSON.stringify(entries));
  
  // Clear draft after saving
  localStorage.removeItem('journal_draft');
}

export function getEnhancedJournalEntries(): EnhancedJournalEntry[] {
  const entriesJson = localStorage.getItem('enhanced_journal_entries');
  if (!entriesJson) {
    // Migrate existing entries if available
    const oldEntries = JSON.parse(localStorage.getItem('journal_entries') || '[]');
    return oldEntries.map((entry: JournalEntry) => ({
      ...entry,
      tags: [],
      category: 'general' as const,
      wordCount: entry.content.split(/\s+/).length,
      readingTime: Math.max(1, Math.ceil(entry.content.split(/\s+/).length / 200)),
      lastModified: entry.createdAt || Date.now()
    }));
  }
  
  try {
    return JSON.parse(entriesJson);
  } catch (error) {
    console.error('Failed to parse enhanced journal entries:', error);
    return [];
  }
}

export function getEnhancedJournalEntryById(id: string): EnhancedJournalEntry | undefined {
  const entries = getEnhancedJournalEntries();
  return entries.find(entry => entry.id === id);
}

export function deleteEnhancedJournalEntry(id: string): void {
  const entries = getEnhancedJournalEntries();
  const updatedEntries = entries.filter(entry => entry.id !== id);
  localStorage.setItem('enhanced_journal_entries', JSON.stringify(updatedEntries));
}

// Search and filter functions
export function searchEnhancedEntries(query: string, filters: {
  tags?: string[];
  category?: string;
  mood?: string;
  dateRange?: { start: number; end: number };
}): EnhancedJournalEntry[] {
  const entries = getEnhancedJournalEntries();
  
  return entries.filter(entry => {
    // Text search
    if (query && !entry.content.toLowerCase().includes(query.toLowerCase())) {
      return false;
    }
    
    // Tag filter
    if (filters.tags && filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some(tag => entry.tags.includes(tag));
      if (!hasMatchingTag) return false;
    }
    
    // Category filter
    if (filters.category && entry.category !== filters.category) {
      return false;
    }
    
    // Mood filter
    if (filters.mood && entry.mood !== filters.mood) {
      return false;
    }
    
    // Date range filter
    if (filters.dateRange) {
      const entryDate = entry.createdAt || 0;
      if (entryDate < filters.dateRange.start || entryDate > filters.dateRange.end) {
        return false;
      }
    }
    
    return true;
  }).sort((a, b) => (b.lastModified || b.createdAt || 0) - (a.lastModified || a.createdAt || 0));
}

// Prayer answer tracking
export function savePrayerAnswer(answer: PrayerAnswer): void {
  const answers = getPrayerAnswers();
  const existingIndex = answers.findIndex(a => a.id === answer.id);
  
  if (existingIndex >= 0) {
    answers[existingIndex] = answer;
  } else {
    answers.push(answer);
  }
  
  localStorage.setItem('prayer_answers', JSON.stringify(answers));
}

export function getPrayerAnswers(): PrayerAnswer[] {
  const answersJson = localStorage.getItem('prayer_answers');
  if (!answersJson) return [];
  
  try {
    return JSON.parse(answersJson);
  } catch (error) {
    console.error('Failed to parse prayer answers:', error);
    return [];
  }
}

export function getPrayerAnswersForPrayer(prayerId: string): PrayerAnswer[] {
  return getPrayerAnswers().filter(answer => answer.prayerId === prayerId);
}

// Spiritual milestones
export function saveSpiritualMilestone(milestone: SpiritualMilestone): void {
  const milestones = getSpiritualMilestones();
  const existingIndex = milestones.findIndex(m => m.id === milestone.id);
  
  if (existingIndex >= 0) {
    milestones[existingIndex] = milestone;
  } else {
    milestones.push(milestone);
  }
  
  localStorage.setItem('spiritual_milestones', JSON.stringify(milestones));
}

export function getSpiritualMilestones(): SpiritualMilestone[] {
  const milestonesJson = localStorage.getItem('spiritual_milestones');
  if (!milestonesJson) return [];
  
  try {
    return JSON.parse(milestonesJson).sort((a: SpiritualMilestone, b: SpiritualMilestone) => b.date - a.date);
  } catch (error) {
    console.error('Failed to parse spiritual milestones:', error);
    return [];
  }
}

// Analytics and insights
export function getJournalingInsights() {
  const entries = getEnhancedJournalEntries();
  const now = Date.now();
  const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
  const recentEntries = entries.filter(entry => (entry.createdAt || 0) > thirtyDaysAgo);
  
  // Calculate streaks
  const sortedEntries = entries
    .filter(entry => entry.createdAt)
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  
  let currentStreak = 0;
  let longestStreak = 0;
  let currentDate = new Date();
  
  for (const entry of sortedEntries) {
    const entryDate = new Date(entry.createdAt || 0);
    const daysDiff = Math.floor((currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff <= currentStreak + 1) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
      currentDate = entryDate;
    } else {
      break;
    }
  }
  
  // Tag analysis
  const tagCounts = recentEntries.reduce((acc, entry) => {
    entry.tags.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);
  
  const topTags = Object.entries(tagCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);
  
  // Category distribution
  const categoryCount = recentEntries.reduce((acc, entry) => {
    acc[entry.category] = (acc[entry.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return {
    totalEntries: entries.length,
    recentEntries: recentEntries.length,
    currentStreak,
    longestStreak,
    totalWords: entries.reduce((sum, entry) => sum + (entry.wordCount || 0), 0),
    averageWordsPerEntry: entries.length > 0 ? Math.round(entries.reduce((sum, entry) => sum + (entry.wordCount || 0), 0) / entries.length) : 0,
    topTags,
    categoryDistribution: categoryCount,
    mostProductiveDay: getMostProductiveDay(entries),
    averageEntriesPerWeek: getAverageEntriesPerWeek(entries)
  };
}

function getMostProductiveDay(entries: EnhancedJournalEntry[]): string {
  const dayCount = entries.reduce((acc, entry) => {
    if (!entry.createdAt) return acc;
    const day = new Date(entry.createdAt).toLocaleDateString('en', { weekday: 'long' });
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(dayCount).reduce((a, b) => dayCount[a[0]] > dayCount[b[0]] ? a : b)?.[0] || 'No data';
}

function getAverageEntriesPerWeek(entries: EnhancedJournalEntry[]): number {
  if (entries.length === 0) return 0;
  
  const oldestEntry = Math.min(...entries.map(e => e.createdAt || Date.now()));
  const weeksSinceStart = Math.max(1, Math.ceil((Date.now() - oldestEntry) / (7 * 24 * 60 * 60 * 1000)));
  
  return Math.round((entries.length / weeksSinceStart) * 10) / 10;
}

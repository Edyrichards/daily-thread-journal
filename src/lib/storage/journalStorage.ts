
import { EnhancedJournalEntry } from '../enhancedStorage';
import { indexedDBStorage } from './indexedDB';
import { JournalEntry } from '../storage';

export class JournalStorageService {
  private isIndexedDBAvailable = false;
  private initPromise: Promise<void>;

  constructor() {
    this.initPromise = this.initialize();
  }

  private async initialize(): Promise<void> {
    this.isIndexedDBAvailable = await indexedDBStorage.initialize();
  }

  async waitForInitialization(): Promise<void> {
    await this.initPromise;
  }

  private convertToEnhancedEntry(entry: JournalEntry): EnhancedJournalEntry {
    const wordCount = entry.content.split(/\s+/).length;
    return {
      ...entry,
      tags: [],
      category: 'general' as const,
      wordCount,
      readingTime: Math.max(1, Math.ceil(wordCount / 200)),
      lastModified: entry.createdAt || Date.now()
    };
  }

  async saveEntry(entry: JournalEntry | EnhancedJournalEntry): Promise<boolean> {
    await this.waitForInitialization();
    
    const enhancedEntry = 'tags' in entry ? entry : this.convertToEnhancedEntry(entry);
    
    if (this.isIndexedDBAvailable) {
      const entries = await this.getEntries();
      const existingIndex = entries.findIndex(e => e.id === enhancedEntry.id);
      
      if (existingIndex >= 0) {
        entries[existingIndex] = enhancedEntry;
      } else {
        entries.push(enhancedEntry);
      }
      
      return await indexedDBStorage.setItem('journal_entries', entries);
    } else {
      this.saveToLocalStorage(enhancedEntry);
      return true;
    }
  }

  private saveToLocalStorage(entry: EnhancedJournalEntry): void {
    const entries = this.getFromLocalStorage();
    const existingIndex = entries.findIndex(e => e.id === entry.id);
    
    if (existingIndex >= 0) {
      entries[existingIndex] = entry;
    } else {
      entries.push(entry);
    }
    
    localStorage.setItem('enhanced_journal_entries', JSON.stringify(entries));
  }

  private getFromLocalStorage(): EnhancedJournalEntry[] {
    const entriesJson = localStorage.getItem('enhanced_journal_entries');
    if (!entriesJson) {
      return [];
    }
    
    try {
      return JSON.parse(entriesJson);
    } catch (error) {
      console.error('Failed to parse enhanced journal entries:', error);
      return [];
    }
  }

  async getEntries(): Promise<EnhancedJournalEntry[]> {
    await this.waitForInitialization();
    
    if (this.isIndexedDBAvailable) {
      const entries = await indexedDBStorage.getItem('journal_entries');
      if (entries && Array.isArray(entries)) {
        return entries.map((entry: any) => 
          'tags' in entry ? entry : this.convertToEnhancedEntry(entry)
        ).sort((a, b) => (b.lastModified || b.createdAt || 0) - (a.lastModified || a.createdAt || 0));
      }
      return this.getFromLocalStorage();
    } else {
      return this.getFromLocalStorage().sort((a, b) => 
        (b.lastModified || b.createdAt || 0) - (a.lastModified || a.createdAt || 0)
      );
    }
  }

  async deleteEntry(id: string): Promise<boolean> {
    await this.waitForInitialization();
    
    if (this.isIndexedDBAvailable) {
      const entries = await this.getEntries();
      const updatedEntries = entries.filter(entry => entry.id !== id);
      return await indexedDBStorage.setItem('journal_entries', updatedEntries);
    } else {
      const entries = this.getFromLocalStorage();
      const updatedEntries = entries.filter(entry => entry.id !== id);
      localStorage.setItem('enhanced_journal_entries', JSON.stringify(updatedEntries));
      return true;
    }
  }
}

export const journalStorage = new JournalStorageService();

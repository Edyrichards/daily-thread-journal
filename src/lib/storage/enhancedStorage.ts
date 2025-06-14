import { indexedDBStorage } from './indexedDB';
import { 
  JournalEntry, 
  Prayer, 
  generateId,
  getJournalEntries as getLocalJournalEntries,
  saveJournalEntry as saveLocalJournalEntry
} from '../storage';
import { EnhancedJournalEntry } from '../enhancedStorage';

// Enhanced storage manager that uses IndexedDB with localStorage fallback
class EnhancedStorageManager {
  private isIndexedDBAvailable = false;
  private initPromise: Promise<void>;

  constructor() {
    this.initPromise = this.initialize();
  }

  private async initialize(): Promise<void> {
    this.isIndexedDBAvailable = await indexedDBStorage.initialize();
    
    if (this.isIndexedDBAvailable) {
      console.log('Using IndexedDB for storage');
      // Migrate existing localStorage data to IndexedDB
      await this.migrateFromLocalStorage();
    } else {
      console.log('Using localStorage for storage');
    }
  }

  private async migrateFromLocalStorage(): Promise<void> {
    try {
      // Migrate journal entries
      const journalEntries = getLocalJournalEntries();
      if (journalEntries.length > 0) {
        // Convert to enhanced entries
        const enhancedEntries: EnhancedJournalEntry[] = journalEntries.map(entry => this.convertToEnhancedEntry(entry));
        // FIX: Use correct key as per DBSchema!
        await indexedDBStorage.setItem('journal_entries', enhancedEntries);
      }

      // Migrate other data types
      const dataTypes = ['prayers', 'prayer_requests', 'spiritual_milestones'];
      
      for (const dataType of dataTypes) {
        const data = localStorage.getItem(dataType);
        if (data) {
          try {
            const parsedData = JSON.parse(data);
            if (Array.isArray(parsedData) && parsedData.length > 0) {
              await indexedDBStorage.setItem(dataType as any, parsedData);
            }
          } catch (error) {
            console.error(`Failed to migrate ${dataType}:`, error);
          }
        }
      }
    } catch (error) {
      console.error('Migration failed:', error);
    }
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

  async waitForInitialization(): Promise<void> {
    await this.initPromise;
  }

  async saveJournalEntry(entry: JournalEntry | EnhancedJournalEntry): Promise<boolean> {
    await this.waitForInitialization();
    
    // Convert to enhanced entry if needed
    const enhancedEntry = 'tags' in entry ? entry : this.convertToEnhancedEntry(entry);
    
    if (this.isIndexedDBAvailable) {
      // Get existing entries and update/add the entry
      const entries = await this.getJournalEntries();
      const existingIndex = entries.findIndex(e => e.id === enhancedEntry.id);
      
      if (existingIndex >= 0) {
        entries[existingIndex] = enhancedEntry;
      } else {
        entries.push(enhancedEntry);
      }
      
      // FIX: Use 'journal_entries' as key
      const success = await indexedDBStorage.setItem('journal_entries', entries);
      if (!success) {
        // Fallback to localStorage
        this.saveToLocalStorage(enhancedEntry);
        return true;
      }
      return success;
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
      // Try to get from old journal entries and convert
      const oldEntries = getLocalJournalEntries();
      return oldEntries.map(entry => this.convertToEnhancedEntry(entry));
    }
    
    try {
      return JSON.parse(entriesJson);
    } catch (error) {
      console.error('Failed to parse enhanced journal entries:', error);
      return [];
    }
  }

  async getJournalEntries(): Promise<EnhancedJournalEntry[]> {
    await this.waitForInitialization();
    
    if (this.isIndexedDBAvailable) {
      // FIX: Use 'journal_entries' as key
      const entries = await indexedDBStorage.getItem('journal_entries');
      if (entries && Array.isArray(entries)) {
        // In case the entries read from indexedDB aren't enhanced, convert them
        return entries.map((entry: any) => this.convertToEnhancedEntry(entry)).sort((a, b) => (b.lastModified || b.createdAt || 0) - (a.lastModified || a.createdAt || 0));
      }
      // Fallback to localStorage
      return this.getFromLocalStorage();
    } else {
      return this.getFromLocalStorage().sort((a, b) => (b.lastModified || b.createdAt || 0) - (a.lastModified || a.createdAt || 0));
    }
  }

  async deleteJournalEntry(id: string): Promise<boolean> {
    await this.waitForInitialization();
    
    if (this.isIndexedDBAvailable) {
      const entries = await this.getJournalEntries();
      const updatedEntries = entries.filter(entry => entry.id !== id);
      // FIX: Use correct key
      return await indexedDBStorage.setItem('journal_entries', updatedEntries);
    } else {
      // Handle localStorage deletion
      const entries = this.getFromLocalStorage();
      const updatedEntries = entries.filter(entry => entry.id !== id);
      localStorage.setItem('enhanced_journal_entries', JSON.stringify(updatedEntries));
      return true;
    }
  }

  async backupData(): Promise<string> {
    await this.waitForInitialization();
    
    let backupData: Record<string, any> = {};
    
    if (this.isIndexedDBAvailable) {
      backupData = await indexedDBStorage.exportData();
    } else {
      // Backup from localStorage
      const keys = ['enhanced_journal_entries', 'prayers', 'prayer_requests', 'spiritual_milestones'];
      keys.forEach(key => {
        const data = localStorage.getItem(key);
        if (data) {
          try {
            backupData[key] = JSON.parse(data);
          } catch (error) {
            console.error(`Failed to backup ${key}:`, error);
          }
        }
      });
    }

    const backup = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      data: backupData
    };

    return JSON.stringify(backup, null, 2);
  }

  async restoreData(backupString: string): Promise<boolean> {
    await this.waitForInitialization();
    
    try {
      const backup = JSON.parse(backupString);
      
      if (!backup.data) {
        throw new Error('Invalid backup format');
      }

      if (this.isIndexedDBAvailable) {
        return await indexedDBStorage.importData(backup.data);
      } else {
        // Restore to localStorage
        Object.entries(backup.data).forEach(([key, value]) => {
          if (value) {
            localStorage.setItem(key, JSON.stringify(value));
          }
        });
        return true;
      }
    } catch (error) {
      console.error('Failed to restore data:', error);
      return false;
    }
  }
}

export const enhancedStorage = new EnhancedStorageManager();

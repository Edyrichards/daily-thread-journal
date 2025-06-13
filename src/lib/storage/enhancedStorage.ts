
import { indexedDBStorage } from './indexedDB';
import { 
  JournalEntry, 
  Prayer, 
  generateId,
  getJournalEntries as getLocalJournalEntries,
  saveJournalEntry as saveLocalJournalEntry
} from '../storage';

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
        await indexedDBStorage.setItem('journal_entries', journalEntries);
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

  async waitForInitialization(): Promise<void> {
    await this.initPromise;
  }

  async saveJournalEntry(entry: JournalEntry): Promise<boolean> {
    await this.waitForInitialization();
    
    if (this.isIndexedDBAvailable) {
      const success = await indexedDBStorage.setItem('journal_entries', entry);
      if (!success) {
        // Fallback to localStorage
        saveLocalJournalEntry(entry);
        return true;
      }
      return success;
    } else {
      saveLocalJournalEntry(entry);
      return true;
    }
  }

  async getJournalEntries(): Promise<JournalEntry[]> {
    await this.waitForInitialization();
    
    if (this.isIndexedDBAvailable) {
      const entries = await indexedDBStorage.getItem('journal_entries');
      if (entries && Array.isArray(entries)) {
        return entries.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      }
      // Fallback to localStorage
      return getLocalJournalEntries();
    } else {
      return getLocalJournalEntries();
    }
  }

  async deleteJournalEntry(id: string): Promise<boolean> {
    await this.waitForInitialization();
    
    if (this.isIndexedDBAvailable) {
      return await indexedDBStorage.removeItem('journal_entries', id);
    } else {
      // Handle localStorage deletion
      const entries = getLocalJournalEntries();
      const updatedEntries = entries.filter(entry => entry.id !== id);
      localStorage.setItem('journal_entries', JSON.stringify(updatedEntries));
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
      const keys = ['journal_entries', 'prayers', 'prayer_requests', 'spiritual_milestones'];
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

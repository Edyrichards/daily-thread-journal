
// Enhanced storage with IndexedDB as primary and localStorage as fallback
interface DBSchema {
  journal_entries: any;
  prayers: any;
  prayer_requests: any;
  spiritual_milestones: any;
  enhanced_journal_entries: any;
  enhanced_prayers: any;
  user_preferences: any;
  offline_data: any;
}

class IndexedDBStorage {
  private dbName = 'ThreadsOfGraceDB';
  private version = 2;
  private db: IDBDatabase | null = null;

  async initialize(): Promise<boolean> {
    if (!('indexedDB' in window)) {
      console.warn('IndexedDB not supported, falling back to localStorage');
      return false;
    }

    try {
      this.db = await this.openDatabase();
      return true;
    } catch (error) {
      console.error('Failed to initialize IndexedDB:', error);
      return false;
    }
  }

  private openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores for each data type
        const stores = [
          'journal_entries',
          'prayers', 
          'prayer_requests',
          'spiritual_milestones',
          'enhanced_journal_entries',
          'enhanced_prayers',
          'user_preferences',
          'offline_data'
        ];

        stores.forEach(storeName => {
          if (!db.objectStoreNames.contains(storeName)) {
            const store = db.createObjectStore(storeName, { keyPath: 'id' });
            store.createIndex('timestamp', 'createdAt', { unique: false });
          }
        });
      };
    });
  }

  async setItem<K extends keyof DBSchema>(storeName: K, data: DBSchema[K]): Promise<boolean> {
    if (!this.db) return false;

    try {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      
      if (Array.isArray(data)) {
        // Store array as individual items
        for (const item of data) {
          await new Promise((resolve, reject) => {
            const request = store.put(item);
            request.onsuccess = () => resolve(undefined);
            request.onerror = () => reject(request.error);
          });
        }
      } else {
        await new Promise((resolve, reject) => {
          const request = store.put(data);
          request.onsuccess = () => resolve(undefined);
          request.onerror = () => reject(request.error);
        });
      }

      return true;
    } catch (error) {
      console.error('IndexedDB setItem error:', error);
      return false;
    }
  }

  async getItem<K extends keyof DBSchema>(storeName: K, id?: string): Promise<DBSchema[K] | null> {
    if (!this.db) return null;

    try {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);

      if (id) {
        // Get specific item
        return new Promise((resolve, reject) => {
          const request = store.get(id);
          request.onsuccess = () => resolve(request.result || null);
          request.onerror = () => reject(request.error);
        });
      } else {
        // Get all items
        return new Promise((resolve, reject) => {
          const request = store.getAll();
          request.onsuccess = () => resolve(request.result || []);
          request.onerror = () => reject(request.error);
        });
      }
    } catch (error) {
      console.error('IndexedDB getItem error:', error);
      return null;
    }
  }

  async removeItem<K extends keyof DBSchema>(storeName: K, id: string): Promise<boolean> {
    if (!this.db) return false;

    try {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      
      await new Promise((resolve, reject) => {
        const request = store.delete(id);
        request.onsuccess = () => resolve(undefined);
        request.onerror = () => reject(request.error);
      });

      return true;
    } catch (error) {
      console.error('IndexedDB removeItem error:', error);
      return false;
    }
  }

  async clear<K extends keyof DBSchema>(storeName: K): Promise<boolean> {
    if (!this.db) return false;

    try {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      
      await new Promise((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => resolve(undefined);
        request.onerror = () => reject(request.error);
      });

      return true;
    } catch (error) {
      console.error('IndexedDB clear error:', error);
      return false;
    }
  }

  async exportData(): Promise<Record<string, any>> {
    if (!this.db) return {};

    const exportData: Record<string, any> = {};
    const storeNames = Array.from(this.db.objectStoreNames);

    for (const storeName of storeNames) {
      try {
        const data = await this.getItem(storeName as keyof DBSchema);
        exportData[storeName] = data;
      } catch (error) {
        console.error(`Failed to export ${storeName}:`, error);
      }
    }

    return exportData;
  }

  async importData(data: Record<string, any>): Promise<boolean> {
    if (!this.db) return false;

    try {
      for (const [storeName, storeData] of Object.entries(data)) {
        if (this.db.objectStoreNames.contains(storeName)) {
          await this.setItem(storeName as keyof DBSchema, storeData);
        }
      }
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }
}

export const indexedDBStorage = new IndexedDBStorage();

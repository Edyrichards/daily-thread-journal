
// IndexedDB wrapper with enhanced error handling and performance
interface DBSchema {
  journal_entries: any[];
  prayers: any[];
  prayer_requests: any[];
  spiritual_milestones: any[];
}

type StorageKey = keyof DBSchema;

class IndexedDBStorage {
  private dbName = 'spiritual_journal_db';
  private version = 1;
  private db: IDBDatabase | null = null;

  async initialize(): Promise<boolean> {
    if (!('indexedDB' in window)) {
      console.warn('IndexedDB not supported');
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
        
        // Create object stores for different data types
        const storeNames: StorageKey[] = ['journal_entries', 'prayers', 'prayer_requests', 'spiritual_milestones'];
        
        storeNames.forEach(storeName => {
          if (!db.objectStoreNames.contains(storeName)) {
            const store = db.createObjectStore(storeName, { keyPath: 'id' });
            store.createIndex('timestamp', 'createdAt', { unique: false });
          }
        });
      };
    });
  }

  async setItem<K extends StorageKey>(key: K, value: any): Promise<boolean> {
    if (!this.db) return false;

    try {
      const transaction = this.db.transaction([key], 'readwrite');
      const store = transaction.objectStore(key);
      
      if (Array.isArray(value)) {
        // Handle array data - store each item individually
        await Promise.all(value.map(item => {
          return new Promise<void>((resolve, reject) => {
            const request = store.put(item);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
          });
        }));
      } else {
        // Handle single item
        await new Promise<void>((resolve, reject) => {
          const request = store.put(value);
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      }

      return true;
    } catch (error) {
      console.error(`Failed to set ${key}:`, error);
      return false;
    }
  }

  async getItem<K extends StorageKey>(key: K): Promise<any[] | null> {
    if (!this.db) return null;

    try {
      const transaction = this.db.transaction([key], 'readonly');
      const store = transaction.objectStore(key);
      
      return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error(`Failed to get ${key}:`, error);
      return null;
    }
  }

  async removeItem<K extends StorageKey>(key: K, id: string): Promise<boolean> {
    if (!this.db) return false;

    try {
      const transaction = this.db.transaction([key], 'readwrite');
      const store = transaction.objectStore(key);
      
      return new Promise((resolve, reject) => {
        const request = store.delete(id);
        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error(`Failed to remove ${key}:`, error);
      return false;
    }
  }

  async exportData(): Promise<Record<string, any>> {
    const data: Record<string, any> = {};
    const keys: StorageKey[] = ['journal_entries', 'prayers', 'prayer_requests', 'spiritual_milestones'];
    
    for (const key of keys) {
      data[key] = await this.getItem(key);
    }
    
    return data;
  }

  async importData(data: Record<string, any>): Promise<boolean> {
    try {
      for (const [key, value] of Object.entries(data)) {
        if (Array.isArray(value) && value.length > 0) {
          await this.setItem(key as StorageKey, value);
        }
      }
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }

  async clearAll(): Promise<boolean> {
    if (!this.db) return false;

    try {
      const keys: StorageKey[] = ['journal_entries', 'prayers', 'prayer_requests', 'spiritual_milestones'];
      
      for (const key of keys) {
        const transaction = this.db.transaction([key], 'readwrite');
        const store = transaction.objectStore(key);
        await new Promise<void>((resolve, reject) => {
          const request = store.clear();
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      }
      
      return true;
    } catch (error) {
      console.error('Failed to clear data:', error);
      return false;
    }
  }
}

export const indexedDBStorage = new IndexedDBStorage();

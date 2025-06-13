
import { BibleVerse } from './types';

class BibleApiService {
  private baseUrl = 'https://bible-api.com';
  private cache = new Map<string, BibleVerse>();

  async getVerse(reference: string, translation: string = 'NIV'): Promise<BibleVerse | null> {
    const cacheKey = `${reference}-${translation}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const url = `${this.baseUrl}/${encodeURIComponent(reference)}?translation=${translation}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch verse: ${response.statusText}`);
      }

      const data = await response.json();
      
      const verse: BibleVerse = {
        id: `${reference}-${translation}`,
        book: data.verses[0]?.book_name || '',
        chapter: data.verses[0]?.chapter || 0,
        verse: data.verses[0]?.verse || 0,
        text: data.text.trim(),
        translation,
        reference: data.reference
      };

      this.cache.set(cacheKey, verse);
      return verse;
    } catch (error) {
      console.error('Error fetching verse:', error);
      return null;
    }
  }

  async getChapter(book: string, chapter: number, translation: string = 'NIV'): Promise<BibleVerse[]> {
    try {
      const reference = `${book} ${chapter}`;
      const url = `${this.baseUrl}/${encodeURIComponent(reference)}?translation=${translation}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch chapter: ${response.statusText}`);
      }

      const data = await response.json();
      
      return data.verses.map((v: any) => ({
        id: `${book}-${chapter}-${v.verse}-${translation}`,
        book: v.book_name,
        chapter: v.chapter,
        verse: v.verse,
        text: v.text.trim(),
        translation,
        reference: `${v.book_name} ${v.chapter}:${v.verse}`
      }));
    } catch (error) {
      console.error('Error fetching chapter:', error);
      return [];
    }
  }

  async searchVerses(query: string, translation: string = 'NIV'): Promise<BibleVerse[]> {
    const commonSearches: Record<string, string[]> = {
      'love': ['1 Corinthians 13:4-7', 'John 3:16', '1 John 4:8'],
      'peace': ['John 14:27', 'Philippians 4:7', 'Isaiah 26:3'],
      'hope': ['Jeremiah 29:11', 'Romans 15:13', 'Isaiah 40:31'],
      'strength': ['Philippians 4:13', 'Isaiah 40:31', 'Joshua 1:9'],
      'faith': ['Hebrews 11:1', 'Romans 10:17', 'Ephesians 2:8-9']
    };

    const references = commonSearches[query.toLowerCase()] || [];
    const results: BibleVerse[] = [];

    for (const ref of references) {
      const verse = await this.getVerse(ref, translation);
      if (verse) {
        results.push(verse);
      }
    }

    return results;
  }
}

export const bibleApi = new BibleApiService();


import { resilientApi } from '../api/resilientApi';
import { BibleVerse } from './types';

// Enhanced Bible API with resilience and offline support
class EnhancedBibleApi {
  private baseUrl = 'https://bible-api.com';
  private fallbackVerses: Record<string, BibleVerse> = {
    'john-3-16': {
      id: 'john-3-16-niv',
      book: 'John',
      chapter: 3,
      verse: 16,
      text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
      translation: 'NIV',
      reference: 'John 3:16'
    },
    'psalm-23-1': {
      id: 'psalm-23-1-niv',
      book: 'Psalms',
      chapter: 23,
      verse: 1,
      text: 'The Lord is my shepherd, I lack nothing.',
      translation: 'NIV',
      reference: 'Psalm 23:1'
    },
    'philippians-4-13': {
      id: 'philippians-4-13-niv',
      book: 'Philippians',
      chapter: 4,
      verse: 13,
      text: 'I can do all this through him who gives me strength.',
      translation: 'NIV',
      reference: 'Philippians 4:13'
    }
  };

  async getVerse(reference: string, translation: string = 'NIV'): Promise<BibleVerse | null> {
    const url = `${this.baseUrl}/${encodeURIComponent(reference)}?translation=${translation}`;
    
    const response = await resilientApi.fetchWithRetry<any>(url, {}, {
      maxRetries: 2,
      baseDelay: 500
    });

    if (response.data) {
      try {
        const data = response.data;
        return {
          id: `${reference}-${translation}`,
          book: data.verses?.[0]?.book_name || '',
          chapter: data.verses?.[0]?.chapter || 0,
          verse: data.verses?.[0]?.verse || 0,
          text: data.text?.trim() || '',
          translation,
          reference: data.reference || reference
        };
      } catch (error) {
        console.error('Error parsing verse data:', error);
      }
    }

    // Fallback to local verses
    const fallbackKey = this.getFallbackKey(reference);
    if (this.fallbackVerses[fallbackKey]) {
      console.log('Using fallback verse for:', reference);
      return {
        ...this.fallbackVerses[fallbackKey],
        translation
      };
    }

    console.error('No verse found for reference:', reference);
    return null;
  }

  async getChapter(book: string, chapter: number, translation: string = 'NIV'): Promise<BibleVerse[]> {
    const reference = `${book} ${chapter}`;
    const url = `${this.baseUrl}/${encodeURIComponent(reference)}?translation=${translation}`;
    
    const response = await resilientApi.fetchWithRetry<any>(url, {}, {
      maxRetries: 2,
      baseDelay: 1000
    });

    if (response.data?.verses) {
      try {
        return response.data.verses.map((v: any) => ({
          id: `${book}-${chapter}-${v.verse}-${translation}`,
          book: v.book_name,
          chapter: v.chapter,
          verse: v.verse,
          text: v.text?.trim() || '',
          translation,
          reference: `${v.book_name} ${v.chapter}:${v.verse}`
        }));
      } catch (error) {
        console.error('Error parsing chapter data:', error);
      }
    }

    // Return empty array if no data available
    return [];
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

    // Fetch verses with resilience
    for (const ref of references) {
      try {
        const verse = await this.getVerse(ref, translation);
        if (verse) {
          results.push(verse);
        }
      } catch (error) {
        console.error(`Failed to fetch verse ${ref}:`, error);
      }
    }

    // If no results and we have fallback verses, return some
    if (results.length === 0) {
      const fallbackKeys = Object.keys(this.fallbackVerses);
      for (let i = 0; i < Math.min(3, fallbackKeys.length); i++) {
        const verse = this.fallbackVerses[fallbackKeys[i]];
        results.push({ ...verse, translation });
      }
    }

    return results;
  }

  private getFallbackKey(reference: string): string {
    return reference.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
  }

  getCacheStats() {
    return resilientApi.getCacheStats();
  }

  clearCache() {
    resilientApi.clearCache();
  }
}

export const enhancedBibleApi = new EnhancedBibleApi();

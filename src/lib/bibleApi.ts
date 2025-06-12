
/**
 * Enhanced Bible API integration with multiple translation support
 */

export interface BibleVerse {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  translation: string;
  reference: string;
}

export interface BibleBook {
  id: string;
  name: string;
  testament: 'old' | 'new';
  chapters: number;
  author?: string;
  theme?: string;
  writtenDate?: string;
}

export interface VerseExplanation {
  verseId: string;
  commentary: string;
  historicalContext: string;
  application: string;
  crossReferences: string[];
  keywords: string[];
  difficulty: 'basic' | 'intermediate' | 'advanced';
}

export interface BibleTranslation {
  id: string;
  name: string;
  abbreviation: string;
  language: string;
  description: string;
}

export const BIBLE_TRANSLATIONS: BibleTranslation[] = [
  { id: 'NIV', name: 'New International Version', abbreviation: 'NIV', language: 'English', description: 'Modern, clear translation' },
  { id: 'ESV', name: 'English Standard Version', abbreviation: 'ESV', language: 'English', description: 'Literal, word-for-word translation' },
  { id: 'NLT', name: 'New Living Translation', abbreviation: 'NLT', language: 'English', description: 'Thought-for-thought translation' },
  { id: 'KJV', name: 'King James Version', abbreviation: 'KJV', language: 'English', description: 'Traditional, poetic language' },
  { id: 'NASB', name: 'New American Standard Bible', abbreviation: 'NASB', language: 'English', description: 'Highly accurate translation' }
];

export const BIBLE_BOOKS: BibleBook[] = [
  // Old Testament
  { id: 'genesis', name: 'Genesis', testament: 'old', chapters: 50, author: 'Moses', theme: 'Beginnings' },
  { id: 'exodus', name: 'Exodus', testament: 'old', chapters: 40, author: 'Moses', theme: 'Deliverance' },
  { id: 'leviticus', name: 'Leviticus', testament: 'old', chapters: 27, author: 'Moses', theme: 'Holiness' },
  { id: 'numbers', name: 'Numbers', testament: 'old', chapters: 36, author: 'Moses', theme: 'Wilderness Journey' },
  { id: 'deuteronomy', name: 'Deuteronomy', testament: 'old', chapters: 34, author: 'Moses', theme: 'Covenant Renewal' },
  { id: 'psalms', name: 'Psalms', testament: 'old', chapters: 150, author: 'David & Others', theme: 'Worship & Prayer' },
  { id: 'proverbs', name: 'Proverbs', testament: 'old', chapters: 31, author: 'Solomon', theme: 'Wisdom' },
  { id: 'ecclesiastes', name: 'Ecclesiastes', testament: 'old', chapters: 12, author: 'Solomon', theme: 'Meaning of Life' },
  { id: 'isaiah', name: 'Isaiah', testament: 'old', chapters: 66, author: 'Isaiah', theme: 'Salvation & Judgment' },
  { id: 'jeremiah', name: 'Jeremiah', testament: 'old', chapters: 52, author: 'Jeremiah', theme: 'Judgment & Hope' },
  
  // New Testament
  { id: 'matthew', name: 'Matthew', testament: 'new', chapters: 28, author: 'Matthew', theme: 'Jesus as King' },
  { id: 'mark', name: 'Mark', testament: 'new', chapters: 16, author: 'Mark', theme: 'Jesus as Servant' },
  { id: 'luke', name: 'Luke', testament: 'new', chapters: 24, author: 'Luke', theme: 'Jesus as Human' },
  { id: 'john', name: 'John', testament: 'new', chapters: 21, author: 'John', theme: 'Jesus as God' },
  { id: 'acts', name: 'Acts', testament: 'new', chapters: 28, author: 'Luke', theme: 'Early Church' },
  { id: 'romans', name: 'Romans', testament: 'new', chapters: 16, author: 'Paul', theme: 'Salvation by Faith' },
  { id: '1-corinthians', name: '1 Corinthians', testament: 'new', chapters: 16, author: 'Paul', theme: 'Church Unity' },
  { id: '2-corinthians', name: '2 Corinthians', testament: 'new', chapters: 13, author: 'Paul', theme: 'Ministry & Suffering' },
  { id: 'galatians', name: 'Galatians', testament: 'new', chapters: 6, author: 'Paul', theme: 'Freedom in Christ' },
  { id: 'ephesians', name: 'Ephesians', testament: 'new', chapters: 6, author: 'Paul', theme: 'Unity in Christ' },
  { id: 'philippians', name: 'Philippians', testament: 'new', chapters: 4, author: 'Paul', theme: 'Joy in Christ' },
  { id: 'colossians', name: 'Colossians', testament: 'new', chapters: 4, author: 'Paul', theme: 'Supremacy of Christ' },
  { id: '1-thessalonians', name: '1 Thessalonians', testament: 'new', chapters: 5, author: 'Paul', theme: 'Second Coming' },
  { id: '2-thessalonians', name: '2 Thessalonians', testament: 'new', chapters: 3, author: 'Paul', theme: 'Perseverance' },
  { id: '1-timothy', name: '1 Timothy', testament: 'new', chapters: 6, author: 'Paul', theme: 'Church Leadership' },
  { id: '2-timothy', name: '2 Timothy', testament: 'new', chapters: 4, author: 'Paul', theme: 'Endurance' },
  { id: 'titus', name: 'Titus', testament: 'new', chapters: 3, author: 'Paul', theme: 'Good Works' },
  { id: 'philemon', name: 'Philemon', testament: 'new', chapters: 1, author: 'Paul', theme: 'Forgiveness' },
  { id: 'hebrews', name: 'Hebrews', testament: 'new', chapters: 13, author: 'Unknown', theme: 'Superiority of Christ' },
  { id: 'james', name: 'James', testament: 'new', chapters: 5, author: 'James', theme: 'Faith in Action' },
  { id: '1-peter', name: '1 Peter', testament: 'new', chapters: 5, author: 'Peter', theme: 'Suffering & Hope' },
  { id: '2-peter', name: '2 Peter', testament: 'new', chapters: 3, author: 'Peter', theme: 'False Teachers' },
  { id: '1-john', name: '1 John', testament: 'new', chapters: 5, author: 'John', theme: 'Love & Fellowship' },
  { id: '2-john', name: '2 John', testament: 'new', chapters: 1, author: 'John', theme: 'Truth & Love' },
  { id: '3-john', name: '3 John', testament: 'new', chapters: 1, author: 'John', theme: 'Hospitality' },
  { id: 'jude', name: 'Jude', testament: 'new', chapters: 1, author: 'Jude', theme: 'Contending for Faith' },
  { id: 'revelation', name: 'Revelation', testament: 'new', chapters: 22, author: 'John', theme: 'End Times' }
];

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
    // This would integrate with a search API in a real implementation
    // For now, return some sample results based on common searches
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

// Sample verse explanations for common verses
export const VERSE_EXPLANATIONS: Record<string, VerseExplanation> = {
  'John 3:16': {
    verseId: 'John 3:16',
    commentary: 'This verse encapsulates the heart of the Gospel message. It speaks of God\'s love (agape), which is unconditional and sacrificial, demonstrated through the giving of His Son.',
    historicalContext: 'Jesus spoke these words to Nicodemus, a Pharisee who came to Him at night seeking understanding about spiritual rebirth.',
    application: 'This verse reminds us that salvation is available to all who believe. It challenges us to share this love with others and to live in gratitude for God\'s incredible gift.',
    crossReferences: ['Romans 5:8', '1 John 4:9-10', 'Romans 6:23'],
    keywords: ['love', 'eternal life', 'believe', 'salvation'],
    difficulty: 'basic'
  },
  'Jeremiah 29:11': {
    verseId: 'Jeremiah 29:11',
    commentary: 'God declares His intentions toward His people - plans for welfare and not for evil, to give them a future and a hope. This speaks to God\'s sovereign purpose and care.',
    historicalContext: 'Written to the Jewish exiles in Babylon, assuring them that their captivity had a purpose and would not last forever.',
    application: 'When facing uncertainty or difficult circumstances, we can trust that God has good plans for our lives and that He works all things for our good.',
    crossReferences: ['Romans 8:28', 'Proverbs 3:5-6', 'Isaiah 55:8-9'],
    keywords: ['plans', 'hope', 'future', 'trust'],
    difficulty: 'basic'
  },
  'Philippians 4:13': {
    verseId: 'Philippians 4:13',
    commentary: 'Paul declares that through Christ\'s strength, he can endure any circumstance. This isn\'t about personal achievement but about spiritual endurance through Christ.',
    historicalContext: 'Written while Paul was imprisoned, expressing contentment in all circumstances through Christ\'s enabling power.',
    application: 'This verse encourages us that we can face any challenge or difficulty when we rely on Christ\'s strength rather than our own abilities.',
    crossReferences: ['2 Corinthians 12:9', 'Ephesians 3:16', 'Isaiah 40:31'],
    keywords: ['strength', 'Christ', 'endurance', 'contentment'],
    difficulty: 'intermediate'
  }
};

export const getVerseExplanation = (reference: string): VerseExplanation | null => {
  return VERSE_EXPLANATIONS[reference] || null;
};

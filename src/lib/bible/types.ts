
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

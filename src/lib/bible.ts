/** Bible data: canonical books, passage fetching, bookmarks, and reading plans. */

export type BookCat = 'Law' | 'History' | 'Poetry' | 'Prophets' | 'Gospels' | 'Epistles';
export interface BibleBook { name: string; chapters: number; cat: BookCat; testament: 'OT' | 'NT'; }

export const BOOKS: BibleBook[] = [
  { name: 'Genesis', chapters: 50, cat: 'Law', testament: 'OT' },
  { name: 'Exodus', chapters: 40, cat: 'Law', testament: 'OT' },
  { name: 'Leviticus', chapters: 27, cat: 'Law', testament: 'OT' },
  { name: 'Numbers', chapters: 36, cat: 'Law', testament: 'OT' },
  { name: 'Deuteronomy', chapters: 34, cat: 'Law', testament: 'OT' },
  { name: 'Joshua', chapters: 24, cat: 'History', testament: 'OT' },
  { name: 'Judges', chapters: 21, cat: 'History', testament: 'OT' },
  { name: 'Ruth', chapters: 4, cat: 'History', testament: 'OT' },
  { name: '1 Samuel', chapters: 31, cat: 'History', testament: 'OT' },
  { name: '2 Samuel', chapters: 24, cat: 'History', testament: 'OT' },
  { name: '1 Kings', chapters: 22, cat: 'History', testament: 'OT' },
  { name: '2 Kings', chapters: 25, cat: 'History', testament: 'OT' },
  { name: '1 Chronicles', chapters: 29, cat: 'History', testament: 'OT' },
  { name: '2 Chronicles', chapters: 36, cat: 'History', testament: 'OT' },
  { name: 'Ezra', chapters: 10, cat: 'History', testament: 'OT' },
  { name: 'Nehemiah', chapters: 13, cat: 'History', testament: 'OT' },
  { name: 'Esther', chapters: 10, cat: 'History', testament: 'OT' },
  { name: 'Job', chapters: 42, cat: 'Poetry', testament: 'OT' },
  { name: 'Psalms', chapters: 150, cat: 'Poetry', testament: 'OT' },
  { name: 'Proverbs', chapters: 31, cat: 'Poetry', testament: 'OT' },
  { name: 'Ecclesiastes', chapters: 12, cat: 'Poetry', testament: 'OT' },
  { name: 'Song of Solomon', chapters: 8, cat: 'Poetry', testament: 'OT' },
  { name: 'Isaiah', chapters: 66, cat: 'Prophets', testament: 'OT' },
  { name: 'Jeremiah', chapters: 52, cat: 'Prophets', testament: 'OT' },
  { name: 'Lamentations', chapters: 5, cat: 'Prophets', testament: 'OT' },
  { name: 'Ezekiel', chapters: 48, cat: 'Prophets', testament: 'OT' },
  { name: 'Daniel', chapters: 12, cat: 'Prophets', testament: 'OT' },
  { name: 'Hosea', chapters: 14, cat: 'Prophets', testament: 'OT' },
  { name: 'Joel', chapters: 3, cat: 'Prophets', testament: 'OT' },
  { name: 'Amos', chapters: 9, cat: 'Prophets', testament: 'OT' },
  { name: 'Obadiah', chapters: 1, cat: 'Prophets', testament: 'OT' },
  { name: 'Jonah', chapters: 4, cat: 'Prophets', testament: 'OT' },
  { name: 'Micah', chapters: 7, cat: 'Prophets', testament: 'OT' },
  { name: 'Nahum', chapters: 3, cat: 'Prophets', testament: 'OT' },
  { name: 'Habakkuk', chapters: 3, cat: 'Prophets', testament: 'OT' },
  { name: 'Zephaniah', chapters: 3, cat: 'Prophets', testament: 'OT' },
  { name: 'Haggai', chapters: 2, cat: 'Prophets', testament: 'OT' },
  { name: 'Zechariah', chapters: 14, cat: 'Prophets', testament: 'OT' },
  { name: 'Malachi', chapters: 4, cat: 'Prophets', testament: 'OT' },
  { name: 'Matthew', chapters: 28, cat: 'Gospels', testament: 'NT' },
  { name: 'Mark', chapters: 16, cat: 'Gospels', testament: 'NT' },
  { name: 'Luke', chapters: 24, cat: 'Gospels', testament: 'NT' },
  { name: 'John', chapters: 21, cat: 'Gospels', testament: 'NT' },
  { name: 'Acts', chapters: 28, cat: 'History', testament: 'NT' },
  { name: 'Romans', chapters: 16, cat: 'Epistles', testament: 'NT' },
  { name: '1 Corinthians', chapters: 16, cat: 'Epistles', testament: 'NT' },
  { name: '2 Corinthians', chapters: 13, cat: 'Epistles', testament: 'NT' },
  { name: 'Galatians', chapters: 6, cat: 'Epistles', testament: 'NT' },
  { name: 'Ephesians', chapters: 6, cat: 'Epistles', testament: 'NT' },
  { name: 'Philippians', chapters: 4, cat: 'Epistles', testament: 'NT' },
  { name: 'Colossians', chapters: 4, cat: 'Epistles', testament: 'NT' },
  { name: '1 Thessalonians', chapters: 5, cat: 'Epistles', testament: 'NT' },
  { name: '2 Thessalonians', chapters: 3, cat: 'Epistles', testament: 'NT' },
  { name: '1 Timothy', chapters: 6, cat: 'Epistles', testament: 'NT' },
  { name: '2 Timothy', chapters: 4, cat: 'Epistles', testament: 'NT' },
  { name: 'Titus', chapters: 3, cat: 'Epistles', testament: 'NT' },
  { name: 'Philemon', chapters: 1, cat: 'Epistles', testament: 'NT' },
  { name: 'Hebrews', chapters: 13, cat: 'Epistles', testament: 'NT' },
  { name: 'James', chapters: 5, cat: 'Epistles', testament: 'NT' },
  { name: '1 Peter', chapters: 5, cat: 'Epistles', testament: 'NT' },
  { name: '2 Peter', chapters: 3, cat: 'Epistles', testament: 'NT' },
  { name: '1 John', chapters: 5, cat: 'Epistles', testament: 'NT' },
  { name: '2 John', chapters: 1, cat: 'Epistles', testament: 'NT' },
  { name: '3 John', chapters: 1, cat: 'Epistles', testament: 'NT' },
  { name: 'Jude', chapters: 1, cat: 'Epistles', testament: 'NT' },
  { name: 'Revelation', chapters: 22, cat: 'Prophets', testament: 'NT' },
];

export const CAT_HSL: Record<BookCat, string> = {
  Law: '105 18% 52%', History: '24 24% 50%', Poetry: '154 14% 49%',
  Prophets: '30 33% 58%', Gospels: '155 24% 22%', Epistles: '33 36% 52%',
};
export const CATEGORIES: BookCat[] = ['Law', 'History', 'Poetry', 'Prophets', 'Gospels', 'Epistles'];

export const findBook = (name: string): BibleBook | undefined => {
  const n = name.trim().toLowerCase().replace(/^psalm$/, 'psalms');
  return BOOKS.find((b) => b.name.toLowerCase() === n)
    || BOOKS.find((b) => b.name.toLowerCase().startsWith(n));
};

/** Parse "John 3:16" / "1 John 5" / "Psalm 23" -> { book, chapter }. */
export const parseReference = (ref: string): { book: string; chapter: number } | null => {
  const m = ref.trim().match(/^(.*?)\s+(\d+)(?::\d+)?\s*$/);
  if (!m) return null;
  const book = findBook(m[1]);
  return book ? { book: book.name, chapter: Number(m[2]) } : null;
};

/* ----------------------------- passages ----------------------------- */
export interface Verse { verse: number; text: string; }
export interface Passage { reference: string; translation: string; verses: Verse[]; }

export type Translation = 'web' | 'kjv';
export const TRANSLATIONS: { id: Translation; label: string; short: string }[] = [
  { id: 'web', label: 'World English Bible', short: 'WEB' },
  { id: 'kjv', label: 'King James Version', short: 'KJV' },
];
export const translationPref = (): Translation => {
  const p = (localStorage.getItem('bibleVersionPreference') || '').toLowerCase();
  return p === 'kjv' ? 'kjv' : 'web';
};
export const translationLabel = (t: Translation = translationPref()) =>
  TRANSLATIONS.find((x) => x.id === t)?.label || 'World English Bible';

const slug = (book: string) => book.toLowerCase().replace(/\s+/g, '');
const cache = new Map<string, Record<string, Record<string, string>>>();

async function loadBook(book: string, trans: Translation) {
  const key = `${trans}:${slug(book)}`;
  if (cache.has(key)) return cache.get(key)!;
  const res = await fetch(`/bible/${trans}/${slug(book)}.json`);
  if (!res.ok) throw new Error('Book not found');
  const data = await res.json();
  cache.set(key, data);
  return data;
}

/** Load a chapter from the bundled, offline public-domain translations. */
export async function fetchPassage(book: string, chapter: number): Promise<Passage> {
  const trans = translationPref();
  const data = await loadBook(book, trans);
  const ch = data[String(chapter)];
  if (!ch) throw new Error('Chapter not found');
  const verses = Object.keys(ch).map(Number).sort((a, b) => a - b).map((v) => ({ verse: v, text: ch[String(v)] }));
  return { reference: `${book} ${chapter}`, translation: translationLabel(trans), verses };
}

/* ----------------------------- bookmarks ----------------------------- */
export interface Bookmark { text: string; reference: string; createdAt: number; }
const BK = 'bookmarked_verses';
export const getBookmarks = (): Bookmark[] => {
  try { return JSON.parse(localStorage.getItem(BK) || '[]'); } catch { return []; }
};
export const isBookmarked = (reference: string) => getBookmarks().some((b) => b.reference === reference);
export const toggleBookmark = (b: { text: string; reference: string }): boolean => {
  const all = getBookmarks();
  const i = all.findIndex((x) => x.reference === b.reference);
  if (i >= 0) { all.splice(i, 1); localStorage.setItem(BK, JSON.stringify(all)); return false; }
  all.unshift({ ...b, createdAt: Date.now() });
  localStorage.setItem(BK, JSON.stringify(all));
  return true;
};

/* --------------------------- reading plans --------------------------- */
export interface PlanDay { book: string; chapter: number; }
export interface ReadingPlan { id: string; title: string; blurb: string; days: PlanDay[]; }

const range = (book: string, from: number, to: number): PlanDay[] =>
  Array.from({ length: to - from + 1 }, (_, i) => ({ book, chapter: from + i }));

export const PLANS: ReadingPlan[] = [
  {
    id: 'peace', title: 'Psalms of Peace', blurb: 'Seven psalms to quiet an anxious heart.',
    days: [23, 27, 46, 62, 91, 121, 131].map((c) => ({ book: 'Psalms', chapter: c })),
  },
  {
    id: 'john', title: 'The Gospel of John', blurb: 'Walk through the life of Jesus in 21 days.',
    days: range('John', 1, 21),
  },
  {
    id: 'gratitude', title: 'A Heart of Gratitude', blurb: 'A week of thanksgiving and praise.',
    days: [
      { book: 'Psalms', chapter: 100 }, { book: 'Philippians', chapter: 4 }, { book: 'Colossians', chapter: 3 },
      { book: 'Psalms', chapter: 103 }, { book: '1 Thessalonians', chapter: 5 }, { book: 'Psalms', chapter: 136 },
      { book: 'Lamentations', chapter: 3 },
    ],
  },
  {
    id: 'proverbs', title: 'Wisdom in 31 Days', blurb: 'A chapter of Proverbs for every day.',
    days: range('Proverbs', 1, 31),
  },
];
export const getPlan = (id: string) => PLANS.find((p) => p.id === id);

const PP = 'plan_progress';
type Progress = Record<string, number[]>;
const readProgress = (): Progress => { try { return JSON.parse(localStorage.getItem(PP) || '{}'); } catch { return {}; } };
export const getPlanProgress = (id: string): number[] => readProgress()[id] || [];
export const planPct = (id: string): number => {
  const plan = getPlan(id); if (!plan) return 0;
  return Math.round((getPlanProgress(id).length / plan.days.length) * 100);
};
export const togglePlanDay = (id: string, dayIdx: number): void => {
  const all = readProgress();
  const done = new Set(all[id] || []);
  done.has(dayIdx) ? done.delete(dayIdx) : done.add(dayIdx);
  all[id] = [...done];
  localStorage.setItem(PP, JSON.stringify(all));
};
export const markPlanDayDone = (id: string, dayIdx: number): void => {
  const all = readProgress();
  const done = new Set(all[id] || []);
  done.add(dayIdx);
  all[id] = [...done];
  localStorage.setItem(PP, JSON.stringify(all));
};

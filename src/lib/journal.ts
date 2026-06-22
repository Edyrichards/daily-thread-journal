import { JournalEntry } from './storage';

export const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const dayKey = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
const entryDate = (e: JournalEntry) => new Date(e.createdAt || e.date);

/** Consecutive days (ending today or yesterday) with at least one entry. */
export const computeStreak = (entries: JournalEntry[]): number => {
  if (!entries.length) return 0;
  const days = new Set(entries.map((e) => dayKey(entryDate(e))));
  let streak = 0;
  const cursor = new Date();
  if (!days.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  while (days.has(dayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
};

export const journaledToday = (entries: JournalEntry[]) =>
  entries.some((e) => isSameDay(entryDate(e), new Date()));

export const entriesThisWeek = (entries: JournalEntry[]) => {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return entries.filter((e) => entryDate(e).getTime() >= weekAgo).length;
};

/** A short, human title derived from an entry's content. */
export const entryTitle = (e: JournalEntry): string => {
  const text = (e.content || e.reflection || '').trim();
  if (!text) return 'A quiet moment';
  const firstLine = text.split('\n')[0];
  const words = firstLine.split(/\s+/);
  const title = words.slice(0, 7).join(' ');
  return words.length > 7 ? `${title}…` : title;
};

/** "Today" / "Yesterday" / "Jun 14" */
export const relativeDay = (e: JournalEntry): string => {
  const d = entryDate(e);
  const now = new Date();
  if (isSameDay(d, now)) return 'Today';
  const y = new Date(now);
  y.setDate(now.getDate() - 1);
  if (isSameDay(d, y)) return 'Yesterday';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

import { JournalEntry, Mood, getJournalEntries, moodEmojis } from '@/lib/storage';
import { isSameMonth, parseISO } from 'date-fns'; // Added

/**
 * Mapping of Mood types to corresponding HSL color strings from the theme.
 * These colors are intended for use in visualizations, e.g., with Recharts.
 */
export const moodColors: Record<Mood, string> = {
  joyful: 'hsl(var(--grace-gold))',    // approx hsl(40, 65%, 70%)
  peaceful: 'hsl(var(--primary))',     // approx hsl(110, 20%, 60%) - Muted Green
  hopeful: 'hsl(var(--grace-200))',    // approx hsl(252, 100%, 94%) - Light Lavender
  content: 'hsl(var(--grace-blue))',   // approx hsl(216, 91%, 91%) - Soft Blue
  neutral: 'hsl(var(--border))',       // approx hsl(60, 10%, 90%) - Very Light Gray
  anxious: 'hsl(var(--soft-peach))',   // approx hsl(30, 100%, 96%) - Soft Peach
  sad: 'hsl(var(--light-beige))',    // approx hsl(45, 70%, 96%) - Light Beige
  stressed: 'hsl(var(--accent))',      // approx hsl(60, 35%, 85%) - Light Yellow/Beige (as a stand-in for muted orange)
  angry: 'hsl(var(--soft-peach))',   // Reusing soft-peach for angry to keep it pastel.
  overwhelmed: 'hsl(var(--grace-100))',// approx hsl(240, 67%, 97%) - Lightest Lavender/Gray
};

/**
 * Retrieves all journal entries and groups moods by date.
 * @returns A Map where keys are dates (YYYY-MM-DD) and values are arrays of Moods recorded on that date.
 */
export function getMoodsByDate(): Map<string, Mood[]> {
  const entries = getJournalEntries();
  const moodsByDate = new Map<string, Mood[]>();

  for (const entry of entries) {
    const date = entry.date; // Assuming entry.date is in 'YYYY-MM-DD' format
    const existingMoods = moodsByDate.get(date);

    if (existingMoods) {
      existingMoods.push(entry.mood);
    } else {
      moodsByDate.set(date, [entry.mood]);
    }
  }

  return moodsByDate;
}

/**
 * Example utility to get the emoji for a mood.
 * This relies on moodEmojis being correctly defined and exported from storage.
 * If moodEmojis is not available or suitable, this function might need adjustment
 * or alternative implementation for mapping moods to emojis.
 */
export function getEmojiForMood(mood: Mood): string {
    return moodEmojis[mood] || '❓'; // Fallback emoji
}

/**
 * Calculates the frequency of each mood for a given month from a list of journal entries.
 * @param entries - Array of JournalEntry objects.
 * @param targetMonth - The month for which to calculate mood frequencies.
 * @returns An array of objects, each containing the mood name, its count (value), and its emoji.
 */
export function getMoodFrequencies(
  entries: JournalEntry[],
  targetMonth: Date
): { name: Mood; value: number; emoji: string }[] {
  const moodCounts = new Map<Mood, number>();

  // Filter entries for the target month and count mood occurrences
  entries.forEach(entry => {
    // Ensure entry.date is valid before parsing
    if (entry.date && isSameMonth(parseISO(entry.date), targetMonth)) {
      const currentCount = moodCounts.get(entry.mood) || 0;
      moodCounts.set(entry.mood, currentCount + 1);
    }
  });

  // Convert the map to the desired array format
  const frequencies: { name: Mood; value: number; emoji: string }[] = [];
  moodCounts.forEach((value, name) => {
    frequencies.push({
      name,
      value,
      emoji: getEmojiForMood(name), // Use existing utility to get emoji
    });
  });
  
  // Optional: Sort by frequency (descending) or mood order
  frequencies.sort((a, b) => b.value - a.value);

  return frequencies;
}

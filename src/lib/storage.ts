
/**
 * Local storage utilities for persisting app data
 */

// Types for our app data
export type Mood = 'joyful' | 'peaceful' | 'hopeful' | 'content' | 'neutral' | 'anxious' | 'sad' | 'stressed' | 'angry' | 'overwhelmed';

export type MoodEmoji = {
  [key in Mood]: string;
};

export const moodEmojis: MoodEmoji = {
  joyful: '😊',
  peaceful: '😌',
  hopeful: '🙏',
  content: '🥰',
  neutral: '😐',
  anxious: '😟',
  sad: '😢',
  stressed: '😫',
  angry: '😠',
  overwhelmed: '😩'
};

export type PrayerStatus = 'praying' | 'answered' | 'waiting';

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  mood: Mood;
  verse?: {
    text: string;
    reference: string;
  };
  reflection?: string; // New field for "What is God saying to you?"
  createdAt: number;
}

export interface Prayer {
  id: string;
  content: string;
  status: PrayerStatus;
  createdAt: number;
  updatedAt: number;
  title?: string;
  prayedCount?: number;
  lastPrayedAt?: number;
  answeredAt?: number;
  answerNote?: string;
}

// Save a journal entry to local storage
export function saveJournalEntry(entry: JournalEntry): void {
  const entries = getJournalEntries();
  
  // Check if entry already exists
  const existingIndex = entries.findIndex(e => e.id === entry.id);
  
  if (existingIndex >= 0) {
    // Update existing entry
    entries[existingIndex] = entry;
  } else {
    // Add new entry
    entries.push(entry);
  }
  
  localStorage.setItem('journal_entries', JSON.stringify(entries));
}

// Get all journal entries from local storage
export function getJournalEntries(): JournalEntry[] {
  const entriesJson = localStorage.getItem('journal_entries');
  
  if (!entriesJson) {
    return [];
  }
  
  try {
    return JSON.parse(entriesJson);
  } catch (error) {
    console.error('Failed to parse journal entries:', error);
    return [];
  }
}

// Get a specific journal entry by ID
export function getJournalEntryById(id: string): JournalEntry | undefined {
  const entries = getJournalEntries();
  return entries.find(entry => entry.id === id);
}

// Delete a journal entry by ID
export function deleteJournalEntry(id: string): void {
  const entries = getJournalEntries();
  const updatedEntries = entries.filter(entry => entry.id !== id);
  localStorage.setItem('journal_entries', JSON.stringify(updatedEntries));
}

// Save a prayer to local storage
export function savePrayer(prayer: Prayer): void {
  const prayers = getPrayers();
  
  // Check if prayer already exists
  const existingIndex = prayers.findIndex(p => p.id === prayer.id);
  
  if (existingIndex >= 0) {
    // Update existing prayer
    prayers[existingIndex] = {
      ...prayer,
      updatedAt: Date.now()
    };
  } else {
    // Add new prayer
    prayers.push(prayer);
  }
  
  localStorage.setItem('prayers', JSON.stringify(prayers));
}

// Get all prayers from local storage
export function getPrayers(): Prayer[] {
  const prayersJson = localStorage.getItem('prayers');
  
  if (!prayersJson) {
    return [];
  }
  
  try {
    return JSON.parse(prayersJson);
  } catch (error) {
    console.error('Failed to parse prayers:', error);
    return [];
  }
}

// Update prayer status
export function updatePrayerStatus(id: string, status: PrayerStatus): void {
  const prayers = getPrayers();
  const prayerIndex = prayers.findIndex(p => p.id === id);
  
  if (prayerIndex >= 0) {
    prayers[prayerIndex].status = status;
    prayers[prayerIndex].updatedAt = Date.now();
    localStorage.setItem('prayers', JSON.stringify(prayers));
  }
}

// Delete a prayer by ID
export function deletePrayer(id: string): void {
  const prayers = getPrayers();
  const updatedPrayers = prayers.filter(prayer => prayer.id !== id);
  localStorage.setItem('prayers', JSON.stringify(updatedPrayers));
}

// Create a new prayer request
export function addPrayer(content: string, title?: string): Prayer {
  const prayer: Prayer = {
    id: generateId(),
    content: content.trim(),
    title: title?.trim() || undefined,
    status: 'praying',
    prayedCount: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  savePrayer(prayer);
  return prayer;
}

// Record that the user prayed for a request today
export function logPrayer(id: string): void {
  const prayers = getPrayers();
  const i = prayers.findIndex(p => p.id === id);
  if (i >= 0) {
    prayers[i].prayedCount = (prayers[i].prayedCount || 0) + 1;
    prayers[i].lastPrayedAt = Date.now();
    prayers[i].updatedAt = Date.now();
    localStorage.setItem('prayers', JSON.stringify(prayers));
  }
}

// Mark a prayer as answered, with an optional note of thanks
export function answerPrayer(id: string, note?: string): void {
  const prayers = getPrayers();
  const i = prayers.findIndex(p => p.id === id);
  if (i >= 0) {
    prayers[i].status = 'answered';
    prayers[i].answeredAt = Date.now();
    prayers[i].answerNote = note?.trim() || undefined;
    prayers[i].updatedAt = Date.now();
    localStorage.setItem('prayers', JSON.stringify(prayers));
  }
}

// Generate a unique ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// --- Prayer Request Wall Feature ---

export interface PrayerComment {
  id: string;
  text: string;
  createdAt: number;
}

export interface PrayerRequest {
  id: string;
  text: string;
  createdAt: number;
  isAnonymous: boolean;
  prayedCount: number;
  comments: PrayerComment[];
}

// Get all prayer requests from local storage
export function getPrayerRequests(): PrayerRequest[] {
  const requestsJson = localStorage.getItem('prayer_requests');
  if (!requestsJson) {
    return [];
  }
  try {
    const requests: PrayerRequest[] = JSON.parse(requestsJson);
    // Sort by createdAt in descending order (newest first)
    return requests.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error('Failed to parse prayer requests:', error);
    return [];
  }
}

// Helper function to save the whole array of prayer requests
function savePrayerRequests(requests: PrayerRequest[]): void {
  localStorage.setItem('prayer_requests', JSON.stringify(requests));
}

// Add a new prayer request
export function addPrayerRequest(requestText: string, anonymous: boolean): PrayerRequest {
  const newRequest: PrayerRequest = {
    id: generateId(),
    text: requestText,
    createdAt: Date.now(),
    isAnonymous: anonymous,
    prayedCount: 0,
    comments: [],
  };
  const requests = getPrayerRequests(); // getPrayerRequests already sorts, but for consistency we add then re-save.
                                        // Or, we could push and then sort before saving if performance was critical with huge lists.
                                        // For now, this is simpler: get sorted, add, save. The next get will re-sort.
  requests.unshift(newRequest); // Add to the beginning for immediate "newest" feel if not re-sorting immediately after
  savePrayerRequests(requests); // This will save it, next getPrayerRequests will sort it correctly if unshift wasn't perfect.
  return newRequest;
}

// Increment prayed count for a prayer request
export function incrementPrayedCount(requestId: string): PrayerRequest | undefined {
  const requests = getPrayerRequests();
  const requestIndex = requests.findIndex(req => req.id === requestId);
  if (requestIndex !== -1) {
    requests[requestIndex].prayedCount += 1;
    savePrayerRequests(requests);
    return requests[requestIndex];
  }
  return undefined;
}

// Add a comment to a prayer request
export function addCommentToPrayerRequest(requestId: string, commentText: string): PrayerRequest | undefined {
  const requests = getPrayerRequests();
  const requestIndex = requests.findIndex(req => req.id === requestId);
  if (requestIndex !== -1) {
    const newComment: PrayerComment = {
      id: generateId(),
      text: commentText,
      createdAt: Date.now(),
    };
    requests[requestIndex].comments.push(newComment);
    // Optional: sort comments by createdAt if desired, e.g., requests[requestIndex].comments.sort((a,b) => a.createdAt - b.createdAt);
    savePrayerRequests(requests);
    return requests[requestIndex];
  }
  return undefined;
}

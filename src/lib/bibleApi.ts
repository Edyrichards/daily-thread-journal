
// Re-export everything from the new modular structure
export * from './bible/types';
export * from './bible/constants';
export * from './bible/enhancedApi';

import { VERSE_EXPLANATIONS } from './bible/constants';
import { VerseExplanation } from './bible/types';

// Re-export the enhanced API as the main API
export { enhancedBibleApi as bibleApi } from './bible/enhancedApi';

export const getVerseExplanation = (reference: string): VerseExplanation | null => {
  return VERSE_EXPLANATIONS[reference] || null;
};

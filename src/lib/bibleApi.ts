
// Re-export everything from the new modular structure
export * from './bible/types';
export * from './bible/constants';
export * from './bible/api';

import { VERSE_EXPLANATIONS } from './bible/constants';
import { VerseExplanation } from './bible/types';

export const getVerseExplanation = (reference: string): VerseExplanation | null => {
  return VERSE_EXPLANATIONS[reference] || null;
};

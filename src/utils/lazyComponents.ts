
import { lazy } from 'react';

// Lazy load heavy components to improve initial load time
export const LazyMoodTrackerPage = lazy(() => import('@/pages/MoodTrackerPage'));
export const LazyDataManagementPage = lazy(() => import('@/pages/DataManagementPage'));
export const LazyPrayerWallPage = lazy(() => import('@/pages/PrayerWallPage'));
export const LazyScripturePage = lazy(() => import('@/pages/ScripturePage'));
export const LazySpiritualGrowthPage = lazy(() => import('@/pages/SpiritualGrowthPage'));
export const LazyBiblePage = lazy(() => import('@/pages/BiblePage'));

// Lazy load Bible integration components
export const LazyVerseSelector = lazy(() => import('@/components/Journal/VerseSelector'));
export const LazyScripturePrayer = lazy(() => import('@/components/Prayer/ScripturePrayer'));
export const LazyVerseCommunity = lazy(() => import('@/components/Community/VerseCommunity'));
export const LazyScriptureDevotional = lazy(() => import('@/components/Devotional/ScriptureDevotional'));

// Preload critical components
export const preloadCriticalComponents = () => {
  // Preload components that are likely to be used soon
  import('@/pages/JournalPage');
  import('@/pages/NewJournalEntry');
  import('@/pages/BiblePage');
  import('@/components/Journal');
  import('@/components/BibleDequeue');
  import('@/components/BibleReadingPlans');
  import('@/components/ScriptureLookup');
  
  // Preload integration components
  import('@/components/Journal/VerseSelector');
  import('@/components/Prayer/ScripturePrayer');
  import('@/components/Community/VerseCommunity');
  import('@/components/Devotional/ScriptureDevotional');
};

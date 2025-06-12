
import { lazy } from 'react';

// Lazy load heavy components to improve initial load time
export const LazyMoodTrackerPage = lazy(() => import('@/pages/MoodTrackerPage'));
export const LazyDataManagementPage = lazy(() => import('@/pages/DataManagementPage'));
export const LazyPrayerWallPage = lazy(() => import('@/pages/PrayerWallPage'));
export const LazyScripturePage = lazy(() => import('@/pages/ScripturePage'));
export const LazySpiritualGrowthPage = lazy(() => import('@/pages/SpiritualGrowthPage'));

// Preload critical components
export const preloadCriticalComponents = () => {
  // Preload components that are likely to be used soon
  import('@/pages/JournalPage');
  import('@/pages/NewJournalEntry');
  import('@/components/Journal');
};

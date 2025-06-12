
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from './pages/Index';
import JournalPage from './pages/JournalPage';
import NewJournalEntry from './pages/NewJournalEntry';
import JournalEntryDetail from './pages/JournalEntryDetail';
import PrayerPage from './pages/PrayerPage';
import SettingsPage from './pages/SettingsPage';
import CommunityPage from './pages/CommunityPage';
import { Toaster } from '@/components/ui/toaster';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

// Lazy load non-critical pages
import {
  LazyMoodTrackerPage,
  LazyDataManagementPage,
  LazyPrayerWallPage,
  LazyScripturePage,
  LazySpiritualGrowthPage,
  preloadCriticalComponents
} from './utils/lazyComponents';

// Loading component for suspense fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Card className="w-64">
      <CardContent className="flex flex-col items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </CardContent>
    </Card>
  </div>
);

function App() {
  React.useEffect(() => {
    // Preload critical components after app loads
    preloadCriticalComponents();
  }, []);

  return (
    <Router>
      <div className="App">
        <Toaster />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/journal/new" element={<NewJournalEntry />} />
            <Route path="/journal/:id" element={<JournalEntryDetail />} />
            <Route path="/prayer" element={<PrayerPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/prayer-wall" element={<LazyPrayerWallPage />} />
            <Route path="/data-management" element={<LazyDataManagementPage />} />
            <Route path="/mood-tracker" element={<LazyMoodTrackerPage />} />
            <Route path="/scripture" element={<LazyScripturePage />} />
            <Route path="/spiritual-growth" element={<LazySpiritualGrowthPage />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;

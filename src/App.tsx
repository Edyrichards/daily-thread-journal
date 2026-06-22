
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';

// Import all pages
import Index from '@/pages/Index';
import TodayPage from '@/pages/TodayPage';
import JournalPage from '@/pages/JournalPage';
import SelahJournalPage from '@/pages/SelahJournalPage';
import NewJournalEntry from '@/pages/NewJournalEntry';
import JournalEntryDetail from '@/pages/JournalEntryDetail';
import PrayerPage from '@/pages/PrayerPage';
import BiblePage from '@/pages/BiblePage';
import ScripturePage from '@/pages/ScripturePage';
import ScriptureDiscoveryPage from '@/pages/ScriptureDiscoveryPage';
import DevotionalPage from '@/pages/DevotionalPage';
import WeeklyDevotionalPage from '@/pages/WeeklyDevotionalPage';
import MoodTrackerPage from '@/pages/MoodTrackerPage';
import HabitTrackerPage from '@/pages/HabitTrackerPage';
import GrowthDashboard from '@/pages/GrowthDashboard';
import SpiritualGrowthPage from '@/pages/SpiritualGrowthPage';
import CommunityPage from '@/pages/CommunityPage';
import PrayerWallPage from '@/pages/PrayerWallPage';
import SettingsPage from '@/pages/SettingsPage';
import DataManagementPage from '@/pages/DataManagementPage';
import VoiceJournalPage from '@/pages/VoiceJournalPage';
import NewJournalFlowPage from '@/pages/NewJournalFlowPage';
import SelahNewEntryPage from '@/pages/SelahNewEntryPage';
import OnboardingPage from '@/pages/OnboardingPage';
import EnhancedPrayerPage from '@/pages/EnhancedPrayerPage';
import GuidedPrayerPage from '@/pages/GuidedPrayerPage';
import NotFound from '@/pages/NotFound';

// New Phase 2 pages
import EnhancedJournalPage from '@/pages/EnhancedJournalPage';
import PrayerInsightsPage from '@/pages/PrayerInsightsPage';
import AnalyticsPage from '@/pages/AnalyticsPage';

// Enhanced components
import ErrorBoundary from '@/components/ErrorBoundary';
import OfflineIndicator from '@/components/OfflineIndicator';

import '@/styles/accessibility.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors except 408 (timeout)
        if (error instanceof Error && 'status' in error) {
          const status = (error as any).status;
          if (status >= 400 && status < 500 && status !== 408) {
            return false;
          }
        }
        return failureCount < 3;
      }
    }
  }
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Router>
            <div className="min-h-screen bg-background">
              <OfflineIndicator />
              <Routes>
                <Route path="/" element={<TodayPage />} />
                <Route path="/home-legacy" element={<Index />} />
                <Route path="/journal" element={<SelahJournalPage />} />
                <Route path="/journal-legacy" element={<JournalPage />} />
                <Route path="/journal/enhanced" element={<EnhancedJournalPage />} />
                <Route path="/journal/new" element={<NewJournalEntry />} />
                <Route path="/journal/new-flow" element={<SelahNewEntryPage />} />
                <Route path="/journal/new-flow-legacy" element={<NewJournalFlowPage />} />
                <Route path="/journal/:id" element={<JournalEntryDetail />} />
                <Route path="/prayer" element={<PrayerPage />} />
                <Route path="/prayer/enhanced" element={<EnhancedPrayerPage />} />
                <Route path="/prayer/guided" element={<GuidedPrayerPage />} />
                <Route path="/prayer/insights" element={<PrayerInsightsPage />} />
                <Route path="/bible" element={<BiblePage />} />
                <Route path="/scripture" element={<ScripturePage />} />
                <Route path="/scripture/discovery" element={<ScriptureDiscoveryPage />} />
                <Route path="/devotional" element={<DevotionalPage />} />
                <Route path="/devotional/weekly" element={<WeeklyDevotionalPage />} />
                <Route path="/mood" element={<MoodTrackerPage />} />
                <Route path="/habits" element={<HabitTrackerPage />} />
                <Route path="/growth" element={<GrowthDashboard />} />
                <Route path="/spiritual-growth" element={<SpiritualGrowthPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/community" element={<CommunityPage />} />
                <Route path="/prayer-wall" element={<PrayerWallPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/data" element={<DataManagementPage />} />
                <Route path="/voice" element={<VoiceJournalPage />} />
                <Route path="/onboarding" element={<OnboardingPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Toaster />
            <Sonner />
          </Router>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;

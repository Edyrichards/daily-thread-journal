
import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import JournalPage from "./pages/JournalPage";
import NewJournalEntry from "./pages/NewJournalEntry";
import NewJournalFlowPage from "./pages/NewJournalFlowPage";
import JournalEntryDetail from "./pages/JournalEntryDetail";
import PrayerPage from "./pages/PrayerPage";
import EnhancedPrayerPage from "./pages/EnhancedPrayerPage";
import DevotionalPage from "./pages/DevotionalPage";
import GuidedPrayerPage from "./pages/GuidedPrayerPage";
import ScriptureDiscoveryPage from "./pages/ScriptureDiscoveryPage";
import BiblePage from "./pages/BiblePage";
import ScripturePage from "./pages/ScripturePage";
import SettingsPage from "./pages/SettingsPage";
import OnboardingPage from "./pages/OnboardingPage";
import VoiceJournalPage from "./pages/VoiceJournalPage";
import WeeklyDevotionalPage from "./pages/WeeklyDevotionalPage";
import HabitTrackerPage from "./pages/HabitTrackerPage";
import SpiritualGrowthPage from "./pages/SpiritualGrowthPage";
import MoodTrackerPage from "./pages/MoodTrackerPage";
import CommunityPage from "./pages/CommunityPage";
import PrayerWallPage from "./pages/PrayerWallPage";
import DataManagementPage from "./pages/DataManagementPage";
import GrowthDashboard from "./pages/GrowthDashboard";

// Lazy load components for better performance
import { 
  LazyMoodTrackerPage, 
  LazyDataManagementPage, 
  LazyPrayerWallPage, 
  LazyScripturePage,
  LazySpiritualGrowthPage,
  preloadCriticalComponents 
} from './utils/lazyComponents';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Preload critical components
preloadCriticalComponents();

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background text-foreground">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/journal/new" element={<NewJournalEntry />} />
            <Route path="/journal/new-flow" element={<NewJournalFlowPage />} />
            <Route path="/journal/:id" element={<JournalEntryDetail />} />
            <Route path="/prayer" element={<PrayerPage />} />
            <Route path="/prayer/enhanced" element={<EnhancedPrayerPage />} />
            <Route path="/prayer/guided" element={<GuidedPrayerPage />} />
            <Route path="/devotional" element={<DevotionalPage />} />
            <Route path="/devotional/weekly" element={<WeeklyDevotionalPage />} />
            <Route path="/scripture-discovery" element={<ScriptureDiscoveryPage />} />
            <Route path="/bible" element={<BiblePage />} />
            <Route path="/scripture" element={
              <Suspense fallback={<LoadingFallback />}>
                <LazyScripturePage />
              </Suspense>
            } />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/voice-journal" element={<VoiceJournalPage />} />
            <Route path="/habits" element={<HabitTrackerPage />} />
            <Route path="/growth" element={
              <Suspense fallback={<LoadingFallback />}>
                <LazySpiritualGrowthPage />
              </Suspense>
            } />
            <Route path="/growth/dashboard" element={<GrowthDashboard />} />
            <Route path="/mood" element={
              <Suspense fallback={<LoadingFallback />}>
                <LazyMoodTrackerPage />
              </Suspense>
            } />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/prayer-wall" element={
              <Suspense fallback={<LoadingFallback />}>
                <LazyPrayerWallPage />
              </Suspense>
            } />
            <Route path="/data" element={
              <Suspense fallback={<LoadingFallback />}>
                <LazyDataManagementPage />
              </Suspense>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;

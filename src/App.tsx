import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import OfflineIndicator from "./components/OfflineIndicator";
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
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors, but retry on network errors
        if (error && 'status' in error && typeof error.status === 'number') {
          return error.status >= 500 && failureCount < 2;
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
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
        <ErrorBoundary>
          <div className="min-h-screen bg-background text-foreground">
            <OfflineIndicator />
            <Routes>
              <Route path="/" element={
                <ErrorBoundary>
                  <Index />
                </ErrorBoundary>
              } />
              <Route path="/journal" element={
                <ErrorBoundary>
                  <JournalPage />
                </ErrorBoundary>
              } />
              <Route path="/journal/new" element={
                <ErrorBoundary>
                  <NewJournalEntry />
                </ErrorBoundary>
              } />
              <Route path="/journal/new-flow" element={
                <ErrorBoundary>
                  <NewJournalFlowPage />
                </ErrorBoundary>
              } />
              <Route path="/journal/:id" element={
                <ErrorBoundary>
                  <JournalEntryDetail />
                </ErrorBoundary>
              } />
              <Route path="/prayer" element={
                <ErrorBoundary>
                  <PrayerPage />
                </ErrorBoundary>
              } />
              <Route path="/prayer/enhanced" element={
                <ErrorBoundary>
                  <EnhancedPrayerPage />
                </ErrorBoundary>
              } />
              <Route path="/prayer/guided" element={
                <ErrorBoundary>
                  <GuidedPrayerPage />
                </ErrorBoundary>
              } />
              <Route path="/devotional" element={
                <ErrorBoundary>
                  <DevotionalPage />
                </ErrorBoundary>
              } />
              <Route path="/devotional/weekly" element={
                <ErrorBoundary>
                  <WeeklyDevotionalPage />
                </ErrorBoundary>
              } />
              <Route path="/scripture-discovery" element={
                <ErrorBoundary>
                  <ScriptureDiscoveryPage />
                </ErrorBoundary>
              } />
              <Route path="/bible" element={
                <ErrorBoundary>
                  <BiblePage />
                </ErrorBoundary>
              } />
              <Route path="/scripture" element={
                <ErrorBoundary>
                  <Suspense fallback={<LoadingFallback />}>
                    <LazyScripturePage />
                  </Suspense>
                </ErrorBoundary>
              } />
              <Route path="/settings" element={
                <ErrorBoundary>
                  <SettingsPage />
                </ErrorBoundary>
              } />
              <Route path="/onboarding" element={
                <ErrorBoundary>
                  <OnboardingPage />
                </ErrorBoundary>
              } />
              <Route path="/voice-journal" element={
                <ErrorBoundary>
                  <VoiceJournalPage />
                </ErrorBoundary>
              } />
              <Route path="/habits" element={
                <ErrorBoundary>
                  <HabitTrackerPage />
                </ErrorBoundary>
              } />
              <Route path="/growth" element={
                <ErrorBoundary>
                  <Suspense fallback={<LoadingFallback />}>
                    <LazySpiritualGrowthPage />
                  </Suspense>
                </ErrorBoundary>
              } />
              <Route path="/growth/dashboard" element={
                <ErrorBoundary>
                  <GrowthDashboard />
                </ErrorBoundary>
              } />
              <Route path="/mood" element={
                <ErrorBoundary>
                  <Suspense fallback={<LoadingFallback />}>
                    <LazyMoodTrackerPage />
                  </Suspense>
                </ErrorBoundary>
              } />
              <Route path="/community" element={
                <ErrorBoundary>
                  <CommunityPage />
                </ErrorBoundary>
              } />
              <Route path="/prayer-wall" element={
                <ErrorBoundary>
                  <Suspense fallback={<LoadingFallback />}>
                    <LazyPrayerWallPage />
                  </Suspense>
                </ErrorBoundary>
              } />
              <Route path="/data" element={
                <ErrorBoundary>
                  <Suspense fallback={<LoadingFallback />}>
                    <LazyDataManagementPage />
                  </Suspense>
                </ErrorBoundary>
              } />
              <Route path="*" element={
                <ErrorBoundary>
                  <NotFound />
                </ErrorBoundary>
              } />
            </Routes>
          </div>
          <Toaster />
        </ErrorBoundary>
      </Router>
    </QueryClientProvider>
  );
}

export default App;

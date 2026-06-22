import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import ErrorBoundary from '@/components/ErrorBoundary';
import OfflineIndicator from '@/components/OfflineIndicator';
import '@/styles/accessibility.css';

// Code-split every route so the initial bundle stays small.
const TodayPage = lazy(() => import('@/pages/TodayPage'));
const SelahJournalPage = lazy(() => import('@/pages/SelahJournalPage'));
const SelahNewEntryPage = lazy(() => import('@/pages/SelahNewEntryPage'));
const SelahEntryDetailPage = lazy(() => import('@/pages/SelahEntryDetailPage'));
const SelahPrayerPage = lazy(() => import('@/pages/SelahPrayerPage'));
const SelahGuidedPrayerPage = lazy(() => import('@/pages/SelahGuidedPrayerPage'));
const SelahBiblePage = lazy(() => import('@/pages/SelahBiblePage'));
const SelahReaderPage = lazy(() => import('@/pages/SelahReaderPage'));
const SelahPlanPage = lazy(() => import('@/pages/SelahPlanPage'));
const SelahCommunityPage = lazy(() => import('@/pages/SelahCommunityPage'));
const SelahJourneyPage = lazy(() => import('@/pages/SelahJourneyPage'));
const SelahSettingsPage = lazy(() => import('@/pages/SelahSettingsPage'));
const SelahOnboardingPage = lazy(() => import('@/pages/SelahOnboardingPage'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: (failureCount, error) => {
        if (error instanceof Error && 'status' in error) {
          const status = (error as any).status;
          if (status >= 400 && status < 500 && status !== 408) return false;
        }
        return failureCount < 3;
      },
    },
  },
});

const RouteFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-forest" />
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Router>
            <div className="min-h-screen bg-background">
              <OfflineIndicator />
              <Suspense fallback={<RouteFallback />}>
                <Routes>
                  <Route path="/" element={<TodayPage />} />
                  <Route path="/onboarding" element={<SelahOnboardingPage />} />

                  <Route path="/journal" element={<SelahJournalPage />} />
                  <Route path="/journal/new-flow" element={<SelahNewEntryPage />} />
                  <Route path="/journal/:id" element={<SelahEntryDetailPage />} />

                  <Route path="/prayer" element={<SelahPrayerPage />} />
                  <Route path="/prayer/guided" element={<SelahGuidedPrayerPage />} />

                  <Route path="/bible" element={<SelahBiblePage />} />
                  <Route path="/bible/read" element={<SelahReaderPage />} />
                  <Route path="/bible/plan/:id" element={<SelahPlanPage />} />

                  <Route path="/community" element={<SelahCommunityPage />} />
                  <Route path="/analytics" element={<SelahJourneyPage />} />
                  <Route path="/settings" element={<SelahSettingsPage />} />

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
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

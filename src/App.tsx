
import React, { useEffect } from "react"; // Added useEffect
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom"; // Added useLocation, useNavigate
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence } from "framer-motion"; // Added

import Index from "./pages/Index";
import JournalPage from "./pages/JournalPage";
import PrayerPage from "./pages/PrayerPage";
import NewJournalEntry from "./pages/NewJournalEntry";
import JournalEntryDetail from "./pages/JournalEntryDetail";
import GrowthDashboard from "./pages/GrowthDashboard";
import NotFound from "./pages/NotFound";
import DevotionalPage from "./pages/DevotionalPage";
import WeeklyDevotionalPage from "./pages/WeeklyDevotionalPage";
import HabitTrackerPage from "./pages/HabitTrackerPage";
import GuidedPrayerPage from "./pages/GuidedPrayerPage";
import ScriptureDiscoveryPage from "./pages/ScriptureDiscoveryPage";
import VoiceJournalPage from "./pages/VoiceJournalPage";
import CommunityPage from "./pages/CommunityPage";
import SettingsPage from "./pages/SettingsPage";
import NewJournalFlowPage from "./pages/NewJournalFlowPage";
import MoodTrackerPage from "./pages/MoodTrackerPage";
import PrayerWallPage from "./pages/PrayerWallPage";
import OnboardingPage from "./pages/OnboardingPage"; // Added
import SpiritualGrowthPage from "./pages/SpiritualGrowthPage"; // Added
import EnhancedPrayerPage from "./pages/EnhancedPrayerPage"; // Added
import ScripturePage from "./pages/ScripturePage"; // Added

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Added

  useEffect(() => {
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    if (onboardingCompleted !== 'true' && location.pathname !== '/welcome') {
      // If onboarding is not completed AND we are not already on the welcome page, redirect.
      // Add more paths here if other paths should also be excluded from this redirect (e.g. /privacy, /terms)
      navigate('/welcome', { replace: true });
    }
  }, [location, navigate]); // Re-run if location changes (e.g. user navigates manually)

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/welcome" element={<OnboardingPage />} /> {/* Added */}
        <Route path="/" element={<Index />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/journal/new" element={<NewJournalEntry />} />
        <Route path="/journal/new-flow" element={<NewJournalFlowPage />} />
        <Route path="/journal/:id" element={<JournalEntryDetail />} />
        <Route path="/prayer" element={<PrayerPage />} />
        <Route path="/enhanced-prayer" element={<EnhancedPrayerPage />} />
        <Route path="/scripture" element={<ScripturePage />} />
        <Route path="/spiritual-growth" element={<SpiritualGrowthPage />} />
        <Route path="/growth" element={<GrowthDashboard />} />
        <Route path="/devotional" element={<DevotionalPage />} />
        <Route path="/weekly-devotional" element={<WeeklyDevotionalPage />} />
        <Route path="/habits" element={<HabitTrackerPage />} />
        <Route path="/guided-prayer" element={<GuidedPrayerPage />} />
        <Route path="/scripture-discovery" element={<ScriptureDiscoveryPage />} />
        <Route path="/voice-journal" element={<VoiceJournalPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/mood-tracker" element={<MoodTrackerPage />} />
        <Route path="/prayer-wall" element={<PrayerWallPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent /> {/* Use the new component here */}
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

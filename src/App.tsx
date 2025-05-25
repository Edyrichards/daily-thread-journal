
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"; // Added useLocation
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
import PrayerWallPage from "./pages/PrayerWallPage"; // Added

const queryClient = new QueryClient();

const AppContent = () => { // Create a new component for content that uses useLocation
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/journal/new" element={<NewJournalEntry />} />
        <Route path="/journal/new-flow" element={<NewJournalFlowPage />} />
        <Route path="/journal/:id" element={<JournalEntryDetail />} />
        <Route path="/prayer" element={<PrayerPage />} />
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
        <Route path="/prayer-wall" element={<PrayerWallPage />} /> {/* Added */}
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


import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/journal/new" element={<NewJournalEntry />} />
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

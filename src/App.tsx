
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from './pages/Index';
import JournalPage from './pages/JournalPage';
import NewJournalEntry from './pages/NewJournalEntry';
import JournalEntryDetail from './pages/JournalEntryDetail';
import PrayerPage from './pages/PrayerPage';
import SettingsPage from './pages/SettingsPage';
import CommunityPage from './pages/CommunityPage';
import PrayerWallPage from './pages/PrayerWallPage';
import { Toaster } from '@/components/ui/toaster';
import DataManagementPage from './pages/DataManagementPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Toaster />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/journal/new" element={<NewJournalEntry />} />
          <Route path="/journal/:id" element={<JournalEntryDetail />} />
          <Route path="/prayer" element={<PrayerPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/prayer-wall" element={<PrayerWallPage />} />
          <Route path="/data-management" element={<DataManagementPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

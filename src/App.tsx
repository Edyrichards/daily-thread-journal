import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import JournalPage from './pages/JournalPage';
import NewJournalEntryPage from './pages/NewJournalEntryPage';
import EditJournalEntryPage from './pages/EditJournalEntryPage';
import PrayerPage from './pages/PrayerPage';
import SettingsPage from './pages/SettingsPage';
import CommunityFeedPage from './pages/CommunityFeedPage';
import PrayerWallPage from './pages/PrayerWallPage';
import { Toaster } from '@/components/ui/toaster';
import DataManagementPage from './pages/DataManagementPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Toaster />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/journal/new" element={<NewJournalEntryPage />} />
          <Route path="/journal/edit/:id" element={<EditJournalEntryPage />} />
          <Route path="/prayer" element={<PrayerPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/community" element={<CommunityFeedPage />} />
          <Route path="/prayer-wall" element={<PrayerWallPage />} />
          <Route path="/data-management" element={<DataManagementPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

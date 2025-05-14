
import React from "react";
import Header from "@/components/Header";
import PrayerTracker from "@/components/PrayerTracker";

const PrayerPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-grace-100">
      <Header title="Prayer Tracker" />
      <main className="flex-1 container max-w-2xl mx-auto px-6 py-12">
        <PrayerTracker />
      </main>
    </div>
  );
};

export default PrayerPage;

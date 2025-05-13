
import React from "react";
import Header from "@/components/Header";
import PrayerTracker from "@/components/PrayerTracker";

const PrayerPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Prayer Tracker" />
      <main className="flex-1 container max-w-2xl mx-auto px-4 py-8">
        <PrayerTracker />
      </main>
    </div>
  );
};

export default PrayerPage;

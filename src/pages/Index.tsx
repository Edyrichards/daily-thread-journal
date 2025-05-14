
import React from "react";
import Header from "@/components/Header";
import BibleVerse from "@/components/BibleVerse";
import MoodPrompt from "@/components/MoodPrompt";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-grace-100">
      <Header />
      <main className="flex-1 container max-w-xl mx-auto px-6 py-12 animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-semibold text-grace-700 mb-3">
            Threads of Grace
          </h1>
          <p className="text-grace-500 max-w-sm mx-auto">
            Connect your emotional journey with scripture, prayer, and gratitude.
          </p>
        </div>

        <BibleVerse />
        <MoodPrompt />
      </main>
    </div>
  );
};

export default Index;

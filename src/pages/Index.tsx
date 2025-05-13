
import React from "react";
import Header from "@/components/Header";
import BibleVerse from "@/components/BibleVerse";
import MoodPrompt from "@/components/MoodPrompt";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container max-w-xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-semibold text-grace-700 mb-2">
            Threads of Grace
          </h1>
          <p className="text-grace-500">
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

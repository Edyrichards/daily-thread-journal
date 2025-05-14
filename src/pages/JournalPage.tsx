
import React from "react";
import Header from "@/components/Header";
import Journal from "@/components/Journal";

const JournalPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-grace-100">
      <Header title="Journal" />
      <main className="flex-1 container max-w-2xl mx-auto px-6 py-12">
        <Journal />
      </main>
    </div>
  );
};

export default JournalPage;

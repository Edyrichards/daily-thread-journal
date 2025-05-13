
import React from "react";
import Header from "@/components/Header";
import Journal from "@/components/Journal";

const JournalPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Journal" />
      <main className="flex-1 container max-w-2xl mx-auto px-4 py-8">
        <Journal />
      </main>
    </div>
  );
};

export default JournalPage;

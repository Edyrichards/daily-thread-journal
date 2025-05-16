
import React from "react";
import Header from "./Header";
import BottomNav from "./BottomNav";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  hideBottomNav?: boolean;
}

const Layout = ({ children, title, hideBottomNav = false }: LayoutProps) => {
  const location = useLocation();
  const isNewJournalEntry = location.pathname === "/journal/new";
  
  // Don't show bottom nav on the journal entry creation screen
  const shouldHideBottomNav = hideBottomNav || isNewJournalEntry;

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f3eb]">
      <Header title={title} />
      <main className="flex-1 container max-w-md mx-auto px-6 py-6 pb-20 animate-fade-in">
        {children}
      </main>
      {!shouldHideBottomNav && <BottomNav />}
    </div>
  );
};

export default Layout;

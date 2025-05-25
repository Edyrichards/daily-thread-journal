
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
    <div className="min-h-screen flex flex-col">
      <Header title={title} />
      <main className="flex-1 container mx-auto py-6 pb-20 md:pb-6 animate-fade-in">
        {children}
      </main>
      {!shouldHideBottomNav && <BottomNav />}
    </div>
  );
};

export default Layout;

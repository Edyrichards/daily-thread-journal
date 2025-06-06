
import React, { useState } from "react";
import Header from "./Header";
import BottomNav from "./BottomNav";
import Sidebar from "./Sidebar";
import FloatingActionButton from "./FloatingActionButton";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  hideBottomNav?: boolean;
}

const Layout = ({ children, title, hideBottomNav = false }: LayoutProps) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const isNewJournalEntry = location.pathname === "/journal/new";
  const shouldHideBottomNav = hideBottomNav || isNewJournalEntry;

  const handleMenuClick = () => {
    setIsSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <Header title={title} onMenuClick={handleMenuClick} />
      <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />
      <main className="flex-1 container mx-auto py-6 pb-20 md:pb-6 animate-fade-in">
        {children}
      </main>
      {!shouldHideBottomNav && <BottomNav />}
      <FloatingActionButton />
    </div>
  );
};

export default Layout;

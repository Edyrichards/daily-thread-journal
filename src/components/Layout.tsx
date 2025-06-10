import React, { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import PWAInstallPrompt from "./PWAInstallPrompt";
import { usePWA } from "@/hooks/usePWA";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  hideBottomNav?: boolean;
}

const Layout = ({ children, title, hideBottomNav = false }: LayoutProps) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const { isInstallable } = usePWA();

  useEffect(() => {
    // Show install prompt after 30 seconds if app is installable
    const timer = setTimeout(() => {
      if (isInstallable && !localStorage.getItem('pwa-install-dismissed')) {
        setShowInstallPrompt(true);
      }
    }, 30000);

    return () => clearTimeout(timer);
  }, [isInstallable]);

  const handleInstallDismiss = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  const isNewJournalEntry = location.pathname === "/journal/new";
  const shouldHideBottomNav = hideBottomNav || isNewJournalEntry;

  const handleMenuClick = () => {
    setIsSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuClick={() => setIsSidebarOpen(true)} title={title} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="pt-16 pb-20 md:pb-4">
        {children}
      </main>
      {!shouldHideBottomNav && <BottomNav />}
      {showInstallPrompt && <PWAInstallPrompt onDismiss={handleInstallDismiss} />}
    </div>
  );
};

export default Layout;

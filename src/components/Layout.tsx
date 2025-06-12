
import React, { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import PWAInstallPrompt from "./PWAInstallPrompt";
import SkipLink from "./accessibility/SkipLink";
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

  // Announce route changes to screen readers
  useEffect(() => {
    const pageTitle = title || 'Threads of Grace';
    document.title = pageTitle;
    
    // Announce page change to screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = `Navigated to ${pageTitle}`;
    
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  }, [location.pathname, title]);

  const handleInstallDismiss = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  const isNewJournalEntry = location.pathname === "/journal/new";
  const shouldHideBottomNav = hideBottomNav || isNewJournalEntry;

  return (
    <div className="min-h-screen bg-background">
      <SkipLink />
      <Header onMenuClick={() => setIsSidebarOpen(true)} title={title} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main 
        id="main-content"
        className="pt-16 pb-20 md:pb-4 focus:outline-none"
        tabIndex={-1}
        role="main"
        aria-label={title ? `${title} page content` : 'Main content'}
      >
        {children}
      </main>
      {!shouldHideBottomNav && <BottomNav />}
      {showInstallPrompt && <PWAInstallPrompt onDismiss={handleInstallDismiss} />}
    </div>
  );
};

export default Layout;

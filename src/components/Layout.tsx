
import React, { useState } from "react";
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
  const [showMenu, setShowMenu] = useState(false);
  
  // Don't show bottom nav on the journal entry creation screen
  const shouldHideBottomNav = hideBottomNav || isNewJournalEntry;

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f3eb]">
      <Header title={title} showMenu={showMenu} setShowMenu={setShowMenu} />
      
      {/* Overlay for closing menu when open */}
      {showMenu && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={() => setShowMenu(false)}
        />
      )}
      
      {/* Side menu */}
      <div 
        className={`fixed top-0 left-0 h-full w-64 bg-[#f8f3eb] shadow-lg z-50 transform transition-transform duration-300 ${showMenu ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-6">
          <h1 className="text-3xl font-serif text-[#333] text-center mb-8">
            THREADS<br/>OF GRACE
          </h1>
          <div className="space-y-4">
            {/* Menu items similar to welcome screen */}
            <div className="space-y-4">
              {[
                { name: "Home", icon: "🏠", path: "/home" },
                { name: "Devotional", icon: "📖", path: "/devotional" },
                { name: "Journal", icon: "✏️", path: "/journal" },
                { name: "Prayer Tracker", icon: "🙏", path: "/prayer" },
                { name: "Community", icon: "👥", path: "/community" },
                { name: "Habit Tracker", icon: "📊", path: "/habits" },
                { name: "Scripture Discovery", icon: "🔍", path: "/scripture-discovery" },
                { name: "Settings", icon: "⚙️", path: "/settings" }
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => window.location.href = item.path}
                  className="w-full flex items-center space-x-3 p-3 text-[#333] hover:bg-[#e8e8e0] rounded-lg font-serif"
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <main className="flex-1 container max-w-md mx-auto px-6 py-6 pb-20 animate-fade-in">
        {children}
      </main>
      {!shouldHideBottomNav && <BottomNav />}
    </div>
  );
};

export default Layout;

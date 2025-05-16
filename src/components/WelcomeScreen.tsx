
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SidebarProvider, Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { BookOpen, FileText, CheckCircle, MessageCircle, LayoutGrid, Hands, Book, Settings } from 'lucide-react';

const WelcomeScreen = () => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleEnter = () => {
    navigate('/home');
  };

  const menuItems = [
    { name: "Devotional", icon: BookOpen, path: "/devotional" },
    { name: "Journal", icon: FileText, path: "/journal" },
    { name: "Prayer Tracker", icon: CheckCircle, path: "/prayer" },
    { name: "Community", icon: MessageCircle, path: "/community" },
    { name: "Habit Tracker", icon: LayoutGrid, path: "/habits" },
    { name: "Shared Prayers", icon: Hands, path: "/prayer" },
    { name: "Scripture Discovery", icon: Book, path: "/scripture-discovery" },
    { name: "Settings", icon: Settings, path: "/settings" }
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    setShowMenu(false);
  };

  return (
    <div className="min-h-screen flex bg-[#f8f3eb] overflow-hidden">
      <div 
        className={`fixed top-0 left-0 h-full w-64 bg-[#f8f3eb] shadow-lg z-50 transform transition-transform duration-300 ${showMenu ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-6">
          <h1 className="text-3xl font-serif text-[#333] text-center mb-8">
            THREADS<br/>OF GRACE
          </h1>
          <div className="space-y-4">
            {menuItems.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                className="w-full justify-start text-[#333] hover:bg-[#e8e8e0] font-serif py-3"
                onClick={() => handleNavigate(item.path)}
              >
                <item.icon className="mr-3" size={18} />
                {item.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Overlay for closing menu */}
      {showMenu && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={() => setShowMenu(false)}
        />
      )}

      <div className="flex-1 flex flex-col items-center justify-center text-center p-6 relative min-h-screen">
        <button 
          onClick={() => setShowMenu(true)} 
          className="absolute top-6 left-6 p-2 rounded-full hover:bg-[#e8e8e0] transition-colors"
          aria-label="Open menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <h1 className="text-5xl font-serif text-[#333] mb-6">
          THREADS OF<br />GRACE
        </h1>

        <div className="w-40 h-40 mb-10">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#333" strokeWidth="2">
            <path d="M70,40 C70,40 70,80 100,100 C130,120 130,160 130,160" />
            <path d="M60,50 C60,50 60,90 90,110 C120,130 120,170 120,170" />
            <path d="M80,30 C80,30 80,70 110,90 C140,110 140,150 140,150" />
            <circle cx="100" cy="100" r="8" fill="#333" />
          </svg>
        </div>

        <Button 
          onClick={handleEnter}
          className="bg-[#a3977e] hover:bg-[#8a7f67] text-white font-medium rounded-full px-12 py-6 text-xl mb-12"
        >
          Enter
        </Button>

        <div className="max-w-md">
          <p className="text-2xl font-serif italic text-[#333] mb-2">
            "Be still, and know that I am God."
          </p>
          <p className="text-lg text-[#555]">
            Psalm 46:10
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;

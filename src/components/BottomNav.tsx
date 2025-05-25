
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, BookOpen, Heart, Users } from "lucide-react";

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const navItems = [
    {
      icon: Home,
      label: "Home",
      path: "/",
    },
    {
      icon: BookOpen,
      label: "Journal",
      path: "/journal",
    },
    {
      icon: Heart,
      label: "Prayer",
      path: "/prayer",
    },
    {
      icon: Users,
      label: "Community",
      path: "/community",
    },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border py-2 px-4 z-50 md:hidden">
      <div className="flex justify-between max-w-md mx-auto">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center p-2 ${
              isActive(item.path) ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <item.icon size={20} strokeWidth={isActive(item.path) ? 2.5 : 2} />
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;


import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { BookOpen, Heart, Home, Book, Users } from 'lucide-react';

const bottomNavigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Journal', href: '/journal', icon: BookOpen },
  { name: 'Bible', href: '/bible', icon: Book },
  { name: 'Prayer', href: '/prayer', icon: Heart },
  { name: 'Community', href: '/community', icon: Users }
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <nav className="flex justify-around items-center h-16 px-2">
        {bottomNavigation.map((item) => {
          const isActive = location.pathname === item.href || 
                          (item.href !== '/' && location.pathname.startsWith(item.href));
          const Icon = item.icon;
          
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center justify-center px-2 py-1 rounded-lg transition-colors ${
                isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNav;


import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, Heart, Calendar, Search, Users, 
  Settings, BarChart3, Mic, Book, Bookmark,
  MessageCircle, Home, Target
} from 'lucide-react';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Journal', href: '/journal', icon: BookOpen },
  { name: 'Bible Study', href: '/bible', icon: Book },
  { name: 'Prayer', href: '/prayer', icon: Heart },
  { name: 'Scripture', href: '/scripture', icon: Bookmark },
  { name: 'Growth', href: '/growth', icon: BarChart3 },
  { name: 'Community', href: '/community', icon: Users },
  { name: 'Habits', href: '/habits', icon: Target },
  { name: 'Voice Journal', href: '/voice-journal', icon: Mic },
  { name: 'Settings', href: '/settings', icon: Settings }
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <Card className="flex-1 flex flex-col min-h-0 border-r rounded-none">
        <CardContent className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-serif text-foreground">Grace Journal</h1>
          </div>
          <nav className="mt-8 flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || 
                              (item.href !== '/' && location.pathname.startsWith(item.href));
              const Icon = item.icon;
              
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive: linkIsActive }) => {
                    const active = isActive || linkIsActive;
                    return `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      active
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`;
                  }}
                >
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sidebar;

import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react";
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Book, ListChecks, Settings, Calendar, Database } from 'lucide-react';
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { setTheme } = useTheme();

  const menuItems = [
    { 
      name: "Home", 
      href: "/", 
      icon: Home 
    },
    { 
      name: "Daily Journal", 
      href: "/journal", 
      icon: Book 
    },
    { 
      name: "Prayer List", 
      href: "/prayer", 
      icon: ListChecks 
    },
    { 
      name: "Mood Calendar", 
      href: "/calendar", 
      icon: Calendar 
    },
    { 
      name: "Settings", 
      href: "/settings", 
      icon: Settings 
    },
    { 
      name: "Data Management", 
      href: "/data-management", 
      icon: Database 
    },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-64">
        <SheetHeader>
          <SheetTitle className="font-serif">Menu</SheetTitle>
          <SheetDescription>
            Navigate through Threads of Grace.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-md text-sm font-medium
                ${isActive ? 'bg-secondary text-secondary-foreground' : 'hover:bg-accent hover:text-accent-foreground'}
                `
              }
              onClick={onClose}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.name}
            </NavLink>
          ))}
        </div>

        <div className="absolute bottom-4 w-full px-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full">
              <div className="flex items-center justify-between px-4 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                <div className="flex items-center">
                  <Avatar className="mr-2 h-6 w-6">
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  Account
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;

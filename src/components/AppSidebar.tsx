
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { 
  Home, BookOpen, Book, Heart, Bookmark, BarChart3, Users, Target, Mic, Settings
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const items = [
  { title: "Home", url: "/", icon: Home },
  { title: "Journal", url: "/journal", icon: BookOpen },
  { title: "Bible Study", url: "/bible", icon: Book },
  { title: "Prayer", url: "/prayer", icon: Heart },
  { title: "Scripture", url: "/scripture", icon: Bookmark },
  { title: "Growth", url: "/growth", icon: BarChart3 },
  { title: "Community", url: "/community", icon: Users },
  { title: "Habits", url: "/habits", icon: Target },
  { title: "Voice Journal", url: "/voice", icon: Mic },
  { title: "Settings", url: "/settings", icon: Settings },
];

const AppSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <span className="text-xl font-serif text-foreground font-medium px-1">
              Grace Journal
            </span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(item => (
                <SidebarMenuItem key={item.title} active={location.pathname === item.url || (item.url !== '/' && location.pathname.startsWith(item.url))}>
                  <SidebarMenuButton asChild>
                    <button
                      className="flex items-center w-full gap-3 px-3 py-2 rounded-lg group transition-all"
                      onClick={() => navigate(item.url)}
                      aria-current={location.pathname === item.url ? "page" : undefined}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;

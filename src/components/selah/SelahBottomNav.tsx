import { NavLink, useLocation } from 'react-router-dom';
import { Sunrise, PenLine, Heart, BookOpen, BarChart3, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tab = { name: string; href: string; icon: LucideIcon; match: (path: string) => boolean };

const tabs: Tab[] = [
  { name: 'Today', href: '/', icon: Sunrise, match: (p) => p === '/' },
  { name: 'Journal', href: '/journal', icon: PenLine, match: (p) => p.startsWith('/journal') },
  { name: 'Pray', href: '/prayer', icon: Heart, match: (p) => p.startsWith('/prayer') },
  { name: 'Bible', href: '/bible', icon: BookOpen, match: (p) => p.startsWith('/bible') || p.startsWith('/scripture') },
  { name: 'Insights', href: '/analytics', icon: BarChart3, match: (p) => p.startsWith('/analytics') || p.startsWith('/insights') || p.startsWith('/growth') },
];

const SelahBottomNav = () => {
  const { pathname } = useLocation();

  return (
    <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2">
      <nav
        className="flex items-start justify-around border-t border-line bg-card/95 px-2 pt-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-md"
        aria-label="Primary"
      >
        {tabs.map(({ name, href, icon: Icon, match }) => {
          const active = match(pathname);
          return (
            <NavLink
              key={name}
              to={href}
              aria-current={active ? 'page' : undefined}
              className="flex w-16 flex-col items-center gap-1.5 outline-none"
            >
              <Icon
                className={cn('h-6 w-6 transition-colors', active ? 'text-clay' : 'text-muted-foreground')}
                strokeWidth={active ? 2.1 : 1.8}
              />
              <span
                className={cn(
                  'text-[11px] font-semibold transition-colors',
                  active ? 'text-clay' : 'text-muted-foreground',
                )}
              >
                {name}
              </span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default SelahBottomNav;

import { NavLink, useLocation } from 'react-router-dom';
import { Home, BookText, HandHeart, BookOpen, LineChart, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tab = { name: string; href: string; icon: LucideIcon; match: (path: string) => boolean };

const tabs: Tab[] = [
  { name: 'Home', href: '/', icon: Home, match: (p) => p === '/' },
  { name: 'Journal', href: '/journal', icon: BookText, match: (p) => p.startsWith('/journal') },
  { name: 'Prayer', href: '/prayer', icon: HandHeart, match: (p) => p.startsWith('/prayer') },
  { name: 'Bible', href: '/bible', icon: BookOpen, match: (p) => p.startsWith('/bible') || p.startsWith('/scripture') },
  { name: 'Journey', href: '/analytics', icon: LineChart, match: (p) => p.startsWith('/analytics') || p.startsWith('/insights') || p.startsWith('/growth') },
];

const SelahBottomNav = () => {
  const { pathname } = useLocation();

  return (
    <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2">
      <nav
        className="flex items-stretch justify-around border-t border-line bg-card/95 px-2 pt-2.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-md"
        aria-label="Primary"
      >
        {tabs.map(({ name, href, icon: Icon, match }) => {
          const active = match(pathname);
          return (
            <NavLink
              key={name}
              to={href}
              aria-current={active ? 'page' : undefined}
              className="flex w-16 flex-col items-center gap-1 pt-1 outline-none"
            >
              <span
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full transition-colors',
                  active ? 'bg-forest text-primary-foreground' : 'text-muted-foreground',
                )}
              >
                <Icon className="h-[19px] w-[19px]" strokeWidth={active ? 2 : 1.7} />
              </span>
              <span
                className={cn(
                  'text-[10.5px] tracking-wide transition-colors',
                  active ? 'font-semibold text-forest' : 'font-medium text-muted-foreground',
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

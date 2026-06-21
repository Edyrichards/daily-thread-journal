import { ReactNode, useEffect } from 'react';
import SelahBottomNav from './SelahBottomNav';

interface SelahShellProps {
  children: ReactNode;
  title?: string;
  /** hide the bottom tab bar (e.g. immersive / full-screen flows) */
  hideNav?: boolean;
}

/**
 * The Selah app frame: a centered mobile column on a warm paper field,
 * with the brand bottom navigation. Page content is responsible for its
 * own horizontal padding via the `selah-page` wrapper.
 */
const SelahShell = ({ children, title, hideNav = false }: SelahShellProps) => {
  useEffect(() => {
    if (title) document.title = `${title} · Selah`;
  }, [title]);

  return (
    <div className="min-h-screen bg-paper">
      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col bg-paper">
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 px-5 pt-3 pb-28 focus:outline-none"
        >
          {children}
        </main>
        {!hideNav && <SelahBottomNav />}
      </div>
    </div>
  );
};

export default SelahShell;

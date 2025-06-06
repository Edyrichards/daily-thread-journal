
import React from 'react';
import { Plus } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const FloatingActionButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Don't show FAB on certain pages
  const hiddenPaths = ['/journal/new', '/journal/new-flow', '/welcome'];
  const shouldHide = hiddenPaths.some(path => location.pathname.startsWith(path));
  
  if (shouldHide) return null;

  return (
    <Button
      onClick={() => navigate('/journal/new-flow')}
      className={cn(
        "fixed bottom-20 right-6 z-40 h-14 w-14 rounded-full shadow-lg",
        "bg-primary text-primary-foreground hover:bg-primary/90",
        "transition-all duration-300 hover:scale-110 active:scale-95",
        "md:bottom-6"
      )}
      size="icon"
    >
      <Plus size={24} strokeWidth={2.5} />
    </Button>
  );
};

export default FloatingActionButton;

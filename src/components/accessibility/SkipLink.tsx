
import React from 'react';
import { Button } from '@/components/ui/button';

const SkipLink: React.FC = () => {
  const handleSkipToMain = () => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Button
      onClick={handleSkipToMain}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-primary text-primary-foreground"
      aria-label="Skip to main content"
    >
      Skip to main content
    </Button>
  );
};

export default SkipLink;

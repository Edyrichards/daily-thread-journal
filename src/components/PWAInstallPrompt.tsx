
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

interface PWAInstallPromptProps {
  onDismiss: () => void;
}

const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ onDismiss }) => {
  const { installApp, isOnline } = usePWA();

  return (
    <Card className="fixed bottom-4 right-4 max-w-sm z-50 shadow-lg rounded-2xl">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-sm font-serif flex items-center">
            <Smartphone className="mr-2" size={16} />
            Install App
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onDismiss} className="p-1 h-auto">
            <X size={14} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-xs text-muted-foreground mb-3">
          Install Threads of Grace for a better experience with offline access and notifications.
        </p>
        <div className="flex gap-2">
          <Button 
            onClick={installApp} 
            size="sm" 
            className="flex-1 rounded-xl text-xs"
          >
            <Download size={12} className="mr-1" />
            Install
          </Button>
          <Button 
            variant="outline" 
            onClick={onDismiss} 
            size="sm" 
            className="rounded-xl text-xs"
          >
            Later
          </Button>
        </div>
        {!isOnline && (
          <p className="text-xs text-orange-600 mt-2">
            You're offline. Some features may be limited.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default PWAInstallPrompt;

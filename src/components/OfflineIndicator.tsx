
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { WifiOff, Wifi } from 'lucide-react';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';

const OfflineIndicator: React.FC = () => {
  const { isOnline, isOffline, since } = useOfflineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <Badge variant="destructive" className="flex items-center space-x-2">
        <WifiOff size={16} />
        <span>Offline Mode</span>
      </Badge>
    </div>
  );
};

export default OfflineIndicator;

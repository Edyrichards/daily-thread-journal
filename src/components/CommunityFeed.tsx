
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getPrayerRequests, incrementPrayedCount, PrayerRequest, PrayerComment } from '@/lib/storage';
import PrayerRequestCard from './PrayerRequestCard';

interface CommunityFeedProps {
  filter?: 'all' | 'recent' | 'most-prayed';
}

const CommunityFeed: React.FC<CommunityFeedProps> = ({ filter = 'all' }) => {
  const [requests, setRequests] = useState<PrayerRequest[]>([]);
  const [prayedRequests, setPrayedRequests] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    loadRequests();
  }, [filter]);

  const loadRequests = () => {
    let allRequests = getPrayerRequests();
    
    // Apply filters
    switch (filter) {
      case 'recent':
        allRequests = allRequests.filter(req => 
          Date.now() - req.createdAt < 24 * 60 * 60 * 1000
        );
        break;
      case 'most-prayed':
        allRequests = allRequests.sort((a, b) => b.prayedCount - a.prayedCount);
        break;
      default:
        break;
    }
    
    setRequests(allRequests);
  };

  const handlePray = (requestId: string) => {
    if (prayedRequests.has(requestId)) {
      toast({
        title: "Already Prayed",
        description: "You've already joined in prayer for this request today.",
      });
      return;
    }

    const updatedRequest = incrementPrayedCount(requestId);
    if (updatedRequest) {
      setRequests(prev => 
        prev.map(req => req.id === requestId ? updatedRequest : req)
      );
      setPrayedRequests(prev => new Set([...prev, requestId]));
      
      toast({
        title: "Prayer Counted",
        description: "Thank you for joining in prayer! 🙏",
      });
    }
  };

  const handleCommentAdded = (requestId: string, comment: PrayerComment) => {
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, comments: [...req.comments, comment] }
          : req
      )
    );
  };

  if (requests.length === 0) {
    return (
      <Card className="text-center p-8">
        <CardContent>
          <User className="mx-auto mb-4 text-muted-foreground" size={48} />
          <p className="text-muted-foreground">
            {filter === 'recent' ? 'No recent prayer requests.' : 'No prayer requests yet.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <PrayerRequestCard
          key={request.id}
          request={request}
          onPrayClicked={handlePray}
          onCommentAdded={handleCommentAdded}
        />
      ))}
    </div>
  );
};

export default CommunityFeed;

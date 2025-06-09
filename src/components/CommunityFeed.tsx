
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share2, Clock, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getPrayerRequests, incrementPrayedCount, PrayerRequest } from '@/lib/storage';
import { format, formatDistanceToNow } from 'date-fns';

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
          Date.now() - req.createdAt < 24 * 60 * 60 * 1000 // Last 24 hours
        );
        break;
      case 'most-prayed':
        allRequests = allRequests.sort((a, b) => b.prayedCount - a.prayedCount);
        break;
      default:
        // 'all' - no additional filtering needed
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

  const handleShare = (request: PrayerRequest) => {
    if (navigator.share) {
      navigator.share({
        title: 'Prayer Request',
        text: request.text,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(request.text);
      toast({
        title: "Copied to Clipboard",
        description: "Prayer request copied to share with others.",
      });
    }
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
        <Card key={request.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs">
                    {request.isAnonymous ? '🙏' : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">
                    {request.isAnonymous ? 'Anonymous' : 'Community Member'}
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock size={12} className="mr-1" />
                    {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                  </div>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                Prayer Request
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-foreground leading-relaxed">{request.text}</p>
            
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePray(request.id)}
                  className={`flex items-center space-x-1 ${
                    prayedRequests.has(request.id) ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <Heart 
                    size={16} 
                    className={prayedRequests.has(request.id) ? 'fill-current' : ''} 
                  />
                  <span>{request.prayedCount}</span>
                </Button>
                
                <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                  <MessageCircle size={16} />
                  <span>{request.comments.length}</span>
                </Button>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare(request)}
                className="flex items-center space-x-1"
              >
                <Share2 size={16} />
                <span>Share</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CommunityFeed;

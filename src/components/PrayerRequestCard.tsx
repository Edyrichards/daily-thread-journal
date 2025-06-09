
import React, { memo, useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PrayerRequest, PrayerComment } from '@/lib/storage';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Heart, MessageCircle, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import CommentSection from './CommentSection';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface PrayerRequestCardProps {
  request: PrayerRequest;
  onPrayClicked: (requestId: string) => void;
  onCommentAdded?: (requestId: string, comment: PrayerComment) => void;
  className?: string;
}

const PrayerRequestCard: React.FC<PrayerRequestCardProps> = ({ 
  request, 
  onPrayClicked, 
  onCommentAdded,
  className 
}) => {
  const [showComments, setShowComments] = useState(false);

  const handleCommentAdded = (comment: PrayerComment) => {
    onCommentAdded?.(request.id, comment);
  };

  return (
    <Card className={cn("rounded-2xl shadow-md bg-card", className)}>
      <CardContent className="p-6">
        <div className="flex justify-between items-center text-xs text-muted-foreground mb-2">
          <span>
            {format(new Date(request.createdAt), "MMMM d, yyyy 'at' h:mm a")}
          </span>
          {request.isAnonymous && (
            <span className="italic">Anonymous</span>
          )}
        </div>
        <p className="text-foreground mb-4 whitespace-pre-wrap">
          {request.text}
        </p>
      </CardContent>
      
      <CardFooter className="p-6 pt-0 flex justify-between items-center">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <span className="flex items-center">
            <Heart size={16} className="mr-1 fill-rose-500 text-rose-500" /> 
            {request.prayedCount}
          </span>
          <Collapsible open={showComments} onOpenChange={setShowComments}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center space-x-1 p-0">
                <MessageCircle size={16} className="mr-1" /> 
                <span>{request.comments.length}</span>
                {showComments ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        </div>
        <Button 
          variant="outline" 
          onClick={() => onPrayClicked(request.id)} 
          className="rounded-xl"
        >
          <Sparkles size={16} className="mr-2" /> Pray
        </Button>
      </CardFooter>

      <Collapsible open={showComments} onOpenChange={setShowComments}>
        <CollapsibleContent className="px-6 pb-6">
          <CommentSection
            requestId={request.id}
            comments={request.comments}
            onCommentAdded={handleCommentAdded}
          />
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default memo(PrayerRequestCard);

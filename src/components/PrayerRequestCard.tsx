import React, { memo } from 'react'; // Added memo
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PrayerRequest, PrayerComment } from '@/lib/storage'; // PrayerComment might be implicitly available via PrayerRequest, but explicit is fine.
import { format, formatDistanceToNow } from 'date-fns'; // Added formatDistanceToNow
import { cn } from '@/lib/utils';
import { Heart, MessageCircle, Sparkles } from 'lucide-react';

interface PrayerRequestCardProps {
  request: PrayerRequest;
  onPrayClicked: (requestId: string) => void;
  onViewCommentsClicked: (requestId: string) => void; // Kept for future use
  className?: string;
}

const PrayerRequestCard: React.FC<PrayerRequestCardProps> = ({ 
  request, 
  onPrayClicked, 
  onViewCommentsClicked, 
  className 
}) => {
  return (
    <Card className={cn("rounded-2xl shadow-md bg-card", className)}>
      <CardContent className="p-6"> {/* Using p-6 for a bit more space */}
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

        {/* Display latest comments */}
        {request.comments && request.comments.length > 0 && (
          <div className="mt-4 pt-3 border-t border-border/50">
            <h4 className="text-xs font-semibold text-muted-foreground mb-1.5">
              Recent Activity:
            </h4>
            <div className="space-y-2">
              {request.comments.slice(-2).reverse().map((comment: PrayerComment) => (
                <div key={comment.id} className="bg-muted/60 p-2.5 rounded-lg shadow-sm">
                  <p className="text-sm text-foreground mb-0.5">{comment.text}</p>
                  <p className="text-xs text-muted-foreground text-right">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </p>
                </div>
              ))}
              {request.comments.length > 2 && (
                <p 
                  className="text-xs text-primary hover:underline cursor-pointer text-center mt-1.5"
                  onClick={() => onViewCommentsClicked(request.id)} // Re-using existing prop for future
                >
                  View all {request.comments.length} comments
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-6 pt-0 flex justify-between items-center">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <span className="flex items-center">
            <Heart size={16} className="mr-1 fill-rose-500 text-rose-500" /> 
            {request.prayedCount}
          </span>
          <span className="flex items-center">
            <MessageCircle size={16} className="mr-1" /> 
            {request.comments.length}
          </span>
        </div>
        <Button 
          variant="outline" 
          onClick={() => onPrayClicked(request.id)} 
          className="rounded-xl"
        >
          <Sparkles size={16} className="mr-2" /> Pray
        </Button>
      </CardFooter>
    </Card>
  );
};

export default memo(PrayerRequestCard); // Wrapped with memo

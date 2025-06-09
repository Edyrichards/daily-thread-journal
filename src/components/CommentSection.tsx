
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Send } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { PrayerComment, addCommentToPrayerRequest } from '@/lib/storage';

interface CommentSectionProps {
  requestId: string;
  comments: PrayerComment[];
  onCommentAdded: (comment: PrayerComment) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({ 
  requestId, 
  comments, 
  onCommentAdded 
}) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const updatedRequest = addCommentToPrayerRequest(requestId, newComment);
      if (updatedRequest) {
        const latestComment = updatedRequest.comments[updatedRequest.comments.length - 1];
        onCommentAdded(latestComment);
        setNewComment('');
        toast({
          title: "Comment Added",
          description: "Your encouragement has been shared.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 text-sm font-medium text-muted-foreground">
        <MessageCircle size={16} />
        <span>{comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}</span>
      </div>

      {comments.length > 0 && (
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {comments.map((comment) => (
            <Card key={comment.id} className="border-l-4 border-l-primary/20">
              <CardContent className="p-3">
                <div className="flex items-start space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs">🤍</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{comment.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="space-y-3">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share words of encouragement..."
          className="resize-none border-border/50 focus:border-primary"
          rows={3}
        />
        <div className="flex justify-end">
          <Button
            onClick={handleSubmitComment}
            disabled={!newComment.trim() || isSubmitting}
            size="sm"
            className="bg-primary hover:bg-primary/90"
          >
            <Send size={14} className="mr-2" />
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;

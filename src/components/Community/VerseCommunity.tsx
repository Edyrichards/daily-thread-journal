
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Share2, MessageCircle, Heart, BookOpen } from 'lucide-react';
import { type BibleVerse } from '@/lib/bibleApi';
import { useToast } from '@/hooks/use-toast';

interface VersePost {
  id: string;
  verse: BibleVerse;
  reflection: string;
  author: string;
  timestamp: Date;
  likes: number;
  comments: number;
}

interface VerseCommunityProps {
  onShareVerse?: (verse: BibleVerse, reflection: string) => void;
}

const VerseCommunity: React.FC<VerseCommunityProps> = ({ onShareVerse }) => {
  const [reflection, setReflection] = useState('');
  const { toast } = useToast();

  // Sample verse posts for demonstration
  const [versePosts] = useState<VersePost[]>([
    {
      id: '1',
      verse: {
        id: 'john-3-16',
        book: 'John',
        chapter: 3,
        verse: 16,
        text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
        translation: 'NIV',
        reference: 'John 3:16'
      },
      reflection: 'This verse reminds me daily of God\'s incredible love. Even in difficult times, I find comfort knowing that His love is unconditional.',
      author: 'Sarah M.',
      timestamp: new Date(),
      likes: 12,
      comments: 3
    }
  ]);

  const handleLike = (postId: string) => {
    toast({
      title: "Liked!",
      description: "You liked this verse reflection."
    });
  };

  const handleComment = (postId: string) => {
    toast({
      title: "Comment feature",
      description: "Comment functionality coming soon!"
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 size={20} />
            Share a Verse
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Share your reflection on a verse with the community..."
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            rows={3}
          />
          <Button className="w-full" disabled={!reflection.trim()}>
            <BookOpen size={16} className="mr-2" />
            Share Verse Reflection
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-serif">Community Verse Reflections</h3>
        {versePosts.map((post) => (
          <Card key={post.id}>
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>{post.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">{post.author}</span>
                    <span className="text-xs text-muted-foreground">
                      {post.timestamp.toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{post.verse.reference}</Badge>
                      <Badge variant="secondary">{post.verse.translation}</Badge>
                    </div>
                    <p className="text-sm italic mb-2">"{post.verse.text}"</p>
                  </div>
                  
                  <p className="text-sm leading-relaxed">{post.reflection}</p>
                  
                  <div className="flex items-center space-x-4 pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(post.id)}
                      className="text-xs"
                    >
                      <Heart size={14} className="mr-1" />
                      {post.likes}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleComment(post.id)}
                      className="text-xs"
                    >
                      <MessageCircle size={14} className="mr-1" />
                      {post.comments}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VerseCommunity;


import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Bookmark, Share2, Volume2, Plus } from 'lucide-react';
import { type BibleVerse } from '@/lib/bibleApi';
import { motion } from 'framer-motion';

interface VerseDisplayProps {
  verse: BibleVerse;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onShare: () => void;
  onSpeak: () => void;
  onAddToJournal?: () => void;
}

const VerseDisplay: React.FC<VerseDisplayProps> = ({
  verse,
  isBookmarked,
  onToggleBookmark,
  onShare,
  onSpeak,
  onAddToJournal
}) => {
  return (
    <motion.div
      key={verse.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gradient-to-br from-grace-100 to-lightBeige border-grace-200">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-serif text-foreground">
                {verse.reference}
              </h2>
              <Badge variant="outline" className="text-xs">
                {verse.translation}
              </Badge>
            </div>
            
            <blockquote className="text-lg md:text-xl font-serif text-foreground leading-relaxed italic">
              "{verse.text}"
            </blockquote>
            
            <Separator className="my-6" />
            
            <div className="flex flex-wrap justify-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleBookmark}
              >
                <Bookmark 
                  size={16} 
                  className={isBookmarked ? 'fill-current' : ''} 
                />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onShare}
              >
                <Share2 size={16} />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onSpeak}
              >
                <Volume2 size={16} />
              </Button>
              
              {onAddToJournal && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onAddToJournal}
                >
                  <Plus size={16} />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default VerseDisplay;

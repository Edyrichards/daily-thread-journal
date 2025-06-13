
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Heart } from 'lucide-react';
import { type BibleVerse } from '@/lib/bibleApi';

interface BookmarkedVersesProps {
  bookmarkedVerses: BibleVerse[];
  onVerseSelect: (reference: string) => void;
}

const BookmarkedVerses: React.FC<BookmarkedVersesProps> = ({
  bookmarkedVerses,
  onVerseSelect
}) => {
  if (bookmarkedVerses.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Heart size={20} />
          <span>Bookmarked Verses</span>
          <Badge variant="outline">{bookmarkedVerses.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-32">
          <div className="space-y-2">
            {bookmarkedVerses.map((verse) => (
              <div
                key={verse.id}
                className="flex items-center justify-between p-2 bg-muted/30 rounded cursor-pointer hover:bg-muted/50"
                onClick={() => onVerseSelect(verse.reference)}
              >
                <span className="text-sm font-medium">{verse.reference}</span>
                <Badge variant="outline" className="text-xs">
                  {verse.translation}
                </Badge>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default BookmarkedVerses;

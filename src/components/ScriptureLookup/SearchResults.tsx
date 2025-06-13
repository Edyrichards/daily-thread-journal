
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { type BibleVerse } from '@/lib/bibleApi';

interface SearchResultsProps {
  searchResults: BibleVerse[];
  selectedVerse: BibleVerse | null;
  onVerseSelect: (verse: BibleVerse) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  searchResults,
  selectedVerse,
  onVerseSelect
}) => {
  if (searchResults.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Search Results</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-3">
            {searchResults.map((verse, index) => (
              <div
                key={`${verse.id}-${index}`}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedVerse?.id === verse.id
                    ? 'bg-primary/10 border-primary'
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => onVerseSelect(verse)}
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">{verse.reference}</Badge>
                  <Badge variant="secondary">{verse.translation}</Badge>
                </div>
                <p className="text-sm leading-relaxed">{verse.text}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default SearchResults;


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Plus, Search } from 'lucide-react';
import { bibleApi, type BibleVerse } from '@/lib/bibleApi';
import { useToast } from '@/hooks/use-toast';

interface VerseSelectorProps {
  onVerseSelect: (verse: BibleVerse) => void;
  selectedVerse?: BibleVerse | null;
}

const VerseSelector: React.FC<VerseSelectorProps> = ({ onVerseSelect, selectedVerse }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<BibleVerse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const verse = await bibleApi.getVerse(searchQuery);
      if (verse) {
        setSearchResults([verse]);
      } else {
        const verses = await bibleApi.searchVerses(searchQuery);
        setSearchResults(verses);
      }
    } catch (error) {
      toast({
        title: "Search failed",
        description: "Unable to find verses. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerseSelect = (verse: BibleVerse) => {
    onVerseSelect(verse);
    toast({
      title: "Verse added",
      description: `${verse.reference} added to your journal entry.`
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <BookOpen size={20} />
          Add Scripture
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Search for a verse (e.g., John 3:16)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={isLoading}>
            <Search size={16} />
          </Button>
        </div>

        {selectedVerse && (
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline">{selectedVerse.reference}</Badge>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onVerseSelect(null as any)}
              >
                Remove
              </Button>
            </div>
            <p className="text-sm italic">{selectedVerse.text}</p>
          </div>
        )}

        {searchResults.length > 0 && !selectedVerse && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {searchResults.map((verse, index) => (
              <div
                key={`${verse.id}-${index}`}
                className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
                onClick={() => handleVerseSelect(verse)}
              >
                <div className="flex items-center justify-between mb-1">
                  <Badge variant="outline" className="text-xs">{verse.reference}</Badge>
                  <Button size="sm" variant="ghost">
                    <Plus size={14} />
                  </Button>
                </div>
                <p className="text-sm">{verse.text}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VerseSelector;

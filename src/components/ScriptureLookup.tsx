
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Search, Bookmark, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ScriptureLookupProps {
  onAddToEntry?: (verse: { text: string; reference: string }) => void;
}

interface Verse {
  text: string;
  reference: string;
  translation: string;
}

const translations = [
  { value: 'NIV', label: 'NIV' },
  { value: 'ESV', label: 'ESV' },
  { value: 'NLT', label: 'NLT' },
  { value: 'KJV', label: 'KJV' }
];

const ScriptureLookup: React.FC<ScriptureLookupProps> = ({ onAddToEntry }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTranslation, setSelectedTranslation] = useState('NIV');
  const [searchResults, setSearchResults] = useState<Verse[]>([]);
  const [bookmarkedVerses, setBookmarkedVerses] = useState<Verse[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      // Simulate API call - in real implementation, this would call Bible API
      const mockResults: Verse[] = [
        {
          text: "For I know the plans I have for you, declares the LORD, plans to prosper you and not to harm you, plans to give you hope and a future.",
          reference: "Jeremiah 29:11",
          translation: selectedTranslation
        },
        {
          text: "Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
          reference: "Proverbs 3:5-6",
          translation: selectedTranslation
        }
      ];
      
      setSearchResults(mockResults);
    } catch (error) {
      toast({
        title: "Search Error",
        description: "Failed to search verses. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const bookmarkVerse = (verse: Verse) => {
    const isAlreadyBookmarked = bookmarkedVerses.some(
      v => v.reference === verse.reference && v.translation === verse.translation
    );
    
    if (isAlreadyBookmarked) {
      setBookmarkedVerses(bookmarkedVerses.filter(
        v => !(v.reference === verse.reference && v.translation === verse.translation)
      ));
      toast({
        title: "Bookmark Removed",
        description: `${verse.reference} removed from bookmarks.`,
      });
    } else {
      setBookmarkedVerses([...bookmarkedVerses, verse]);
      toast({
        title: "Verse Bookmarked",
        description: `${verse.reference} added to bookmarks.`,
      });
    }
  };

  const addToEntry = (verse: Verse) => {
    if (onAddToEntry) {
      onAddToEntry({ text: verse.text, reference: `${verse.reference} (${verse.translation})` });
      toast({
        title: "Verse Added",
        description: "Scripture added to your journal entry.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen size={20} />
            <span>Scripture Lookup</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Search for a verse (e.g., John 3:16, love, hope)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Select value={selectedTranslation} onValueChange={setSelectedTranslation}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {translations.map((translation) => (
                  <SelectItem key={translation.value} value={translation.value}>
                    {translation.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} disabled={isSearching}>
              <Search size={16} />
            </Button>
          </div>

          {searchResults.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium">Search Results</h3>
              {searchResults.map((verse, index) => (
                <Card key={index} className="bg-muted/30">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <blockquote className="text-sm italic leading-relaxed">
                        "{verse.text}"
                      </blockquote>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <cite className="text-sm font-medium">{verse.reference}</cite>
                          <Badge variant="outline" className="text-xs">
                            {verse.translation}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => bookmarkVerse(verse)}
                          >
                            <Bookmark size={14} />
                          </Button>
                          {onAddToEntry && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => addToEntry(verse)}
                            >
                              <Plus size={14} />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {bookmarkedVerses.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium">Bookmarked Verses</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {bookmarkedVerses.map((verse, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted/20 rounded">
                    <span className="text-sm">{verse.reference} ({verse.translation})</span>
                    <div className="flex items-center space-x-1">
                      {onAddToEntry && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => addToEntry(verse)}
                        >
                          <Plus size={12} />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => bookmarkVerse(verse)}
                      >
                        <Bookmark size={12} className="fill-current" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ScriptureLookup;

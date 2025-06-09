
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Search, Bookmark, Plus, Heart } from 'lucide-react';
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

// Sample verses database - in real app this would come from Bible API
const verseDatabase: Record<string, Verse[]> = {
  'john 3:16': [
    {
      text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
      reference: "John 3:16",
      translation: "NIV"
    },
    {
      text: "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.",
      reference: "John 3:16",
      translation: "ESV"
    }
  ],
  'jeremiah 29:11': [
    {
      text: "For I know the plans I have for you, declares the LORD, plans to prosper you and not to harm you, plans to give you hope and a future.",
      reference: "Jeremiah 29:11",
      translation: "NIV"
    }
  ],
  'proverbs 3:5-6': [
    {
      text: "Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
      reference: "Proverbs 3:5-6",
      translation: "NIV"
    }
  ],
  'love': [
    {
      text: "Above all else, guard your heart, for everything you do flows from it.",
      reference: "Proverbs 4:23",
      translation: "NIV"
    },
    {
      text: "Love is patient, love is kind. It does not envy, it does not boast, it is not proud.",
      reference: "1 Corinthians 13:4",
      translation: "NIV"
    }
  ],
  'hope': [
    {
      text: "But those who hope in the LORD will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.",
      reference: "Isaiah 40:31",
      translation: "NIV"
    },
    {
      text: "May the God of hope fill you with all joy and peace as you trust in him, so that you may overflow with hope by the power of the Holy Spirit.",
      reference: "Romans 15:13",
      translation: "NIV"
    }
  ],
  'peace': [
    {
      text: "Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.",
      reference: "John 14:27",
      translation: "NIV"
    },
    {
      text: "And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.",
      reference: "Philippians 4:7",
      translation: "NIV"
    }
  ]
};

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
    
    // Simulate API delay
    setTimeout(() => {
      const query = searchQuery.toLowerCase();
      let results: Verse[] = [];
      
      // Search in verse database
      Object.entries(verseDatabase).forEach(([key, verses]) => {
        if (key.includes(query) || verses.some(v => v.text.toLowerCase().includes(query))) {
          results.push(...verses.filter(v => v.translation === selectedTranslation));
        }
      });
      
      // If no results, provide some default encouraging verses
      if (results.length === 0) {
        results = [
          {
            text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
            reference: "Romans 8:28",
            translation: selectedTranslation
          }
        ];
      }
      
      setSearchResults(results);
      setIsSearching(false);
    }, 500);
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

          {/* Quick Search Buttons */}
          <div className="flex flex-wrap gap-2">
            {['love', 'hope', 'peace', 'john 3:16', 'jeremiah 29:11'].map((term) => (
              <Button
                key={term}
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery(term);
                  setTimeout(handleSearch, 100);
                }}
              >
                {term}
              </Button>
            ))}
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
                            <Bookmark 
                              size={14} 
                              className={bookmarkedVerses.some(v => v.reference === verse.reference) ? 'fill-current' : ''} 
                            />
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
              <h3 className="font-medium flex items-center space-x-2">
                <Heart size={16} />
                <span>Bookmarked Verses</span>
              </h3>
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

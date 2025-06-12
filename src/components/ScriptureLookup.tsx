
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, BookOpen, Heart, Share2, Volume2, Eye } from 'lucide-react';
import { bibleApi, BIBLE_TRANSLATIONS, BIBLE_BOOKS, getVerseExplanation, type BibleVerse } from '@/lib/bibleApi';
import { useToast } from '@/hooks/use-toast';

const ScriptureLookup = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTranslation, setSelectedTranslation] = useState('NIV');
  const [searchResults, setSearchResults] = useState<BibleVerse[]>([]);
  const [selectedVerse, setSelectedVerse] = useState<BibleVerse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchType, setSearchType] = useState<'reference' | 'keyword'>('reference');
  const [showExplanation, setShowExplanation] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      if (searchType === 'reference') {
        const verse = await bibleApi.getVerse(searchQuery, selectedTranslation);
        if (verse) {
          setSearchResults([verse]);
          setSelectedVerse(verse);
        } else {
          setSearchResults([]);
          toast({
            title: "Verse not found",
            description: "Please check your reference format (e.g., John 3:16)",
            variant: "destructive"
          });
        }
      } else {
        const verses = await bibleApi.searchVerses(searchQuery, selectedTranslation);
        setSearchResults(verses);
        setSelectedVerse(verses[0] || null);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search failed",
        description: "Unable to search scripture. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerseSelect = (verse: BibleVerse) => {
    setSelectedVerse(verse);
    setShowExplanation(false);
  };

  const handleShare = async (verse: BibleVerse) => {
    const shareText = `"${verse.text}" - ${verse.reference} (${verse.translation})`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: verse.reference,
          text: shareText
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Copied to clipboard",
        description: "Verse has been copied to your clipboard"
      });
    }
  };

  const handleSpeakVerse = (verse: BibleVerse) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(`${verse.reference}. ${verse.text}`);
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "Not supported",
        description: "Text-to-speech is not supported in your browser",
        variant: "destructive"
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const explanation = selectedVerse ? getVerseExplanation(selectedVerse.reference) : null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search size={20} />
            Scripture Lookup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Select value={searchType} onValueChange={(value: 'reference' | 'keyword') => setSearchType(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reference">Reference</SelectItem>
                <SelectItem value="keyword">Keyword</SelectItem>
              </SelectContent>
            </Select>
            
            <Input
              placeholder={searchType === 'reference' ? "e.g., John 3:16" : "e.g., love, peace, hope"}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            
            <Select value={selectedTranslation} onValueChange={setSelectedTranslation}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BIBLE_TRANSLATIONS.map((translation) => (
                  <SelectItem key={translation.id} value={translation.id}>
                    {translation.abbreviation}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
          </div>

          {searchType === 'reference' && (
            <div className="text-sm text-muted-foreground">
              <p>Enter a Bible reference like "John 3:16" or "Romans 8:28-30"</p>
            </div>
          )}
        </CardContent>
      </Card>

      {searchResults.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-2">
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
                      onClick={() => handleVerseSelect(verse)}
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

          {selectedVerse && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{selectedVerse.reference}</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSpeakVerse(selectedVerse)}
                    >
                      <Volume2 size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleShare(selectedVerse)}
                    >
                      <Share2 size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                    >
                      <Heart size={16} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-lg leading-relaxed font-serif">{selectedVerse.text}</p>
                  <div className="flex items-center justify-between mt-3 text-sm text-muted-foreground">
                    <span>{selectedVerse.reference}</span>
                    <span>{selectedVerse.translation}</span>
                  </div>
                </div>

                {explanation && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant={showExplanation ? "default" : "outline"}
                        onClick={() => setShowExplanation(!showExplanation)}
                      >
                        <Eye size={16} className="mr-2" />
                        {showExplanation ? 'Hide' : 'Show'} Explanation
                      </Button>
                      <Badge className="capitalize">{explanation.difficulty}</Badge>
                    </div>

                    {showExplanation && (
                      <div className="space-y-4 p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold mb-2">Commentary</h4>
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            {explanation.commentary}
                          </p>
                        </div>

                        <Separator />

                        <div>
                          <h4 className="font-semibold mb-2">Historical Context</h4>
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            {explanation.historicalContext}
                          </p>
                        </div>

                        <Separator />

                        <div>
                          <h4 className="font-semibold mb-2">Application</h4>
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            {explanation.application}
                          </p>
                        </div>

                        {explanation.crossReferences.length > 0 && (
                          <>
                            <Separator />
                            <div>
                              <h4 className="font-semibold mb-2">Cross References</h4>
                              <div className="flex flex-wrap gap-2">
                                {explanation.crossReferences.map((ref, index) => (
                                  <Badge key={index} variant="outline" className="cursor-pointer">
                                    {ref}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </>
                        )}

                        {explanation.keywords.length > 0 && (
                          <>
                            <Separator />
                            <div>
                              <h4 className="font-semibold mb-2">Key Themes</h4>
                              <div className="flex flex-wrap gap-2">
                                {explanation.keywords.map((keyword, index) => (
                                  <Badge key={index} variant="secondary">
                                    {keyword}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default ScriptureLookup;

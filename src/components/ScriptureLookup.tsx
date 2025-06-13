
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { bibleApi, getVerseExplanation, type BibleVerse } from '@/lib/bibleApi';
import { useToast } from '@/hooks/use-toast';
import SearchForm from './ScriptureLookup/SearchForm';
import SearchResults from './ScriptureLookup/SearchResults';
import VerseDetails from './ScriptureLookup/VerseDetails';

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
        <CardContent>
          <SearchForm
            searchQuery={searchQuery}
            searchType={searchType}
            selectedTranslation={selectedTranslation}
            isLoading={isLoading}
            onSearchQueryChange={setSearchQuery}
            onSearchTypeChange={setSearchType}
            onTranslationChange={setSelectedTranslation}
            onSearch={handleSearch}
          />
        </CardContent>
      </Card>

      {searchResults.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-2">
          <SearchResults
            searchResults={searchResults}
            selectedVerse={selectedVerse}
            onVerseSelect={handleVerseSelect}
          />

          {selectedVerse && (
            <VerseDetails
              verse={selectedVerse}
              explanation={explanation}
              showExplanation={showExplanation}
              onToggleExplanation={() => setShowExplanation(!showExplanation)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ScriptureLookup;


import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { BIBLE_TRANSLATIONS } from '@/lib/bibleApi';

interface SearchFormProps {
  searchQuery: string;
  searchType: 'reference' | 'keyword';
  selectedTranslation: string;
  isLoading: boolean;
  onSearchQueryChange: (query: string) => void;
  onSearchTypeChange: (type: 'reference' | 'keyword') => void;
  onTranslationChange: (translation: string) => void;
  onSearch: () => void;
}

const SearchForm: React.FC<SearchFormProps> = ({
  searchQuery,
  searchType,
  selectedTranslation,
  isLoading,
  onSearchQueryChange,
  onSearchTypeChange,
  onTranslationChange,
  onSearch
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Select value={searchType} onValueChange={onSearchTypeChange}>
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
          onChange={(e) => onSearchQueryChange(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        
        <Select value={selectedTranslation} onValueChange={onTranslationChange}>
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
        
        <Button onClick={onSearch} disabled={isLoading}>
          {isLoading ? 'Searching...' : <Search size={16} />}
        </Button>
      </div>

      {searchType === 'reference' && (
        <div className="text-sm text-muted-foreground">
          <p>Enter a Bible reference like "John 3:16" or "Romans 8:28-30"</p>
        </div>
      )}
    </div>
  );
};

export default SearchForm;

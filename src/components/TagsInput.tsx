
import React, { useState, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Hash } from 'lucide-react';

interface TagsInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
}

const defaultSuggestions = [
  'prayer', 'gratitude', 'scripture-study', 'worship', 'family', 
  'work', 'struggles', 'growth', 'praise', 'confession', 'guidance',
  'relationships', 'health', 'ministry', 'faith-journey'
];

const TagsInput: React.FC<TagsInputProps> = ({ 
  tags, 
  onTagsChange, 
  suggestions = defaultSuggestions,
  placeholder = "Add tags to organize your entry..."
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const addTag = (tag: string) => {
    const cleanTag = tag.trim().toLowerCase().replace(/\s+/g, '-');
    if (cleanTag && !tags.includes(cleanTag)) {
      onTagsChange([...tags, cleanTag]);
    }
    setInputValue('');
    setShowSuggestions(false);
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (inputValue.trim()) {
        addTag(inputValue);
      }
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const filteredSuggestions = suggestions.filter(
    suggestion => 
      suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
      !tags.includes(suggestion)
  ).slice(0, 6);

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Hash size={16} className="text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">Tags</span>
      </div>
      
      <div className="space-y-2">
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="flex items-center space-x-1 px-2 py-1"
              >
                <span>#{tag}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => removeTag(tag)}
                >
                  <X size={10} />
                </Button>
              </Badge>
            ))}
          </div>
        )}
        
        <div className="relative">
          <Input
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            placeholder={placeholder}
            className="text-sm"
          />
          
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-background border border-border rounded-md shadow-lg z-10 mt-1">
              {filteredSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => addTag(suggestion)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-muted flex items-center space-x-2"
                >
                  <Hash size={12} className="text-muted-foreground" />
                  <span>{suggestion}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TagsInput;

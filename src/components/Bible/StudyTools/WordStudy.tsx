
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BookOpen, Search } from 'lucide-react';

interface WordDefinition {
  word: string;
  strongsNumber: string;
  definition: string;
  etymology: string;
  usage: string[];
  relatedWords: string[];
}

const WordStudy = () => {
  const [searchWord, setSearchWord] = useState('');
  const [wordData, setWordData] = useState<WordDefinition | null>(null);

  // Sample word data for demonstration
  const sampleWords: Record<string, WordDefinition> = {
    'love': {
      word: 'Love (Agape)',
      strongsNumber: 'G26',
      definition: 'Unconditional love; the love of God for humanity and of humanity for God',
      etymology: 'From Greek ἀγάπη (agape), meaning divine love',
      usage: ['1 John 4:8', 'John 3:16', '1 Corinthians 13:4-7'],
      relatedWords: ['phileo', 'eros', 'storge']
    },
    'peace': {
      word: 'Peace (Shalom)',
      strongsNumber: 'H7965',
      definition: 'Completeness, wholeness, health, peace, welfare, safety',
      etymology: 'From Hebrew שָׁלוֹם (shalom), meaning completeness',
      usage: ['Numbers 6:26', 'Isaiah 26:3', 'John 14:27'],
      relatedWords: ['rest', 'harmony', 'tranquility']
    }
  };

  const handleSearch = () => {
    const word = sampleWords[searchWord.toLowerCase()];
    setWordData(word || null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen size={20} />
          Word Study
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter a word to study (e.g., love, peace)"
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch}>
            <Search size={16} />
          </Button>
        </div>

        {wordData && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">{wordData.word}</h3>
              <Badge variant="outline">{wordData.strongsNumber}</Badge>
            </div>

            <div>
              <h4 className="font-medium mb-2">Definition</h4>
              <p className="text-sm text-muted-foreground">{wordData.definition}</p>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-2">Etymology</h4>
              <p className="text-sm text-muted-foreground">{wordData.etymology}</p>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-2">Biblical Usage</h4>
              <div className="flex flex-wrap gap-2">
                {wordData.usage.map((verse, index) => (
                  <Badge key={index} variant="secondary">{verse}</Badge>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-2">Related Words</h4>
              <div className="flex flex-wrap gap-2">
                {wordData.relatedWords.map((word, index) => (
                  <Badge key={index} variant="outline" className="cursor-pointer">
                    {word}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WordStudy;


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowRight, Search } from 'lucide-react';

interface CrossReference {
  reference: string;
  connection: string;
  relevance: 'high' | 'medium' | 'low';
  theme: string;
}

const CrossReferences = () => {
  const [searchVerse, setSearchVerse] = useState('');
  const [references, setReferences] = useState<CrossReference[]>([]);

  // Sample cross-reference data
  const sampleReferences: Record<string, CrossReference[]> = {
    'John 3:16': [
      { reference: 'Romans 5:8', connection: 'God\'s love demonstrated', relevance: 'high', theme: 'Divine Love' },
      { reference: '1 John 4:9', connection: 'God\'s love through His Son', relevance: 'high', theme: 'Divine Love' },
      { reference: 'Romans 6:23', connection: 'Gift of eternal life', relevance: 'high', theme: 'Salvation' },
      { reference: 'Ephesians 2:8-9', connection: 'Salvation by faith', relevance: 'medium', theme: 'Faith' }
    ]
  };

  const handleSearch = () => {
    const refs = sampleReferences[searchVerse] || [];
    setReferences(refs);
  };

  const getRelevanceColor = (relevance: string) => {
    switch (relevance) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRight size={20} />
          Cross References
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter verse reference (e.g., John 3:16)"
            value={searchVerse}
            onChange={(e) => setSearchVerse(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch}>
            <Search size={16} />
          </Button>
        </div>

        {references.length > 0 && (
          <ScrollArea className="h-80">
            <div className="space-y-3">
              {references.map((ref, index) => (
                <Card key={index} className="p-3">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">{ref.reference}</h4>
                    <div className="flex gap-2">
                      <Badge className={getRelevanceColor(ref.relevance)}>
                        {ref.relevance}
                      </Badge>
                      <Badge variant="outline">{ref.theme}</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{ref.connection}</p>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default CrossReferences;

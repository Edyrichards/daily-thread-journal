
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare } from 'lucide-react';

interface CommentaryEntry {
  author: string;
  title: string;
  text: string;
  perspective: string;
}

const Commentary = () => {
  const [selectedVerse, setSelectedVerse] = useState('John 3:16');
  
  // Sample commentary data
  const commentaries: Record<string, CommentaryEntry[]> = {
    'John 3:16': [
      {
        author: 'Matthew Henry',
        title: 'Complete Commentary',
        text: 'Here is love, the love of God to the world of mankind, a lost and guilty world. God so loved the world; so really, so richly. Behold and wonder, that the great God should love such a worthless world!',
        perspective: 'Reformed'
      },
      {
        author: 'John Wesley',
        title: 'Explanatory Notes',
        text: 'God so loved the world - His tender love toward all the children of men! That he gave - In the greatest instance of love that can be conceived.',
        perspective: 'Methodist'
      },
      {
        author: 'Charles Spurgeon',
        title: 'Treasury of David',
        text: 'This is love indeed! Here is love - not that we loved God, but that he loved us. The fountain-head of salvation is the love of God.',
        perspective: 'Baptist'
      }
    ]
  };

  const currentCommentaries = commentaries[selectedVerse] || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare size={20} />
          Commentary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={selectedVerse} onValueChange={setSelectedVerse}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="John 3:16">John 3:16</SelectItem>
            <SelectItem value="Romans 8:28">Romans 8:28</SelectItem>
            <SelectItem value="Philippians 4:13">Philippians 4:13</SelectItem>
          </SelectContent>
        </Select>

        <ScrollArea className="h-96">
          <div className="space-y-4">
            {currentCommentaries.map((commentary, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{commentary.author}</h4>
                  <Badge variant="outline">{commentary.perspective}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{commentary.title}</p>
                <p className="text-sm leading-relaxed">{commentary.text}</p>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default Commentary;

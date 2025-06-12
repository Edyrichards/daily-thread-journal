
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Heart, BookOpen, Send } from 'lucide-react';
import { type BibleVerse } from '@/lib/bibleApi';
import { useToast } from '@/hooks/use-toast';

interface ScripturePrayerProps {
  verse: BibleVerse;
  onPrayerSubmit: (prayer: string, verse: BibleVerse) => void;
}

const ScripturePrayer: React.FC<ScripturePrayerProps> = ({ verse, onPrayerSubmit }) => {
  const [prayer, setPrayer] = useState('');
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!prayer.trim()) return;
    
    onPrayerSubmit(prayer, verse);
    setPrayer('');
    toast({
      title: "Prayer saved",
      description: "Your scripture-based prayer has been recorded."
    });
  };

  const prayerPrompts = [
    `Thank you, Lord, for the truth in ${verse.reference}...`,
    `Help me to apply the wisdom of ${verse.reference} in my life...`,
    `I meditate on ${verse.reference} and pray...`,
    `Lord, as I read ${verse.reference}, I am reminded...`
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart size={20} />
          Pray Through Scripture
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline">{verse.reference}</Badge>
            <BookOpen size={16} className="text-muted-foreground" />
          </div>
          <p className="text-sm italic leading-relaxed">"{verse.text}"</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Prayer Starters:</label>
          <div className="flex flex-wrap gap-2">
            {prayerPrompts.map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setPrayer(prompt)}
                className="text-xs"
              >
                {prompt.split('...')[0]}...
              </Button>
            ))}
          </div>
        </div>

        <Textarea
          placeholder="Write your prayer based on this scripture..."
          value={prayer}
          onChange={(e) => setPrayer(e.target.value)}
          rows={4}
        />

        <Button onClick={handleSubmit} disabled={!prayer.trim()} className="w-full">
          <Send size={16} className="mr-2" />
          Save Prayer
        </Button>
      </CardContent>
    </Card>
  );
};

export default ScripturePrayer;


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BookOpen, 
  Search, 
  Calendar, 
  Heart, 
  Star,
  Clock,
  User,
  Play
} from 'lucide-react';

interface Devotional {
  id: string;
  title: string;
  author: string;
  category: 'daily' | 'seasonal' | 'topical' | 'life-stage';
  duration: string;
  rating: number;
  description: string;
  tags: string[];
  content: string;
  audioAvailable: boolean;
}

const DevotionalLibrary = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDevotional, setSelectedDevotional] = useState<Devotional | null>(null);

  const devotionals: Devotional[] = [
    {
      id: '1',
      title: 'Finding Peace in God\'s Presence',
      author: 'Sarah Johnson',
      category: 'daily',
      duration: '5 min',
      rating: 4.8,
      description: 'Discover how to find true peace through prayer and meditation on God\'s word.',
      tags: ['peace', 'prayer', 'anxiety', 'trust'],
      content: `"Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid." - John 14:27

In our fast-paced world, finding genuine peace can seem impossible. Yet Jesus promises us a peace that surpasses understanding - a peace that doesn't depend on our circumstances.

**Reflection Questions:**
• What situations in your life are causing you to feel anxious or troubled?
• How can you invite God's presence into these areas today?
• What does God's peace look like in practical terms for your life?

**Prayer:**
Lord, thank you for the promise of your peace. Help me to rest in your presence and trust in your perfect plan for my life. When anxiety tries to overwhelm me, remind me of your faithfulness and love. Amen.`,
      audioAvailable: true
    },
    {
      id: '2',
      title: 'Advent: Preparing Our Hearts',
      author: 'Pastor Mark Williams',
      category: 'seasonal',
      duration: '7 min',
      rating: 4.9,
      description: 'A 25-day journey preparing our hearts for the celebration of Christ\'s birth.',
      tags: ['advent', 'christmas', 'preparation', 'hope'],
      content: `"The people walking in darkness have seen a great light; on those living in the land of deep darkness a light has dawned." - Isaiah 9:2

Advent is more than just a countdown to Christmas - it's a season of preparation, anticipation, and hope. In the darkness of winter, we remember that Jesus is the light of the world.

**Today's Focus: Hope**
Hope is not wishful thinking, but confident expectation based on God's promises. Just as the Israelites waited for their Messiah, we wait for Christ's return.

**Advent Practice:**
Light a candle today and spend 5 minutes in silent prayer, asking God to kindle hope in your heart for the year ahead.`,
      audioAvailable: false
    },
    {
      id: '3',
      title: 'Walking Through Grief',
      author: 'Dr. Emily Chen',
      category: 'life-stage',
      duration: '10 min',
      rating: 4.7,
      description: 'Finding God\'s comfort and healing in times of loss and sorrow.',
      tags: ['grief', 'comfort', 'healing', 'loss'],
      content: `"The Lord is close to the brokenhearted and saves those who are crushed in spirit." - Psalm 34:18

Grief is one of life's most difficult journeys, but you don't walk it alone. God meets us in our deepest pain and offers comfort that only He can provide.

**Understanding Grief:**
Grief is not a problem to be solved but a process to be walked through. It's okay to feel angry, confused, or overwhelmed. These emotions are part of the healing journey.

**God's Comfort:**
God doesn't promise to take away all pain immediately, but He promises to be with us through it. His comfort comes in many forms - through His word, through others, and through His abiding presence.

**Gentle Steps Forward:**
• Allow yourself to feel without judgment
• Reach out to trusted friends or counselors
• Find small ways to honor your loved one's memory
• Be patient with yourself and the process`,
      audioAvailable: true
    }
  ];

  const filteredDevotionals = devotionals.filter(devotional => {
    const matchesSearch = devotional.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         devotional.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         devotional.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || devotional.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    const colors = {
      daily: 'bg-blue-100 text-blue-800',
      seasonal: 'bg-green-100 text-green-800',
      topical: 'bg-purple-100 text-purple-800',
      'life-stage': 'bg-orange-100 text-orange-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={12}
        className={i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
      />
    ));
  };

  if (selectedDevotional) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => setSelectedDevotional(null)}>
          ← Back to Library
        </Button>
        
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{selectedDevotional.title}</CardTitle>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1">
                    <User size={16} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{selectedDevotional.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock size={16} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{selectedDevotional.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {renderStars(selectedDevotional.rating)}
                    <span className="text-sm text-muted-foreground">({selectedDevotional.rating})</span>
                  </div>
                </div>
              </div>
              {selectedDevotional.audioAvailable && (
                <Button variant="outline" size="sm">
                  <Play size={16} className="mr-1" />
                  Listen
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <div dangerouslySetInnerHTML={{ 
                __html: selectedDevotional.content.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
              }} />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen size={20} />
            <span>Devotional Library</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search devotionals, authors, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="seasonal">Seasonal</SelectItem>
                <SelectItem value="topical">Topical</SelectItem>
                <SelectItem value="life-stage">Life Stage</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDevotionals.map((devotional) => (
          <Card key={devotional.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <Badge className={getCategoryColor(devotional.category)}>
                  {devotional.category}
                </Badge>
                {devotional.audioAvailable && (
                  <Play size={16} className="text-muted-foreground" />
                )}
              </div>
              <CardTitle className="text-lg">{devotional.title}</CardTitle>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>{devotional.author}</span>
                <span>{devotional.duration}</span>
                <div className="flex items-center space-x-1">
                  {renderStars(devotional.rating)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                {devotional.description}
              </p>
              <div className="flex flex-wrap gap-1 mb-3">
                {devotional.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setSelectedDevotional(devotional)}
              >
                Read Devotional
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DevotionalLibrary;

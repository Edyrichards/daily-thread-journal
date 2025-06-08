
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Hand, Heart, Check, Clock, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PrayerRequest {
  id: string;
  type: 'adoration' | 'confession' | 'thanksgiving' | 'supplication';
  content: string;
  category: 'personal' | 'family' | 'health' | 'ministry' | 'world';
  status: 'praying' | 'answered' | 'waiting';
  dateCreated: number;
  dateAnswered?: number;
  answerDetails?: string;
}

const EnhancedPrayerTracker = () => {
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
  const [activeTab, setActiveTab] = useState('adoration');
  const [newPrayer, setNewPrayer] = useState({
    type: 'adoration' as PrayerRequest['type'],
    content: '',
    category: 'personal' as PrayerRequest['category']
  });
  const { toast } = useToast();

  const actsCategories = {
    adoration: {
      title: 'Adoration',
      icon: <Heart size={16} />,
      description: 'Worship and praise God for who He is',
      prompts: [
        'What attributes of God am I grateful for today?',
        'How has God shown His faithfulness in my life?',
        'What about God\'s character brings me joy?'
      ]
    },
    confession: {
      title: 'Confession',
      icon: <Hand size={16} />,
      description: 'Confess sins and seek forgiveness',
      prompts: [
        'What do I need to confess to God today?',
        'How can I make things right with others?',
        'What habits or thoughts need God\'s healing touch?'
      ]
    },
    thanksgiving: {
      title: 'Thanksgiving',
      icon: <Heart size={16} />,
      description: 'Thank God for His blessings and provision',
      prompts: [
        'What am I most grateful for today?',
        'How has God provided for me this week?',
        'What answered prayers can I celebrate?'
      ]
    },
    supplication: {
      title: 'Supplication',
      icon: <Users size={16} />,
      description: 'Present requests and intercede for others',
      prompts: [
        'Who needs prayer in my life right now?',
        'What situations require God\'s intervention?',
        'How can I pray for my community and world?'
      ]
    }
  };

  const addPrayer = () => {
    if (!newPrayer.content.trim()) {
      toast({
        title: "Prayer Required",
        description: "Please enter your prayer request.",
        variant: "destructive",
      });
      return;
    }

    const prayer: PrayerRequest = {
      id: Date.now().toString(),
      type: newPrayer.type,
      content: newPrayer.content,
      category: newPrayer.category,
      status: 'praying',
      dateCreated: Date.now()
    };

    setPrayers([prayer, ...prayers]);
    setNewPrayer({ ...newPrayer, content: '' });
    
    toast({
      title: "Prayer Added",
      description: "Your prayer has been added to your prayer list.",
    });
  };

  const updatePrayerStatus = (id: string, status: PrayerRequest['status'], answerDetails?: string) => {
    setPrayers(prayers.map(prayer => 
      prayer.id === id 
        ? { 
            ...prayer, 
            status, 
            dateAnswered: status === 'answered' ? Date.now() : undefined,
            answerDetails: answerDetails || undefined
          }
        : prayer
    ));

    if (status === 'answered') {
      toast({
        title: "Praise God!",
        description: "Prayer marked as answered. Thank you, Lord!",
      });
    }
  };

  const getPrayersByType = (type: PrayerRequest['type']) => {
    return prayers.filter(prayer => prayer.type === type);
  };

  const getCategoryColor = (category: PrayerRequest['category']) => {
    const colors = {
      personal: 'bg-blue-100 text-blue-800',
      family: 'bg-green-100 text-green-800',
      health: 'bg-red-100 text-red-800',
      ministry: 'bg-purple-100 text-purple-800',
      world: 'bg-yellow-100 text-yellow-800'
    };
    return colors[category];
  };

  const getStatusColor = (status: PrayerRequest['status']) => {
    const colors = {
      praying: 'bg-orange-100 text-orange-800',
      answered: 'bg-green-100 text-green-800',
      waiting: 'bg-gray-100 text-gray-800'
    };
    return colors[status];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Hand size={20} />
            <span>ACTS Prayer Journal</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              {Object.entries(actsCategories).map(([key, category]) => (
                <TabsTrigger key={key} value={key} className="text-xs">
                  <div className="flex items-center space-x-1">
                    {category.icon}
                    <span className="hidden sm:inline">{category.title}</span>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(actsCategories).map(([key, category]) => (
              <TabsContent key={key} value={key} className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">{category.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Reflection prompts:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {category.prompts.map((prompt, index) => (
                        <li key={index}>• {prompt}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <Select 
                      value={newPrayer.category} 
                      onValueChange={(value: any) => setNewPrayer({...newPrayer, category: value})}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="personal">Personal</SelectItem>
                        <SelectItem value="family">Family</SelectItem>
                        <SelectItem value="health">Health</SelectItem>
                        <SelectItem value="ministry">Ministry</SelectItem>
                        <SelectItem value="world">World</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      onClick={() => setNewPrayer({...newPrayer, type: key as PrayerRequest['type']})}
                      className="hidden"
                    />
                  </div>

                  <Textarea
                    placeholder={`Write your ${category.title.toLowerCase()} prayer here...`}
                    value={newPrayer.type === key ? newPrayer.content : ''}
                    onChange={(e) => setNewPrayer({
                      type: key as PrayerRequest['type'],
                      content: e.target.value,
                      category: newPrayer.category
                    })}
                    className="min-h-20"
                  />

                  <Button onClick={addPrayer} className="w-full">
                    Add Prayer
                  </Button>
                </div>

                <div className="space-y-3">
                  {getPrayersByType(key as PrayerRequest['type']).map((prayer) => (
                    <Card key={prayer.id} className="bg-muted/20">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <p className="text-sm leading-relaxed flex-1">{prayer.content}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Badge className={getCategoryColor(prayer.category)}>
                                {prayer.category}
                              </Badge>
                              <Badge className={getStatusColor(prayer.status)}>
                                {prayer.status}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updatePrayerStatus(prayer.id, 'answered')}
                                disabled={prayer.status === 'answered'}
                              >
                                <Check size={14} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updatePrayerStatus(prayer.id, 'waiting')}
                              >
                                <Clock size={14} />
                              </Button>
                            </div>
                          </div>
                          {prayer.dateAnswered && (
                            <p className="text-xs text-muted-foreground">
                              Answered on {new Date(prayer.dateAnswered).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedPrayerTracker;

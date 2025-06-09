
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Share2, Heart, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SharedInsight {
  id: string;
  type: 'verse' | 'reflection' | 'testimony';
  title: string;
  content: string;
  verseReference?: string;
  isAnonymous: boolean;
  tags: string[];
  createdAt: number;
  likes: number;
}

const InsightSharing: React.FC = () => {
  const [insights, setInsights] = useState<SharedInsight[]>([
    {
      id: '1',
      type: 'verse',
      title: 'Finding Peace in Storms',
      content: 'This verse has been my anchor during difficult times. God\'s peace truly surpasses understanding.',
      verseReference: 'Philippians 4:7',
      isAnonymous: false,
      tags: ['peace', 'comfort'],
      createdAt: Date.now() - 86400000,
      likes: 12
    },
    {
      id: '2',
      type: 'testimony',
      title: 'Answered Prayer',
      content: 'After months of prayer for healing, I received wonderful news from my doctor today. God is faithful!',
      isAnonymous: true,
      tags: ['healing', 'answered-prayer'],
      createdAt: Date.now() - 172800000,
      likes: 18
    }
  ]);
  
  const [newInsight, setNewInsight] = useState({
    type: 'reflection' as SharedInsight['type'],
    title: '',
    content: '',
    verseReference: '',
    isAnonymous: true,
    tags: [] as string[]
  });
  
  const [showForm, setShowForm] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newInsight.title.trim() || !newInsight.content.trim()) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in both title and content.",
        variant: "destructive",
      });
      return;
    }

    const insight: SharedInsight = {
      id: Date.now().toString(),
      ...newInsight,
      createdAt: Date.now(),
      likes: 0
    };

    setInsights([insight, ...insights]);
    setNewInsight({
      type: 'reflection',
      title: '',
      content: '',
      verseReference: '',
      isAnonymous: true,
      tags: []
    });
    setTagInput('');
    setShowForm(false);

    toast({
      title: "Insight Shared!",
      description: "Your spiritual insight has been shared with the community.",
    });
  };

  const addTag = () => {
    if (tagInput.trim() && !newInsight.tags.includes(tagInput.trim())) {
      setNewInsight(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewInsight(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleLike = (insightId: string) => {
    setInsights(prev =>
      prev.map(insight =>
        insight.id === insightId
          ? { ...insight, likes: insight.likes + 1 }
          : insight
      )
    );
  };

  const getTypeIcon = (type: SharedInsight['type']) => {
    switch (type) {
      case 'verse': return <BookOpen size={16} />;
      case 'testimony': return <Heart size={16} />;
      default: return <Lightbulb size={16} />;
    }
  };

  const getTypeColor = (type: SharedInsight['type']) => {
    switch (type) {
      case 'verse': return 'bg-blue-100 text-blue-800';
      case 'testimony': return 'bg-green-100 text-green-800';
      default: return 'bg-purple-100 text-purple-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center space-x-2">
              <Share2 size={20} />
              <span>Community Insights</span>
            </CardTitle>
            <Button onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : 'Share Insight'}
            </Button>
          </div>
        </CardHeader>
        
        {showForm && (
          <CardContent className="border-t">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <select
                    id="type"
                    value={newInsight.type}
                    onChange={(e) => setNewInsight(prev => ({ ...prev, type: e.target.value as SharedInsight['type'] }))}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="reflection">Reflection</option>
                    <option value="verse">Favorite Verse</option>
                    <option value="testimony">Testimony</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newInsight.title}
                    onChange={(e) => setNewInsight(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Give your insight a title"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={newInsight.content}
                  onChange={(e) => setNewInsight(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Share your spiritual insight..."
                  rows={4}
                />
              </div>
              
              {newInsight.type === 'verse' && (
                <div>
                  <Label htmlFor="verse">Scripture Reference</Label>
                  <Input
                    id="verse"
                    value={newInsight.verseReference}
                    onChange={(e) => setNewInsight(prev => ({ ...prev, verseReference: e.target.value }))}
                    placeholder="e.g., John 3:16"
                  />
                </div>
              )}
              
              <div>
                <Label>Tags</Label>
                <div className="flex space-x-2 mb-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a tag"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} variant="outline">Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newInsight.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="anonymous"
                  checked={newInsight.isAnonymous}
                  onCheckedChange={(checked) => setNewInsight(prev => ({ ...prev, isAnonymous: checked as boolean }))}
                />
                <Label htmlFor="anonymous">Share anonymously</Label>
              </div>
              
              <Button type="submit" className="w-full">Share Insight</Button>
            </form>
          </CardContent>
        )}
      </Card>

      <div className="space-y-4">
        {insights.map(insight => (
          <Card key={insight.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Badge className={getTypeColor(insight.type)}>
                      {getTypeIcon(insight.type)}
                      <span className="ml-1 capitalize">{insight.type}</span>
                    </Badge>
                    {insight.verseReference && (
                      <Badge variant="outline">{insight.verseReference}</Badge>
                    )}
                  </div>
                  <h3 className="font-semibold">{insight.title}</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(insight.id)}
                  className="flex items-center space-x-1"
                >
                  <Heart size={16} />
                  <span>{insight.likes}</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">{insight.content}</p>
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {insight.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  {insight.isAnonymous ? 'Anonymous' : 'Community Member'}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default InsightSharing;

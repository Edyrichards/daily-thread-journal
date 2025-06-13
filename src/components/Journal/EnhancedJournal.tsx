
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Search, Filter, BookOpen, Heart, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { enhancedStorage } from '@/lib/storage/enhancedStorage';
import { EnhancedJournalEntry } from '@/lib/enhancedStorage';
import VirtualList from '@/components/performance/VirtualList';

const EnhancedJournal = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<EnhancedJournalEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<EnhancedJournalEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    { value: 'all', label: 'All Entries', icon: BookOpen },
    { value: 'devotion', label: 'Devotions', icon: Heart },
    { value: 'prayer', label: 'Prayers', icon: Heart },
    { value: 'gratitude', label: 'Gratitude', icon: Heart },
    { value: 'study', label: 'Bible Study', icon: BookOpen },
    { value: 'general', label: 'General', icon: Lightbulb }
  ];

  useEffect(() => {
    loadEntries();
  }, []);

  useEffect(() => {
    filterEntries();
  }, [entries, searchQuery, selectedCategory]);

  const loadEntries = async () => {
    setIsLoading(true);
    try {
      await enhancedStorage.waitForInitialization();
      const journalEntries = await enhancedStorage.getJournalEntries();
      setEntries(journalEntries);
    } catch (error) {
      console.error('Failed to load journal entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterEntries = () => {
    let filtered = entries;

    if (searchQuery) {
      filtered = filtered.filter(entry =>
        entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(entry => entry.category === selectedCategory);
    }

    setFilteredEntries(filtered);
  };

  const renderEntryCard = (entry: EnhancedJournalEntry, index: number) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      key={entry.id}
    >
      <Card className="mb-4 hover:shadow-lg transition-shadow cursor-pointer" 
            onClick={() => navigate(`/journal/${entry.id}`)}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="outline" className="text-xs">
                  {entry.category}
                </Badge>
                {entry.mood && (
                  <Badge variant="secondary" className="text-xs">
                    {entry.mood}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {new Date(entry.createdAt || 0).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <p>{entry.readingTime} min read</p>
              <p>{entry.wordCount} words</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm line-clamp-3 mb-3">
            {entry.content}
          </p>
          {entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {entry.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
              {entry.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{entry.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif">Enhanced Journal</h1>
          <p className="text-muted-foreground">
            {entries.length} entries • {filteredEntries.length} showing
          </p>
        </div>
        <Button onClick={() => navigate('/journal/new-flow')}>
          New Entry
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search entries, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-6">
            {categories.map(category => {
              const Icon = category.icon;
              return (
                <TabsTrigger key={category.value} value={category.value} className="flex items-center space-x-1">
                  <Icon className="h-3 w-3" />
                  <span className="hidden sm:inline">{category.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>

      {/* Entries List */}
      {filteredEntries.length > 0 ? (
        <VirtualList
          items={filteredEntries}
          itemHeight={200}
          containerHeight={600}
          renderItem={renderEntryCard}
          className="space-y-4"
        />
      ) : (
        <Card className="p-8 text-center">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No entries found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || selectedCategory !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Start your spiritual journey by creating your first entry'
            }
          </p>
          <Button onClick={() => navigate('/journal/new-flow')}>
            Create Entry
          </Button>
        </Card>
      )}
    </div>
  );
};

export default EnhancedJournal;


import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Archive, Unarchive, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { getEnhancedJournalEntries, saveEnhancedJournalEntry, EnhancedJournalEntry } from '@/lib/enhancedStorage';
import { format } from 'date-fns';

interface ArchivedEntry extends EnhancedJournalEntry {
  archivedAt?: number;
  isArchived?: boolean;
}

const EntryArchive: React.FC = () => {
  const { toast } = useToast();
  const [allEntries, setAllEntries] = useState<ArchivedEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<ArchivedEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewFilter, setViewFilter] = useState<'all' | 'active' | 'archived'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'wordCount' | 'category'>('date');

  useEffect(() => {
    loadEntries();
  }, []);

  useEffect(() => {
    filterAndSortEntries();
  }, [allEntries, searchTerm, viewFilter, sortBy]);

  const loadEntries = () => {
    const entries = getEnhancedJournalEntries().map(entry => ({
      ...entry,
      isArchived: entry.isArchived || false,
      archivedAt: entry.archivedAt
    }));
    setAllEntries(entries);
  };

  const filterAndSortEntries = () => {
    let filtered = allEntries;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(entry =>
        entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply view filter
    if (viewFilter === 'active') {
      filtered = filtered.filter(entry => !entry.isArchived);
    } else if (viewFilter === 'archived') {
      filtered = filtered.filter(entry => entry.isArchived);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return (b.lastModified || b.createdAt) - (a.lastModified || a.createdAt);
        case 'wordCount':
          return (b.wordCount || 0) - (a.wordCount || 0);
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    setFilteredEntries(filtered);
  };

  const toggleArchiveStatus = (entryId: string) => {
    const entry = allEntries.find(e => e.id === entryId);
    if (!entry) return;

    const updatedEntry: ArchivedEntry = {
      ...entry,
      isArchived: !entry.isArchived,
      archivedAt: !entry.isArchived ? Date.now() : undefined,
      lastModified: Date.now()
    };

    saveEnhancedJournalEntry(updatedEntry);
    
    setAllEntries(prev => 
      prev.map(e => e.id === entryId ? updatedEntry : e)
    );

    toast({
      title: updatedEntry.isArchived ? "Entry Archived" : "Entry Unarchived",
      description: updatedEntry.isArchived 
        ? "The entry has been moved to your archive." 
        : "The entry has been restored to your active entries.",
    });
  };

  const getStats = () => {
    const active = allEntries.filter(e => !e.isArchived).length;
    const archived = allEntries.filter(e => e.isArchived).length;
    const totalWords = allEntries.reduce((sum, e) => sum + (e.wordCount || 0), 0);
    
    return { active, archived, total: allEntries.length, totalWords };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="font-serif flex items-center">
            <Archive className="mr-2" size={20} />
            Entry Archive Manager
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-primary/5 rounded-xl">
              <div className="text-2xl font-bold text-primary">{stats.active}</div>
              <div className="text-xs text-muted-foreground">Active Entries</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-xl">
              <div className="text-2xl font-bold">{stats.archived}</div>
              <div className="text-xs text-muted-foreground">Archived</div>
            </div>
            <div className="text-center p-3 bg-secondary/50 rounded-xl">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-xs text-muted-foreground">Total Entries</div>
            </div>
            <div className="text-center p-3 bg-accent/50 rounded-xl">
              <div className="text-2xl font-bold">{stats.totalWords.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Total Words</div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Search entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-xl"
              />
            </div>
            <Select value={viewFilter} onValueChange={(value: any) => setViewFilter(value)}>
              <SelectTrigger className="w-full md:w-[150px] rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Entries</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="archived">Archived Only</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-full md:w-[150px] rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Sort by Date</SelectItem>
                <SelectItem value="wordCount">Sort by Length</SelectItem>
                <SelectItem value="category">Sort by Category</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <Card className="rounded-2xl">
            <CardContent className="text-center py-8">
              <Archive className="mx-auto mb-4 text-muted-foreground" size={48} />
              <p className="text-muted-foreground">
                {searchTerm ? 'No entries match your search.' : 'No entries found.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredEntries.map((entry) => (
            <Card key={entry.id} className={`rounded-2xl ${entry.isArchived ? 'bg-muted/50' : ''}`}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-2">
                    <Badge variant={entry.isArchived ? 'secondary' : 'default'}>
                      {entry.category}
                    </Badge>
                    {entry.isArchived && (
                      <Badge variant="outline" className="text-xs">
                        Archived
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(entry.lastModified || entry.createdAt), 'MMM d, yyyy')}
                  </div>
                </div>
                
                <p className="text-sm mb-3 line-clamp-3">
                  {entry.content}
                </p>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span>{entry.wordCount} words</span>
                    <span>{entry.readingTime} min read</span>
                    {entry.tags.length > 0 && (
                      <span>{entry.tags.length} tags</span>
                    )}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleArchiveStatus(entry.id)}
                    className="rounded-xl"
                  >
                    {entry.isArchived ? (
                      <>
                        <Unarchive size={14} className="mr-1" />
                        Unarchive
                      </>
                    ) : (
                      <>
                        <Archive size={14} className="mr-1" />
                        Archive
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default EntryArchive;

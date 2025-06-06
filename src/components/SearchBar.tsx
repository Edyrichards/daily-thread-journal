
import React, { useState, useEffect } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  placeholder?: string;
  className?: string;
}

export interface SearchFilters {
  mood?: string[];
  dateRange?: 'today' | 'week' | 'month' | 'all';
  hasVerses?: boolean;
  hasPrayers?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = "Search your reflections...", 
  className 
}) => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    mood: [],
    dateRange: 'all',
    hasVerses: false,
    hasPrayers: false,
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const moodOptions = ['happy', 'grateful', 'anxious', 'sad', 'hopeful'];
  const dateRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'all', label: 'All Time' },
  ];

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(query, filters);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, filters, onSearch]);

  const handleMoodToggle = (mood: string) => {
    setFilters(prev => ({
      ...prev,
      mood: prev.mood?.includes(mood) 
        ? prev.mood.filter(m => m !== mood)
        : [...(prev.mood || []), mood]
    }));
  };

  const clearFilters = () => {
    setFilters({
      mood: [],
      dateRange: 'all',
      hasVerses: false,
      hasPrayers: false,
    });
  };

  const hasActiveFilters = 
    filters.mood?.length > 0 || 
    filters.dateRange !== 'all' || 
    filters.hasVerses || 
    filters.hasPrayers;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="relative flex items-center space-x-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="pl-10 pr-10 rounded-xl border-border/50 focus:border-primary"
          />
          {query && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setQuery('')}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
            >
              <X size={14} />
            </Button>
          )}
        </div>
        
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="icon"
              className={cn(
                "rounded-xl",
                hasActiveFilters && "border-primary text-primary"
              )}
            >
              <Filter size={16} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Filters</h4>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear all
                  </Button>
                )}
              </div>

              {/* Mood Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Mood</label>
                <div className="flex flex-wrap gap-2">
                  {moodOptions.map((mood) => (
                    <Badge
                      key={mood}
                      variant={filters.mood?.includes(mood) ? "default" : "outline"}
                      className="cursor-pointer capitalize"
                      onClick={() => handleMoodToggle(mood)}
                    >
                      {mood}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Date Range Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Date Range</label>
                <div className="space-y-2">
                  {dateRangeOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        checked={filters.dateRange === option.value}
                        onCheckedChange={() => 
                          setFilters(prev => ({ ...prev, dateRange: option.value as any }))
                        }
                      />
                      <label className="text-sm">{option.label}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Content Type</label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={filters.hasVerses}
                      onCheckedChange={(checked) => 
                        setFilters(prev => ({ ...prev, hasVerses: !!checked }))
                      }
                    />
                    <label className="text-sm">Has Bible Verses</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={filters.hasPrayers}
                      onCheckedChange={(checked) => 
                        setFilters(prev => ({ ...prev, hasPrayers: !!checked }))
                      }
                    />
                    <label className="text-sm">Has Prayers</label>
                  </div>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.mood?.map((mood) => (
            <Badge key={mood} variant="secondary" className="capitalize">
              {mood}
              <X 
                size={12} 
                className="ml-1 cursor-pointer" 
                onClick={() => handleMoodToggle(mood)}
              />
            </Badge>
          ))}
          {filters.dateRange !== 'all' && (
            <Badge variant="secondary">
              {dateRangeOptions.find(opt => opt.value === filters.dateRange)?.label}
            </Badge>
          )}
          {filters.hasVerses && (
            <Badge variant="secondary">Has Verses</Badge>
          )}
          {filters.hasPrayers && (
            <Badge variant="secondary">Has Prayers</Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;


import React, { useState, useEffect } from 'react';
import { Search, X, Filter, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface AdvancedSearchProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  placeholder?: string;
  className?: string;
}

export interface SearchFilters {
  mood?: string[];
  dateRange?: { start: Date; end: Date } | null;
  category?: string[];
  hasVerses?: boolean;
  hasPrayers?: boolean;
  sortBy?: 'date' | 'mood' | 'relevance';
  sortOrder?: 'asc' | 'desc';
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ 
  onSearch, 
  placeholder = "Search your spiritual journey...", 
  className 
}) => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    mood: [],
    dateRange: null,
    category: [],
    hasVerses: false,
    hasPrayers: false,
    sortBy: 'date',
    sortOrder: 'desc',
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const moodOptions = ['joyful', 'peaceful', 'hopeful', 'content', 'neutral', 'anxious', 'sad', 'stressed'];
  const categoryOptions = ['devotion', 'prayer', 'gratitude', 'study', 'general'];

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

  const handleCategoryToggle = (category: string) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category?.includes(category) 
        ? prev.category.filter(c => c !== category)
        : [...(prev.category || []), category]
    }));
  };

  const handleDateRangeSelect = (range: { from: Date; to: Date } | undefined) => {
    if (range?.from && range?.to) {
      setFilters(prev => ({
        ...prev,
        dateRange: { start: range.from, end: range.to }
      }));
    }
  };

  const clearFilters = () => {
    setFilters({
      mood: [],
      dateRange: null,
      category: [],
      hasVerses: false,
      hasPrayers: false,
      sortBy: 'date',
      sortOrder: 'desc',
    });
  };

  const hasActiveFilters = 
    filters.mood?.length > 0 || 
    filters.category?.length > 0 ||
    filters.dateRange || 
    filters.hasVerses || 
    filters.hasPrayers ||
    filters.sortBy !== 'date' ||
    filters.sortOrder !== 'desc';

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
          <PopoverContent className="w-96 p-4" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Advanced Filters</h4>
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

              {/* Category Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <div className="flex flex-wrap gap-2">
                  {categoryOptions.map((category) => (
                    <Badge
                      key={category}
                      variant={filters.category?.includes(category) ? "default" : "outline"}
                      className="cursor-pointer capitalize"
                      onClick={() => handleCategoryToggle(category)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Date Range Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Date Range</label>
                <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <Calendar size={16} className="mr-2" />
                      {filters.dateRange 
                        ? `${format(filters.dateRange.start, 'MMM dd')} - ${format(filters.dateRange.end, 'MMM dd')}`
                        : 'Select date range'
                      }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="range"
                      selected={filters.dateRange ? { from: filters.dateRange.start, to: filters.dateRange.end } : undefined}
                      onSelect={handleDateRangeSelect}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Content Type Filter */}
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

              {/* Sort Options */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm font-medium mb-1 block">Sort By</label>
                  <Select value={filters.sortBy} onValueChange={(value) => 
                    setFilters(prev => ({ ...prev, sortBy: value as any }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="mood">Mood</SelectItem>
                      <SelectItem value="relevance">Relevance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Order</label>
                  <Select value={filters.sortOrder} onValueChange={(value) => 
                    setFilters(prev => ({ ...prev, sortOrder: value as any }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desc">Newest First</SelectItem>
                      <SelectItem value="asc">Oldest First</SelectItem>
                    </SelectContent>
                  </Select>
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
          {filters.category?.map((category) => (
            <Badge key={category} variant="secondary" className="capitalize">
              {category}
              <X 
                size={12} 
                className="ml-1 cursor-pointer" 
                onClick={() => handleCategoryToggle(category)}
              />
            </Badge>
          ))}
          {filters.dateRange && (
            <Badge variant="secondary">
              {format(filters.dateRange.start, 'MMM dd')} - {format(filters.dateRange.end, 'MMM dd')}
              <X 
                size={12} 
                className="ml-1 cursor-pointer" 
                onClick={() => setFilters(prev => ({ ...prev, dateRange: null }))}
              />
            </Badge>
          )}
          {filters.hasVerses && (
            <Badge variant="secondary">
              Has Verses
              <X 
                size={12} 
                className="ml-1 cursor-pointer" 
                onClick={() => setFilters(prev => ({ ...prev, hasVerses: false }))}
              />
            </Badge>
          )}
          {filters.hasPrayers && (
            <Badge variant="secondary">
              Has Prayers
              <X 
                size={12} 
                className="ml-1 cursor-pointer" 
                onClick={() => setFilters(prev => ({ ...prev, hasPrayers: false }))}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;

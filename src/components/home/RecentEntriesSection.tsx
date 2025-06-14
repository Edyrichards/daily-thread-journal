
import React from 'react';
import { JournalEntry } from '@/lib/storage';
import SearchBar, { SearchFilters } from '@/components/SearchBar';
import RecentEntryCard from '@/components/RecentEntryCard';
import SkeletonLoader from '@/components/ui/skeleton-loader';

interface RecentEntriesSectionProps {
  recentEntries: JournalEntry[];
  filteredEntries: JournalEntry[];
  searchQuery: string;
  isLoadingEntries: boolean;
  onSearch: (query: string, filters: SearchFilters) => void;
}

const RecentEntriesSection: React.FC<RecentEntriesSectionProps> = ({
  recentEntries,
  filteredEntries,
  searchQuery,
  isLoadingEntries,
  onSearch
}) => {
  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-serif text-foreground">
          Recent Reflections
        </h2>
        <div className="w-full sm:w-auto sm:max-w-md">
          <SearchBar onSearch={onSearch} />
        </div>
      </div>

      {isLoadingEntries ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card rounded-xl p-4 md:p-6 border">
              <SkeletonLoader variant="card" />
            </div>
          ))}
        </div>
      ) : filteredEntries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredEntries.map((entry) => (
            <RecentEntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      ) : recentEntries.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-xl border">
          <p className="text-muted-foreground text-lg mb-4">
            No journal entries yet. Start your spiritual journey today!
          </p>
        </div>
      ) : (
        <div className="text-center py-8 bg-card rounded-xl border">
          <p className="text-muted-foreground">
            No entries match your search "{searchQuery}"
          </p>
        </div>
      )}
    </section>
  );
};

export default RecentEntriesSection;


import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import SearchBar, { SearchFilters } from '@/components/SearchBar';
import RecentEntryCard from '@/components/RecentEntryCard';
import { JournalEntry } from '@/lib/storage';

interface RecentEntriesSectionProps {
  recentEntries: JournalEntry[];
  filteredEntries: JournalEntry[];
  searchQuery: string;
  isLoadingVerse: boolean;
  onSearch: (query: string, filters: SearchFilters) => void;
}

const RecentEntriesSection: React.FC<RecentEntriesSectionProps> = ({
  recentEntries,
  filteredEntries,
  searchQuery,
  isLoadingVerse,
  onSearch
}) => {
  const navigate = useNavigate();

  return (
    <section className="mt-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif text-foreground mb-4">
          My Reflections
        </h2>
        <p className="text-muted-foreground">
          Your journey of faith and growth
        </p>
      </div>
      
      {recentEntries.length > 0 && (
        <div className="mb-8">
          <SearchBar 
            onSearch={onSearch}
            placeholder="Search your reflections..."
            className="max-w-2xl mx-auto"
          />
        </div>
      )}

      {!isLoadingVerse && filteredEntries.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredEntries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.4 }}
            >
              <RecentEntryCard entry={entry} />
            </motion.div>
          ))}
        </motion.div>
      ) : !isLoadingVerse && recentEntries.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center p-12 bg-gradient-to-br from-grace-100 to-lightBeige rounded-3xl shadow-lg border border-white/50"
        >
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-6">✨</div>
            <h3 className="text-xl font-serif text-foreground mb-4">
              Begin Your Spiritual Journey
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Your reflections, prayers, and moments with God will appear here. 
              Start by sharing what's on your heart today.
            </p>
            <Button 
              onClick={() => navigate("/journal/new-flow")}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-8 py-3"
            >
              Write Your First Reflection
            </Button>
          </div>
        </motion.div>
      ) : searchQuery && filteredEntries.length === 0 ? (
        <div className="text-center p-8 bg-lightBeige/50 rounded-2xl">
          <p className="text-muted-foreground">
            No reflections found matching "{searchQuery}"
          </p>
        </div>
      ) : null}
    </section>
  );
};

export default RecentEntriesSection;

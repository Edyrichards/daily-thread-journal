
import React from 'react';
import { RecentEntryCard } from '@/components/RecentEntryCard';
import type { JournalEntry } from '@/lib/storage';

interface MemoizedRecentEntryCardProps {
  entry: JournalEntry;
}

const MemoizedRecentEntryCard = React.memo<MemoizedRecentEntryCardProps>(({ entry }) => {
  return <RecentEntryCard entry={entry} />;
}, (prevProps, nextProps) => {
  // Custom comparison function for optimization
  return (
    prevProps.entry.id === nextProps.entry.id &&
    prevProps.entry.content === nextProps.entry.content &&
    prevProps.entry.date === nextProps.entry.date &&
    prevProps.entry.mood === nextProps.entry.mood
  );
});

MemoizedRecentEntryCard.displayName = 'MemoizedRecentEntryCard';

export default MemoizedRecentEntryCard;

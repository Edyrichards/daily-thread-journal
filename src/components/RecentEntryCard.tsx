import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { JournalEntry, moodEmojis } from '@/lib/storage';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface RecentEntryCardProps {
  entry: JournalEntry;
  className?: string;
}

const RecentEntryCard: React.FC<RecentEntryCardProps> = ({ entry, className }) => {
  return (
    <Card className={cn("rounded-2xl shadow-md bg-lightBeige", className)}>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-xs text-muted-foreground">
            {/* Ensure entry.createdAt is a valid date string or timestamp */}
            {entry.createdAt ? format(new Date(entry.createdAt), "MMMM d, yyyy") : 'Date not available'}
          </p>
          <span className="text-xl">{moodEmojis[entry.mood]}</span>
        </div>
        <p className="text-sm text-foreground line-clamp-3 mb-3">
          {entry.content}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link 
          to={`/journal/${entry.id}`} 
          className="text-sm text-primary hover:underline hover:text-primary/80 font-semibold"
        >
          Read More &rarr;
        </Link>
      </CardFooter>
    </Card>
  );
};

export default RecentEntryCard;

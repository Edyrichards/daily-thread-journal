
import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { JournalEntry, moodEmojis } from '@/lib/storage';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface RecentEntryCardProps {
  entry: JournalEntry;
  className?: string;
}

const RecentEntryCard: React.FC<RecentEntryCardProps> = ({ entry, className }) => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Card className={cn(
        "rounded-2xl shadow-md bg-lightBeige border border-white/50 hover:shadow-xl transition-all duration-300 group overflow-hidden",
        className
      )}>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-3">
            <p className="text-xs text-muted-foreground font-medium">
              {entry.createdAt ? format(new Date(entry.createdAt), "MMMM d, yyyy") : 'Date not available'}
            </p>
            <motion.span 
              className="text-2xl"
              whileHover={{ scale: 1.2, rotate: 10 }}
              transition={{ duration: 0.2 }}
            >
              {moodEmojis[entry.mood]}
            </motion.span>
          </div>
          <p className="text-sm text-foreground line-clamp-3 mb-4 leading-relaxed">
            {entry.content}
          </p>
        </CardContent>
        <CardFooter className="p-6 pt-0">
          <Link 
            to={`/journal/${entry.id}`} 
            className="flex items-center text-sm text-primary hover:text-primary/80 font-semibold group-hover:translate-x-1 transition-all duration-200"
          >
            <span className="mr-2">Read More</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default memo(RecentEntryCard);

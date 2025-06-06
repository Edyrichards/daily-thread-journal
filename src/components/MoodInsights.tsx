
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Heart, Star, Calendar } from 'lucide-react';
import { getJournalEntries, moodEmojis } from '@/lib/storage';
import { format, subDays, isAfter } from 'date-fns';

const MoodInsights: React.FC = () => {
  const entries = getJournalEntries();
  const recentEntries = entries.filter(entry => 
    entry.createdAt && isAfter(new Date(entry.createdAt), subDays(new Date(), 30))
  );

  // Calculate mood distribution
  const moodCounts = recentEntries.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalEntries = recentEntries.length;
  const dominantMood = Object.entries(moodCounts).reduce((a, b) => 
    moodCounts[a[0]] > moodCounts[b[0]] ? a : b
  )?.[0];

  // Calculate streak
  const sortedEntries = entries
    .filter(entry => entry.createdAt)
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  
  let currentStreak = 0;
  let currentDate = new Date();
  
  for (const entry of sortedEntries) {
    const entryDate = new Date(entry.createdAt || 0);
    const daysDiff = Math.floor((currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff <= currentStreak + 1) {
      currentStreak++;
      currentDate = entryDate;
    } else {
      break;
    }
  }

  if (totalEntries === 0) {
    return (
      <Card className="bg-gradient-to-br from-grace-100 to-lightBeige">
        <CardContent className="p-6 text-center">
          <Heart className="mx-auto mb-4 text-grace-gold" size={32} />
          <p className="text-muted-foreground">Start journaling to see your mood insights!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="bg-gradient-to-br from-grace-100 to-lightBeige">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <TrendingUp size={16} className="mr-2 text-grace-gold" />
            Dominant Mood
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{moodEmojis[dominantMood as keyof typeof moodEmojis]}</span>
            <div>
              <p className="text-lg font-semibold capitalize">{dominantMood}</p>
              <p className="text-sm text-muted-foreground">
                {Math.round((moodCounts[dominantMood] / totalEntries) * 100)}% of entries
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-grace-blue/20 to-grace-200/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Calendar size={16} className="mr-2 text-grace-blue" />
            Journal Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <p className="text-2xl font-bold text-grace-blue">{currentStreak}</p>
            <p className="text-sm text-muted-foreground">
              {currentStreak === 1 ? 'day' : 'days'} in a row
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-soft-peach/30 to-grace-gold/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Star size={16} className="mr-2 text-grace-gold" />
            Total Reflections
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <p className="text-2xl font-bold text-grace-gold">{totalEntries}</p>
            <p className="text-sm text-muted-foreground">this month</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MoodInsights;


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, RefreshCw } from 'lucide-react';
import { getJournalEntries, Mood } from '@/lib/storage';
import { getVerseByMood } from '@/lib/api';
import { motion } from 'framer-motion';

interface VerseRecommendation {
  text: string;
  reference: string;
  reason: string;
}

const PersonalizedVerses: React.FC = () => {
  const [recommendations, setRecommendations] = useState<VerseRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const analyzeUserMoods = (): Mood[] => {
    const entries = getJournalEntries();
    const recentEntries = entries.slice(-10); // Last 10 entries
    
    // Get mood frequency
    const moodCounts = recentEntries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Return top 3 moods
    return Object.entries(moodCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([mood]) => mood as Mood);
  };

  const getMoodReason = (mood: Mood): string => {
    const reasons = {
      joyful: "to celebrate your joy",
      peaceful: "for moments of tranquility",
      hopeful: "to strengthen your hope",
      content: "for grateful reflection",
      neutral: "for balanced perspective",
      anxious: "to calm your worries",
      sad: "for comfort in difficult times",
      stressed: "to find peace in chaos",
      angry: "for patience and understanding",
      overwhelmed: "to find rest and clarity"
    };
    return reasons[mood] || "for spiritual growth";
  };

  const fetchRecommendations = async () => {
    setIsLoading(true);
    try {
      const topMoods = analyzeUserMoods();
      const versePromises = topMoods.map(async (mood) => {
        const verse = await getVerseByMood(mood);
        return {
          ...verse,
          reason: getMoodReason(mood)
        };
      });
      
      const verses = await Promise.all(versePromises);
      setRecommendations(verses);
    } catch (error) {
      console.error('Failed to fetch personalized verses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const nextVerse = () => {
    setCurrentIndex((prev) => (prev + 1) % recommendations.length);
  };

  if (recommendations.length === 0 && !isLoading) {
    return (
      <Card className="bg-gradient-to-br from-grace-100 to-lightBeige">
        <CardContent className="p-6 text-center">
          <Sparkles className="mx-auto mb-4 text-grace-gold" size={32} />
          <p className="text-muted-foreground mb-4">
            Start journaling to get personalized verse recommendations!
          </p>
          <Button onClick={fetchRecommendations} variant="outline">
            Get Recommendations
          </Button>
        </CardContent>
      </Card>
    );
  }

  const currentVerse = recommendations[currentIndex];

  return (
    <Card className="bg-gradient-to-br from-grace-100 to-lightBeige border-grace-gold/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Sparkles size={18} className="mr-2 text-grace-gold" />
            <span className="text-lg font-serif">For You Today</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextVerse}
            disabled={isLoading || recommendations.length <= 1}
            className="h-8 w-8"
          >
            <RefreshCw size={14} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin h-6 w-6 border-2 border-grace-gold border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Finding verses for you...</p>
          </div>
        ) : currentVerse ? (
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <blockquote className="text-lg font-serif italic text-foreground mb-4 leading-relaxed">
              "{currentVerse.text}"
            </blockquote>
            <div className="flex justify-between items-center">
              <cite className="text-sm text-muted-foreground">— {currentVerse.reference}</cite>
              <span className="text-xs text-grace-gold bg-grace-gold/10 px-2 py-1 rounded-full">
                {currentVerse.reason}
              </span>
            </div>
            {recommendations.length > 1 && (
              <div className="flex justify-center mt-4 space-x-1">
                {recommendations.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full transition-colors ${
                      index === currentIndex ? 'bg-grace-gold' : 'bg-grace-gold/30'
                    }`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default PersonalizedVerses;


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { TrendingUp, BookOpen, Heart, Target, Award } from 'lucide-react';
import { getJournalingInsights } from '@/lib/enhancedStorage';
import { motion } from 'framer-motion';

const SpiritualGrowthAnalytics = () => {
  const [insights, setInsights] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = () => {
    try {
      const journalInsights = getJournalingInsights();
      
      // Create growth metrics
      const growthMetrics = {
        consistency: Math.min(100, (journalInsights.currentStreak / 30) * 100),
        depth: Math.min(100, (journalInsights.averageWordsPerEntry / 500) * 100),
        reflection: Math.min(100, (journalInsights.totalEntries / 50) * 100),
        prayer: 75, // This would come from prayer data
        study: 60,  // This would come from Bible study data
        community: 40 // This would come from community engagement
      };

      const radarData = [
        { subject: 'Consistency', A: growthMetrics.consistency, fullMark: 100 },
        { subject: 'Depth', A: growthMetrics.depth, fullMark: 100 },
        { subject: 'Reflection', A: growthMetrics.reflection, fullMark: 100 },
        { subject: 'Prayer', A: growthMetrics.prayer, fullMark: 100 },
        { subject: 'Study', A: growthMetrics.study, fullMark: 100 },
        { subject: 'Community', A: growthMetrics.community, fullMark: 100 }
      ];

      // Weekly progress simulation
      const weeklyProgress = Array.from({ length: 12 }, (_, i) => ({
        week: `Week ${i + 1}`,
        growth: Math.floor(Math.random() * 20) + 60 + (i * 2),
        journal: Math.floor(Math.random() * 5) + 3,
        prayer: Math.floor(Math.random() * 7) + 5
      }));

      setInsights({
        ...journalInsights,
        growthMetrics,
        radarData,
        weeklyProgress,
        spiritualAge: Math.floor(journalInsights.totalEntries / 10) + 1,
        nextMilestone: (Math.floor(journalInsights.totalEntries / 10) + 1) * 10
      });
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getGrowthLevel = (entries: number) => {
    if (entries < 10) return { level: 'Seedling', icon: '🌱', color: 'text-green-500' };
    if (entries < 25) return { level: 'Growing', icon: '🌿', color: 'text-green-600' };
    if (entries < 50) return { level: 'Flourishing', icon: '🌳', color: 'text-green-700' };
    if (entries < 100) return { level: 'Mature', icon: '🌳', color: 'text-green-800' };
    return { level: 'Wise Oak', icon: '🏛️', color: 'text-amber-600' };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const growthLevel = getGrowthLevel(insights.totalEntries || 0);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-serif mb-2">Spiritual Growth Analytics</h2>
        <p className="text-muted-foreground">
          Track your journey of faith and personal growth
        </p>
      </div>

      {/* Growth Level */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-none">
          <CardContent className="p-6">
            <div className="text-4xl mb-2">{growthLevel.icon}</div>
            <h3 className={`text-xl font-serif mb-2 ${growthLevel.color}`}>
              {growthLevel.level}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Spiritual Age: {insights.spiritualAge} • Next milestone: {insights.nextMilestone} entries
            </p>
            <Progress 
              value={((insights.totalEntries || 0) % 10) * 10} 
              className="w-full max-w-md mx-auto"
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{insights.currentStreak || 0}</p>
            <p className="text-sm text-muted-foreground">Day Streak</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{insights.totalWords || 0}</p>
            <p className="text-sm text-muted-foreground">Words Written</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Heart className="h-8 w-8 mx-auto mb-2 text-red-500" />
            <p className="text-2xl font-bold">{insights.averageEntriesPerWeek || 0}</p>
            <p className="text-sm text-muted-foreground">Entries/Week</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold">{insights.mostProductiveDay || 'N/A'}</p>
            <p className="text-sm text-muted-foreground">Best Day</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts */}
      <Tabs defaultValue="growth" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="growth">Growth Radar</TabsTrigger>
          <TabsTrigger value="progress">Weekly Progress</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="growth">
          <Card>
            <CardHeader>
              <CardTitle>Spiritual Growth Areas</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={insights.radarData || []}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar
                    name="Growth"
                    dataKey="A"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>Growth Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={insights.weeklyProgress || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="growth" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {(insights.topTags || []).map(([tag, count]: [string, number]) => (
                    <div key={tag} className="flex justify-between items-center">
                      <Badge variant="outline">#{tag}</Badge>
                      <span className="text-sm text-muted-foreground">{count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(insights.categoryDistribution || {}).map(([category, count]) => (
                    <div key={category} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize">{category}</span>
                        <span>{count as number}</span>
                      </div>
                      <Progress 
                        value={((count as number) / insights.totalEntries) * 100} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5" />
            <span>Recent Achievements</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insights.currentStreak >= 7 && (
              <Badge variant="outline" className="p-3 text-center">
                🔥 Week Warrior - 7 day streak!
              </Badge>
            )}
            {insights.totalEntries >= 10 && (
              <Badge variant="outline" className="p-3 text-center">
                📝 Consistent Writer - 10 entries
              </Badge>
            )}
            {insights.totalWords >= 1000 && (
              <Badge variant="outline" className="p-3 text-center">
                📚 Word Smith - 1000+ words
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpiritualGrowthAnalytics;

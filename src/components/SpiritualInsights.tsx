
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Heart, 
  BookOpen, 
  Calendar, 
  Target,
  Award,
  Flame
} from 'lucide-react';
import { getJournalingInsights } from '@/lib/enhancedStorage';

const SpiritualInsights = () => {
  const insights = getJournalingInsights();

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'text-green-600 bg-green-100';
    if (streak >= 7) return 'text-blue-600 bg-blue-100';
    if (streak >= 3) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getFaithMilestones = () => {
    const milestones = [
      { threshold: 1, title: 'First Steps', description: 'Started your faith journey' },
      { threshold: 7, title: 'Week of Faith', description: '7 days of consistent journaling' },
      { threshold: 30, title: 'Month of Growth', description: '30 days of spiritual discipline' },
      { threshold: 100, title: 'Faithful Scribe', description: '100 journal entries completed' },
      { threshold: 365, title: 'Year of Blessing', description: 'One year of faithful journaling' }
    ];

    return milestones.filter(milestone => insights.totalEntries >= milestone.threshold);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Current Streak */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Flame className={`w-5 h-5 ${insights.currentStreak > 0 ? 'text-orange-500' : 'text-gray-400'}`} />
              <div>
                <p className="text-2xl font-bold">{insights.currentStreak}</p>
                <p className="text-sm text-muted-foreground">Day Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Entries */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{insights.totalEntries}</p>
                <p className="text-sm text-muted-foreground">Total Entries</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Words Written */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{insights.totalWords.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Words Written</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Average */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{insights.averageEntriesPerWeek}</p>
                <p className="text-sm text-muted-foreground">Entries/Week</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Faith Milestones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="w-5 h-5" />
            <span>Faith Milestones</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {getFaithMilestones().map((milestone, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
              <Award className="w-6 h-6 text-yellow-500" />
              <div className="flex-1">
                <h4 className="font-medium">{milestone.title}</h4>
                <p className="text-sm text-muted-foreground">{milestone.description}</p>
              </div>
              <Badge variant="secondary">Achieved</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Spiritual Themes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="w-5 h-5" />
            <span>Recent Spiritual Themes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.topTags.length > 0 ? (
              insights.topTags.map(([tag, count]) => (
                <div key={tag} className="flex items-center justify-between">
                  <span className="text-sm">#{tag}</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={(count / insights.recentEntries) * 100} className="w-20" />
                    <span className="text-sm text-muted-foreground">{count}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Start tagging your entries to see spiritual themes!</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Growth Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Growth Goals</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Daily Journaling Goal</span>
              <span>{Math.min(100, Math.round((insights.averageEntriesPerWeek / 7) * 100))}%</span>
            </div>
            <Progress value={Math.min(100, Math.round((insights.averageEntriesPerWeek / 7) * 100))} />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Longest Streak Goal (30 days)</span>
              <span>{Math.min(100, Math.round((insights.longestStreak / 30) * 100))}%</span>
            </div>
            <Progress value={Math.min(100, Math.round((insights.longestStreak / 30) * 100))} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpiritualInsights;

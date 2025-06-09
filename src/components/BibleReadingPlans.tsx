
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Calendar, BookOpen, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReadingPlan {
  id: string;
  name: string;
  description: string;
  duration: number; // days
  readings: DailyReading[];
  category: 'beginner' | 'intermediate' | 'advanced';
}

interface DailyReading {
  day: number;
  passages: string[];
  theme?: string;
  completed: boolean;
}

interface ReadingProgress {
  planId: string;
  currentDay: number;
  completedDays: number[];
  startDate: string;
}

const BibleReadingPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState<ReadingPlan | null>(null);
  const [progress, setProgress] = useState<ReadingProgress | null>(null);
  const { toast } = useToast();

  const readingPlans: ReadingPlan[] = [
    {
      id: 'new-testament-30',
      name: 'New Testament in 30 Days',
      description: 'Read through the entire New Testament in one month',
      duration: 30,
      category: 'intermediate',
      readings: Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        passages: [`Day ${i + 1} Reading`],
        theme: i === 0 ? 'The Gospels Begin' : i < 10 ? 'Life of Jesus' : i < 20 ? 'Early Church' : 'Letters to Churches',
        completed: false
      }))
    },
    {
      id: 'psalms-wisdom',
      name: 'Psalms & Wisdom',
      description: 'Journey through Psalms, Proverbs, and Ecclesiastes',
      duration: 60,
      category: 'beginner',
      readings: Array.from({ length: 60 }, (_, i) => ({
        day: i + 1,
        passages: [`Psalm ${i + 1}`, `Proverbs ${Math.ceil((i + 1) / 2)}`],
        theme: i < 20 ? 'Praise & Worship' : i < 40 ? 'Trust & Faith' : 'Wisdom & Understanding',
        completed: false
      }))
    },
    {
      id: 'whole-bible-year',
      name: 'Through the Bible in a Year',
      description: 'Systematic reading through the entire Bible',
      duration: 365,
      category: 'advanced',
      readings: Array.from({ length: 365 }, (_, i) => ({
        day: i + 1,
        passages: [`Genesis ${Math.ceil((i + 1) / 10)}`, `Matthew ${Math.ceil((i + 1) / 15)}`],
        theme: i < 90 ? 'Old Testament Foundations' : i < 180 ? 'History & Prophecy' : i < 270 ? 'Wisdom Literature' : 'New Testament',
        completed: false
      }))
    }
  ];

  useEffect(() => {
    const savedProgress = localStorage.getItem('bible_reading_progress');
    if (savedProgress) {
      try {
        setProgress(JSON.parse(savedProgress));
      } catch (error) {
        console.error('Failed to parse reading progress:', error);
      }
    }
  }, []);

  const startPlan = (plan: ReadingPlan) => {
    const newProgress: ReadingProgress = {
      planId: plan.id,
      currentDay: 1,
      completedDays: [],
      startDate: new Date().toISOString()
    };
    
    setProgress(newProgress);
    setSelectedPlan(plan);
    localStorage.setItem('bible_reading_progress', JSON.stringify(newProgress));
    
    toast({
      title: "Reading Plan Started!",
      description: `You've started "${plan.name}". Happy reading!`,
    });
  };

  const markDayComplete = (day: number) => {
    if (!progress || !selectedPlan) return;
    
    const updatedProgress = {
      ...progress,
      completedDays: [...progress.completedDays, day].sort((a, b) => a - b),
      currentDay: Math.max(progress.currentDay, day + 1)
    };
    
    setProgress(updatedProgress);
    localStorage.setItem('bible_reading_progress', JSON.stringify(updatedProgress));
    
    toast({
      title: "Day Completed!",
      description: `Great job finishing day ${day}!`,
    });
  };

  const getProgressPercentage = () => {
    if (!progress || !selectedPlan) return 0;
    return Math.round((progress.completedDays.length / selectedPlan.duration) * 100);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-blue-100 text-blue-800',
      advanced: 'bg-purple-100 text-purple-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (selectedPlan && progress) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen size={20} />
                  <span>{selectedPlan.name}</span>
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedPlan.description}
                </p>
              </div>
              <Button variant="outline" onClick={() => setSelectedPlan(null)}>
                View All Plans
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{progress.completedDays.length}/{selectedPlan.duration} days</span>
              </div>
              <Progress value={getProgressPercentage()} className="h-2" />
              <p className="text-sm text-muted-foreground">
                {getProgressPercentage()}% complete
              </p>
            </div>
            
            <div className="grid gap-2 max-h-96 overflow-y-auto">
              {selectedPlan.readings.slice(0, 14).map((reading) => (
                <div
                  key={reading.day}
                  className={`p-3 rounded-lg border ${
                    progress.completedDays.includes(reading.day)
                      ? 'bg-green-50 border-green-200'
                      : 'bg-muted/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">Day {reading.day}</span>
                        {reading.theme && (
                          <Badge variant="outline" className="text-xs">
                            {reading.theme}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {reading.passages.join(', ')}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markDayComplete(reading.day)}
                      disabled={progress.completedDays.includes(reading.day)}
                    >
                      {progress.completedDays.includes(reading.day) ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar size={20} />
            <span>Bible Reading Plans</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Choose a structured approach to reading God's Word consistently.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {readingPlans.map((plan) => (
              <Card key={plan.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge className={getCategoryColor(plan.category)}>
                      {plan.category}
                    </Badge>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Target size={14} />
                      <span>{plan.duration} days</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {plan.description}
                  </p>
                  <Button 
                    className="w-full"
                    onClick={() => startPlan(plan)}
                  >
                    Start Plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BibleReadingPlans;

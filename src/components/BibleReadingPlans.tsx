
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Calendar, Check, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReadingPlan {
  id: string;
  title: string;
  description: string;
  duration: number; // days
  type: 'chronological' | 'topical' | 'book-study' | 'devotional';
  dailyReadings: DailyReading[];
}

interface DailyReading {
  day: number;
  passages: string[];
  completed: boolean;
  completedDate?: number;
}

interface UserProgress {
  planId: string;
  currentDay: number;
  startDate: number;
  completedDays: number[];
}

const readingPlans: ReadingPlan[] = [
  {
    id: 'bible-year',
    title: 'Bible in a Year',
    description: 'Read through the entire Bible in 365 days with a chronological approach',
    duration: 365,
    type: 'chronological',
    dailyReadings: [
      { day: 1, passages: ['Genesis 1-3'], completed: false },
      { day: 2, passages: ['Genesis 4-7'], completed: false },
      { day: 3, passages: ['Genesis 8-11'], completed: false },
      // ... more readings would be here
    ]
  },
  {
    id: 'gospels-30',
    title: '30 Days in the Gospels',
    description: 'Focus on the life and teachings of Jesus through all four Gospels',
    duration: 30,
    type: 'topical',
    dailyReadings: [
      { day: 1, passages: ['Matthew 1-2'], completed: false },
      { day: 2, passages: ['Luke 1-2'], completed: false },
      { day: 3, passages: ['Matthew 3-4', 'Mark 1'], completed: false },
      // ... more readings would be here
    ]
  },
  {
    id: 'psalms-proverbs',
    title: 'Psalms & Proverbs',
    description: 'Read through wisdom literature in 60 days',
    duration: 60,
    type: 'book-study',
    dailyReadings: [
      { day: 1, passages: ['Psalm 1-2', 'Proverbs 1'], completed: false },
      { day: 2, passages: ['Psalm 3-4', 'Proverbs 2'], completed: false },
      // ... more readings would be here
    ]
  }
];

const BibleReadingPlans = () => {
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<ReadingPlan | null>(null);
  const { toast } = useToast();

  const startPlan = (plan: ReadingPlan) => {
    const existingProgress = userProgress.find(p => p.planId === plan.id);
    
    if (existingProgress) {
      setSelectedPlan(plan);
      return;
    }

    const newProgress: UserProgress = {
      planId: plan.id,
      currentDay: 1,
      startDate: Date.now(),
      completedDays: []
    };

    setUserProgress([...userProgress, newProgress]);
    setSelectedPlan(plan);
    
    toast({
      title: "Reading Plan Started",
      description: `You've started "${plan.title}". Happy reading!`,
    });
  };

  const markDayComplete = (planId: string, day: number) => {
    setUserProgress(userProgress.map(progress => 
      progress.planId === planId
        ? {
            ...progress,
            completedDays: [...progress.completedDays, day],
            currentDay: Math.min(progress.currentDay + 1, selectedPlan?.duration || 365)
          }
        : progress
    ));

    toast({
      title: "Day Completed!",
      description: `Great job completing day ${day} of your reading plan.`,
    });
  };

  const getPlanProgress = (planId: string) => {
    const progress = userProgress.find(p => p.planId === planId);
    if (!progress) return { percentage: 0, completedDays: 0, totalDays: 0 };
    
    const plan = readingPlans.find(p => p.id === planId);
    const totalDays = plan?.duration || 0;
    const completedDays = progress.completedDays.length;
    const percentage = totalDays > 0 ? (completedDays / totalDays) * 100 : 0;
    
    return { percentage, completedDays, totalDays };
  };

  const getTodaysReading = (plan: ReadingPlan) => {
    const progress = userProgress.find(p => p.planId === plan.id);
    if (!progress) return null;
    
    return plan.dailyReadings.find(reading => reading.day === progress.currentDay);
  };

  const getTypeColor = (type: ReadingPlan['type']) => {
    const colors = {
      chronological: 'bg-blue-100 text-blue-800',
      topical: 'bg-green-100 text-green-800',
      'book-study': 'bg-purple-100 text-purple-800',
      devotional: 'bg-orange-100 text-orange-800'
    };
    return colors[type];
  };

  if (selectedPlan) {
    const progress = getPlanProgress(selectedPlan.id);
    const todaysReading = getTodaysReading(selectedPlan);
    const userPlanProgress = userProgress.find(p => p.planId === selectedPlan.id);

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen size={20} />
                  <span>{selectedPlan.title}</span>
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
              <div className="flex items-center justify-between text-sm">
                <span>Progress</span>
                <span>{progress.completedDays} of {progress.totalDays} days</span>
              </div>
              <Progress value={progress.percentage} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {Math.round(progress.percentage)}% complete
              </p>
            </div>

            {todaysReading && (
              <Card className="bg-muted/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">Day {todaysReading.day}</h3>
                    <Badge className={getTypeColor(selectedPlan.type)}>
                      {selectedPlan.type.replace('-', ' ')}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Today's Reading:</p>
                    <ul className="space-y-1">
                      {todaysReading.passages.map((passage, index) => (
                        <li key={index} className="text-sm text-muted-foreground">
                          • {passage}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {userPlanProgress && !userPlanProgress.completedDays.includes(todaysReading.day) && (
                    <Button 
                      className="w-full mt-3" 
                      onClick={() => markDayComplete(selectedPlan.id, todaysReading.day)}
                    >
                      <Check size={16} className="mr-2" />
                      Mark as Complete
                    </Button>
                  )}
                  {userPlanProgress?.completedDays.includes(todaysReading.day) && (
                    <div className="flex items-center justify-center mt-3 text-green-600">
                      <Check size={16} className="mr-2" />
                      <span className="text-sm">Completed!</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
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
            <BookOpen size={20} />
            <span>Bible Reading Plans</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {readingPlans.map((plan) => {
              const progress = getPlanProgress(plan.id);
              const isStarted = userProgress.some(p => p.planId === plan.id);
              
              return (
                <Card key={plan.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <h3 className="font-medium">{plan.title}</h3>
                          <p className="text-sm text-muted-foreground">{plan.description}</p>
                        </div>
                        <Badge className={getTypeColor(plan.type)}>
                          {plan.type.replace('-', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar size={14} />
                          <span>{plan.duration} days</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock size={14} />
                          <span>~{Math.round(plan.duration / 7)} weeks</span>
                        </div>
                      </div>

                      {isStarted && (
                        <div className="space-y-2">
                          <Progress value={progress.percentage} className="h-1.5" />
                          <p className="text-xs text-muted-foreground">
                            {progress.completedDays} of {progress.totalDays} days complete
                          </p>
                        </div>
                      )}

                      <Button 
                        onClick={() => startPlan(plan)}
                        variant={isStarted ? "outline" : "default"}
                        className="w-full"
                      >
                        {isStarted ? "Continue Reading" : "Start Plan"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BibleReadingPlans;

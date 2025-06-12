
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Calendar, BookOpen, Clock, CheckCircle } from 'lucide-react';

interface ReadingPlan {
  id: string;
  name: string;
  description: string;
  duration: string;
  progress: number;
  currentReading: string;
  type: 'chronological' | 'topical' | 'book-by-book' | 'devotional';
  isActive: boolean;
}

const READING_PLANS: ReadingPlan[] = [
  {
    id: 'bible-year',
    name: 'Bible in a Year',
    description: 'Read through the entire Bible in 365 days with a structured plan',
    duration: '365 days',
    progress: 15,
    currentReading: 'Genesis 15-17',
    type: 'chronological',
    isActive: true
  },
  {
    id: 'new-testament-90',
    name: 'New Testament in 90 Days',
    description: 'Complete the New Testament in just 3 months',
    duration: '90 days',
    progress: 0,
    currentReading: 'Not started',
    type: 'book-by-book',
    isActive: false
  },
  {
    id: 'psalms-proverbs',
    name: 'Psalms & Proverbs',
    description: 'Read through wisdom literature with daily reflections',
    duration: '31 days',
    progress: 45,
    currentReading: 'Psalm 23, Proverbs 15',
    type: 'devotional',
    isActive: false
  },
  {
    id: 'gospel-study',
    name: 'Life of Jesus',
    description: 'Follow Jesus through the four Gospels chronologically',
    duration: '60 days',
    progress: 0,
    currentReading: 'Not started',
    type: 'topical',
    isActive: false
  }
];

const BibleReadingPlans = () => {
  const [plans, setPlans] = useState<ReadingPlan[]>(READING_PLANS);

  const handleStartPlan = (planId: string) => {
    setPlans(prev => prev.map(plan => ({
      ...plan,
      isActive: plan.id === planId ? true : plan.isActive
    })));
  };

  const handleCompleteTodaysReading = (planId: string) => {
    setPlans(prev => prev.map(plan => {
      if (plan.id === planId) {
        const newProgress = Math.min(plan.progress + 1, 100);
        return {
          ...plan,
          progress: newProgress,
          currentReading: newProgress === 100 ? 'Completed!' : plan.currentReading
        };
      }
      return plan;
    }));
  };

  const getTypeColor = (type: ReadingPlan['type']) => {
    switch (type) {
      case 'chronological': return 'bg-blue-100 text-blue-800';
      case 'topical': return 'bg-green-100 text-green-800';
      case 'book-by-book': return 'bg-purple-100 text-purple-800';
      case 'devotional': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-serif mb-2">Bible Reading Plans</h2>
        <p className="text-muted-foreground">
          Choose a structured plan to guide your Bible study journey
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {plans.map((plan) => (
          <Card key={plan.id} className={`transition-all ${plan.isActive ? 'ring-2 ring-primary' : ''}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen size={20} />
                    {plan.name}
                    {plan.isActive && (
                      <Badge variant="default" className="text-xs">
                        Active
                      </Badge>
                    )}
                  </CardTitle>
                  <Badge className={getTypeColor(plan.type)}>
                    {plan.type.replace('-', ' ')}
                  </Badge>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock size={16} className="mr-1" />
                  {plan.duration}
                </div>
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{plan.progress}%</span>
                </div>
                <Progress value={plan.progress} className="w-full" />
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Calendar size={16} className="text-muted-foreground" />
                <span className="text-muted-foreground">Current reading:</span>
                <span className="font-medium">{plan.currentReading}</span>
              </div>

              <div className="flex gap-2">
                {!plan.isActive ? (
                  <Button 
                    onClick={() => handleStartPlan(plan.id)}
                    className="flex-1"
                  >
                    Start Plan
                  </Button>
                ) : (
                  <Button 
                    onClick={() => handleCompleteTodaysReading(plan.id)}
                    className="flex-1"
                    variant={plan.progress === 100 ? "secondary" : "default"}
                    disabled={plan.progress === 100}
                  >
                    <CheckCircle size={16} className="mr-2" />
                    {plan.progress === 100 ? 'Completed' : 'Mark as Read'}
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-lg">Create Custom Plan</CardTitle>
          <CardDescription>
            Want to create your own reading schedule? Set up a personalized plan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full">
            <BookOpen size={16} className="mr-2" />
            Create Custom Plan
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BibleReadingPlans;

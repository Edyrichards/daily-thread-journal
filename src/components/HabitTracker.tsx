
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { 
  BookOpen, 
  Hand, 
  Church, 
  Heart, 
  Users, 
  Calendar as CalendarIcon,
  CheckCircle2,
  Circle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Habit {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: 'spiritual' | 'service' | 'study' | 'community';
  target: number; // times per week
  completed: number;
}

interface HabitEntry {
  date: string;
  habitId: string;
  completed: boolean;
}

const HabitTracker = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [habits] = useState<Habit[]>([
    {
      id: 'bible-reading',
      name: 'Bible Reading',
      icon: <BookOpen size={16} />,
      category: 'study',
      target: 7,
      completed: 5
    },
    {
      id: 'prayer-time',
      name: 'Prayer Time',
      icon: <Hand size={16} />,
      category: 'spiritual',
      target: 7,
      completed: 6
    },
    {
      id: 'church-attendance',
      name: 'Church/Fellowship',
      icon: <Church size={16} />,
      category: 'community',
      target: 2,
      completed: 1
    },
    {
      id: 'worship-music',
      name: 'Worship & Praise',
      icon: <Heart size={16} />,
      category: 'spiritual',
      target: 5,
      completed: 4
    },
    {
      id: 'service',
      name: 'Acts of Service',
      icon: <Users size={16} />,
      category: 'service',
      target: 3,
      completed: 2
    }
  ]);

  const [habitEntries, setHabitEntries] = useState<HabitEntry[]>([]);
  const { toast } = useToast();

  const toggleHabit = (habitId: string, date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const existingEntry = habitEntries.find(
      entry => entry.habitId === habitId && entry.date === dateStr
    );

    if (existingEntry) {
      setHabitEntries(entries =>
        entries.map(entry =>
          entry.habitId === habitId && entry.date === dateStr
            ? { ...entry, completed: !entry.completed }
            : entry
        )
      );
    } else {
      setHabitEntries(entries => [
        ...entries,
        { date: dateStr, habitId, completed: true }
      ]);
    }

    const habit = habits.find(h => h.id === habitId);
    toast({
      title: "Habit Updated",
      description: `${habit?.name} marked for ${date.toLocaleDateString()}`,
    });
  };

  const isHabitCompleted = (habitId: string, date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const entry = habitEntries.find(
      entry => entry.habitId === habitId && entry.date === dateStr
    );
    return entry?.completed || false;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      spiritual: 'bg-purple-100 text-purple-800',
      service: 'bg-green-100 text-green-800',
      study: 'bg-blue-100 text-blue-800',
      community: 'bg-orange-100 text-orange-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getProgress = (habit: Habit) => {
    return Math.min(100, Math.round((habit.completed / habit.target) * 100));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Habit List */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Spiritual Disciplines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {habits.map((habit) => (
                <div key={habit.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {habit.icon}
                      <div>
                        <h4 className="font-medium">{habit.name}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge className={getCategoryColor(habit.category)}>
                            {habit.category}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {habit.completed}/{habit.target} this week
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{getProgress(habit)}%</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleHabit(habit.id, selectedDate)}
                      >
                        {isHabitCompleted(habit.id, selectedDate) ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getProgress(habit)}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CalendarIcon size={20} />
              <span>Track Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
            <div className="mt-4 space-y-2">
              <h4 className="font-medium">
                {selectedDate.toLocaleDateString()}
              </h4>
              {habits.map((habit) => (
                <div key={habit.id} className="flex items-center space-x-2">
                  <Checkbox
                    checked={isHabitCompleted(habit.id, selectedDate)}
                    onCheckedChange={() => toggleHabit(habit.id, selectedDate)}
                  />
                  <span className="text-sm">{habit.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Summary */}
      <Card>
        <CardHeader>
          <CardTitle>This Week's Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {habits.map((habit) => (
              <div key={habit.id} className="text-center">
                <div className="mb-2">{habit.icon}</div>
                <p className="text-sm font-medium">{habit.name}</p>
                <p className="text-xs text-muted-foreground">
                  {habit.completed}/{habit.target}
                </p>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-1">
                  <div
                    className="bg-primary h-1 rounded-full"
                    style={{ width: `${getProgress(habit)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HabitTracker;

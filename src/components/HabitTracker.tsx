
import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

type Habit = 'prayer' | 'gratitude' | 'bible' | 'worship' | 'encouragement';

interface HabitLog {
  date: string; // YYYY-MM-DD format
  habits: Habit[];
}

const habitEmojis: Record<Habit, string> = {
  prayer: '🙏',
  gratitude: '❤️',
  bible: '📖',
  worship: '🎵',
  encouragement: '💌'
};

const habitColors: Record<Habit, string> = {
  prayer: 'bg-[#e5deff] text-[#6e59a5]',
  gratitude: 'bg-[#ffdee2] text-[#d16277]',
  bible: 'bg-[#f2fce2] text-[#608b46]',
  worship: 'bg-[#fef7cd] text-[#b0964f]',
  encouragement: 'bg-[#d3e4fd] text-[#4a7dbd]'
};

const encouragementVerses = [
  { text: "Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up.", reference: "Galatians 6:9" },
  { text: "And let us consider how we may spur one another on toward love and good deeds.", reference: "Hebrews 10:24" },
  { text: "Therefore encourage one another and build each other up, just as in fact you are doing.", reference: "1 Thessalonians 5:11" },
  { text: "May the God who gives endurance and encouragement give you the same attitude of mind toward each other that Christ Jesus had.", reference: "Romans 15:5" }
];

const HabitTracker = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
  const [streakCount, setStreakCount] = useState(0);
  const [encouragement, setEncouragement] = useState(encouragementVerses[0]);

  // Load habit logs from local storage
  useEffect(() => {
    const savedLogs = localStorage.getItem('habit_logs');
    if (savedLogs) {
      setHabitLogs(JSON.parse(savedLogs));
    }
    
    // Randomly select an encouragement verse
    setEncouragement(encouragementVerses[Math.floor(Math.random() * encouragementVerses.length)]);
    
    // Calculate streak
    calculateStreak();
  }, []);

  // Calculate current streak
  const calculateStreak = () => {
    const logs = habitLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    // Check if logged today
    const todayLog = logs.find(log => log.date === today);
    if (todayLog && todayLog.habits.length > 0) {
      streak = 1;
      
      // Check previous days
      let currentDate = yesterday;
      let currentStreak = true;
      
      while (currentStreak) {
        const log = logs.find(log => log.date === currentDate);
        if (log && log.habits.length > 0) {
          streak++;
          // Move to previous day
          const prevDate = new Date(new Date(currentDate).getTime() - 86400000);
          currentDate = prevDate.toISOString().split('T')[0];
        } else {
          currentStreak = false;
        }
      }
    }
    
    setStreakCount(streak);
  };

  // Format date as YYYY-MM-DD
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // Get habits for selected date
  const getHabitsForDate = (date: Date): Habit[] => {
    const formattedDate = formatDate(date);
    const log = habitLogs.find(log => log.date === formattedDate);
    return log ? log.habits : [];
  };

  // Toggle habit for selected date
  const toggleHabit = (habit: Habit) => {
    const formattedDate = formatDate(date);
    const currentHabits = getHabitsForDate(date);
    
    let updatedHabits: Habit[];
    
    if (currentHabits.includes(habit)) {
      updatedHabits = currentHabits.filter(h => h !== habit);
    } else {
      updatedHabits = [...currentHabits, habit];
    }
    
    // Update or create log
    const updatedLogs = [...habitLogs.filter(log => log.date !== formattedDate)];
    
    if (updatedHabits.length > 0) {
      updatedLogs.push({
        date: formattedDate,
        habits: updatedHabits
      });
    }
    
    setHabitLogs(updatedLogs);
    localStorage.setItem('habit_logs', JSON.stringify(updatedLogs));
    
    // Show toast if completing habit
    if (!currentHabits.includes(habit)) {
      toast({
        title: "Habit Tracked",
        description: `You've completed ${habitEmojis[habit]} ${habit} today!`,
      });
    }
    
    // Recalculate streak
    calculateStreak();
  };

  // Function to add CSS classes to calendar days with habits
  const modifiersClassNames = {
    hasHabit: "bg-[#f4f6f0] rounded-md relative",
  };
  
  // Define modifier for days with habits
  const modifiers = {
    hasHabit: (day: Date) => {
      const formattedDate = formatDate(day);
      return habitLogs.some(log => log.date === formattedDate && log.habits.length > 0);
    },
  };

  const selectedDateHabits = getHabitsForDate(date);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="border-[#e8e8e0] shadow-sm flex-1">
          <CardHeader>
            <CardTitle className="font-serif text-[#333]">Daily Grace</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              modifiers={modifiers}
              modifiersClassNames={modifiersClassNames}
              className="rounded-md border border-[#e8e8e0]"
            />
            
            <div className="mt-6 flex flex-wrap gap-2">
              {Object.entries(habitEmojis).map(([habit, emoji]) => (
                <Button
                  key={habit}
                  variant="outline"
                  onClick={() => toggleHabit(habit as Habit)}
                  className={`${
                    selectedDateHabits.includes(habit as Habit)
                      ? habitColors[habit as Habit]
                      : 'bg-white text-[#666]'
                  } border-[#e8e8e0] rounded-full px-4 py-2 flex items-center gap-2 transition-all hover:scale-105`}
                >
                  <span>{emoji}</span>
                  <span className="capitalize">{habit}</span>
                  {selectedDateHabits.includes(habit as Habit) && (
                    <CheckIcon className="h-4 w-4 ml-1" />
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-[#e8e8e0] shadow-sm flex-1">
          <CardHeader>
            <CardTitle className="font-serif text-[#333]">Your Journey</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-[#f4f6f0] p-4 rounded-xl text-center">
              <div className="text-4xl font-bold text-[#6e59a5] mb-2">{streakCount}</div>
              <div className="text-[#333] font-serif">Day Streak</div>
              {streakCount > 0 && (
                <div className="text-xs text-[#666] mt-1">Well done, faithful servant!</div>
              )}
            </div>
            
            <div className="bg-[#f4f6f0] p-4 rounded-xl">
              <p className="verse-text italic text-sm mb-2 text-[#333]">"{encouragement.text}"</p>
              <p className="verse-reference text-right">— {encouragement.reference}</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {Object.entries(habitEmojis).map(([habit, emoji]) => {
                const count = habitLogs.filter(log => 
                  log.habits.includes(habit as Habit)
                ).length;
                
                return count > 0 ? (
                  <Badge 
                    key={habit}
                    className={`${habitColors[habit as Habit]} border-0 py-1 px-3 font-normal`}
                  >
                    {emoji} {count}
                  </Badge>
                ) : null;
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HabitTracker;


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Plus, X, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PrayerReminder {
  id: string;
  time: string;
  label: string;
  isActive: boolean;
  days: string[];
}

const PrayerReminders: React.FC = () => {
  const [reminders, setReminders] = useState<PrayerReminder[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('prayerReminders');
    if (saved) {
      setReminders(JSON.parse(saved));
    } else {
      // Default reminders
      setReminders([
        {
          id: '1',
          time: '07:00',
          label: 'Morning Prayer',
          isActive: true,
          days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        {
          id: '2',
          time: '21:00',
          label: 'Evening Reflection',
          isActive: true,
          days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        }
      ]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('prayerReminders', JSON.stringify(reminders));
  }, [reminders]);

  const toggleReminder = (id: string) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === id 
        ? { ...reminder, isActive: !reminder.isActive }
        : reminder
    ));
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== id));
  };

  const getNextPrayerTime = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const activeReminders = reminders.filter(r => r.isActive);
    const upcomingToday = activeReminders.find(reminder => {
      const [hours, minutes] = reminder.time.split(':').map(Number);
      const reminderTime = hours * 60 + minutes;
      return reminderTime > currentTime;
    });

    if (upcomingToday) {
      return upcomingToday;
    }

    // Return first reminder of tomorrow
    return activeReminders.length > 0 ? activeReminders[0] : null;
  };

  const nextPrayer = getNextPrayerTime();

  return (
    <Card className="bg-gradient-to-br from-grace-blue/10 to-grace-200/30">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Bell size={18} className="mr-2 text-grace-blue" />
            <span>Prayer Reminders</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAddForm(!showAddForm)}
            className="h-8 px-2"
          >
            <Plus size={14} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {nextPrayer && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-grace-blue/5 border border-grace-blue/20 rounded-lg p-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock size={14} className="text-grace-blue" />
                <span className="text-sm font-medium">Next: {nextPrayer.label}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {nextPrayer.time}
              </Badge>
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {reminders.map((reminder) => (
            <motion.div
              key={reminder.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                reminder.isActive 
                  ? 'bg-card border-border' 
                  : 'bg-muted/50 border-muted'
              }`}
            >
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => toggleReminder(reminder.id)}
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    reminder.isActive 
                      ? 'bg-grace-blue border-grace-blue' 
                      : 'border-muted-foreground'
                  }`}
                >
                  {reminder.isActive && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </button>
                <div>
                  <p className={`font-medium text-sm ${
                    reminder.isActive ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {reminder.label}
                  </p>
                  <p className={`text-xs ${
                    reminder.isActive ? 'text-muted-foreground' : 'text-muted-foreground/70'
                  }`}>
                    {reminder.time} • Daily
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteReminder(reminder.id)}
                className="h-6 w-6 text-muted-foreground hover:text-destructive"
              >
                <X size={12} />
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>

        {reminders.length === 0 && (
          <div className="text-center py-6">
            <Bell className="mx-auto mb-2 text-muted-foreground" size={24} />
            <p className="text-sm text-muted-foreground">No prayer reminders set</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PrayerReminders;

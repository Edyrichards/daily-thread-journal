
import { useState, useEffect } from "react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, parseISO } from "date-fns";
import { getJournalEntries, getPrayers, JournalEntry, Prayer, Mood } from "@/lib/storage";

// Mapping moods to numeric values for the chart
export const moodToValue: Record<Mood, number> = {
  joyful: 10,
  peaceful: 9,
  hopeful: 8,
  content: 7,
  neutral: 6,
  anxious: 5,
  sad: 4,
  stressed: 3,
  angry: 2,
  overwhelmed: 1,
};

type MoodData = Array<{name: string; mood: number}>;
type PrayerData = Array<{name: string; prayers: number}>;

type WeeklyStats = {
  totalEntries: number;
  averageMood: number;
  prayersAnswered: number;
};

export const useWeeklyData = () => {
  const [moodData, setMoodData] = useState<MoodData>([]);
  const [prayerData, setPrayerData] = useState<PrayerData>([]);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats>({
    totalEntries: 0,
    averageMood: 0,
    prayersAnswered: 0,
  });

  useEffect(() => {
    // Get data for the current week
    const today = new Date();
    const weekStart = startOfWeek(today);
    const weekEnd = endOfWeek(today);
    const daysOfWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
    
    // Get journal entries and prayers
    const journalEntries = getJournalEntries();
    const prayers = getPrayers();
    
    // Process mood data
    const moodByDay = daysOfWeek.map(day => {
      const dayStr = format(day, "yyyy-MM-dd");
      const dayEntries = journalEntries.filter(entry => entry.date.startsWith(dayStr));
      
      // Calculate average mood for the day if entries exist
      let averageMood = 6; // Default to neutral
      if (dayEntries.length > 0) {
        const moodSum = dayEntries.reduce((sum, entry) => sum + moodToValue[entry.mood], 0);
        averageMood = moodSum / dayEntries.length;
      }
      
      return {
        name: format(day, "EEE"),
        mood: averageMood
      };
    });
    
    // Process prayer data
    const prayersByDay = daysOfWeek.map(day => {
      const dayStr = format(day, "yyyy-MM-dd");
      // Count prayers answered on this day
      const answeredPrayers = prayers.filter(prayer => {
        const updatedDate = new Date(prayer.updatedAt);
        return format(updatedDate, "yyyy-MM-dd") === dayStr && prayer.status === "answered";
      });
      
      return {
        name: format(day, "EEE"),
        prayers: answeredPrayers.length
      };
    });
    
    // Calculate weekly stats
    const weeklyEntries = journalEntries.filter(entry => {
      const entryDate = parseISO(entry.date);
      return entryDate >= weekStart && entryDate <= weekEnd;
    });
    
    const weeklyAnsweredPrayers = prayers.filter(prayer => {
      const updatedDate = new Date(prayer.updatedAt);
      return updatedDate >= weekStart && updatedDate <= weekEnd && prayer.status === "answered";
    });
    
    const averageMood = weeklyEntries.length > 0
      ? weeklyEntries.reduce((sum, entry) => sum + moodToValue[entry.mood], 0) / weeklyEntries.length
      : 0;
    
    setMoodData(moodByDay);
    setPrayerData(prayersByDay);
    setWeeklyStats({
      totalEntries: weeklyEntries.length,
      averageMood,
      prayersAnswered: weeklyAnsweredPrayers.length
    });
    
  }, []);

  return {
    moodData,
    prayerData,
    weeklyStats
  };
};

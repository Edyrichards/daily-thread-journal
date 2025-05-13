
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, parseISO } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent, 
  ChartLegend, 
  ChartLegendContent 
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { getJournalEntries, JournalEntry, getPrayers, Prayer, Mood } from "@/lib/storage";
import { Activity, TrendingUp } from "lucide-react";
import Header from "@/components/Header";

// Mapping moods to numeric values for the chart
const moodToValue: Record<Mood, number> = {
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

// Config for the charts
const config = {
  mood: { 
    label: "Mood", 
    theme: { light: "#a48df3", dark: "#a48df3" }
  },
  prayers: { 
    label: "Prayers", 
    theme: { light: "#e6c27a", dark: "#e6c27a" }
  }
};

const GrowthDashboard = () => {
  const navigate = useNavigate();
  const [moodData, setMoodData] = useState<Array<{name: string; mood: number}>>([]);
  const [prayerData, setPrayerData] = useState<Array<{name: string; prayers: number}>>([]);
  const [weeklyStats, setWeeklyStats] = useState({
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

  return (
    <div className="container max-w-4xl mx-auto px-4 pt-4 pb-20">
      <Header />
      
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-grace-700 mb-2">Spiritual Growth</h1>
        <p className="text-grace-600">
          "Here's how God has shown up this week"
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="border-grace-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-medium text-grace-700 flex items-center gap-2">
              <Activity className="h-5 w-5 text-grace-400" /> 
              <span>Journal Entries</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-grace-700">{weeklyStats.totalEntries}</p>
            <p className="text-sm text-grace-500">This week</p>
          </CardContent>
        </Card>

        <Card className="border-grace-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-medium text-grace-700 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-grace-400" />
              <span>Average Mood</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-grace-700">
              {weeklyStats.averageMood > 0 ? weeklyStats.averageMood.toFixed(1) : "N/A"}
            </p>
            <p className="text-sm text-grace-500">Scale 1-10</p>
          </CardContent>
        </Card>

        <Card className="border-grace-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-medium text-grace-700 flex items-center gap-2">
              <Activity className="h-5 w-5 text-grace-400" />
              <span>Prayers Answered</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-grace-700">{weeklyStats.prayersAnswered}</p>
            <p className="text-sm text-grace-500">This week</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Mood chart */}
      <Card className="border-grace-200 mb-8">
        <CardHeader>
          <CardTitle className="text-xl font-medium text-grace-700">Weekly Mood</CardTitle>
          <CardDescription>Your emotional journey this week</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={config} className="h-80">
            <LineChart data={moodData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis domain={[1, 10]} ticks={[1, 3, 5, 7, 9]} />
              <ChartTooltip 
                content={<ChartTooltipContent />} 
              />
              <Line 
                type="monotone" 
                dataKey="mood" 
                stroke="var(--color-mood)" 
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
      
      {/* Prayer chart */}
      <Card className="border-grace-200">
        <CardHeader>
          <CardTitle className="text-xl font-medium text-grace-700">Prayers Answered</CardTitle>
          <CardDescription>Blessings received throughout the week</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={config} className="h-80">
            <BarChart data={prayerData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip 
                content={<ChartTooltipContent />} 
              />
              <Bar
                dataKey="prayers"
                fill="var(--color-prayers)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default GrowthDashboard;

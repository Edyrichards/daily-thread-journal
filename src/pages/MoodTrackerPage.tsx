import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import Layout from '@/components/Layout';
import { Calendar } from '@/components/ui/calendar';
import { Mood, JournalEntry, getJournalEntries } from '@/lib/storage';
import { getMoodsByDate, moodColors, getMoodFrequencies } from '@/lib/moodTrackerUtils';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'; // Added Recharts imports

// Copied from Index.tsx / NewJournalFlowPage.tsx for legend/tooltip label consistency
// Ideally, this would be in a shared constants file.
const moodOptions: Array<{ label: string; emoji: string; value: Mood; bgColor?: string }> = [
  { label: "Happy", emoji: "😊", value: "joyful", bgColor: "bg-grace-gold/70" },
  { label: "Grateful", emoji: "🙏", value: "content", bgColor: "bg-grace-blue/70" },
  { label: "Anxious", emoji: "😟", value: "anxious", bgColor: "bg-soft-peach/70" },
  { label: "Sad", emoji: "😢", value: "sad", bgColor: "bg-lightBeige/70" },
  { label: "Hopeful", emoji: "✨", value: "hopeful", bgColor: "bg-grace-200/70" },
  { label: "Peaceful", emoji: "😌", value: "peaceful", bgColor: "bg-primary/30" },
  // Add other moods from the Mood type if they should appear in legend/tooltips with specific labels
  { label: "Neutral", emoji: "😐", value: "neutral" },
  { label: "Stressed", emoji: "😫", value: "stressed" },
  { label: "Angry", emoji: "😠", value: "angry" },
  { label: "Overwhelmed", emoji: "😩", value: "overwhelmed" },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const moodDetail = moodOptions.find(m => m.value === data.name);
    return (
      <div className="bg-card/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-border">
        <p className="text-sm font-semibold text-foreground">{`${data.emoji} ${moodDetail?.label || data.name}`}</p>
        <p className="text-xs text-muted-foreground">Count: {data.value}</p>
      </div>
    );
  }
  return null;
};

const MoodTrackerPage: React.FC = () => {
  const [moodsData, setMoodsData] = useState<Map<string, Mood[]>>(new Map());
  const [currentDisplayMonth, setCurrentDisplayMonth] = useState<Date>(new Date());
  const [allEntries, setAllEntries] = useState<JournalEntry[]>([]);
  const [chartMoodColors, setChartMoodColors] = useState<Record<Mood, string>>({} as Record<Mood, string>);
  const [moodFrequencyData, setMoodFrequencyData] = useState<{ name: Mood; value: number; emoji: string }[]>([]);

  const navigate = useNavigate();

  // Fetch all entries and set up calendar mood data
  useEffect(() => {
    const fetchedEntries = getJournalEntries();
    setAllEntries(fetchedEntries);

    const allMoodsByDate = getMoodsByDate(); // Can be optimized to use fetchedEntries
    setMoodsData(allMoodsByDate);
  }, []);

  // Resolve CSS variable colors for charts
  useEffect(() => {
    const tempResolvedColors: Record<Mood, string> = {} as Record<Mood, string>;
    (Object.keys(moodColors) as Mood[]).forEach(moodKey => {
      const cssVarString = moodColors[moodKey];
      const match = cssVarString.match(/var\((--[^)]+)\)/);
      if (match && match[1]) {
        const varName = match[1];
        try {
          if (typeof window !== 'undefined' && typeof document !== 'undefined') { // Ensure document is available
            const resolvedValue = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
            if (resolvedValue) {
              tempResolvedColors[moodKey] = `hsl(${resolvedValue})`;
            } else {
              tempResolvedColors[moodKey] = '#8884d8'; // Fallback
            }
          } else {
             tempResolvedColors[moodKey] = '#8884d8'; // Fallback for non-browser env
          }
        } catch (e) {
          console.error("Error resolving CSS var for charts:", varName, e);
          tempResolvedColors[moodKey] = '#8884d8'; // Fallback
        }
      } else {
        tempResolvedColors[moodKey] = cssVarString; // Already a valid color
      }
    });
    setChartMoodColors(tempResolvedColors);
  }, []); // Runs once on mount as moodColors is stable

  // Calculate mood frequency data when allEntries or currentDisplayMonth changes
  useEffect(() => {
    if (allEntries.length > 0) {
      const frequencies = getMoodFrequencies(allEntries, currentDisplayMonth);
      setMoodFrequencyData(frequencies);
    }
  }, [allEntries, currentDisplayMonth]);


  const handleDayClick = (day: Date | undefined) => {
    if (!day || allEntries.length === 0) {
      return;
    }
    const clickedDateStr = format(day, "yyyy-MM-dd");
    const matchingEntries = allEntries.filter(entry => entry.date === clickedDateStr);

    if (matchingEntries.length > 0) {
      // Sort by createdAt to get the earliest or latest if multiple on same day
      matchingEntries.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
      navigate(`/journal/${matchingEntries[0].id}`);
    } else {
      console.log("No moods recorded for", clickedDateStr);
    }
  };

  // For debugging chart data
  useEffect(() => {
    // console.log("Chart Mood Colors:", chartMoodColors); // Keep for debugging if needed
    // console.log("Mood Frequency Data for current month:", moodFrequencyData);
  }, [chartMoodColors, moodFrequencyData]);
  
  const pieChartData = useMemo(() => {
    return moodFrequencyData.map(moodEntry => ({
      name: moodEntry.name,
      value: moodEntry.value,
      emoji: moodEntry.emoji,
      fill: chartMoodColors[moodEntry.name] || '#8884d8',
    }));
  }, [moodFrequencyData, chartMoodColors]);

  return (
    <Layout title="Mood Tracker">
      <div className="p-4 md:p-8">
        <h2 className="text-2xl font-serif text-foreground mb-6 text-center">
          Your Mood Calendar
        </h2>
        <Calendar
          mode="single"
          selected={undefined} 
          onDayClick={handleDayClick} 
          month={currentDisplayMonth}
          onMonthChange={setCurrentDisplayMonth}
          className="rounded-md border max-w-md mx-auto shadow-md bg-card"
          components={{
            DayContent: ({ date, displayMonth }) => {
              const formattedDateKey = format(date, "yyyy-MM-dd");
              const dayMoods = moodsData.get(formattedDateKey);
              const isCurrentMonth = date.getFullYear() === displayMonth.getFullYear() &&
                                     date.getMonth() === displayMonth.getMonth();
              return (
                <div className="relative h-full w-full flex flex-col items-center justify-center p-0 m-0">
                  <span>{date.getDate()}</span>
                  {isCurrentMonth && dayMoods && dayMoods.length > 0 && (
                    <div className="flex space-x-1 mt-0.5">
                      {dayMoods.slice(0, 3).map((mood, index) => (
                        <span 
                          key={index} 
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: moodColors[mood] || 'transparent' }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            },
          }}
        />

        {/* Donut Chart Section */}
        <section className="mt-12">
          <h3 className="text-xl font-serif text-foreground mb-6 text-center">
            Monthly Mood Overview
          </h3>
          {pieChartData.length > 0 ? (
            <div className="w-full h-[350px] md:h-[400px] bg-card p-4 rounded-2xl shadow-md">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={45}
                    labelLine={false}
                    label={({ name, emoji, percent }) => `${emoji} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.fill} 
                        className="focus:outline-none ring-0 focus:ring-0" 
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    iconType="circle" 
                    formatter={(value) => {
                      const moodDetail = moodOptions.find(m => m.value === value);
                      return <span className="text-foreground">{moodDetail?.emoji} {moodDetail?.label || value}</span>;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-10">
              No mood data to display for this month.
            </p>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default MoodTrackerPage;

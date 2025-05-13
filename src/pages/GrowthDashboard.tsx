
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import StatCards from "@/components/dashboard/StatCards";
import MoodChart from "@/components/dashboard/MoodChart";
import PrayerChart from "@/components/dashboard/PrayerChart";
import { useWeeklyData } from "@/hooks/useWeeklyData";

const GrowthDashboard = () => {
  const navigate = useNavigate();
  const { moodData, prayerData, weeklyStats } = useWeeklyData();

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
      <StatCards 
        totalEntries={weeklyStats.totalEntries}
        averageMood={weeklyStats.averageMood}
        prayersAnswered={weeklyStats.prayersAnswered}
      />
      
      {/* Mood chart */}
      <MoodChart data={moodData} />
      
      {/* Prayer chart */}
      <PrayerChart data={prayerData} />
    </div>
  );
};

export default GrowthDashboard;

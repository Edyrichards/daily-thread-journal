
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import StatCards from "@/components/dashboard/StatCards";
import MoodChart from "@/components/dashboard/MoodChart";
import PrayerChart from "@/components/dashboard/PrayerChart";
import { useWeeklyData } from "@/hooks/useWeeklyData";

const GrowthDashboard = () => {
  const navigate = useNavigate();
  const { moodData, prayerData, weeklyStats } = useWeeklyData();

  return (
    <Layout title="Spiritual Growth">
      <div className="mb-8">
        <p className="text-[#666] italic font-serif">
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
    </Layout>
  );
};

export default GrowthDashboard;

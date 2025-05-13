
import { Activity, TrendingUp } from "lucide-react";
import StatCard from "./StatCard";

interface StatCardsProps {
  totalEntries: number;
  averageMood: number;
  prayersAnswered: number;
}

const StatCards = ({ totalEntries, averageMood, prayersAnswered }: StatCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <StatCard 
        title="Journal Entries" 
        value={totalEntries} 
        subtitle="This week" 
        icon={Activity} 
      />
      <StatCard 
        title="Average Mood" 
        value={averageMood > 0 ? averageMood.toFixed(1) : "N/A"} 
        subtitle="Scale 1-10" 
        icon={TrendingUp} 
      />
      <StatCard 
        title="Prayers Answered" 
        value={prayersAnswered} 
        subtitle="This week" 
        icon={Activity} 
      />
    </div>
  );
};

export default StatCards;

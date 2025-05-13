
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent
} from "@/components/ui/chart";

// Config for the prayer chart
const config = {
  prayers: { 
    label: "Prayers", 
    theme: { light: "#e6c27a", dark: "#e6c27a" }
  }
};

interface PrayerChartProps {
  data: Array<{name: string; prayers: number}>;
}

const PrayerChart = ({ data }: PrayerChartProps) => {
  return (
    <Card className="border-grace-200">
      <CardHeader>
        <CardTitle className="text-xl font-medium text-grace-700">Prayers Answered</CardTitle>
        <CardDescription>Blessings received throughout the week</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-80">
          <BarChart data={data}>
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
  );
};

export default PrayerChart;

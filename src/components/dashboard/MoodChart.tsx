
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent
} from "@/components/ui/chart";

// Config for the mood chart
const config = {
  mood: { 
    label: "Mood", 
    theme: { light: "#a48df3", dark: "#a48df3" }
  }
};

interface MoodChartProps {
  data: Array<{name: string; mood: number}>;
}

const MoodChart = ({ data }: MoodChartProps) => {
  return (
    <Card className="border-grace-200 mb-8">
      <CardHeader>
        <CardTitle className="text-xl font-medium text-grace-700">Weekly Mood</CardTitle>
        <CardDescription>Your emotional journey this week</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-80">
          <LineChart data={data}>
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
  );
};

export default MoodChart;

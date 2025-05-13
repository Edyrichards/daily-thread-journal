
import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
}

const StatCard = ({ title, value, subtitle, icon: Icon }: StatCardProps) => {
  return (
    <Card className="border-grace-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium text-grace-700 flex items-center gap-2">
          <Icon className="h-5 w-5 text-grace-400" /> 
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-grace-700">{value}</p>
        <p className="text-sm text-grace-500">{subtitle}</p>
      </CardContent>
    </Card>
  );
};

export default StatCard;


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { Calendar, TrendingUp, Heart, CheckCircle } from 'lucide-react';
import { getEnhancedPrayers, EnhancedPrayer } from '@/lib/enhancedStorage';

const EnhancedPrayerInsights = () => {
  const [prayers, setPrayers] = useState<EnhancedPrayer[]>([]);
  const [insights, setInsights] = useState<any>({});

  useEffect(() => {
    loadPrayerData();
  }, []);

  const loadPrayerData = () => {
    const prayerData = getEnhancedPrayers();
    setPrayers(prayerData);
    calculateInsights(prayerData);
  };

  const calculateInsights = (prayerData: EnhancedPrayer[]) => {
    const now = Date.now();
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
    const recentPrayers = prayerData.filter(p => p.dateCreated > thirtyDaysAgo);

    // Category breakdown
    const categoryCount = prayerData.reduce((acc, prayer) => {
      acc[prayer.category] = (acc[prayer.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Status breakdown
    const statusCount = prayerData.reduce((acc, prayer) => {
      acc[prayer.status] = (acc[prayer.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Answer rate
    const answeredPrayers = prayerData.filter(p => p.status === 'answered').length;
    const answerRate = prayerData.length > 0 ? (answeredPrayers / prayerData.length) * 100 : 0;

    // Weekly prayer trend
    const weeklyData = Array.from({ length: 4 }, (_, i) => {
      const weekStart = now - ((i + 1) * 7 * 24 * 60 * 60 * 1000);
      const weekEnd = now - (i * 7 * 24 * 60 * 60 * 1000);
      const weekPrayers = prayerData.filter(p => 
        p.dateCreated >= weekStart && p.dateCreated < weekEnd
      ).length;
      
      return {
        week: `Week ${4 - i}`,
        prayers: weekPrayers
      };
    });

    setInsights({
      totalPrayers: prayerData.length,
      recentPrayers: recentPrayers.length,
      categoryData: Object.entries(categoryCount).map(([name, value]) => ({ name, value })),
      statusData: Object.entries(statusCount).map(([name, value]) => ({ name, value })),
      answerRate,
      weeklyData
    });
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-serif mb-2">Prayer Insights</h2>
        <p className="text-muted-foreground">
          Understanding your prayer journey and God's faithfulness
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Heart className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{insights.totalPrayers || 0}</p>
            <p className="text-sm text-muted-foreground">Total Prayers</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{insights.recentPrayers || 0}</p>
            <p className="text-sm text-muted-foreground">This Month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold">{Math.round(insights.answerRate || 0)}%</p>
            <p className="text-sm text-muted-foreground">Answer Rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">
              {insights.weeklyData ? 
                Math.round(insights.weeklyData.reduce((sum: number, week: any) => sum + week.prayers, 0) / 4) 
                : 0
              }
            </p>
            <p className="text-sm text-muted-foreground">Avg/Week</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="categories" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Prayer Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={insights.categoryData || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {(insights.categoryData || []).map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle>Prayer Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={insights.statusData || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Prayer Frequency Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={insights.weeklyData || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="prayers" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Faithfulness Reminder */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-none">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-serif mb-2">God's Faithfulness</h3>
          <p className="text-sm text-muted-foreground mb-4">
            "And my God will meet all your needs according to the riches of his glory in Christ Jesus." - Philippians 4:19
          </p>
          <div className="flex justify-center space-x-4">
            <Badge variant="secondary">Faithful</Badge>
            <Badge variant="secondary">Loving</Badge>
            <Badge variant="secondary">Present</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedPrayerInsights;

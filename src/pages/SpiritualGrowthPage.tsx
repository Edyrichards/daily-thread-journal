
import React from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SpiritualInsights from '@/components/SpiritualInsights';
import HabitTracker from '@/components/HabitTracker';
import DevotionalLibrary from '@/components/DevotionalLibrary';
import { TrendingUp, Target, BookOpen } from 'lucide-react';

const SpiritualGrowthPage = () => {
  return (
    <Layout title="Spiritual Growth">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-serif text-foreground mb-2">
            Your Spiritual Growth Journey
          </h1>
          <p className="text-muted-foreground">
            Track your progress, build spiritual habits, and discover meaningful content
          </p>
        </div>

        <Tabs defaultValue="insights" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="insights" className="flex items-center space-x-2">
              <TrendingUp size={16} />
              <span>Insights</span>
            </TabsTrigger>
            <TabsTrigger value="habits" className="flex items-center space-x-2">
              <Target size={16} />
              <span>Habits</span>
            </TabsTrigger>
            <TabsTrigger value="devotionals" className="flex items-center space-x-2">
              <BookOpen size={16} />
              <span>Devotionals</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="insights">
            <SpiritualInsights />
          </TabsContent>

          <TabsContent value="habits">
            <HabitTracker />
          </TabsContent>

          <TabsContent value="devotionals">
            <DevotionalLibrary />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SpiritualGrowthPage;


import React from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ScriptureLookup from '@/components/ScriptureLookup';
import BibleReadingPlans from '@/components/BibleReadingPlans';
import { Search, Calendar } from 'lucide-react';

const ScripturePage = () => {
  return (
    <Layout title="Scripture Study">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-serif text-foreground mb-2">
            Scripture Study & Reading
          </h1>
          <p className="text-muted-foreground">
            Search verses, explore reading plans, and deepen your Bible study
          </p>
        </div>

        <Tabs defaultValue="lookup" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="lookup" className="flex items-center space-x-2">
              <Search size={16} />
              <span>Scripture Lookup</span>
            </TabsTrigger>
            <TabsTrigger value="plans" className="flex items-center space-x-2">
              <Calendar size={16} />
              <span>Reading Plans</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lookup">
            <ScriptureLookup />
          </TabsContent>

          <TabsContent value="plans">
            <BibleReadingPlans />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ScripturePage;

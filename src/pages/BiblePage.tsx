
import React from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BibleDequeue from '@/components/BibleDequeue';
import ScriptureLookup from '@/components/ScriptureLookup';
import BibleReadingPlans from '@/components/BibleReadingPlans';
import { BookOpen, Search, Calendar, Heart } from 'lucide-react';

const BiblePage = () => {
  return (
    <Layout title="Bible Study">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-serif text-foreground mb-2">
            Bible Study & Reading
          </h1>
          <p className="text-muted-foreground">
            Dive deep into God's Word with verse-by-verse study, explanations, and reading plans
          </p>
        </div>

        <Tabs defaultValue="dequeue" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dequeue" className="flex items-center space-x-2">
              <Heart size={16} />
              <span>Bible Dequeue</span>
            </TabsTrigger>
            <TabsTrigger value="lookup" className="flex items-center space-x-2">
              <Search size={16} />
              <span>Scripture Lookup</span>
            </TabsTrigger>
            <TabsTrigger value="plans" className="flex items-center space-x-2">
              <Calendar size={16} />
              <span>Reading Plans</span>
            </TabsTrigger>
            <TabsTrigger value="study" className="flex items-center space-x-2">
              <BookOpen size={16} />
              <span>Study Tools</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dequeue">
            <BibleDequeue />
          </TabsContent>

          <TabsContent value="lookup">
            <ScriptureLookup />
          </TabsContent>

          <TabsContent value="plans">
            <BibleReadingPlans />
          </TabsContent>

          <TabsContent value="study">
            <div className="text-center p-8 bg-muted/30 rounded-xl">
              <BookOpen size={48} className="mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-serif mb-2">Advanced Study Tools</h3>
              <p className="text-muted-foreground">
                Coming soon: Word studies, commentaries, and cross-reference tools
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default BiblePage;

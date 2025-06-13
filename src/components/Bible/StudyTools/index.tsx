
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, MessageSquare, ArrowRight } from 'lucide-react';
import WordStudy from './WordStudy';
import Commentary from './Commentary';
import CrossReferences from './CrossReferences';

const BibleStudyTools = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-serif mb-2">Advanced Study Tools</h2>
        <p className="text-muted-foreground">
          Dive deeper into Scripture with word studies, commentaries, and cross-references
        </p>
      </div>

      <Tabs defaultValue="word-study" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="word-study" className="flex items-center space-x-2">
            <BookOpen size={16} />
            <span>Word Study</span>
          </TabsTrigger>
          <TabsTrigger value="commentary" className="flex items-center space-x-2">
            <MessageSquare size={16} />
            <span>Commentary</span>
          </TabsTrigger>
          <TabsTrigger value="cross-refs" className="flex items-center space-x-2">
            <ArrowRight size={16} />
            <span>Cross References</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="word-study">
          <WordStudy />
        </TabsContent>

        <TabsContent value="commentary">
          <Commentary />
        </TabsContent>

        <TabsContent value="cross-refs">
          <CrossReferences />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BibleStudyTools;

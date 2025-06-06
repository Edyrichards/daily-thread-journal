
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Heart, BookOpen, Hands, Sparkles } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  content: string;
  color: string;
}

interface EntryTemplatesProps {
  onSelectTemplate: (content: string) => void;
  onSkip: () => void;
}

const templates: Template[] = [
  {
    id: 'morning',
    name: 'Morning Devotion',
    icon: <Clock size={20} />,
    description: 'Start your day with intentional reflection',
    color: 'bg-yellow-50 border-yellow-200',
    content: `Good morning, Lord!

**What I'm grateful for today:**
• 

**Scripture for today:**


**Prayers for today:**
• 

**How I want to serve You today:**


**My heart's desire:**

`
  },
  {
    id: 'evening',
    name: 'Evening Reflection',
    icon: <Sparkles size={20} />,
    description: 'Reflect on God\'s presence throughout your day',
    color: 'bg-purple-50 border-purple-200',
    content: `Thank you for this day, God.

**How I saw You today:**


**What I learned:**


**Moments of joy:**
• 

**Challenges I faced:**


**Tomorrow I want to:**


**Prayer before rest:**

`
  },
  {
    id: 'gratitude',
    name: 'Gratitude Log',
    icon: <Heart size={20} />,
    description: 'Count your blessings and celebrate God\'s goodness',
    color: 'bg-rose-50 border-rose-200',
    content: `Counting my blessings today...

**Three things I'm grateful for:**
1. 
2. 
3. 

**A person I'm thankful for:**


**A way God provided for me:**


**A small joy from today:**


**A prayer of thanksgiving:**

`
  },
  {
    id: 'prayer',
    name: 'Prayer Journal',
    icon: <Hands size={20} />,
    description: 'Dedicated time for prayer and conversation with God',
    color: 'bg-blue-50 border-blue-200',
    content: `Dear Heavenly Father,

**Adoration - Who You are:**


**Confession - What I need to release:**


**Thanksgiving - What I'm grateful for:**


**Supplication - My prayers for others:**
• 

**Personal requests:**
• 

**Listening prayer - What I sense You saying:**


Amen.`
  },
  {
    id: 'study',
    name: 'Scripture Study',
    icon: <BookOpen size={20} />,
    description: 'Deep dive into God\'s Word with structured reflection',
    color: 'bg-green-50 border-green-200',
    content: `Scripture Study

**Passage:**


**What stands out to me:**


**Questions I have:**
• 

**What this teaches me about God:**


**How this applies to my life:**


**Prayer response:**

`
  }
];

const EntryTemplates: React.FC<EntryTemplatesProps> = ({ onSelectTemplate, onSkip }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-serif text-foreground mb-2">
          Choose Your Journal Style
        </h2>
        <p className="text-muted-foreground">
          Select a template to guide your reflection, or start with a blank page
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template) => (
          <Card 
            key={template.id} 
            className={`cursor-pointer hover:shadow-md transition-all duration-200 ${template.color}`}
            onClick={() => onSelectTemplate(template.content)}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="text-foreground">
                  {template.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground mb-1">
                    {template.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {template.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button 
          variant="outline" 
          onClick={onSkip}
          className="rounded-full px-8"
        >
          Start with blank page
        </Button>
      </div>
    </div>
  );
};

export default EntryTemplates;

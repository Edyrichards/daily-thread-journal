
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BookOpen, Heart, ArrowRight, Clock } from 'lucide-react';
import { type BibleVerse } from '@/lib/bibleApi';

interface DevotionalContent {
  id: string;
  title: string;
  verse: BibleVerse;
  reflection: string;
  prayer: string;
  application: string;
  duration: string;
  theme: string;
}

interface ScriptureDevotionalProps {
  onStartDevotional?: (devotional: DevotionalContent) => void;
}

const ScriptureDevotional: React.FC<ScriptureDevotionalProps> = ({ onStartDevotional }) => {
  const [currentDevotional] = useState<DevotionalContent>({
    id: 'daily-1',
    title: 'Walking in God\'s Love',
    verse: {
      id: 'john-3-16',
      book: 'John',
      chapter: 3,
      verse: 16,
      text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
      translation: 'NIV',
      reference: 'John 3:16'
    },
    reflection: 'God\'s love is not just an emotion—it\'s an action. The greatest demonstration of love in human history was when God gave His Son for us. This wasn\'t because we deserved it, but because love compelled Him to act.',
    prayer: 'Lord, help me to understand the depth of Your love for me. May this truth transform how I see myself and others. Give me courage to love as You have loved me.',
    application: 'Today, look for one opportunity to show sacrificial love to someone in your life. Consider how God\'s love for you can overflow into love for others.',
    duration: '5 min',
    theme: 'God\'s Love'
  });

  const [currentStep, setCurrentStep] = useState<'verse' | 'reflection' | 'prayer' | 'application'>('verse');

  const steps = [
    { key: 'verse', label: 'Scripture', icon: BookOpen },
    { key: 'reflection', label: 'Reflection', icon: Heart },
    { key: 'prayer', label: 'Prayer', icon: Heart },
    { key: 'application', label: 'Application', icon: ArrowRight }
  ];

  const handleNext = () => {
    const currentIndex = steps.findIndex(step => step.key === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].key as any);
    }
  };

  const handlePrevious = () => {
    const currentIndex = steps.findIndex(step => step.key === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].key as any);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'verse':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <Badge variant="outline">{currentDevotional.verse.reference}</Badge>
                <Badge variant="secondary">{currentDevotional.verse.translation}</Badge>
              </div>
              <p className="text-lg font-serif italic leading-relaxed">
                "{currentDevotional.verse.text}"
              </p>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Take a moment to read and meditate on this verse.
            </p>
          </div>
        );
      
      case 'reflection':
        return (
          <div className="space-y-4">
            <h4 className="font-medium">Reflection</h4>
            <p className="leading-relaxed">{currentDevotional.reflection}</p>
          </div>
        );
      
      case 'prayer':
        return (
          <div className="space-y-4">
            <h4 className="font-medium">Prayer</h4>
            <p className="leading-relaxed italic">{currentDevotional.prayer}</p>
            <p className="text-sm text-muted-foreground">
              Use this as a starting point for your own prayer.
            </p>
          </div>
        );
      
      case 'application':
        return (
          <div className="space-y-4">
            <h4 className="font-medium">Today's Application</h4>
            <p className="leading-relaxed">{currentDevotional.application}</p>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BookOpen size={20} />
            {currentDevotional.title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock size={12} />
              {currentDevotional.duration}
            </Badge>
            <Badge>{currentDevotional.theme}</Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Progress indicator */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isActive = step.key === currentStep;
            const isCompleted = steps.findIndex(s => s.key === currentStep) > index;
            
            return (
              <div key={step.key} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  isActive ? 'border-primary bg-primary text-primary-foreground' :
                  isCompleted ? 'border-primary bg-primary/10 text-primary' :
                  'border-muted-foreground/30 text-muted-foreground'
                }`}>
                  <step.icon size={14} />
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-2 ${
                    isCompleted ? 'bg-primary' : 'bg-muted-foreground/30'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        <Separator />

        {/* Step content */}
        <div className="min-h-48">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 'verse'}
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentStep === 'application'}
          >
            {currentStep === 'application' ? 'Complete' : 'Next'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScriptureDevotional;

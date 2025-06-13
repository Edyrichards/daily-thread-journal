
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, RefreshCw, Info } from 'lucide-react';
import { BIBLE_TRANSLATIONS } from '@/lib/bibleApi';

interface NavigationControlsProps {
  selectedTranslation: string;
  isLoading: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
  hasExplanation: boolean;
  showExplanation: boolean;
  onGoBack: () => void;
  onGoForward: () => void;
  onGetRandom: () => void;
  onTranslationChange: (translation: string) => void;
  onToggleExplanation: () => void;
}

const NavigationControls: React.FC<NavigationControlsProps> = ({
  selectedTranslation,
  isLoading,
  canGoBack,
  canGoForward,
  hasExplanation,
  showExplanation,
  onGoBack,
  onGoForward,
  onGetRandom,
  onTranslationChange,
  onToggleExplanation
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onGoBack}
            disabled={!canGoBack}
          >
            <ChevronLeft size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onGoForward}
            disabled={!canGoForward}
          >
            <ChevronRight size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onGetRandom}
            disabled={isLoading}
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Select value={selectedTranslation} onValueChange={onTranslationChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {BIBLE_TRANSLATIONS.map((translation) => (
              <SelectItem key={translation.id} value={translation.id}>
                {translation.abbreviation}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleExplanation}
          disabled={!hasExplanation}
        >
          <Info size={16} className="mr-1" />
          {showExplanation ? 'Hide' : 'Show'} Explanation
        </Button>
      </div>
    </div>
  );
};

export default NavigationControls;

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { bibleApi, BibleVerse, getVerseExplanation, type VerseExplanation } from '@/lib/bibleApi';
import { AnimatePresence } from 'framer-motion';
import NavigationControls from './BibleDequeue/NavigationControls';
import VerseDisplay from './BibleDequeue/VerseDisplay';
import BookmarkedVerses from './BibleDequeue/BookmarkedVerses';
import VerseDetails from './ScriptureLookup/VerseDetails';

interface BibleDequeueProps {
  onAddToJournal?: (verse: BibleVerse) => void;
  initialVerse?: string;
}

const BibleDequeue: React.FC<BibleDequeueProps> = ({ onAddToJournal, initialVerse = 'John 3:16' }) => {
  const [currentVerse, setCurrentVerse] = useState<BibleVerse | null>(null);
  const [selectedTranslation, setSelectedTranslation] = useState('NIV');
  const [isLoading, setIsLoading] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [explanation, setExplanation] = useState<VerseExplanation | null>(null);
  const [bookmarkedVerses, setBookmarkedVerses] = useState<BibleVerse[]>([]);
  const [verseHistory, setVerseHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const { toast } = useToast();

  useEffect(() => {
    loadVerse(initialVerse);
  }, [initialVerse]);

  const loadVerse = async (reference: string) => {
    setIsLoading(true);
    try {
      const verse = await bibleApi.getVerse(reference, selectedTranslation);
      if (verse) {
        setCurrentVerse(verse);
        setExplanation(getVerseExplanation(reference));
        
        const newHistory = [...verseHistory];
        if (historyIndex < newHistory.length - 1) {
          newHistory.splice(historyIndex + 1);
        }
        newHistory.push(reference);
        setVerseHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
      } else {
        toast({
          title: "Verse not found",
          description: "Could not load the requested verse.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error loading verse:', error);
      toast({
        title: "Error loading verse",
        description: "Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      loadVerse(verseHistory[newIndex]);
    }
  };

  const goForward = () => {
    if (historyIndex < verseHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      loadVerse(verseHistory[newIndex]);
    }
  };

  const getRandomVerse = async () => {
    const randomVerses = [
      'Psalm 23:1', 'Romans 8:28', 'Proverbs 3:5-6', 'Isaiah 40:31',
      'Matthew 11:28', 'Philippians 4:19', '1 Peter 5:7', 'James 1:5',
      'Psalm 46:10', 'Jeremiah 33:3', '2 Timothy 1:7', 'Psalm 139:14'
    ];
    const randomRef = randomVerses[Math.floor(Math.random() * randomVerses.length)];
    await loadVerse(randomRef);
  };

  const toggleBookmark = () => {
    if (!currentVerse) return;
    
    const isBookmarked = bookmarkedVerses.some(v => v.id === currentVerse.id);
    
    if (isBookmarked) {
      setBookmarkedVerses(bookmarkedVerses.filter(v => v.id !== currentVerse.id));
      toast({
        title: "Bookmark removed",
        description: `${currentVerse.reference} removed from bookmarks.`,
      });
    } else {
      setBookmarkedVerses([...bookmarkedVerses, currentVerse]);
      toast({
        title: "Verse bookmarked",
        description: `${currentVerse.reference} added to bookmarks.`,
      });
    }
  };

  const shareVerse = async () => {
    if (!currentVerse) return;
    
    const shareText = `"${currentVerse.text}" - ${currentVerse.reference} (${currentVerse.translation})`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentVerse.reference,
          text: shareText,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      toast({
        title: "Verse copied",
        description: "Verse copied to clipboard.",
      });
    }
  };

  const speakVerse = () => {
    if (!currentVerse) return;
    
    const utterance = new SpeechSynthesisUtterance(
      `${currentVerse.reference}. ${currentVerse.text}`
    );
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  };

  const addToJournal = () => {
    if (currentVerse && onAddToJournal) {
      onAddToJournal(currentVerse);
      toast({
        title: "Added to journal",
        description: "Verse added to your journal entry.",
      });
    }
  };

  const changeTranslation = async (newTranslation: string) => {
    setSelectedTranslation(newTranslation);
    if (currentVerse) {
      await loadVerse(currentVerse.reference);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen size={20} />
            <span>Bible Dequeue</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <NavigationControls
            selectedTranslation={selectedTranslation}
            isLoading={isLoading}
            canGoBack={historyIndex > 0}
            canGoForward={historyIndex < verseHistory.length - 1}
            hasExplanation={!!explanation}
            showExplanation={showExplanation}
            onGoBack={goBack}
            onGoForward={goForward}
            onGetRandom={getRandomVerse}
            onTranslationChange={changeTranslation}
            onToggleExplanation={() => setShowExplanation(!showExplanation)}
          />
        </CardContent>
      </Card>

      <AnimatePresence mode="wait">
        {currentVerse && (
          <VerseDisplay
            verse={currentVerse}
            isBookmarked={bookmarkedVerses.some(v => v.id === currentVerse.id)}
            onToggleBookmark={toggleBookmark}
            onShare={shareVerse}
            onSpeak={speakVerse}
            onAddToJournal={onAddToJournal ? addToJournal : undefined}
          />
        )}
      </AnimatePresence>

      {showExplanation && explanation && currentVerse && (
        <VerseDetails
          verse={currentVerse}
          explanation={explanation}
          showExplanation={true}
          onToggleExplanation={() => setShowExplanation(false)}
        />
      )}

      <BookmarkedVerses
        bookmarkedVerses={bookmarkedVerses}
        onVerseSelect={loadVerse}
      />
    </div>
  );
};

export default BibleDequeue;

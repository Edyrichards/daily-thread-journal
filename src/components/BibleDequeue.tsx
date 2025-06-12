
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BookOpen, ChevronLeft, ChevronRight, Bookmark, Share2, 
  Volume2, Eye, Plus, Heart, MessageCircle, Search,
  RefreshCw, Home, Info
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { bibleApi, BibleVerse, BIBLE_TRANSLATIONS, getVerseExplanation, type VerseExplanation } from '@/lib/bibleApi';
import { motion, AnimatePresence } from 'framer-motion';

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
        
        // Update history
        const newHistory = [...verseHistory];
        if (historyIndex < newHistory.length - 1) {
          // Remove forward history if we're not at the end
          newHistory.splice(historyIndex + 1);
        }
        newHistory.push(reference);
        setVerseHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
      } else {
        toast({
          title: "Verse not found",
          description: "Could not load the requested verse. Please try another reference.",
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
      {/* Navigation and Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen size={20} />
              <span>Bible Dequeue</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={goBack}
                disabled={historyIndex <= 0}
              >
                <ChevronLeft size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={goForward}
                disabled={historyIndex >= verseHistory.length - 1}
              >
                <ChevronRight size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={getRandomVerse}
                disabled={isLoading}
              >
                <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Select value={selectedTranslation} onValueChange={changeTranslation}>
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
              onClick={() => setShowExplanation(!showExplanation)}
              disabled={!explanation}
            >
              <Info size={16} className="mr-1" />
              {showExplanation ? 'Hide' : 'Show'} Explanation
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Verse Display */}
      <AnimatePresence mode="wait">
        {currentVerse && (
          <motion.div
            key={currentVerse.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-grace-100 to-lightBeige border-grace-200">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <div className="space-y-4">
                    <h2 className="text-xl font-serif text-foreground">
                      {currentVerse.reference}
                    </h2>
                    <Badge variant="outline" className="text-xs">
                      {currentVerse.translation}
                    </Badge>
                  </div>
                  
                  <blockquote className="text-lg md:text-xl font-serif text-foreground leading-relaxed italic">
                    "{currentVerse.text}"
                  </blockquote>
                  
                  <Separator className="my-6" />
                  
                  {/* Action Buttons */}
                  <div className="flex flex-wrap justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleBookmark}
                    >
                      <Bookmark 
                        size={16} 
                        className={bookmarkedVerses.some(v => v.id === currentVerse.id) ? 'fill-current' : ''} 
                      />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={shareVerse}
                    >
                      <Share2 size={16} />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={speakVerse}
                    >
                      <Volume2 size={16} />
                    </Button>
                    
                    {onAddToJournal && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={addToJournal}
                      >
                        <Plus size={16} />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Verse Explanation */}
      {showExplanation && explanation && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle size={20} />
                <span>Understanding This Verse</span>
                <Badge variant="outline" className="ml-2">
                  {explanation.difficulty}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Commentary</h4>
                <p className="text-sm leading-relaxed">{explanation.commentary}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Historical Context</h4>
                <p className="text-sm leading-relaxed">{explanation.historicalContext}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Application</h4>
                <p className="text-sm leading-relaxed">{explanation.application}</p>
              </div>
              
              {explanation.crossReferences.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">Cross References</h4>
                  <div className="flex flex-wrap gap-2">
                    {explanation.crossReferences.map((ref, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => loadVerse(ref)}
                        className="text-xs"
                      >
                        {ref}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              {explanation.keywords.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">Key Themes</h4>
                  <div className="flex flex-wrap gap-1">
                    {explanation.keywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Bookmarked Verses */}
      {bookmarkedVerses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart size={20} />
              <span>Bookmarked Verses</span>
              <Badge variant="outline">{bookmarkedVerses.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-32">
              <div className="space-y-2">
                {bookmarkedVerses.map((verse) => (
                  <div
                    key={verse.id}
                    className="flex items-center justify-between p-2 bg-muted/30 rounded cursor-pointer hover:bg-muted/50"
                    onClick={() => loadVerse(verse.reference)}
                  >
                    <span className="text-sm font-medium">{verse.reference}</span>
                    <Badge variant="outline" className="text-xs">
                      {verse.translation}
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BibleDequeue;

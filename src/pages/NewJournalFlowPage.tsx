import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Mood, JournalEntry as JournalEntryType, saveJournalEntry, generateId } from '@/lib/storage'; // Added JournalEntryType, saveJournalEntry, generateId
import { cn } from '@/lib/utils';
import { getVerseByMood } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast'; // Added

// Define Mood options based on the task description
// Values must be valid Mood types from lib/storage.ts
// joyful, peaceful, hopeful, content, neutral, anxious, sad, stressed, angry, overwhelmed.
const moodOptions: Array<{ label: string; emoji: string; value: Mood; bgColor: string }> = [
  { label: "Happy", emoji: "😊", value: "joyful", bgColor: "bg-grace-gold/70" },
  { label: "Grateful", emoji: "🙏", value: "content", bgColor: "bg-grace-blue/70" },
  { label: "Anxious", emoji: "😟", value: "anxious", bgColor: "bg-soft-peach/70" }, // Using /70
  { label: "Sad", emoji: "😢", value: "sad", bgColor: "bg-lightBeige/70" },      // Using /70
  { label: "Hopeful", emoji: "✨", value: "hopeful", bgColor: "bg-grace-200/70" },
  { label: "Peaceful", emoji: "😌", value: "peaceful", bgColor: "bg-primary/30" }
];


const NewJournalFlowPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [currentVerse, setCurrentVerse] = useState<{ text: string; reference: string } | null>(null);
  const [isLoadingVerse, setIsLoadingVerse] = useState(false);
  const [journalText, setJournalText] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [reflectionText, setReflectionText] = useState(""); // Added
  const [searchParams, setSearchParams] = useSearchParams(); // Updated to setSearchParams for clearing
  const navigate = useNavigate();
  const { toast } = useToast(); // Added

  useEffect(() => {
    const moodParam = searchParams.get('mood') as Mood | null;
    if (moodParam && moodOptions.some(option => option.value === moodParam)) {
      setSelectedMood(moodParam);
      // Optional: Automatically advance to step 2 if mood is pre-selected
      // setCurrentStep(2); 
    }
  }, [searchParams]);

  useEffect(() => {
    if (currentStep === 2 && selectedMood && !currentVerse && !isLoadingVerse) {
      setIsLoadingVerse(true);
      const fetchVerse = async () => {
        try {
          const verseData = await getVerseByMood(selectedMood);
          setCurrentVerse(verseData);
        } catch (error) {
          console.error("Error fetching verse for mood:", error);
          setCurrentVerse(null);
        } finally {
          setIsLoadingVerse(false);
        }
      };
      fetchVerse();
    }
  }, [currentStep, selectedMood, currentVerse, isLoadingVerse]);

  // Effect for word count
  useEffect(() => {
    const words = journalText.trim().split(/\s+/).filter(Boolean);
    setWordCount(words.length === 1 && words[0] === '' ? 0 : words.length);
  }, [journalText]);

  const resetFlowStates = () => {
    setSelectedMood(null);
    setCurrentVerse(null);
    setJournalText("");
    setReflectionText(""); // Added
    setWordCount(0);
    setCurrentStep(1);
    // Clear searchParams by navigating to the same path without them
    navigate("/journal/new-flow", { replace: true });
  };

  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood);
    setCurrentVerse(null); 
    setIsLoadingVerse(false); 
    setJournalText("");
    setReflectionText(""); // Added
    setWordCount(0);
    setCurrentStep(2);
  };

  const handleSaveEntry = () => {
    if (!selectedMood) {
      toast({ title: "Error", description: "Mood not selected.", variant: "destructive" });
      return;
    }
    const newEntry: JournalEntryType = {
      id: generateId(),
      date: new Date().toISOString().split('T')[0],
      mood: selectedMood,
      content: journalText,
      verse: currentVerse || undefined,
      reflection: reflectionText.trim() || undefined,
      createdAt: Date.now(),
    };

    saveJournalEntry(newEntry);
    toast({ title: "Entry Saved", description: "Your reflection has been saved." });
    resetFlowStates(); // Reset states
    navigate("/journal"); // Navigate to journal list
  };
  
  const currentMoodDetails = moodOptions.find(m => m.value === selectedMood);

  return (
    <Layout title="New Reflection">
      <motion.div 
        className="p-4 md:p-8"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -50 }} // Added exit animation
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-serif text-foreground mb-8 text-center">
              How are you feeling right now?
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-2xl mx-auto">
              {moodOptions.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => handleMoodSelect(mood.value)}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 md:p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer aspect-square",
                    mood.bgColor,
                    selectedMood === mood.value 
                      ? "ring-2 ring-primary ring-offset-2 ring-offset-background" 
                      : "hover:scale-105"
                  )}
                >
                  <span className="text-3xl md:text-4xl mb-2">{mood.emoji}</span>
                  <span className="text-sm md:text-md text-foreground text-center">{mood.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h3 className="text-lg text-muted-foreground mb-4">
              Feeling: {currentMoodDetails?.label} {currentMoodDetails?.emoji}
            </h3>
            
            {isLoadingVerse && (
              <p className="text-center text-foreground py-10">Finding a comforting word...</p>
            )}
            
            {!isLoadingVerse && currentVerse && (
              <Card className="bg-grace-100/80 p-6 rounded-2xl shadow-lg my-6 max-w-lg mx-auto">
                <p className="font-serif text-lg text-foreground mb-2">"{currentVerse.text}"</p>
                <p className="text-sm text-muted-foreground text-right">— {currentVerse.reference}</p>
              </Card>
            )}

            {!isLoadingVerse && !currentVerse && (
              <p className="text-center text-muted-foreground py-10">
                No specific verse found for this mood, or you can reflect freely.
              </p>
            )}

            <div className="flex justify-between items-center mt-8 max-w-md mx-auto">
              <Button 
                variant="outline" 
                onClick={() => { 
                  setCurrentStep(1); 
                  setCurrentVerse(null); 
                  setIsLoadingVerse(false); // Reset loading state
                }} 
                className="rounded-xl"
              >
                Back
              </Button>
              <Button 
                onClick={() => setCurrentStep(3)} 
                className="rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Continue
              </Button>
            </div>
          </motion.div>
        )}

        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }} // Added exit animation
            transition={{ duration: 0.5 }}
            className="max-w-xl mx-auto" // Centering content
          >
            <h2 className="text-xl font-serif text-foreground mb-6 text-center">
              {`Reflecting on ${currentMoodDetails?.label || 'your day'}${currentVerse ? ` after reading ${currentVerse.reference}` : ''}`}
            </h2>
            
            <Textarea
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              placeholder="Write your thoughts here..."
              className="w-full min-h-[250px] p-4 rounded-2xl border bg-card focus:ring-2 focus:ring-primary shadow-sm text-base"
            />
            <p className="text-sm text-muted-foreground mt-2 text-right">
              Word count: {wordCount}
            </p>

            <div className="flex justify-between items-center mt-8">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(2)} 
                className="rounded-xl"
              >
                Back
              </Button>
              <Button 
                onClick={() => setCurrentStep(4)} 
                className="rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Continue to Reflection
              </Button>
            </div>
          </motion.div>
        )}

        {currentStep === 4 && (
           <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }} // Added exit animation for consistency
            transition={{ duration: 0.5 }}
            className="max-w-xl mx-auto" // Centering content
          >
            <h2 className="text-xl font-serif text-foreground mb-4 text-center">
              What is God saying to you in this moment?
            </h2>
            <Textarea
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              placeholder="A short reflection..."
              className="w-full min-h-[100px] p-3 rounded-2xl border bg-card focus:ring-2 focus:ring-primary shadow-sm text-base"
              rows={4}
            />
            <div className="flex justify-between items-center mt-8">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep(3)} 
                className="rounded-xl"
              >
                Back
              </Button>
              <Button 
                onClick={handleSaveEntry} 
                className="rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Save Entry
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default NewJournalFlowPage;

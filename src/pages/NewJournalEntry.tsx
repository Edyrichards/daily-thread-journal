
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import MoodPicker from "@/components/MoodPicker";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { JournalEntry, Mood, generateId, saveJournalEntry } from "@/lib/storage";
import { getRandomVerse } from "@/lib/api";

const NewJournalEntry = () => {
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<Mood | null>(null);
  const [verse, setVerse] = useState<{ text: string; reference: string } | null>(null);
  const [isLoadingVerse, setIsLoadingVerse] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if mood was selected from home page
    const currentMood = localStorage.getItem("current_mood") as Mood | null;
    const journalTemplate = localStorage.getItem("journal_template");
    
    if (currentMood) {
      setMood(currentMood);
      
      // Set initial content from template if available
      if (journalTemplate) {
        setContent(journalTemplate);
      }
    }
  }, []);

  const handleAddVerse = async () => {
    setIsLoadingVerse(true);
    try {
      const verseData = await getRandomVerse();
      setVerse(verseData);
    } catch (error) {
      console.error("Error fetching Bible verse:", error);
      toast({
        title: "Error",
        description: "Failed to load a verse. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingVerse(false);
    }
  };

  const handleMoodChange = (newMood: Mood) => {
    setMood(newMood);
    localStorage.setItem("current_mood", newMood);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!mood) {
      toast({
        title: "Mood Required",
        description: "Please select how you're feeling today.",
        variant: "destructive",
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "Entry Required",
        description: "Please write something for your journal entry.",
        variant: "destructive",
      });
      return;
    }

    const today = new Date();
    const entry: JournalEntry = {
      id: generateId(),
      date: today.toISOString().split('T')[0],
      content,
      mood,
      verse: verse || undefined,
      createdAt: Date.now(),
    };

    saveJournalEntry(entry);
    
    toast({
      title: "Entry Saved",
      description: "Your journal entry has been saved.",
    });
    
    // Clear the mood selection for today to allow a new entry with potentially different mood
    localStorage.removeItem("journal_template");
    
    navigate("/journal");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f3eb]">
      <Header title="THREADS of GRACE" />
      <main className="flex-1 container max-w-md mx-auto px-6 py-6 animate-fade-in">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="mb-4">
            <h2 className="text-xl font-serif text-[#333] mb-3">How are you feeling?</h2>
            <MoodPicker selectedMood={mood} onSelectMood={handleMoodChange} />
          </div>
          
          <div className="flex-grow mb-4">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your heart today?"
              className="min-h-[200px] border-0 shadow-none focus:ring-0 p-0 text-[#333] text-lg font-serif"
            />
          </div>
          
          {verse ? (
            <Card className="mb-4 bg-[#f4f6f0] border-[#e8e8e0] shadow-sm rounded-xl">
              <CardContent className="p-4 relative">
                <p className="verse-text mb-1 italic leading-relaxed text-[#333] text-sm">
                  "{verse.text.trim()}"
                </p>
                <p className="verse-reference text-right text-[#666] text-xs">
                  — {verse.reference}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setVerse(null)}
                  className="absolute top-1 right-1 text-xs text-[#666] hover:text-[#333] p-1"
                >
                  ✕
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={handleAddVerse}
              disabled={isLoadingVerse}
              className="self-end mb-4 text-[#333] border-[#d8d8c8] rounded-full px-4 py-1 text-xs bg-white shadow-sm hover:bg-[#f4f6f0]"
            >
              {isLoadingVerse ? "Loading..." : "+ Verse"}
            </Button>
          )}
          
          <div className="flex justify-between space-x-4 mb-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/journal")}
              className="border-[#d8d8c8] rounded-full px-6 text-[#333]"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-[#c3d1b8] hover:bg-[#a3b198] text-[#333] rounded-full px-6 shadow-sm"
            >
              Save Entry
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default NewJournalEntry;

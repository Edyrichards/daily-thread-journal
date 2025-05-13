
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import MoodPicker from "@/components/MoodPicker";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { JournalEntry, Mood, generateId, saveJournalEntry } from "@/lib/storage";
import { getRandomVerse } from "@/lib/api";

const NewJournalEntry = () => {
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<Mood | null>(null);
  const [verse, setVerse] = useState<{ text: string; reference: string } | null>(null);
  const [isLoadingVerse, setIsLoadingVerse] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

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
    
    navigate("/journal");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header title="New Journal Entry" />
      <main className="flex-1 container max-w-2xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-serif text-grace-700 mb-6">New Journal Entry</h2>
        
        <form onSubmit={handleSubmit}>
          <MoodPicker selectedMood={mood} onSelectMood={setMood} />
          
          <div className="mb-6">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              What's on your heart today?
            </label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your thoughts, feelings, or prayers here..."
              className="min-h-[200px] border-grace-200"
            />
          </div>
          
          {verse ? (
            <Card className="mb-6 bg-grace-100 border-grace-200">
              <CardContent className="p-4 relative">
                <p className="verse-text mb-2 italic leading-relaxed text-grace-700 text-sm">
                  "{verse.text.trim()}"
                </p>
                <p className="verse-reference text-right text-grace-500 font-medium text-xs">
                  — {verse.reference}
                </p>
                <div className="absolute top-0 left-0 h-full w-1 bg-grace-300"></div>
              </CardContent>
            </Card>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={handleAddVerse}
              disabled={isLoadingVerse}
              className="mb-6 text-grace-500 border-grace-300"
            >
              {isLoadingVerse ? "Loading..." : "+ Add Verse"}
            </Button>
          )}
          
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/journal")}
              className="border-grace-300"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-grace-400 hover:bg-grace-500 text-white"
              disabled={!mood || !content.trim()}
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

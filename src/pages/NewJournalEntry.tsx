
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-grace-100">
      <Header title="New Journal Entry" />
      <main className="flex-1 container max-w-2xl mx-auto px-6 py-12 animate-fade-in">
        <h2 className="text-2xl font-serif text-grace-700 mb-8">New Journal Entry</h2>
        
        <form onSubmit={handleSubmit}>
          <MoodPicker selectedMood={mood} onSelectMood={setMood} />
          
          <div className="mb-8 relative">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2 font-serif">
              What's on your heart today?
            </label>
            <div className="relative">
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your thoughts, feelings, or prayers here..."
                className="min-h-[200px] border-grace-200 shadow-sm focus:border-grace-300 focus:ring focus:ring-grace-200 focus:ring-opacity-50 rounded-xl"
              />
              {verse ? null : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddVerse}
                  disabled={isLoadingVerse}
                  className="absolute top-2 right-2 text-grace-500 border-grace-300 rounded-full px-4 py-1 text-xs bg-white shadow-sm hover:bg-grace-100"
                >
                  {isLoadingVerse ? "Loading..." : "+ Add Verse"}
                </Button>
              )}
            </div>
          </div>
          
          {verse ? (
            <Card className="mb-8 bg-grace-100 border-grace-200 shadow-sm">
              <CardContent className="p-5 relative">
                <div className="absolute -right-8 -top-8 text-4xl opacity-5 rotate-12">✝️</div>
                <p className="verse-text mb-2 italic leading-relaxed text-grace-700 text-sm">
                  "{verse.text.trim()}"
                </p>
                <p className="verse-reference text-right text-grace-500 font-medium text-xs">
                  — {verse.reference}
                </p>
                <div className="absolute top-0 left-0 h-full w-1 bg-grace-300"></div>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setVerse(null)}
                  className="absolute top-0 right-0 text-xs text-grace-500 hover:text-grace-700 p-1"
                >
                  ✕
                </Button>
              </CardContent>
            </Card>
          ) : null}
          
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/journal")}
              className="border-grace-300 rounded-full px-6"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-grace-400 hover:bg-grace-500 text-white rounded-full px-6 shadow-sm"
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

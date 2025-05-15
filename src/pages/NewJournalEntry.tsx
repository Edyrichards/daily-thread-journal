
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
  const [content, setContent] = useState("God, today I feel grateful for the blessings You've given me. Help me to be a source of Your love in the lives of others.");
  const [mood, setMood] = useState<Mood | null>("joyful");
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
    <div className="min-h-screen flex flex-col bg-[#f8f3eb]">
      <Header title="THREADS of GRACE" />
      <main className="flex-1 container max-w-md mx-auto px-6 py-6 animate-fade-in">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
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
              + Verse
            </Button>
          )}
          
          <div className="flex justify-center space-x-4 mb-6">
            <Button type="button" className="text-2xl bg-transparent hover:bg-[#f4f6f0] text-[#333]">
              🙂
            </Button>
            <Button type="button" className="text-2xl bg-transparent hover:bg-[#f4f6f0] text-[#333]">
              😊
            </Button>
            <Button type="button" className="text-2xl bg-transparent hover:bg-[#f4f6f0] text-[#333]">
              ❤️
            </Button>
            <Button type="button" className="text-2xl bg-transparent hover:bg-[#f4f6f0] text-[#333]">
              🙏
            </Button>
          </div>
          
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
          
          <div className="bg-[#e8e8e0] p-4 rounded-t-xl mt-4">
            <div className="grid grid-cols-10 gap-1 mb-2">
              {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'].map(key => (
                <div key={key} className="bg-white rounded-lg py-2 shadow-sm flex justify-center">{key}</div>
              ))}
            </div>
            <div className="grid grid-cols-10 gap-1 mb-2">
              {['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'].map(key => (
                <div key={key} className="bg-white rounded-lg py-2 shadow-sm flex justify-center">{key}</div>
              ))}
              <div className="hidden"></div>
            </div>
            <div className="grid grid-cols-10 gap-1 mb-2">
              <div className="bg-[#d8d8d0] rounded-lg py-2 shadow-sm flex justify-center col-span-1">⇧</div>
              {['Z', 'X', 'C', 'V', 'B', 'N', 'M'].map(key => (
                <div key={key} className="bg-white rounded-lg py-2 shadow-sm flex justify-center">{key}</div>
              ))}
              <div className="bg-[#d8d8d0] rounded-lg py-2 shadow-sm flex justify-center col-span-2">⌫</div>
            </div>
            <div className="grid grid-cols-10 gap-1">
              <div className="bg-[#d8d8d0] rounded-lg py-2 shadow-sm flex justify-center col-span-2">123</div>
              <div className="bg-white rounded-lg py-2 shadow-sm flex justify-center col-span-6">space</div>
              <div className="bg-[#d8d8d0] rounded-lg py-2 shadow-sm flex justify-center col-span-2">return</div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default NewJournalEntry;

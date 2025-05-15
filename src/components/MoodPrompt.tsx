
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Mood, moodEmojis } from "@/lib/storage";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

const emotionalPrompts = {
  joyful: "Where did you experience God's joy today?",
  peaceful: "How has God brought peace into your life recently?",
  hopeful: "What gives you hope in God's promises today?",
  content: "In what ways do you feel content in God's presence?",
  neutral: "How has God spoken to you lately?",
  anxious: "What anxieties can you surrender to God today?",
  sad: "Which scripture brings you comfort in sadness?",
  stressed: "How can you rest in God's presence today?",
  angry: "What truth from scripture helps with difficult emotions?",
  overwhelmed: "Which of God's promises feels most needed today?"
};

const journalTemplates = {
  joyful: "Today I'm feeling joyful because... God has blessed me by...",
  peaceful: "I feel peace in my heart when... God's presence brings me calm as I...",
  hopeful: "I'm hopeful about... I trust God's plan for...",
  content: "I feel content with... God has satisfied my heart by...",
  neutral: "Today feels ordinary, but I notice God in... I'm grateful for...",
  anxious: "I'm feeling anxious about... I need God's peace for...",
  sad: "I'm sad about... I'm seeking God's comfort through...",
  stressed: "I feel overwhelmed by... I need God's strength to...",
  angry: "I'm struggling with anger toward... God, help me to see...",
  overwhelmed: "I feel overwhelmed by... I'm seeking God's guidance with..."
};

const MoodPrompt = () => {
  const navigate = useNavigate();
  const today = new Date();
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [lastSelectedDate, setLastSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    // Check if the user already selected a mood today
    const savedDate = localStorage.getItem("last_mood_date");
    const savedMood = localStorage.getItem("current_mood") as Mood | null;
    
    if (savedDate && savedMood) {
      const today = new Date().toDateString();
      if (savedDate === today) {
        setSelectedMood(savedMood);
        setLastSelectedDate(savedDate);
      }
    }
  }, []);

  const handleMoodSelection = (mood: Mood) => {
    setSelectedMood(mood);
    localStorage.setItem("current_mood", mood);
    localStorage.setItem("last_mood_date", new Date().toDateString());
    localStorage.setItem("journal_template", journalTemplates[mood]);
    
    toast({
      title: "Mood Logged",
      description: `Today you're feeling ${mood}. Journal to reflect on this.`,
    });
    
    // Allow a moment for the user to see their selection
    setTimeout(() => {
      navigate("/journal/new");
    }, 800);
  };

  return (
    <Card className="border-[#e8e8e0] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden rounded-xl">
      <CardContent className="p-8 text-center">
        <p className="text-sm font-serif text-[#888888] mb-2">
          {format(today, "MMMM d")}
        </p>
        <h2 className="devotional-prompt mb-6 font-serif text-xl text-[#333]">
          How are you feeling today?
        </h2>
        
        <div className="grid grid-cols-5 gap-2 mb-6">
          {Object.entries(moodEmojis).map(([mood, emoji]) => (
            <Button
              key={mood}
              onClick={() => handleMoodSelection(mood as Mood)}
              variant="ghost"
              className={`p-2 rounded-full text-2xl hover:bg-[#f4f6f0] transition-all ${
                selectedMood === mood ? "bg-[#f4f6f0] scale-110" : ""
              }`}
              aria-label={mood}
            >
              {emoji}
            </Button>
          ))}
        </div>
        
        {selectedMood && (
          <p className="text-[#333] italic mb-4 font-serif">{emotionalPrompts[selectedMood]}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default MoodPrompt;


import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WeeklyDevotionalPage = () => {
  const navigate = useNavigate();
  
  // Weekly devotional content
  const weeklyTheme = {
    title: "Trusting God's Path",
    scripture: {
      text: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
      reference: "Proverbs 3:5-6"
    },
    days: [
      {
        day: "Monday",
        title: "The Foundation of Trust",
        verse: "Psalm 9:10",
        completed: true
      },
      {
        day: "Tuesday",
        title: "Beyond Understanding",
        verse: "Isaiah 55:8-9",
        completed: true
      },
      {
        day: "Wednesday",
        title: "Submission as Freedom",
        verse: "James 4:7-8",
        completed: false
      },
      {
        day: "Thursday",
        title: "God's Direction",
        verse: "Psalm 25:4-5",
        completed: false
      },
      {
        day: "Friday",
        title: "When Paths Seem Crooked",
        verse: "Psalm 18:30-32",
        completed: false
      },
      {
        day: "Saturday",
        title: "Progress on the Path",
        verse: "Philippians 1:6",
        completed: false
      },
      {
        day: "Sunday",
        title: "Weekly Reflection",
        verse: "Proverbs 3:5-6",
        completed: false
      }
    ],
    communityPrompt: "How has trusting God's path led you somewhere unexpected but wonderful?",
    communityResponses: 24
  };
  
  return (
    <Layout title="Weekly Focus">
      <div className="space-y-6 pb-16 animate-fade-in">
        <Card className="mb-6 bg-[#f4f6f0] border-[#e8e8e0] overflow-hidden shadow-sm rounded-xl">
          <CardContent className="p-6 relative">
            <div className="absolute -right-8 -top-8 text-6xl opacity-5 rotate-12">✝️</div>
            <h2 className="text-xl font-serif text-[#333] mb-3">Weekly Scripture Focus</h2>
            <p className="verse-text mb-4 italic leading-relaxed text-[#333] text-lg">
              "{weeklyTheme.scripture.text}"
            </p>
            <p className="verse-reference text-right font-medium text-[#666]">
              — {weeklyTheme.scripture.reference}
            </p>
            <div className="absolute top-0 left-0 h-full w-1 bg-[#c3d1b8]"></div>
          </CardContent>
        </Card>
        
        <Card className="border-[#e8e8e0] shadow-sm overflow-hidden rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <BookOpen size={20} className="text-[#666] mr-2" />
              <h2 className="text-xl font-serif text-[#333]">{weeklyTheme.title}</h2>
            </div>
            
            <div className="space-y-4 my-6">
              {weeklyTheme.days.map((day, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-[#f4f6f0] rounded-lg">
                  <div>
                    <p className="font-serif text-[#333]">{day.day}: {day.title}</p>
                    <span className="text-xs text-[#666]">{day.verse}</span>
                  </div>
                  <div className="flex items-center">
                    {day.completed ? (
                      <CheckCircle size={18} className="text-[#a3b198]" />
                    ) : (
                      <Button
                        variant="ghost"
                        className="text-[#333] hover:bg-[#e8e8e0] rounded-full h-8 w-8 p-0"
                        aria-label={`Read ${day.day}'s devotional`}
                        onClick={() => {
                          // This would navigate to the specific day's devotional
                          // For now we'll just go to the general devotional page
                          navigate("/devotional");
                        }}
                      >
                        →
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-[#f4f6f0] p-4 rounded-lg mt-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <MessageSquare size={18} className="text-[#666] mr-2" />
                  <h3 className="font-serif text-[#333]">Community Discussion</h3>
                </div>
                <span className="text-xs bg-[#e8e8e0] px-2 py-1 rounded-full text-[#666]">
                  {weeklyTheme.communityResponses} responses
                </span>
              </div>
              <p className="mt-2 text-[#333] italic">{weeklyTheme.communityPrompt}</p>
              <Button 
                onClick={() => navigate("/community")}
                variant="ghost"
                className="mt-2 text-[#666] hover:text-[#333] hover:bg-[#e8e8e0] text-sm"
              >
                Join the conversation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default WeeklyDevotionalPage;

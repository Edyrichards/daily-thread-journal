
import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import MoodPrompt from "@/components/MoodPrompt";
import BibleVerse from "@/components/BibleVerse";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getJournalEntries, getPrayers } from "@/lib/storage";
import { ChevronRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [journalCount, setJournalCount] = useState(0);
  const [prayerCount, setPrayerCount] = useState(0);
  
  useEffect(() => {
    const entries = getJournalEntries();
    const prayers = getPrayers();
    
    setJournalCount(entries.length);
    setPrayerCount(prayers.length);
  }, []);
  
  return (
    <Layout>
      <div className="space-y-6 pb-16">
        <MoodPrompt />
        <BibleVerse />
        
        <Card className="border-[#e8e8e0] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden rounded-xl">
          <CardContent className="p-6">
            <h2 className="text-xl font-serif text-[#333] mb-3">My Journey</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-[#f4f6f0] rounded-lg">
                <div>
                  <span className="font-serif text-[#333]">Journal Entries</span>
                  <p className="text-xs text-[#666]">{journalCount} entries</p>
                </div>
                <Button
                  onClick={() => navigate("/journal")}
                  variant="ghost"
                  className="text-[#333] hover:bg-[#e8e8e0] rounded-full"
                >
                  View All <ChevronRight size={16} />
                </Button>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-[#f4f6f0] rounded-lg">
                <div>
                  <span className="font-serif text-[#333]">Prayer Requests</span>
                  <p className="text-xs text-[#666]">{prayerCount} prayers</p>
                </div>
                <Button
                  onClick={() => navigate("/prayer")}
                  variant="ghost"
                  className="text-[#333] hover:bg-[#e8e8e0] rounded-full"
                >
                  View All <ChevronRight size={16} />
                </Button>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-[#f4f6f0] rounded-lg">
                <div>
                  <span className="font-serif text-[#333]">Growth Insights</span>
                  <p className="text-xs text-[#666]">Track your spiritual journey</p>
                </div>
                <Button
                  onClick={() => navigate("/growth")}
                  variant="ghost"
                  className="text-[#333] hover:bg-[#e8e8e0] rounded-full"
                >
                  View <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-[#e8e8e0] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden rounded-xl bg-[#f4f6f0]">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-serif text-[#333] mb-3">Weekly Scripture Focus</h2>
            <p className="text-[#333] italic font-serif mb-4">
              "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight."
            </p>
            <p className="text-[#666] font-serif mb-4">— Proverbs 3:5-6</p>
            <Button
              onClick={() => navigate("/weekly-devotional")}
              variant="outline"
              className="bg-transparent border-[#c3d1b8] text-[#333] hover:bg-[#c3d1b8] hover:text-[#333]"
            >
              Weekly Devotional
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Index;

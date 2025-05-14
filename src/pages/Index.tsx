
import React from "react";
import Layout from "@/components/Layout";
import MoodPrompt from "@/components/MoodPrompt";
import BibleVerse from "@/components/BibleVerse";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <Layout>
      <div className="space-y-6 pb-16">
        <BibleVerse />
        <MoodPrompt />
        
        <Card className="border-[#e8e8e0] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden rounded-xl">
          <CardContent className="p-6">
            <h2 className="text-xl font-serif text-[#333] mb-3">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-[#f4f6f0] rounded-lg">
                <span className="font-serif text-[#333]">Journal Entries</span>
                <Button
                  onClick={() => navigate("/journal")}
                  variant="ghost"
                  className="text-[#333] hover:bg-[#e8e8e0] rounded-full"
                >
                  View All →
                </Button>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-[#f4f6f0] rounded-lg">
                <span className="font-serif text-[#333]">Prayer Requests</span>
                <Button
                  onClick={() => navigate("/prayer")}
                  variant="ghost"
                  className="text-[#333] hover:bg-[#e8e8e0] rounded-full"
                >
                  View All →
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
            <p className="text-[#666] font-serif">— Proverbs 3:5-6</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Index;


import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { getDevotionalContent } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { BookOpen, Share2, Heart } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const DevotionalPage = () => {
  const [verse, setVerse] = useState<{ text: string; reference: string } | null>(null);
  const [devotional, setDevotional] = useState<{ 
    title: string; 
    content: string; 
    prayerPoints: string[];
  } | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get saved verse from local storage
    const savedVerse = localStorage.getItem("current_verse");
    if (!savedVerse) {
      navigate("/");
      return;
    }
    
    const parsedVerse = JSON.parse(savedVerse);
    setVerse(parsedVerse);
    
    // Get devotional content
    const devotionalContent = getDevotionalContent(parsedVerse.reference);
    setDevotional(devotionalContent);
  }, [navigate]);
  
  const handleShare = () => {
    if (verse) {
      navigator.clipboard.writeText(`"${verse.text}" - ${verse.reference}`);
      toast({
        title: "Verse copied!",
        description: "The verse has been copied to your clipboard.",
      });
    }
  };
  
  const handleSave = () => {
    // Save to favorites logic would go here
    toast({
      title: "Verse saved",
      description: "This verse has been added to your favorites.",
    });
  };

  if (!verse || !devotional) {
    return (
      <Layout title="Daily Devotional">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="animate-pulse h-4 w-3/4 bg-[#e8e8e0] rounded mb-2"></div>
          <div className="animate-pulse h-4 w-1/2 bg-[#e8e8e0] rounded"></div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout title="Daily Devotional">
      <div className="space-y-6 pb-16 animate-fade-in">
        <Card className="mb-6 bg-[#f4f6f0] border-[#e8e8e0] overflow-hidden shadow-sm rounded-xl">
          <CardContent className="p-6 relative">
            <div className="absolute -right-8 -top-8 text-6xl opacity-5 rotate-12">✝️</div>
            <h3 className="text-lg font-serif text-[#333] mb-3">{verse.reference}</h3>
            <p className="verse-text mb-4 italic leading-relaxed text-[#333] text-lg">
              "{verse.text.trim()}"
            </p>
            <div className="flex justify-end space-x-2 mt-4">
              <Button 
                onClick={handleSave}
                variant="ghost" 
                size="sm"
                className="text-[#666] hover:text-[#333] hover:bg-[#e8e8e0]"
              >
                <Heart size={18} />
              </Button>
              <Button 
                onClick={handleShare}
                variant="ghost" 
                size="sm"
                className="text-[#666] hover:text-[#333] hover:bg-[#e8e8e0]"
              >
                <Share2 size={18} />
              </Button>
            </div>
            <div className="absolute top-0 left-0 h-full w-1 bg-[#c3d1b8]"></div>
          </CardContent>
        </Card>
        
        <Card className="border-[#e8e8e0] shadow-sm overflow-hidden rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <BookOpen size={20} className="text-[#666] mr-2" />
              <h2 className="text-xl font-serif text-[#333]">{devotional.title}</h2>
            </div>
            <div className="prose prose-sm max-w-none text-[#333] mb-6 font-sans leading-relaxed">
              <p>{devotional.content}</p>
            </div>
            
            <div className="bg-[#f4f6f0] p-4 rounded-lg">
              <h3 className="text-lg font-serif text-[#333] mb-2">Prayer Points</h3>
              <ul className="list-disc list-inside text-[#333]">
                {devotional.prayerPoints.map((point, index) => (
                  <li key={index} className="mb-2 text-sm">{point}</li>
                ))}
              </ul>
            </div>
            
            <div className="mt-6">
              <Button 
                onClick={() => navigate("/journal/new")}
                className="w-full bg-[#c3d1b8] hover:bg-[#a3b198] text-[#333] font-medium"
              >
                Journal Your Reflections
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DevotionalPage;


import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { generateId, Mood, moodEmojis, saveJournalEntry } from "@/lib/storage";
import { useNavigate } from "react-router-dom";

const VoiceJournal = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [mood, setMood] = useState<Mood>("peaceful");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleStartRecording = () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      toast({
        title: "Not Supported",
        description: "Voice recording is not supported by your browser.",
        variant: "destructive",
      });
      return;
    }

    setIsRecording(true);
    toast({
      title: "Recording Started",
      description: "Speak clearly into your microphone.",
    });

    // This would normally use the Web Speech API
    // For now we'll simulate it
    setTimeout(() => {
      setTranscript("God, I know that you are with me even in this difficult time");
      setIsRecording(false);
      toast({
        title: "Recording Finished",
        description: "Your prayer has been transcribed.",
      });
    }, 2000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    toast({
      title: "Recording Stopped",
      description: "Your voice entry has been saved.",
    });
  };

  const handleSaveEntry = () => {
    if (!transcript.trim()) {
      toast({
        title: "Empty Entry",
        description: "Please record or type something before saving.",
        variant: "destructive",
      });
      return;
    }

    const today = new Date();
    const entry = {
      id: generateId(),
      date: today.toISOString().split('T')[0],
      content: transcript,
      mood,
      createdAt: Date.now(),
    };

    saveJournalEntry(entry);
    toast({
      title: "Entry Saved",
      description: "Your voice journal entry has been saved.",
    });
    navigate("/journal");
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <Card className="bg-[#f8f3eb] border-[#e8e8e0] rounded-xl overflow-hidden">
          <CardContent className="p-6">
            <h2 className="text-center mb-4 text-2xl font-serif">Journal Entry</h2>
            
            <div className="flex justify-center space-x-3 mb-6">
              <Button 
                variant="ghost" 
                className={`p-2 rounded-full text-2xl hover:bg-[#f4f6f0] transition-all ${mood === "peaceful" ? "bg-[#f4f6f0] scale-110" : ""}`}
                onClick={() => setMood("peaceful")}
              >
                <span className="text-2xl">{moodEmojis.peaceful}</span>
                <span className="text-sm block mt-1">Peaceful</span>
              </Button>
              <Button 
                variant="ghost" 
                className={`p-2 rounded-full text-2xl hover:bg-[#f4f6f0] transition-all ${mood === "hopeful" ? "bg-[#f4f6f0] scale-110" : ""}`}
                onClick={() => setMood("hopeful")}
              >
                <span className="text-2xl">{moodEmojis.hopeful}</span>
                <span className="text-sm block mt-1">Hopeful</span>
              </Button>
              <Button 
                variant="ghost" 
                className={`p-2 rounded-full text-2xl hover:bg-[#f4f6f0] transition-all ${mood === "joyful" ? "bg-[#f4f6f0] scale-110" : ""}`}
                onClick={() => setMood("joyful")}
              >
                <span className="text-2xl">{moodEmojis.joyful}</span>
                <span className="text-sm block mt-1">Joyful</span>
              </Button>
              <Button 
                variant="ghost" 
                className={`p-2 rounded-full text-2xl hover:bg-[#f4f6f0] transition-all ${mood === "content" ? "bg-[#f4f6f0] scale-110" : ""}`}
                onClick={() => setMood("content")}
              >
                <span className="text-2xl">{moodEmojis.content}</span>
                <span className="text-sm block mt-1">Content</span>
              </Button>
            </div>

            <div className="bg-white rounded-lg p-4 mb-4 min-h-[120px] text-lg font-serif">
              {transcript || "Your journal entry will appear here..."}
              {transcript && <p className="mt-4 text-sm text-[#666]">Jeremiah 29:11     James 1:12</p>}
            </div>
            
            <div className="flex justify-center">
              <Button 
                variant="outline" 
                className="bg-[#dbe2d3] hover:bg-[#c3d1b8] text-[#333] px-10 py-5 rounded-full w-full text-lg font-serif"
                onClick={isRecording ? handleStopRecording : handleStartRecording}
              >
                {isRecording ? "Stop Recording" : "+ Verse"}
              </Button>
            </div>

            {transcript && (
              <div className="mt-4 flex justify-end">
                <Button 
                  onClick={handleSaveEntry}
                  className="bg-[#c3d1b8] hover:bg-[#a3b198] text-[#333] rounded-full px-6"
                >
                  Save Entry
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VoiceJournal;

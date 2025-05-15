
import { useState, useEffect } from "react";
import { Prayer, getPrayers, savePrayer, generateId, updatePrayerStatus, deletePrayer } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const MoodItem = ({ label, emoji }: { label: string; emoji?: string }) => (
  <div className="flex items-center py-3 px-5 bg-[#f8f3eb] rounded-lg mb-3">
    {emoji && <span className="mr-2 text-xl">{emoji}</span>}
    <span className="font-medium text-[#333]">{label}</span>
  </div>
);

const ScriptureItem = ({ reference, text }: { reference: string, text: string }) => (
  <div className="bg-[#f4f6f0] p-4 mb-3 rounded-xl">
    <p className="font-serif text-sm font-medium mb-1">{reference}</p>
    <p className="text-xs text-[#666]">{text}</p>
  </div>
);

const PrayerTracker = () => {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [newPrayer, setNewPrayer] = useState("");
  const { toast } = useToast();
  const [answeredCount, setAnsweredCount] = useState(0);

  useEffect(() => {
    // Load prayers from local storage
    loadPrayers();
  }, []);

  const loadPrayers = () => {
    const loadedPrayers = getPrayers();
    setPrayers(loadedPrayers);
    
    // Count answered prayers in the last week
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const answeredInLastWeek = loadedPrayers.filter(
      p => p.status === 'answered' && p.updatedAt > oneWeekAgo
    ).length;
    setAnsweredCount(answeredInLastWeek);
  };

  const handleAddPrayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrayer.trim()) return;
    
    const prayer: Prayer = {
      id: generateId(),
      content: newPrayer,
      status: 'praying',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    savePrayer(prayer);
    setNewPrayer("");
    loadPrayers();
    
    toast({
      title: "Prayer Added",
      description: "Your prayer request has been added.",
    });
  };

  const handleUpdateStatus = (id: string, status: "praying" | "answered" | "waiting") => {
    updatePrayerStatus(id, status);
    loadPrayers();
    
    toast({
      title: status === 'answered' ? "Prayer Answered" : "Status Updated",
      description: status === 'answered' 
        ? "Praise God for answering this prayer!" 
        : "Your prayer status has been updated.",
    });
  };

  const handleDeletePrayer = (id: string) => {
    deletePrayer(id);
    loadPrayers();
    
    toast({
      title: "Prayer Removed",
      description: "Your prayer request has been removed.",
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-serif text-[#333]">Prayer Tracker</h2>
        {answeredCount > 0 && (
          <div className="bg-[#f4f6f0] text-[#333] px-3 py-1 rounded-full text-sm">
            {answeredCount} answered
          </div>
        )}
      </div>
      
      <form onSubmit={handleAddPrayer} className="mb-8 flex">
        <Input
          type="text"
          value={newPrayer}
          onChange={(e) => setNewPrayer(e.target.value)}
          placeholder="Enter your prayer request..."
          className="mr-2 flex-grow rounded-full border-[#d8d8c8] focus:border-[#a3b198]"
        />
        <Button type="submit" className="bg-[#c3d1b8] hover:bg-[#a3b198] text-[#333] rounded-full px-5">
          Add
        </Button>
      </form>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col">
          <Card className="border-none shadow-none bg-transparent mb-6">
            <CardContent className="p-0">
              <h3 className="font-serif text-lg mb-4 text-center">My Mood</h3>
              <div className="space-y-2">
                <MoodItem label="Hopeful" emoji="😊" />
                <MoodItem label="Calm" emoji="😌" />
                <MoodItem label="Thankful" emoji="🙏" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex flex-col">
          <Card className="border-none shadow-none bg-transparent">
            <CardContent className="p-0">
              <h3 className="font-serif text-lg mb-4 text-center">Scripture</h3>
              <div className="space-y-2">
                <ScriptureItem 
                  reference="Isaiah 40:31" 
                  text="They who wait upon the Lord shall renew their strength."
                />
                <ScriptureItem 
                  reference="Psalm 25:2" 
                  text="No one who hopes in you will ever be put to shame."
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="font-serif text-lg mb-4">My Mood</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <MoodItem label="Hopeful" />
          <MoodItem label="Calm" />
          <MoodItem label="Thankful" />
          <MoodItem label="Peaceful" />
          <MoodItem label="Joyful" />
          <MoodItem label="Grateful" />
        </div>
      </div>
    </div>
  );
};

export default PrayerTracker;

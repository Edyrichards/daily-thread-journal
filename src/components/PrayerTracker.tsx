
import { useState, useEffect } from "react";
import { Prayer, getPrayers, savePrayer, generateId, updatePrayerStatus, deletePrayer } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { BookOpen, Check, Clock, Trash2, Plus } from "lucide-react";
import { format } from "date-fns";

const PrayerTracker = () => {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [newPrayer, setNewPrayer] = useState("");
  const { toast } = useToast();
  const [answeredCount, setAnsweredCount] = useState(0);
  const [selectedVerse, setSelectedVerse] = useState({
    text: "They who wait upon the Lord shall renew their strength.",
    reference: "Isaiah 40:31"
  });

  useEffect(() => {
    // Load prayers from local storage
    loadPrayers();
    
    // Get the current verse
    const currentVerse = localStorage.getItem("current_verse");
    if (currentVerse) {
      setSelectedVerse(JSON.parse(currentVerse));
    }
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'answered':
        return <Check size={16} className="text-[#a3b198]" />;
      case 'waiting':
        return <Clock size={16} className="text-[#e6c27a]" />;
      default:
        return <BookOpen size={16} className="text-[#666]" />;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-serif text-[#333]">Prayer Tracker</h2>
        {answeredCount > 0 && (
          <div className="bg-[#f4f6f0] text-[#333] px-3 py-1 rounded-full text-sm">
            {answeredCount} answered this week
          </div>
        )}
      </div>
      
      <Card className="mb-8 border-[#e8e8e0] overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 rounded-xl">
        <CardContent className="p-6">
          <div className="bg-[#f4f6f0] p-4 rounded-lg mb-4">
            <h3 className="font-serif text-lg mb-2 text-[#333]">Scripture Encouragement</h3>
            <p className="italic text-[#333] mb-1">"{selectedVerse.text}"</p>
            <p className="text-right text-sm text-[#666]">— {selectedVerse.reference}</p>
          </div>
          
          <form onSubmit={handleAddPrayer} className="flex">
            <Input
              type="text"
              value={newPrayer}
              onChange={(e) => setNewPrayer(e.target.value)}
              placeholder="Enter your prayer request..."
              className="mr-2 flex-grow rounded-full border-[#d8d8c8] focus:border-[#a3b198]"
            />
            <Button type="submit" className="bg-[#c3d1b8] hover:bg-[#a3b198] text-[#333] rounded-full px-4">
              <Plus size={18} className="mr-1" /> Add
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <div className="space-y-3">
        {prayers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[#666] italic">No prayers added yet. Add your first prayer request above.</p>
          </div>
        ) : (
          prayers.sort((a, b) => b.updatedAt - a.updatedAt).map((prayer) => (
            <Card 
              key={prayer.id} 
              className={`border-[#e8e8e0] overflow-hidden shadow-sm rounded-xl ${
                prayer.status === 'answered' ? 'bg-[#f4f6f0]' : 'bg-white'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center mb-2">
                    {getStatusIcon(prayer.status)}
                    <span className="text-xs text-[#666] ml-2">
                      {format(new Date(prayer.createdAt), "MMM d")}
                    </span>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 rounded-full text-[#666] hover:bg-[#f4f6f0]"
                      onClick={() => handleDeletePrayer(prayer.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
                <p className="text-[#333] mb-3">{prayer.content}</p>
                <div className="flex justify-end space-x-2">
                  {prayer.status !== 'praying' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs bg-transparent border-[#d8d8c8] text-[#666] hover:bg-[#f4f6f0]"
                      onClick={() => handleUpdateStatus(prayer.id, 'praying')}
                    >
                      Praying
                    </Button>
                  )}
                  {prayer.status !== 'waiting' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs bg-transparent border-[#d8d8c8] text-[#666] hover:bg-[#f4f6f0]"
                      onClick={() => handleUpdateStatus(prayer.id, 'waiting')}
                    >
                      Waiting
                    </Button>
                  )}
                  {prayer.status !== 'answered' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs bg-transparent border-[#d8d8c8] text-[#666] hover:bg-[#a3b198] hover:border-[#a3b198] hover:text-white"
                      onClick={() => handleUpdateStatus(prayer.id, 'answered')}
                    >
                      Answered
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default PrayerTracker;

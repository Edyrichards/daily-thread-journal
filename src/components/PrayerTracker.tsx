
import { useState, useEffect } from "react";
import { Prayer, getPrayers, savePrayer, generateId, updatePrayerStatus, deletePrayer } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const PrayerTracker = () => {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [newPrayer, setNewPrayer] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadPrayers();
  }, []);

  const loadPrayers = () => {
    const loadedPrayers = getPrayers();
    // Sort by most recent first
    loadedPrayers.sort((a, b) => b.createdAt - a.createdAt);
    setPrayers(loadedPrayers);
  };

  const handleAddPrayer = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPrayer.trim()) return;
    
    const prayer: Prayer = {
      id: generateId(),
      content: newPrayer,
      status: "praying",
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    savePrayer(prayer);
    setNewPrayer("");
    loadPrayers();
    
    toast({
      title: "Prayer Added",
      description: "Your prayer has been added to your prayer list.",
    });
  };

  const handleUpdateStatus = (id: string, status: "praying" | "answered" | "waiting") => {
    updatePrayerStatus(id, status);
    loadPrayers();
    
    toast({
      title: "Prayer Updated",
      description: `Prayer status updated to "${status}".`,
    });
  };

  const handleDeletePrayer = (id: string) => {
    deletePrayer(id);
    loadPrayers();
    
    toast({
      title: "Prayer Removed",
      description: "The prayer has been removed from your list.",
    });
  };

  const getStatusBadgeClasses = (status: string) => {
    switch (status) {
      case "praying":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "answered":
        return "bg-green-100 text-green-800 border-green-200";
      case "waiting":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-serif text-grace-700 mb-6">Prayer Tracker</h2>
      
      <form onSubmit={handleAddPrayer} className="mb-6 flex">
        <Input
          type="text"
          value={newPrayer}
          onChange={(e) => setNewPrayer(e.target.value)}
          placeholder="Enter your prayer request..."
          className="mr-2 flex-grow"
        />
        <Button type="submit" className="bg-grace-400 hover:bg-grace-500 text-white">
          Add Prayer
        </Button>
      </form>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {prayers.map((prayer) => (
          <Card key={prayer.id} className="border-grace-200">
            <CardHeader className="pb-2 pt-4 px-4">
              <div className="flex justify-between items-start">
                <CardTitle className="text-md font-medium text-grace-700">
                  My Prayer
                </CardTitle>
                <span 
                  className={`text-xs px-2 py-1 rounded-full capitalize border ${getStatusBadgeClasses(prayer.status)}`}
                >
                  {prayer.status}
                </span>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <p className="text-grace-600 mb-4">{prayer.content}</p>
              
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleUpdateStatus(prayer.id, "praying")}
                    className={`text-xs border ${prayer.status === "praying" ? "border-blue-500 bg-blue-50" : ""}`}
                  >
                    Praying
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleUpdateStatus(prayer.id, "waiting")}
                    className={`text-xs border ${prayer.status === "waiting" ? "border-yellow-500 bg-yellow-50" : ""}`}
                  >
                    Waiting
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleUpdateStatus(prayer.id, "answered")}
                    className={`text-xs border ${prayer.status === "answered" ? "border-green-500 bg-green-50" : ""}`}
                  >
                    Answered
                  </Button>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleDeletePrayer(prayer.id)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {prayers.length === 0 && (
        <Card className="border-grace-200 shadow-sm">
          <CardContent className="p-6 text-center">
            <p className="text-grace-500">No prayers added yet. Add your first prayer above.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PrayerTracker;

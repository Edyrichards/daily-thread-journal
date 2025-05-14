
import { useState, useEffect } from "react";
import { getJournalEntries, JournalEntry, moodEmojis } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const Journal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load journal entries from local storage
    const loadedEntries = getJournalEntries();
    // Sort by most recent first
    loadedEntries.sort((a, b) => b.createdAt - a.createdAt);
    setEntries(loadedEntries);
  }, []);

  const handleNewEntry = () => {
    navigate("/journal/new");
  };

  const handleViewEntry = (id: string) => {
    navigate(`/journal/${id}`);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-serif text-grace-700">Your Journal</h2>
        <Button 
          onClick={handleNewEntry}
          className="bg-grace-400 hover:bg-grace-500 text-white rounded-full px-5"
        >
          New Entry
        </Button>
      </div>

      {entries.length === 0 ? (
        <Card className="border-grace-200 shadow-sm bg-white/70 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <p className="text-grace-500 mb-6 font-serif">Begin your spiritual journey with a journal entry.</p>
            <Button 
              onClick={handleNewEntry}
              className="bg-grace-400 hover:bg-grace-500 text-white rounded-full px-6 shadow-sm"
            >
              Create Your First Entry
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-5">
          {entries.map((entry) => (
            <Card 
              key={entry.id} 
              className="border-grace-200 hover:border-grace-300 cursor-pointer shadow-sm hover:shadow-md transition-all duration-300"
              onClick={() => handleViewEntry(entry.id)}
            >
              <CardHeader className="pb-2 pt-4 px-5 flex flex-row items-center justify-between">
                <CardTitle className="text-md font-medium flex items-center">
                  <span className="mr-2 text-xl">{moodEmojis[entry.mood]}</span>
                  <span className="font-serif">{format(new Date(entry.date), "MMMM d, yyyy")}</span>
                </CardTitle>
                <span className="text-xs text-grace-500 capitalize bg-grace-100 px-3 py-1 rounded-full">
                  {entry.mood}
                </span>
              </CardHeader>
              <CardContent className="px-5 pb-5">
                <p className="text-grace-600 line-clamp-2">{entry.content}</p>
                {entry.verse && (
                  <p className="text-xs text-grace-500 mt-2 italic font-serif">
                    Verse: {entry.verse.reference}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Journal;

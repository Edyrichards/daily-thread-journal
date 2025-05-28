
import { useState, useEffect } from "react";
import { getJournalEntries, JournalEntry, moodEmojis } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { BookOpen } from "lucide-react";

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
      {/* Header: Title and New Entry Button */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4 sm:gap-0">
        <h2 className="text-2xl font-serif text-[#333] text-center sm:text-left">Your Journal</h2>
        <Button 
          onClick={handleNewEntry}
          className="bg-[#c3d1b8] hover:bg-[#a3b198] text-[#333] rounded-full px-5 w-full sm:w-auto"
        >
          New Entry
        </Button>
      </div>

      {/* Empty State Card */}
      {entries.length === 0 ? (
        <Card className="border-[#e8e8e0] shadow-sm bg-white/70 backdrop-blur-sm">
          <CardContent className="p-4 sm:p-8 text-center">
            <p className="text-[#666] mb-6 font-serif">Begin your spiritual journey with a journal entry.</p>
            <Button 
              onClick={handleNewEntry}
              className="bg-[#c3d1b8] hover:bg-[#a3b198] text-[#333] rounded-full px-6 shadow-sm w-full sm:w-auto"
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
              className="border-[#e8e8e0] hover:border-[#d8d8d0] cursor-pointer shadow-sm hover:shadow-md transition-all duration-300"
              onClick={() => handleViewEntry(entry.id)}
            >
              {/* Card Header: Mood, Date, and Mood Tag */}
              <CardHeader className="pb-2 pt-4 px-4 sm:px-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                <CardTitle className="text-md font-medium flex items-center text-center sm:text-left">
                  <span className="mr-2 text-xl">{moodEmojis[entry.mood]}</span>
                  <span className="font-serif">{format(new Date(entry.date), "MMMM d, yyyy")}</span>
                </CardTitle>
                <span className="text-xs text-[#666] capitalize bg-[#f4f6f0] px-3 py-1 rounded-full self-center sm:self-auto">
                  {entry.mood}
                </span>
              </CardHeader>
              <CardContent className="px-4 sm:px-5 pb-4 sm:pb-5">
                <p className="text-[#333] line-clamp-2 font-serif">{entry.content}</p>
                {entry.verse && (
                  <div className="flex items-center mt-2 text-xs text-[#666]">
                    <BookOpen size={12} className="mr-1" />
                    <p className="italic">
                      {entry.verse.reference}
                    </p>
                  </div>
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

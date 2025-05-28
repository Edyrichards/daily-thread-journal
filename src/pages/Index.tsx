
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getRandomVerse } from "@/lib/api";
import { motion } from "framer-motion";
import { getJournalEntries, JournalEntry } from "@/lib/storage"; // Added
import RecentEntryCard from "@/components/RecentEntryCard"; // Added

const moodOptions = [
  { label: "Happy", emoji: "😊", color: "bg-grace-gold/70", value: "happy" },
  { label: "Grateful", emoji: "🙏", color: "bg-grace-blue/70", value: "grateful" },
  { label: "Anxious", emoji: "😟", color: "bg-soft-peach/70", value: "anxious" },
  { label: "Sad", emoji: "😢", color: "bg-light-beige/70", value: "sad" },
  { label: "Hopeful", emoji: "✨", color: "bg-grace-200/70", value: "hopeful" }
];

const Index = () => {
  const navigate = useNavigate();
  const [dailyVerse, setDailyVerse] = useState<{ text: string; reference: string } | null>(null);
  const [isLoadingVerse, setIsLoadingVerse] = useState(true);
  const [recentEntries, setRecentEntries] = useState<JournalEntry[]>([]); // Added

  useEffect(() => {
    const fetchData = async () => { // Renamed for clarity
      setIsLoadingVerse(true); 
      try {
        const verse = await getRandomVerse();
        setDailyVerse(verse);

        const allEntries = getJournalEntries();
        const sortedEntries = allEntries.sort((a, b) => {
          // Ensure createdAt is treated as a number for sorting
          const dateA = typeof a.createdAt === 'string' ? new Date(a.createdAt).getTime() : (a.createdAt || 0);
          const dateB = typeof b.createdAt === 'string' ? new Date(b.createdAt).getTime() : (b.createdAt || 0);
          return dateB - dateA;
        });
        setRecentEntries(sortedEntries.slice(0, 3));

      } catch (error) {
        console.error("Failed to fetch data for homepage:", error); // Updated error message
        setDailyVerse(null); 
      } finally {
        setIsLoadingVerse(false);
      }
    };

    fetchData();
    // Reset journal template if navigating back to home (if this functionality is still needed elsewhere)
    // localStorage.removeItem("journal_template"); 
  }, []);

  return (
    <Layout>
      <motion.div 
        className="space-y-8 p-4 md:p-6 [will-change:transform,opacity]"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        
        {/* Daily Scripture Section */}
        <div className="relative p-8 md:p-12 rounded-3xl overflow-hidden text-center">
          <img
            src="https://images.pexels.com/photos/1766838/pexels-photo-1766838.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Calming background"
            className="absolute inset-0 w-full h-full object-cover filter blur-lg brightness-75"
          />
          
          {isLoadingVerse && (
            <div className="relative z-10 flex items-center justify-center h-40">
              <p className="text-white text-lg">Loading verse...</p>
            </div>
          )}

          {!isLoadingVerse && dailyVerse && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative z-10 [will-change:transform,opacity]"
            >
              <Card className="bg-white/70 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl max-w-xl mx-auto">
                <CardContent className="p-6 text-center">
                  <p className="text-2xl font-serif text-card-foreground mb-2">
                    "{dailyVerse.text}"
                  </p>
                  <p className="text-sm text-muted-foreground font-serif">
                    — {dailyVerse.reference}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {!isLoadingVerse && !dailyVerse && (
            <div className="relative z-10 flex items-center justify-center h-40">
              <p className="text-white text-lg">Could not load verse.</p>
            </div>
          )}
        </div>
        
        {/* Mood Quick-Select Section */}
        <section className="text-center">
          <h2 className="text-2xl font-serif text-foreground mb-6">
            How are you feeling today?
          </h2>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {moodOptions.map((mood) => (
              <button
                key={mood.value}
                onClick={() => navigate(`/journal/new-flow?mood=${mood.value}`)}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 min-w-[100px] cursor-pointer ${mood.color}`}
              >
                <span className="text-3xl mb-1">{mood.emoji}</span>
                <span className="text-sm text-foreground">{mood.label}</span> 
              </button>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <Button
            onClick={() => navigate("/journal/new-flow")}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            Start a New Journal Entry
          </Button>
        </section>

        {/* Recent Entries Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-serif text-foreground mb-6 text-center">
            My Recent Reflections
          </h2>
          {/* We only show recent entries if not loading AND if there are entries. 
              If no entries, the empty state is shown (also when not loading).
              The isLoadingVerse check effectively gates this entire section's content.
          */}
          {!isLoadingVerse && recentEntries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentEntries.map((entry) => (
                <RecentEntryCard entry={entry} key={entry.id} />
              ))}
            </div>
          ) : !isLoadingVerse && recentEntries.length === 0 ? (
            <div className="text-center p-8 bg-lightBeige/70 rounded-2xl shadow">
              <p className="text-muted-foreground mb-4">
                Your recent reflections will appear here.
              </p>
              <Button 
                variant="outline" 
                onClick={() => navigate("/journal/new-flow")}
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-xl"
              >
                Write your first reflection
              </Button>
            </div>
          ) : null /* While isLoadingVerse is true, this section won't render content, which is fine */ }
        </section>

      </motion.div>
    </Layout>
  );
};

export default Index;

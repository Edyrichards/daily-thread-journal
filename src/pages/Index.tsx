import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getRandomVerse } from "@/lib/api";
import { motion } from "framer-motion";
import { getJournalEntries, JournalEntry } from "@/lib/storage";
import RecentEntryCard from "@/components/RecentEntryCard";
import SearchBar, { SearchFilters } from "@/components/SearchBar";
import { Skeleton } from "@/components/ui/skeleton";
import MoodInsights from "@/components/MoodInsights";
import PersonalizedVerses from "@/components/PersonalizedVerses";
import PrayerReminders from "@/components/PrayerReminders";
import { Badge } from "@/components/ui/badge";
import { BarChart3, BookOpen, Heart, TrendingUp } from "lucide-react";

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
  const [recentEntries, setRecentEntries] = useState<JournalEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingVerse(true); 
      try {
        const verse = await getRandomVerse();
        setDailyVerse(verse);

        const allEntries = getJournalEntries();
        const sortedEntries = allEntries.sort((a, b) => {
          const dateA = typeof a.createdAt === 'string' ? new Date(a.createdAt).getTime() : (a.createdAt || 0);
          const dateB = typeof b.createdAt === 'string' ? new Date(b.createdAt).getTime() : (b.createdAt || 0);
          return dateB - dateA;
        });
        setRecentEntries(sortedEntries.slice(0, 6));
        setFilteredEntries(sortedEntries.slice(0, 6));

      } catch (error) {
        console.error("Failed to fetch data for homepage:", error);
        setDailyVerse(null); 
      } finally {
        setIsLoadingVerse(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (query: string, filters: SearchFilters) => {
    setSearchQuery(query);
    
    let filtered = recentEntries;
    
    if (query) {
      filtered = filtered.filter(entry => 
        entry.content.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    if (filters.mood && filters.mood.length > 0) {
      filtered = filtered.filter(entry => 
        filters.mood!.includes(entry.mood)
      );
    }
    
    setFilteredEntries(filtered);
  };

  return (
    <Layout>
      <div className="space-y-10 p-4 md:p-6">
        {/* --- UI: Frosted/Blurred Banner --- */}
        <section className="relative">
          <div className="relative flex items-center justify-center p-3 md:p-5 rounded-3xl overflow-hidden">
            <img
              src="https://images.pexels.com/photos/1766838/pexels-photo-1766838.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="Calming background"
              className="absolute inset-0 w-full h-full object-cover filter blur-lg brightness-55 scale-105"
            />
            <div className="relative z-10 w-full flex items-center justify-center">
              <div className="w-full max-w-[840px] mx-auto px-4 py-12 md:py-16
                rounded-3xl shadow-2xl bg-white/75 backdrop-blur-xl border border-white/30"
                style={{ boxShadow: "0 8px 40px 8px rgba(0,0,0,0.12)" }}
              >
                <blockquote className="text-2xl md:text-4xl font-serif text-card-foreground mb-6 leading-relaxed italic text-center">
                  " But seek first God’s Kingdom, and his righteousness; and all these things will be given to you as well. "
                </blockquote>
                <cite className="text-lg md:text-xl text-muted-foreground font-serif not-italic block text-center">
                  — Matthew 6:33
                </cite>
                <div className="mt-8">
                  <div className="w-12 h-0.5 bg-primary/60 mx-auto opacity-60"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- Enhanced Spiritual Tools Section --- */}
        <section>
          <h2 className="text-2xl font-serif text-foreground text-center mb-8">
            Enhanced Spiritual Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div 
              className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white/90 border border-gray-200 rounded-2xl"
              onClick={() => navigate('/journal/enhanced')}
            >
              <div className="p-6 text-center">
                <BookOpen className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Enhanced Journal</h3>
                <p className="text-sm text-muted-foreground">
                  Advanced search, tags, and insights
                </p>
                <span className="inline-block rounded bg-muted px-2 py-0.5 text-xs font-medium mt-2">New</span>
              </div>
            </div>
            <div 
              className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white/90 border border-gray-200 rounded-2xl"
              onClick={() => navigate('/prayer/insights')}
            >
              <div className="p-6 text-center">
                <Heart className="h-8 w-8 mx-auto mb-3 text-red-500" />
                <h3 className="font-semibold mb-2">Prayer Insights</h3>
                <p className="text-sm text-muted-foreground">
                  Track answered prayers and patterns
                </p>
                <span className="inline-block rounded bg-muted px-2 py-0.5 text-xs font-medium mt-2">New</span>
              </div>
            </div>
            <div 
              className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white/90 border border-gray-200 rounded-2xl"
              onClick={() => navigate('/analytics')}
            >
              <div className="p-6 text-center">
                <BarChart3 className="h-8 w-8 mx-auto mb-3 text-green-500" />
                <h3 className="font-semibold mb-2">Growth Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Visualize your spiritual journey
                </p>
                <span className="inline-block rounded bg-muted px-2 py-0.5 text-xs font-medium mt-2">New</span>
              </div>
            </div>
            <div 
              className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white/90 border border-gray-200 rounded-2xl"
              onClick={() => navigate('/bible')}
            >
              <div className="p-6 text-center">
                <BarChart3 className="h-8 w-8 mx-auto mb-3 text-blue-500" />
                <h3 className="font-semibold mb-2">Bible Study Tools</h3>
                <p className="text-sm text-muted-foreground">
                  Advanced study with insights
                </p>
                <span className="inline-block rounded border border-primary px-2 py-0.5 text-xs font-medium mt-2 text-primary">Enhanced</span>
              </div>
            </div>
          </div>
        </section>
        
        {/* Phase 2: Smart Personalization Features */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-serif text-foreground text-center mb-8">
              Your Spiritual Journey
            </h2>
            
            {/* Mood Insights */}
            <MoodInsights />
            
            {/* Personalized Verses and Prayer Reminders */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PersonalizedVerses />
              <PrayerReminders />
            </div>
          </motion.div>
        </section>
        
        {/* Mood Quick-Select Section */}
        <section className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h2 className="text-3xl font-serif text-foreground mb-8">
              How are you feeling today?
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
              {moodOptions.map((mood, index) => (
                <motion.button
                  key={mood.value}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index, duration: 0.4 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/journal/new-flow?mood=${mood.value}`)}
                  className={`flex flex-col items-center justify-center p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer ${mood.color} border border-white/20`}
                >
                  <span className="text-4xl mb-2">{mood.emoji}</span>
                  <span className="text-sm font-medium text-foreground">{mood.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Button
              onClick={() => navigate("/journal/new-flow")}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl px-10 py-4 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Start Writing Your Heart
            </Button>
          </motion.div>
        </section>

        {/* Recent Entries Section - Enhanced with Search */}
        <section className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif text-foreground mb-4">
              My Reflections
            </h2>
            <p className="text-muted-foreground">
              Your journey of faith and growth
            </p>
          </div>
          
          {recentEntries.length > 0 && (
            <div className="mb-8">
              <SearchBar 
                onSearch={handleSearch}
                placeholder="Search your reflections..."
                className="max-w-2xl mx-auto"
              />
            </div>
          )}

          {!isLoadingVerse && filteredEntries.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredEntries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.4 }}
                >
                  <RecentEntryCard entry={entry} />
                </motion.div>
              ))}
            </motion.div>
          ) : !isLoadingVerse && recentEntries.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-center p-12 bg-gradient-to-br from-grace-100 to-lightBeige rounded-3xl shadow-lg border border-white/50"
            >
              <div className="max-w-md mx-auto">
                <div className="text-6xl mb-6">✨</div>
                <h3 className="text-xl font-serif text-foreground mb-4">
                  Begin Your Spiritual Journey
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Your reflections, prayers, and moments with God will appear here. 
                  Start by sharing what's on your heart today.
                </p>
                <Button 
                  onClick={() => navigate("/journal/new-flow")}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-8 py-3"
                >
                  Write Your First Reflection
                </Button>
              </div>
            </motion.div>
          ) : searchQuery && filteredEntries.length === 0 ? (
            <div className="text-center p-8 bg-lightBeige/50 rounded-2xl">
              <p className="text-muted-foreground">
                No reflections found matching "{searchQuery}"
              </p>
            </div>
          ) : null}
        </section>

      </div>
    </Layout>
  );
};

export default Index;

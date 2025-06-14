
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { getRandomVerse } from "@/lib/api";
import { motion } from "framer-motion";
import { getJournalEntries, JournalEntry } from "@/lib/storage";
import SearchBar, { SearchFilters } from "@/components/SearchBar";
import FrostedBanner from "@/components/home/FrostedBanner";
import EnhancedToolsSection from "@/components/home/EnhancedToolsSection";
import SpiritualJourneySection from "@/components/home/SpiritualJourneySection";
import MoodSelectionSection from "@/components/home/MoodSelectionSection";
import RecentEntriesSection from "@/components/home/RecentEntriesSection";

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
        <FrostedBanner />
        <EnhancedToolsSection />
        <SpiritualJourneySection />
        <MoodSelectionSection />

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

        <RecentEntriesSection 
          recentEntries={recentEntries}
          filteredEntries={filteredEntries}
          searchQuery={searchQuery}
          isLoadingVerse={isLoadingVerse}
          onSearch={handleSearch}
        />
      </div>
    </Layout>
  );
};

export default Index;

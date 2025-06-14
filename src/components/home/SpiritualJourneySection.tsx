
import React from 'react';
import { motion } from 'framer-motion';
import MoodInsights from '@/components/MoodInsights';
import PersonalizedVerses from '@/components/PersonalizedVerses';
import PrayerReminders from '@/components/PrayerReminders';

const SpiritualJourneySection: React.FC = () => {
  return (
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
  );
};

export default SpiritualJourneySection;

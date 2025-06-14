
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const moodOptions = [
  { label: "Happy", emoji: "😊", color: "bg-grace-gold/70", value: "happy" },
  { label: "Grateful", emoji: "🙏", color: "bg-grace-blue/70", value: "grateful" },
  { label: "Anxious", emoji: "😟", color: "bg-soft-peach/70", value: "anxious" },
  { label: "Sad", emoji: "😢", color: "bg-light-beige/70", value: "sad" },
  { label: "Hopeful", emoji: "✨", color: "bg-grace-200/70", value: "hopeful" }
];

const MoodSelectionSection: React.FC = () => {
  const navigate = useNavigate();

  return (
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
  );
};

export default MoodSelectionSection;


import { Mood, moodEmojis } from "@/lib/storage";

interface MoodPickerProps {
  selectedMood: Mood | null;
  onSelectMood: (mood: Mood) => void;
}

const MoodPicker = ({ selectedMood, onSelectMood }: MoodPickerProps) => {
  const moods: Mood[] = [
    'joyful',
    'peaceful',
    'hopeful',
    'content',
    'neutral',
    'anxious',
    'sad',
    'stressed',
    'angry',
    'overwhelmed'
  ];

  return (
    <div className="mb-8">
      <h3 className="text-sm font-medium text-gray-700 mb-3 font-serif">How are you feeling today?</h3>
      <div className="grid grid-cols-5 gap-3">
        {moods.map((mood) => (
          <button
            key={mood}
            type="button"
            onClick={() => onSelectMood(mood)}
            className={`p-3 rounded-xl flex flex-col items-center transition-all duration-200 transform ${
              selectedMood === mood 
                ? 'bg-grace-300 border-2 border-grace-400 scale-105 shadow-md' 
                : 'bg-white border border-grace-200 hover:bg-grace-100 hover:scale-102'
            }`}
          >
            <span className="text-2xl mb-1">{moodEmojis[mood]}</span>
            <span className="text-xs capitalize font-medium">{mood}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MoodPicker;

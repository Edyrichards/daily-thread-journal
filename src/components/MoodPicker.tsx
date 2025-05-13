
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
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-2">How are you feeling today?</h3>
      <div className="grid grid-cols-5 gap-2">
        {moods.map((mood) => (
          <button
            key={mood}
            type="button"
            onClick={() => onSelectMood(mood)}
            className={`p-2 rounded-lg flex flex-col items-center 
              ${selectedMood === mood 
                ? 'bg-grace-300 border-2 border-grace-400' 
                : 'bg-white border border-grace-200 hover:bg-grace-100'
              }`}
          >
            <span className="text-2xl mb-1">{moodEmojis[mood]}</span>
            <span className="text-xs capitalize">{mood}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MoodPicker;

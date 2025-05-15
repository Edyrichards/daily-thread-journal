
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mood, moodEmojis } from "@/lib/storage";

interface ScriptureCategory {
  title: string;
  emotions: Mood[];
  verses: {
    text: string;
    reference: string;
  }[];
}

const scriptureCategories: ScriptureCategory[] = [
  {
    title: "Peace & Comfort",
    emotions: ["anxious", "stressed", "overwhelmed"],
    verses: [
      { text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.", reference: "Philippians 4:6-7" },
      { text: "Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.", reference: "John 14:27" },
      { text: "Come to me, all you who are weary and burdened, and I will give you rest.", reference: "Matthew 11:28" },
      { text: "Cast all your anxiety on him because he cares for you.", reference: "1 Peter 5:7" }
    ]
  },
  {
    title: "Hope & Encouragement",
    emotions: ["sad", "neutral"],
    verses: [
      { text: "For I know the plans I have for you, declares the LORD, plans to prosper you and not to harm you, plans to give you hope and a future.", reference: "Jeremiah 29:11" },
      { text: "But those who hope in the LORD will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.", reference: "Isaiah 40:31" },
      { text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.", reference: "Romans 8:28" }
    ]
  },
  {
    title: "Joy & Gratitude",
    emotions: ["joyful", "content", "peaceful"],
    verses: [
      { text: "Rejoice in the Lord always. I will say it again: Rejoice!", reference: "Philippians 4:4" },
      { text: "This is the day the LORD has made; let us rejoice and be glad in it.", reference: "Psalm 118:24" },
      { text: "Give thanks in all circumstances; for this is God's will for you in Christ Jesus.", reference: "1 Thessalonians 5:18" }
    ]
  },
  {
    title: "Guidance & Direction",
    emotions: ["hopeful", "neutral"],
    verses: [
      { text: "Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.", reference: "Proverbs 3:5-6" },
      { text: "Your word is a lamp for my feet, a light on my path.", reference: "Psalm 119:105" },
      { text: "If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you.", reference: "James 1:5" }
    ]
  },
  {
    title: "Strength & Courage",
    emotions: ["angry", "stressed"],
    verses: [
      { text: "I can do all this through him who gives me strength.", reference: "Philippians 4:13" },
      { text: "Be strong and courageous. Do not be afraid; do not be discouraged, for the LORD your God will be with you wherever you go.", reference: "Joshua 1:9" },
      { text: "The LORD is my strength and my shield; my heart trusts in him, and he helps me.", reference: "Psalm 28:7" }
    ]
  }
];

const ScriptureDiscovery = () => {
  const [selectedEmotion, setSelectedEmotion] = useState<Mood | null>(null);
  const [currentVerse, setCurrentVerse] = useState<{text: string, reference: string} | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleEmotionSelect = (emotion: Mood) => {
    setSelectedEmotion(emotion);
    
    // Find matching categories
    const matchingCategories = scriptureCategories.filter(category => 
      category.emotions.includes(emotion)
    );
    
    if (matchingCategories.length > 0) {
      // Randomly select a category if multiple match
      const selectedCategory = matchingCategories[Math.floor(Math.random() * matchingCategories.length)];
      
      // Randomly select a verse from the category
      const selectedVerse = selectedCategory.verses[Math.floor(Math.random() * selectedCategory.verses.length)];
      
      // Animate the verse change
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentVerse(selectedVerse);
        setIsAnimating(false);
      }, 300);
    }
  };

  return (
    <div className="animate-fade-in">
      <Card className="border-[#e8e8e0] shadow-sm overflow-hidden rounded-xl">
        <CardContent className="p-6">
          <h2 className="text-xl font-serif text-center text-[#333] mb-6">Scripture Discovery</h2>
          
          <p className="text-center text-[#666] mb-6 font-serif">
            How are you feeling right now? Select an emotion to discover scripture for your heart.
          </p>

          <div className="grid grid-cols-5 gap-2 mb-8">
            {Object.entries(moodEmojis).map(([mood, emoji]) => (
              <Button
                key={mood}
                onClick={() => handleEmotionSelect(mood as Mood)}
                variant="ghost"
                className={`p-2 rounded-full flex flex-col items-center transition-all hover:bg-[#f4f6f0] ${
                  selectedEmotion === mood ? "bg-[#f4f6f0] scale-110" : ""
                }`}
              >
                <span className="text-2xl mb-1">{emoji}</span>
                <span className="text-xs capitalize">{mood}</span>
              </Button>
            ))}
          </div>
          
          {selectedEmotion && (
            <div className={`transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
              <div className="bg-[#f4f6f0] rounded-xl p-6">
                {currentVerse && (
                  <>
                    <p className="verse-text mb-4 italic leading-relaxed text-[#333]">
                      "{currentVerse.text}"
                    </p>
                    <p className="verse-reference text-right">
                      — {currentVerse.reference}
                    </p>
                  </>
                )}
              </div>
              
              <div className="mt-4 text-center">
                <Button
                  onClick={() => handleEmotionSelect(selectedEmotion)}
                  variant="outline"
                  className="rounded-full px-4 py-2 text-sm border-[#c3d1b8] text-[#333] hover:bg-[#c3d1b8]"
                >
                  Discover Another Verse
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ScriptureDiscovery;

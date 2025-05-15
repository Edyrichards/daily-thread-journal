
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Headphones, PauseIcon, PlayIcon } from "lucide-react";

const prayerPrompts = [
  "Take a deep breath. What do you want to surrender today?",
  "God is listening. Speak freely.",
  "What are you grateful for in this moment?",
  "Is there something weighing on your heart today?",
  "Who needs your prayers right now?",
  "What Scripture has been meaningful to you lately?",
  "Where have you seen God's hand in your life recently?",
  "What are you hoping for?",
  "What burden can you release into His hands today?",
  "In the quiet, what is God saying to your heart?"
];

const GuidedPrayer = () => {
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Background music options
  const musicOptions = [
    {
      name: "Peaceful Piano",
      url: "https://cdn.freesound.org/previews/612/612095_5674468-lq.mp3" // placeholder URL
    },
    {
      name: "Ambient Worship",
      url: "https://cdn.freesound.org/previews/612/612092_13537971-lq.mp3" // placeholder URL
    },
    {
      name: "Nature Sounds",
      url: "https://cdn.freesound.org/previews/617/617443_1648170-lq.mp3" // placeholder URL
    }
  ];

  const [selectedMusic, setSelectedMusic] = useState(musicOptions[0]);

  useEffect(() => {
    // Initialize audio element
    if (!audioRef.current) {
      audioRef.current = new Audio(selectedMusic.url);
      audioRef.current.loop = true;
      audioRef.current.volume = volume;
    }

    return () => {
      // Cleanup
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // Update audio source when music changes
    if (audioRef.current) {
      const wasPlaying = !audioRef.current.paused;
      audioRef.current.src = selectedMusic.url;
      
      if (wasPlaying) {
        audioRef.current.play();
      }
    }
  }, [selectedMusic]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const nextPrompt = () => {
    setCurrentPrompt((prev) => (prev + 1) % prayerPrompts.length);
  };

  const previousPrompt = () => {
    setCurrentPrompt((prev) => (prev - 1 + prayerPrompts.length) % prayerPrompts.length);
  };

  const selectMusic = (music: typeof musicOptions[0]) => {
    setSelectedMusic(music);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <Card className="border-[#e8e8e0] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden rounded-xl">
        <CardContent className="p-8">
          <div className="flex items-center justify-center mb-8">
            <Button
              variant="ghost"
              size="sm"
              className="text-[#666] hover:text-[#333]"
              onClick={previousPrompt}
            >
              ❮
            </Button>
            <h2 className="devotional-prompt px-6 text-xl text-center font-serif text-[#333] leading-relaxed">
              {prayerPrompts[currentPrompt]}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-[#666] hover:text-[#333]"
              onClick={nextPrompt}
            >
              ❯
            </Button>
          </div>

          <div className="bg-[#f4f6f0] p-5 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Headphones size={18} className="text-[#666] mr-2" />
                <span className="font-serif text-sm text-[#666]">Background Music</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full w-8 h-8 p-0"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <PauseIcon size={16} className="text-[#666]" />
                ) : (
                  <PlayIcon size={16} className="text-[#666]" />
                )}
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {musicOptions.map((music) => (
                <Button
                  key={music.name}
                  variant="outline"
                  size="sm"
                  className={`rounded-full px-3 py-1 ${
                    selectedMusic.name === music.name
                      ? "bg-[#c3d1b8] text-[#333]"
                      : "bg-white text-[#666]"
                  }`}
                  onClick={() => selectMusic(music)}
                >
                  {music.name}
                </Button>
              ))}
            </div>

            <div className="pt-2">
              <label className="text-xs text-[#666] block mb-1">Volume</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={changeVolume}
                className="w-full accent-[#c3d1b8]"
              />
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-[#666] italic font-serif">
              Take a moment to be still. Journal your prayer below or simply meditate in silence.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuidedPrayer;


import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { generateId, Mood, moodEmojis, saveJournalEntry } from "@/lib/storage";
import { useNavigate } from "react-router-dom";
import { Mic, MicOff, Play, Pause, Square } from "lucide-react";

const VoiceJournal = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [mood, setMood] = useState<Mood>("peaceful");
  const [isSupported, setIsSupported] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Check for speech recognition support
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(prev => prev + ' ' + finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        toast({
          title: "Recording Error",
          description: "There was an issue with speech recognition. Please try again.",
          variant: "destructive",
        });
        setIsRecording(false);
      };
    }
  }, [toast]);

  const handleStartRecording = async () => {
    if (!isSupported) {
      toast({
        title: "Not Supported",
        description: "Voice recording is not supported by your browser.",
        variant: "destructive",
      });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        audioRef.current = new Audio(audioUrl);
      };

      mediaRecorderRef.current.start();
      recognitionRef.current?.start();
      setIsRecording(true);

      toast({
        title: "Recording Started",
        description: "Speak clearly into your microphone.",
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Permission Denied",
        description: "Please allow microphone access to use voice recording.",
        variant: "destructive",
      });
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    recognitionRef.current?.stop();
    setIsRecording(false);
    
    toast({
      title: "Recording Stopped",
      description: "Your voice entry has been transcribed.",
    });
  };

  const handlePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
        audioRef.current.onended = () => setIsPlaying(false);
      }
    }
  };

  const handleSaveEntry = () => {
    if (!transcript.trim()) {
      toast({
        title: "Empty Entry",
        description: "Please record or type something before saving.",
        variant: "destructive",
      });
      return;
    }

    const today = new Date();
    const entry = {
      id: generateId(),
      date: today.toISOString().split('T')[0],
      content: transcript,
      mood,
      createdAt: Date.now(),
    };

    saveJournalEntry(entry);
    toast({
      title: "Entry Saved",
      description: "Your voice journal entry has been saved.",
    });
    navigate("/journal");
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <Card className="bg-[#f8f3eb] border-[#e8e8e0] rounded-xl overflow-hidden">
          <CardContent className="p-6">
            <h2 className="text-center mb-4 text-2xl font-serif">Voice Journal Entry</h2>
            
            <div className="flex justify-center space-x-3 mb-6">
              {(['peaceful', 'hopeful', 'joyful', 'content'] as Mood[]).map((moodOption) => (
                <Button 
                  key={moodOption}
                  variant="ghost" 
                  className={`p-2 rounded-full text-2xl hover:bg-[#f4f6f0] transition-all ${mood === moodOption ? "bg-[#f4f6f0] scale-110" : ""}`}
                  onClick={() => setMood(moodOption)}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-2xl">{moodEmojis[moodOption]}</span>
                    <span className="text-sm block mt-1 capitalize">{moodOption}</span>
                  </div>
                </Button>
              ))}
            </div>

            <Textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Your journal entry will appear here as you speak, or you can type directly..."
              className="min-h-[120px] text-lg font-serif bg-white rounded-lg mb-4"
              rows={6}
            />
            
            <div className="flex justify-center space-x-4 mb-4">
              <Button 
                variant="outline" 
                className={`px-8 py-4 rounded-full text-lg font-serif ${isRecording ? 'bg-red-100 hover:bg-red-200 text-red-700' : 'bg-[#dbe2d3] hover:bg-[#c3d1b8] text-[#333]'}`}
                onClick={isRecording ? handleStopRecording : handleStartRecording}
                disabled={!isSupported}
              >
                {isRecording ? (
                  <>
                    <Square size={20} className="mr-2" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic size={20} className="mr-2" />
                    Start Recording
                  </>
                )}
              </Button>

              {audioRef.current && (
                <Button 
                  variant="outline" 
                  className="px-6 py-4 rounded-full text-lg font-serif bg-[#dbe2d3] hover:bg-[#c3d1b8] text-[#333]"
                  onClick={handlePlayback}
                >
                  {isPlaying ? (
                    <>
                      <Pause size={20} className="mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play size={20} className="mr-2" />
                      Play
                    </>
                  )}
                </Button>
              )}
            </div>

            {!isSupported && (
              <p className="text-center text-sm text-muted-foreground mb-4">
                Voice recording not supported. You can still type your entry above.
              </p>
            )}

            {transcript && (
              <div className="flex justify-end">
                <Button 
                  onClick={handleSaveEntry}
                  className="bg-[#c3d1b8] hover:bg-[#a3b198] text-[#333] rounded-full px-6"
                >
                  Save Entry
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VoiceJournal;

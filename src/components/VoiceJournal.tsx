
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, MicOff, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const VoiceJournal = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState<{ id: string; blob: Blob; url: string; date: Date }[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        setRecordings([
          ...recordings, 
          { 
            id: Date.now().toString(),
            blob: audioBlob,
            url: audioUrl,
            date: new Date()
          }
        ]);
        
        setRecordingTime(0);
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        
        toast({
          title: "Recording saved",
          description: "Your voice journal entry has been saved.",
        });
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      // Timer for recording duration
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
      
    } catch (err) {
      console.error("Error accessing microphone:", err);
      toast({
        title: "Microphone access denied",
        description: "Please allow access to your microphone to record voice entries.",
        variant: "destructive",
      });
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop all tracks on the stream
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };
  
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-serif text-[#333] mb-6">Voice Journal</h2>
      
      <Card className="mb-6 border-[#e8e8e0] shadow-sm hover:shadow-md transition-all duration-300">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="mb-4">
              {isRecording ? (
                <div className="text-lg font-medium text-[#333] mb-2">
                  Recording... {formatTime(recordingTime)}
                </div>
              ) : (
                <p className="text-[#666] font-serif mb-4">
                  Record your thoughts, prayers, or reflections instead of writing them down.
                </p>
              )}
            </div>
            
            <div className="flex justify-center">
              {isRecording ? (
                <Button
                  onClick={stopRecording}
                  className="rounded-full h-16 w-16 bg-red-500 hover:bg-red-600 flex items-center justify-center"
                >
                  <MicOff size={24} />
                </Button>
              ) : (
                <Button
                  onClick={startRecording}
                  className="rounded-full h-16 w-16 bg-[#c3d1b8] hover:bg-[#a3b198] text-[#333] flex items-center justify-center"
                >
                  <Mic size={24} />
                </Button>
              )}
            </div>
            
            {isRecording && (
              <p className="text-xs text-[#666] mt-4">Tap the button again to stop recording</p>
            )}
          </div>
        </CardContent>
      </Card>
      
      {recordings.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-serif text-lg text-[#333]">Your Voice Entries</h3>
          
          {recordings.map((recording) => (
            <Card 
              key={recording.id} 
              className="border-[#e8e8e0] shadow-sm hover:shadow-md transition-all duration-300"
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="text-[#333] font-medium">
                    {recording.date.toLocaleDateString()} {recording.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      const audio = new Audio(recording.url);
                      audio.play();
                    }}
                    className="h-8 w-8 rounded-full p-0 flex items-center justify-center"
                  >
                    <Play size={16} />
                  </Button>
                </div>
                <audio controls className="w-full mt-2">
                  <source src={recording.url} type="audio/webm" />
                  Your browser does not support the audio element.
                </audio>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VoiceJournal;

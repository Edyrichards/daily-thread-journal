
import { useState, useEffect } from "react";
import { getRandomVerse } from "../lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const BibleVerse = () => {
  const [verse, setVerse] = useState<{ text: string; reference: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchVerse = async () => {
      setLoading(true);
      try {
        const verseData = await getRandomVerse();
        setVerse(verseData);
      } catch (error) {
        console.error("Error fetching Bible verse:", error);
        toast({
          title: "Error loading verse",
          description: "We couldn't load today's verse. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVerse();
  }, [toast]);

  return (
    <Card className="mb-6 bg-[#f4f6f0] border-[#e8e8e0] overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 rounded-xl">
      <CardContent className="p-6 relative">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[150px] space-y-3">
            <div className="animate-pulse h-4 w-3/4 bg-[#e8e8e0] rounded"></div>
            <div className="animate-pulse h-4 w-1/2 bg-[#e8e8e0] rounded"></div>
            <div className="animate-pulse h-4 w-2/3 bg-[#e8e8e0] rounded"></div>
          </div>
        ) : (
          <>
            <div className="absolute -right-8 -top-8 text-6xl opacity-5 rotate-12">✝️</div>
            <h3 className="text-lg font-serif text-[#333] mb-3">Today's Verse</h3>
            <p className="verse-text mb-4 italic leading-relaxed text-[#333] text-lg">
              "{verse?.text.trim()}"
            </p>
            <p className="verse-reference text-right font-medium text-[#666]">
              — {verse?.reference}
            </p>
            <div className="absolute top-0 left-0 h-full w-1 bg-[#c3d1b8]"></div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BibleVerse;

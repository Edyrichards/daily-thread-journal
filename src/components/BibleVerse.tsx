
import { useState, useEffect } from "react";
import { getRandomVerse } from "../lib/api";
import { Card, CardContent } from "@/components/ui/card";

const BibleVerse = () => {
  const [verse, setVerse] = useState<{ text: string; reference: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchVerse = async () => {
      setLoading(true);
      try {
        const verseData = await getRandomVerse();
        setVerse(verseData);
      } catch (error) {
        console.error("Error fetching Bible verse:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVerse();
  }, []);

  return (
    <Card className="mb-8 bg-grace-100 border-grace-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-6 relative">
        {loading ? (
          <div className="flex items-center justify-center min-h-[150px]">
            <div className="animate-pulse h-4 w-3/4 bg-grace-200 mb-3 rounded"></div>
            <div className="animate-pulse h-4 w-1/2 bg-grace-200 mb-3 rounded"></div>
            <div className="animate-pulse h-4 w-2/3 bg-grace-200 rounded"></div>
          </div>
        ) : (
          <>
            <div className="absolute -right-8 -top-8 text-6xl opacity-5 rotate-12">✝️</div>
            <p className="verse-text mb-4 italic leading-relaxed text-grace-700">
              "{verse?.text.trim()}"
            </p>
            <p className="verse-reference text-right text-grace-500 font-medium">
              — {verse?.reference}
            </p>
            <div className="absolute top-0 left-0 h-full w-1 bg-grace-300"></div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BibleVerse;

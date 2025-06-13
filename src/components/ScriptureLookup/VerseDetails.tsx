
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Volume2, Share2, Heart, Eye } from 'lucide-react';
import { type BibleVerse, type VerseExplanation } from '@/lib/bibleApi';
import { useToast } from '@/hooks/use-toast';

interface VerseDetailsProps {
  verse: BibleVerse;
  explanation: VerseExplanation | null;
  showExplanation: boolean;
  onToggleExplanation: () => void;
}

const VerseDetails: React.FC<VerseDetailsProps> = ({
  verse,
  explanation,
  showExplanation,
  onToggleExplanation
}) => {
  const { toast } = useToast();

  const handleShare = async () => {
    const shareText = `"${verse.text}" - ${verse.reference} (${verse.translation})`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: verse.reference,
          text: shareText
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Copied to clipboard",
        description: "Verse has been copied to your clipboard"
      });
    }
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(`${verse.reference}. ${verse.text}`);
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "Not supported",
        description: "Text-to-speech is not supported in your browser",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{verse.reference}</CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleSpeak}>
              <Volume2 size={16} />
            </Button>
            <Button size="sm" variant="outline" onClick={handleShare}>
              <Share2 size={16} />
            </Button>
            <Button size="sm" variant="outline">
              <Heart size={16} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-muted/30 rounded-lg">
          <p className="text-lg leading-relaxed font-serif">{verse.text}</p>
          <div className="flex items-center justify-between mt-3 text-sm text-muted-foreground">
            <span>{verse.reference}</span>
            <span>{verse.translation}</span>
          </div>
        </div>

        {explanation && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={showExplanation ? "default" : "outline"}
                onClick={onToggleExplanation}
              >
                <Eye size={16} className="mr-2" />
                {showExplanation ? 'Hide' : 'Show'} Explanation
              </Button>
              <Badge className="capitalize">{explanation.difficulty}</Badge>
            </div>

            {showExplanation && (
              <div className="space-y-4 p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold mb-2">Commentary</h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {explanation.commentary}
                  </p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Historical Context</h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {explanation.historicalContext}
                  </p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Application</h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {explanation.application}
                  </p>
                </div>

                {explanation.crossReferences.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-2">Cross References</h4>
                      <div className="flex flex-wrap gap-2">
                        {explanation.crossReferences.map((ref, index) => (
                          <Badge key={index} variant="outline" className="cursor-pointer">
                            {ref}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {explanation.keywords.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-2">Key Themes</h4>
                      <div className="flex flex-wrap gap-2">
                        {explanation.keywords.map((keyword, index) => (
                          <Badge key={index} variant="secondary">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VerseDetails;

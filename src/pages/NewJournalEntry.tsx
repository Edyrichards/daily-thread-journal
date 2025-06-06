
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import MoodPicker from "@/components/MoodPicker";
import RichTextEditor from "@/components/RichTextEditor";
import TagsInput from "@/components/TagsInput";
import EntryTemplates from "@/components/EntryTemplates";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Mood, generateId } from "@/lib/storage";
import { EnhancedJournalEntry, saveEnhancedJournalEntry } from "@/lib/enhancedStorage";
import { getRandomVerse } from "@/lib/api";
import { ArrowLeft, Save, BookOpen } from "lucide-react";

const NewJournalEntry = () => {
  const [showTemplates, setShowTemplates] = useState(true);
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<Mood | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [category, setCategory] = useState<'devotion' | 'prayer' | 'gratitude' | 'study' | 'general'>('general');
  const [verse, setVerse] = useState<{ text: string; reference: string } | null>(null);
  const [isLoadingVerse, setIsLoadingVerse] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check if mood was selected from home page
    const moodFromParams = searchParams.get('mood') as Mood | null;
    if (moodFromParams) {
      setMood(moodFromParams);
    }

    // Check for existing draft
    const draft = localStorage.getItem('journal_draft');
    if (draft) {
      setContent(draft);
      setShowTemplates(false);
    }
  }, [searchParams]);

  const handleTemplateSelect = (templateContent: string) => {
    setContent(templateContent);
    setShowTemplates(false);
    
    // Auto-categorize based on template content
    if (templateContent.includes('Morning Devotion')) {
      setCategory('devotion');
      setTags(['morning', 'devotion']);
    } else if (templateContent.includes('Evening Reflection')) {
      setCategory('devotion');
      setTags(['evening', 'reflection']);
    } else if (templateContent.includes('Gratitude')) {
      setCategory('gratitude');
      setTags(['gratitude', 'thanksgiving']);
    } else if (templateContent.includes('Prayer')) {
      setCategory('prayer');
      setTags(['prayer']);
    } else if (templateContent.includes('Scripture Study')) {
      setCategory('study');
      setTags(['scripture-study', 'bible']);
    }
  };

  const handleSkipTemplates = () => {
    setShowTemplates(false);
  };

  const handleAddVerse = async () => {
    setIsLoadingVerse(true);
    try {
      const verseData = await getRandomVerse();
      setVerse(verseData);
    } catch (error) {
      console.error("Error fetching Bible verse:", error);
      toast({
        title: "Error",
        description: "Failed to load a verse. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingVerse(false);
    }
  };

  const handleSave = async (isDraft = false) => {
    if (!mood && !isDraft) {
      toast({
        title: "Mood Required",
        description: "Please select how you're feeling today.",
        variant: "destructive",
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "Entry Required",
        description: "Please write something for your journal entry.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const today = new Date();
      const entry: EnhancedJournalEntry = {
        id: generateId(),
        date: today.toISOString().split('T')[0],
        content,
        mood: mood || 'neutral',
        verse: verse || undefined,
        createdAt: Date.now(),
        tags,
        category,
        wordCount: content.split(/\s+/).length,
        readingTime: Math.max(1, Math.ceil(content.split(/\s+/).length / 200)),
        lastModified: Date.now()
      };

      saveEnhancedJournalEntry(entry);
      
      toast({
        title: isDraft ? "Draft Saved" : "Entry Saved",
        description: isDraft ? "Your draft has been saved." : "Your journal entry has been saved.",
      });
      
      if (!isDraft) {
        navigate("/journal");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (showTemplates) {
    return (
      <Layout title="New Journal Entry">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate("/journal")}
              className="mr-4"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-serif">New Journal Entry</h1>
          </div>
          
          <EntryTemplates 
            onSelectTemplate={handleTemplateSelect}
            onSkip={handleSkipTemplates}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="New Journal Entry">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => navigate("/journal")}
              className="mr-4"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-serif">New Journal Entry</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => handleSave(true)}
              disabled={isSaving}
              className="rounded-full"
            >
              Save Draft
            </Button>
            <Button
              onClick={() => handleSave(false)}
              disabled={isSaving}
              className="rounded-full"
            >
              <Save size={16} className="mr-2" />
              {isSaving ? "Saving..." : "Publish"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  onAddVerse={handleAddVerse}
                  placeholder="What's on your heart today? Share your thoughts, prayers, and reflections..."
                />
              </CardContent>
            </Card>
            
            {verse && (
              <Card className="bg-muted/50 border-grace-gold/20">
                <CardContent className="p-6 relative">
                  <div className="flex items-center mb-3">
                    <BookOpen size={16} className="mr-2 text-grace-gold" />
                    <span className="text-sm font-medium">Scripture</span>
                  </div>
                  <blockquote className="text-lg font-serif italic text-foreground mb-4 leading-relaxed">
                    "{verse.text}"
                  </blockquote>
                  <cite className="text-sm text-muted-foreground">— {verse.reference}</cite>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setVerse(null)}
                    className="absolute top-2 right-2 h-8 w-8 p-0"
                  >
                    ×
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-4">
            <Card>
              <CardContent className="p-4 space-y-4">
                <div>
                  <h3 className="font-medium mb-3">How are you feeling?</h3>
                  <MoodPicker selectedMood={mood} onSelectMood={setMood} />
                </div>

                <div>
                  <h3 className="font-medium mb-3">Category</h3>
                  <Select value={category} onValueChange={(value: any) => setCategory(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Reflection</SelectItem>
                      <SelectItem value="devotion">Devotional</SelectItem>
                      <SelectItem value="prayer">Prayer</SelectItem>
                      <SelectItem value="gratitude">Gratitude</SelectItem>
                      <SelectItem value="study">Scripture Study</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <TagsInput
                  tags={tags}
                  onTagsChange={setTags}
                  placeholder="Add tags to organize..."
                />

                {!verse && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddVerse}
                    disabled={isLoadingVerse}
                    className="w-full"
                  >
                    <BookOpen size={16} className="mr-2" />
                    {isLoadingVerse ? "Loading..." : "Add Scripture"}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NewJournalEntry;

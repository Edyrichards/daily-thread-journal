import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { JournalEntry, getJournalEntryById, deleteJournalEntry, moodEmojis } from "@/lib/storage";
import { format } from "date-fns";

const JournalEntryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      const journalEntry = getJournalEntryById(id);
      if (journalEntry) {
        setEntry(journalEntry);
      } else {
        navigate("/journal");
        toast({
          title: "Entry Not Found",
          description: "The journal entry you're looking for could not be found.",
          variant: "destructive",
        });
      }
    }
  }, [id, navigate, toast]);

  const handleDelete = () => {
    if (id) {
      deleteJournalEntry(id);
      toast({
        title: "Entry Deleted",
        description: "Your journal entry has been deleted.",
      });
      navigate("/journal");
    }
  };

  if (!entry) {
    return (
      <Layout title="Journal Entry">
        <p className="text-center text-[#666]">Loading entry...</p>
      </Layout>
    );
  }

  return (
    <Layout title="Journal Entry">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-serif text-[#333] flex items-center">
            <span className="mr-2 text-2xl">{moodEmojis[entry.mood]}</span>
            <span>{format(new Date(entry.date), "MMMM d, yyyy")}</span>
          </h2>
          <p className="text-[#666] capitalize text-sm">Feeling: {entry.mood}</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="text-red-500 border-red-200 hover:bg-red-50 rounded-full"
          >
            Delete
          </Button>
        </div>
      </div>
      
      <Card className="mb-8 border-[#e8e8e0] shadow-sm bg-white rounded-xl">
        <CardContent className="p-8">
          <p className="text-[#333] whitespace-pre-wrap leading-relaxed">{entry.content}</p>
        </CardContent>
      </Card>
      
      {entry.verse && (
        <Card className="mb-6 bg-[#f4f6f0] border-[#e8e8e0] shadow-sm rounded-xl">
          <CardContent className="p-6 relative">
            <h3 className="text-sm font-medium text-[#666] mb-3 font-serif">Scripture for Reflection</h3>
            <div className="absolute -right-8 -top-8 text-4xl opacity-5 rotate-12">✝️</div>
            <p className="verse-text mb-4 italic leading-relaxed text-[#333]">
              "{entry.verse.text.trim()}"
            </p>
            <p className="verse-reference text-right text-[#666] font-medium">
              — {entry.verse.reference}
            </p>
            <div className="absolute top-0 left-0 h-full w-1 bg-[#c3d1b8]"></div>
          </CardContent>
        </Card>
      )}
    </Layout>
  );
};

export default JournalEntryDetail;

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Share2, Trash2, BookOpen, Sparkles } from 'lucide-react';
import { LeafSprig } from '@/components/threads/Botanical';
import { JournalEntry, getJournalEntryById, deleteJournalEntry, moodEmojis } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

const SelahEntryDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [entry, setEntry] = useState<JournalEntry | null>(null);

  useEffect(() => {
    if (!id) return;
    const e = getJournalEntryById(id);
    if (e) setEntry(e);
    else { toast({ title: 'Entry not found', variant: 'destructive' }); navigate('/journal'); }
  }, [id, navigate, toast]);

  if (!entry) return <div className="min-h-screen bg-background" />;

  const dateStr = new Date(entry.createdAt || entry.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const shareVerse = () => {
    if (entry.verse) {
      navigator.clipboard?.writeText(`“${entry.verse.text.trim()}” — ${entry.verse.reference}`);
      toast({ title: 'Verse copied', description: 'Share it with someone today.' });
    }
  };
  const remove = () => { deleteJournalEntry(entry.id); toast({ title: 'Entry deleted' }); navigate('/journal'); };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-md px-5 pb-16">
        {/* top bar */}
        <div className="flex items-center justify-between pt-4">
          <button onClick={() => navigate('/journal')} aria-label="Back" className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
            <ChevronLeft className="h-5 w-5 text-ink-soft" />
          </button>
          <span className="eyebrow text-[11px] text-muted-foreground">Reflection</span>
          <button onClick={remove} aria-label="Delete" className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-destructive/80">
            <Trash2 className="h-[18px] w-[18px]" strokeWidth={1.6} />
          </button>
        </div>

        {/* header */}
        <motion.header initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mt-6 flex items-center gap-3.5">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-[24px]" aria-hidden>{moodEmojis[entry.mood]}</span>
          <div>
            <h1 className="font-display text-[24px] font-semibold leading-tight text-foreground">{dateStr}</h1>
            <p className="text-[13px] capitalize text-muted-foreground">Feeling {entry.mood}</p>
          </div>
        </motion.header>

        {/* scripture */}
        {entry.verse && (
          <section className="relative mt-6 overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-card" style={{ borderLeft: '4px solid hsl(var(--forest))' }}>
            <LeafSprig className="pointer-events-none absolute -right-2 -top-2 h-14 w-20 rotate-12 text-sage/20" />
            <div className="flex items-center gap-2 text-forest">
              <BookOpen className="h-4 w-4" strokeWidth={1.6} />
              <span className="eyebrow text-[10.5px]">Scripture for Reflection</span>
            </div>
            <p className="mt-3 font-display text-[21px] italic leading-snug text-foreground">“{entry.verse.text.trim()}”</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="eyebrow text-[10.5px] text-accent">{entry.verse.reference}</span>
              <button onClick={shareVerse} className="flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground">
                <Share2 className="h-4 w-4" /> Copy
              </button>
            </div>
          </section>
        )}

        {/* content */}
        <article className="mt-6 whitespace-pre-wrap text-[16px] leading-[1.75] text-foreground">
          {entry.content || <span className="text-muted-foreground">No writing for this entry.</span>}
        </article>

        {/* reflection */}
        {entry.reflection && (
          <section className="mt-6 rounded-2xl border border-border bg-accent/10 p-5">
            <div className="flex items-center gap-2 text-accent">
              <Sparkles className="h-4 w-4" strokeWidth={1.6} />
              <span className="eyebrow text-[10.5px]">What God is saying</span>
            </div>
            <p className="mt-2 font-display text-[19px] italic leading-snug text-foreground">{entry.reflection}</p>
          </section>
        )}
      </div>
    </div>
  );
};

export default SelahEntryDetailPage;

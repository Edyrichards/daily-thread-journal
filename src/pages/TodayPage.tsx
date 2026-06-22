import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, PenLine, ChevronRight, MoreHorizontal } from 'lucide-react';
import SelahShell from '@/components/selah/SelahShell';
import { Feather, SunSprout, SprigDivider, MoodFace, LeafSprig } from '@/components/threads/Botanical';
import { verseOfDay } from '@/lib/bible';
import { getJournalEntries, JournalEntry, Mood, moodEmojis } from '@/lib/storage';
import { entryTitle, relativeDay } from '@/lib/journal';

type MoodOpt = { label: string; mood: Mood; face: 'joyful' | 'peaceful' | 'overwhelmed' | 'grateful'; hsl: string };
const moodOpts: MoodOpt[] = [
  { label: 'Joyful', mood: 'joyful', face: 'joyful', hsl: '24 24% 54%' },
  { label: 'Peaceful', mood: 'peaceful', face: 'peaceful', hsl: '105 18% 52%' },
  { label: 'Overwhelmed', mood: 'overwhelmed', face: 'overwhelmed', hsl: '154 14% 49%' },
  { label: 'Grateful', mood: 'content', face: 'grateful', hsl: '24 24% 50%' },
];

const thumbGradients = [
  'linear-gradient(135deg, hsl(95 26% 82%), hsl(95 20% 62%))',
  'linear-gradient(135deg, hsl(40 45% 84%), hsl(30 38% 66%))',
  'linear-gradient(135deg, hsl(154 16% 84%), hsl(154 14% 54%))',
];

const TodayPage = () => {
  const navigate = useNavigate();
  const [verse, setVerse] = useState<{ text: string; reference: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    let active = true;
    verseOfDay()
      .then((v) => active && setVerse({ ...v, text: v.text.trim() }))
      .finally(() => active && setLoading(false));
    setEntries(
      getJournalEntries().sort(
        (a, b) => (b.createdAt || +new Date(b.date)) - (a.createdAt || +new Date(a.date)),
      ),
    );
    return () => { active = false; };
  }, []);

  const recent = useMemo(() => entries.slice(0, 2), [entries]);

  return (
    <SelahShell title="Home">
      {/* wordmark */}
      <header className="flex items-center justify-center gap-2.5 pb-2 pt-1">
        <Feather className="h-[26px] w-[26px] text-gold" />
        <h1 className="font-display text-[30px] font-semibold tracking-tight text-forest">
          Threads <span className="italic font-medium">of</span> Grace
        </h1>
      </header>

      {/* today's scripture */}
      <motion.section
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="relative mt-2 overflow-hidden rounded-[22px] border border-gold/45 bg-card px-6 py-7 text-center shadow-soft"
      >
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(120% 80% at 85% 0%, hsl(var(--gold-soft)/0.8), transparent 55%), radial-gradient(90% 60% at 0% 100%, hsl(var(--sage-soft)/0.7), transparent 60%)' }} />
        <LeafSprig className="pointer-events-none absolute -right-2 top-4 h-16 w-24 rotate-12 text-sage/30" />
        <div className="relative">
          <div className="flex items-center justify-center gap-2 text-gold">
            <SunSprout className="h-4 w-7" />
            <span className="eyebrow text-[11px]">Today’s Scripture</span>
          </div>
          {loading ? (
            <div className="mt-5 space-y-3">
              <div className="mx-auto h-5 w-4/5 animate-pulse rounded-full bg-secondary" />
              <div className="mx-auto h-5 w-3/5 animate-pulse rounded-full bg-secondary" />
            </div>
          ) : (
            <blockquote className="mt-4 font-display text-[27px] font-medium italic leading-[1.25] text-ink">
              “{verse?.text}”
            </blockquote>
          )}
          <SprigDivider className="my-5" />
          <p className="font-serif text-[16px] tracking-wide text-ink-soft">{verse?.reference}</p>
          <button
            onClick={() => setSaved((s) => !s)}
            aria-label="Save verse"
            className="mt-4 inline-flex text-clay/80"
          >
            <Heart className={saved ? 'h-5 w-5 fill-clay text-clay' : 'h-5 w-5'} />
          </button>
        </div>
      </motion.section>

      {/* mood */}
      <section className="mt-7">
        <p className="eyebrow text-[11px] text-muted-foreground">How are you feeling?</p>
        <div className="mt-4 flex items-center justify-between">
          {moodOpts.map((m) => (
            <button
              key={m.label}
              onClick={() => navigate(`/journal/new-flow?mood=${m.mood}`)}
              className="flex flex-col items-center gap-2"
            >
              <span
                className="flex h-[58px] w-[58px] items-center justify-center rounded-full transition-transform active:scale-95"
                style={{ backgroundColor: `hsl(${m.hsl} / 0.16)`, color: `hsl(${m.hsl})` }}
              >
                <MoodFace type={m.face} className="h-8 w-8" />
              </span>
              <span className="text-[12px] font-medium text-ink-soft">{m.label}</span>
            </button>
          ))}
          <ChevronRight className="h-5 w-5 self-center text-muted-foreground" />
        </div>
      </section>

      {/* start writing */}
      <button
        onClick={() => navigate('/journal/new-flow')}
        className="mt-7 flex w-full items-center justify-center gap-2.5 rounded-full bg-forest py-4 text-primary-foreground shadow-soft"
      >
        <PenLine className="h-[18px] w-[18px]" />
        <span className="font-sans text-[16px] font-semibold tracking-wide">Start Writing</span>
      </button>

      {/* recent entries */}
      <section className="mt-7">
        <div className="flex items-center justify-between">
          <p className="eyebrow text-[11px] text-muted-foreground">Recent Entries</p>
          <button onClick={() => navigate('/journal')} className="flex items-center gap-1 text-[12px] font-semibold text-gold">
            View All <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {recent.length === 0 ? (
          <button
            onClick={() => navigate('/journal/new-flow')}
            className="mt-3 flex w-full items-center gap-3 rounded-[18px] border border-dashed border-line bg-card/60 px-4 py-5 text-left"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-forest-soft text-forest">
              <PenLine className="h-5 w-5" />
            </span>
            <span>
              <span className="block font-serif text-[16px] text-ink">Your story begins here</span>
              <span className="block text-[13px] text-muted-foreground">Write your first reflection →</span>
            </span>
          </button>
        ) : (
          <ul className="mt-3 space-y-3">
            {recent.map((e, i) => (
              <li key={e.id}>
                <button
                  onClick={() => navigate(`/journal/${e.id}`)}
                  className="flex w-full items-stretch gap-3.5 rounded-[18px] border border-line bg-card p-3 text-left shadow-soft"
                >
                  <span
                    className="relative flex h-[74px] w-[74px] shrink-0 items-center justify-center overflow-hidden rounded-[14px]"
                    style={{ background: thumbGradients[i % thumbGradients.length] }}
                  >
                    <LeafSprig className="h-8 w-12 text-white/55" />
                  </span>
                  <span className="min-w-0 flex-1 py-0.5">
                    <span className="flex items-start justify-between gap-2">
                      <span className="font-serif text-[18px] font-medium leading-tight text-ink">{entryTitle(e)}</span>
                      <MoreHorizontal className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                    </span>
                    {e.content && (
                      <span className="mt-1 line-clamp-2 block text-[13px] leading-snug text-ink-soft">{e.content}</span>
                    )}
                    <span className="mt-2 flex items-center justify-between">
                      <span className="text-[12px] font-medium text-clay">{relativeDay(e)}</span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium capitalize text-ink-soft">
                        <span aria-hidden>{moodEmojis[e.mood]}</span> {e.mood}
                      </span>
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </SelahShell>
  );
};

export default TodayPage;

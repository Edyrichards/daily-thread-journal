import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Plus, BookOpen, Feather, X } from 'lucide-react';
import SelahShell from '@/components/selah/SelahShell';
import { getJournalEntries, JournalEntry, Mood, moodEmojis } from '@/lib/storage';
import { computeStreak, entriesThisWeek, entryTitle, relativeDay } from '@/lib/journal';
import { cn } from '@/lib/utils';

type Filter = { label: string; test: (e: JournalEntry) => boolean };

const filters: Filter[] = [
  { label: 'All', test: () => true },
  { label: 'Grateful', test: (e) => e.mood === 'joyful' || e.mood === 'content' },
  { label: 'At peace', test: (e) => e.mood === 'peaceful' },
  { label: 'Heavy', test: (e) => ['sad', 'anxious', 'overwhelmed', 'stressed'].includes(e.mood) },
  { label: 'With verse', test: (e) => Boolean(e.verse) },
];

const moodColor: Partial<Record<Mood, string>> = {
  joyful: 'var(--gold)', content: 'var(--gold)', hopeful: 'var(--sky)',
  peaceful: 'var(--sage)', neutral: 'var(--muted-foreground)',
  anxious: 'var(--clay)', sad: 'var(--plum)', stressed: 'var(--clay)',
  angry: 'var(--clay)', overwhelmed: 'var(--plum)',
};

const SelahJournalPage = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const all = getJournalEntries().sort(
      (a, b) => (b.createdAt || +new Date(b.date)) - (a.createdAt || +new Date(a.date)),
    );
    setEntries(all);
  }, []);

  const streak = useMemo(() => computeStreak(entries), [entries]);
  const thisWeek = useMemo(() => entriesThisWeek(entries), [entries]);

  const visible = useMemo(() => {
    const f = filters.find((x) => x.label === activeFilter) || filters[0];
    const q = query.trim().toLowerCase();
    return entries.filter(
      (e) =>
        f.test(e) &&
        (!q ||
          e.content?.toLowerCase().includes(q) ||
          e.reflection?.toLowerCase().includes(q) ||
          e.verse?.reference.toLowerCase().includes(q)),
    );
  }, [entries, activeFilter, query]);

  return (
    <SelahShell title="Journal">
      {/* header */}
      <header className="mb-4 mt-2 flex items-center justify-between">
        <h1 className="font-serif text-[30px] font-semibold tracking-tight text-ink">Journal</h1>
        <button
          onClick={() => setSearching((s) => !s)}
          className="flex h-11 w-11 items-center justify-center rounded-[14px] border border-line bg-card"
          aria-label="Search entries"
        >
          {searching ? <X className="h-5 w-5 text-ink-soft" /> : <Search className="h-5 w-5 text-ink-soft" />}
        </button>
      </header>

      {searching && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-4">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your reflections…"
            className="w-full rounded-[16px] border border-line bg-card px-4 py-3 text-[15px] text-ink outline-none placeholder:text-muted-foreground focus:border-clay/40"
          />
        </motion.div>
      )}

      {/* filter chips */}
      <div className="-mx-5 mb-4 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {filters.map((f) => (
          <button
            key={f.label}
            onClick={() => setActiveFilter(f.label)}
            className={cn(
              'shrink-0 rounded-full border px-3.5 py-2 text-[13px] font-semibold transition-colors',
              activeFilter === f.label
                ? 'border-transparent bg-clay-soft text-clay'
                : 'border-line bg-card text-ink-soft',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* stats */}
      <div className="mb-4 flex gap-3">
        {[
          { n: entries.length, l: 'entries', c: 'text-clay' },
          { n: streak, l: 'day streak', c: 'text-sage' },
          { n: thisWeek, l: 'this week', c: 'text-gold' },
        ].map((s) => (
          <div key={s.l} className="flex-1 rounded-[18px] border border-line bg-card p-3.5">
            <div className={cn('font-serif text-[26px] font-semibold leading-none', s.c)}>{s.n}</div>
            <div className="mt-1 text-[12px] font-semibold text-muted-foreground">{s.l}</div>
          </div>
        ))}
      </div>

      {/* entries */}
      {visible.length === 0 ? (
        <div className="mt-14 flex flex-col items-center px-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-sage-soft">
            <Feather className="h-7 w-7 text-sage" />
          </div>
          <h2 className="mt-4 font-serif text-[20px] font-semibold text-ink">
            {entries.length === 0 ? 'Your first page awaits' : 'Nothing here yet'}
          </h2>
          <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">
            {entries.length === 0
              ? 'Begin a reflection and it will live here — private, and just for you.'
              : 'Try a different filter or search.'}
          </p>
          {entries.length === 0 && (
            <button
              onClick={() => navigate('/journal/new-flow')}
              className="mt-5 rounded-[16px] bg-clay px-6 py-3 text-[15px] font-bold text-white shadow-glow-clay"
            >
              Write your first entry
            </button>
          )}
        </div>
      ) : (
        <ul className="space-y-3">
          {visible.map((e, i) => (
            <motion.li
              key={e.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.3) }}
            >
              <button
                onClick={() => navigate(`/journal/${e.id}`)}
                className="w-full rounded-[22px] border border-line bg-card p-4 text-left shadow-soft"
              >
                <div className="flex gap-3.5">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-secondary text-[21px]"
                    aria-hidden
                  >
                    {moodEmojis[e.mood] || '🕊️'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="truncate font-serif text-[17px] font-semibold text-ink">{entryTitle(e)}</h3>
                      <span className="shrink-0 text-[12px] font-semibold text-muted-foreground">
                        {relativeDay(e)}
                      </span>
                    </div>
                    {e.content && (
                      <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-ink-soft">{e.content}</p>
                    )}
                    <div className="mt-2.5 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold capitalize text-muted-foreground">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: `hsl(${moodColor[e.mood] || 'var(--muted-foreground)'})` }}
                        />
                        {e.mood}
                      </span>
                      {e.verse && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-sage-soft px-2.5 py-1 text-[11px] font-bold text-sage">
                          <BookOpen className="h-3 w-3" /> {e.verse.reference}
                        </span>
                      )}
                      {e.reflection && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gold-soft px-2.5 py-1 text-[11px] font-bold text-gold">
                          Reflection
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            </motion.li>
          ))}
        </ul>
      )}

      {/* FAB */}
      <button
        onClick={() => navigate('/journal/new-flow')}
        aria-label="New entry"
        className="fixed bottom-[104px] left-1/2 z-40 ml-[122px] flex h-[60px] w-[60px] -translate-x-1/2 items-center justify-center rounded-[22px] bg-clay shadow-glow-clay"
      >
        <Plus className="h-7 w-7 text-white" strokeWidth={2.4} />
      </button>
    </SelahShell>
  );
};

export default SelahJournalPage;

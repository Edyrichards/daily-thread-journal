import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Plus, X, Sparkles, BookOpen, HandHeart, Leaf, MoreHorizontal, LucideIcon } from 'lucide-react';
import SelahShell from '@/components/selah/SelahShell';
import { SprigDivider, LeafSprig } from '@/components/threads/Botanical';
import { getJournalEntries, JournalEntry, Mood, moodEmojis } from '@/lib/storage';
import { cn } from '@/lib/utils';

type Filter = { label: string; test: (e: JournalEntry) => boolean };
const filters: Filter[] = [
  { label: 'All', test: () => true },
  { label: 'Gratitude', test: (e) => e.mood === 'joyful' || e.mood === 'content' },
  { label: 'Reflection', test: (e) => Boolean(e.reflection) },
  { label: 'Scripture', test: (e) => Boolean(e.verse) },
];

const barColor: Partial<Record<Mood, string>> = {
  joyful: 'hsl(var(--gold))', content: 'hsl(var(--gold))', hopeful: 'hsl(var(--sky))',
  peaceful: 'hsl(var(--sage))', neutral: 'hsl(var(--muted-foreground))',
  anxious: 'hsl(var(--clay))', stressed: 'hsl(var(--clay))', overwhelmed: 'hsl(var(--clay))',
  angry: 'hsl(var(--clay))', sad: 'hsl(var(--plum))',
};

/** category tag (icon + label + color) for an entry */
const tagFor = (e: JournalEntry): { label: string; icon: LucideIcon; hsl: string } => {
  if (e.verse) return { label: 'Scripture', icon: BookOpen, hsl: '24 24% 50%' };
  if (e.reflection) return { label: 'Reflection', icon: Leaf, hsl: '105 18% 52%' };
  if (e.mood === 'joyful' || e.mood === 'content') return { label: 'Gratitude', icon: Leaf, hsl: '24 24% 50%' };
  if (['sad', 'anxious', 'overwhelmed', 'stressed'].includes(e.mood)) return { label: 'Prayer', icon: HandHeart, hsl: '30 33% 60%' };
  return { label: 'Reflection', icon: Leaf, hsl: '105 18% 52%' };
};

const fmtDate = (e: JournalEntry) =>
  new Date(e.createdAt || e.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

const SelahJournalPage = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [active, setActive] = useState('All');
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    setEntries(
      getJournalEntries().sort(
        (a, b) => (b.createdAt || +new Date(b.date)) - (a.createdAt || +new Date(a.date)),
      ),
    );
  }, []);

  const visible = useMemo(() => {
    const f = filters.find((x) => x.label === active) || filters[0];
    const q = query.trim().toLowerCase();
    return entries.filter(
      (e) => f.test(e) && (!q || e.content?.toLowerCase().includes(q) || e.reflection?.toLowerCase().includes(q) || e.verse?.reference.toLowerCase().includes(q)),
    );
  }, [entries, active, query]);

  return (
    <SelahShell title="Journal">
      {/* top bar */}
      <div className="flex items-center justify-between pt-1">
        <Sparkles className="h-5 w-5 text-gold" />
        <button
          onClick={() => setSearching((s) => !s)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-card"
          aria-label="Search"
        >
          {searching ? <X className="h-4 w-4 text-ink-soft" /> : <Search className="h-4 w-4 text-ink-soft" />}
        </button>
      </div>
      <h1 className="-mt-6 text-center font-display text-[36px] font-semibold tracking-tight text-forest">Journal</h1>
      <SprigDivider className="mb-5 mt-1" />

      {searching && (
        <motion.input
          initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
          autoFocus value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your reflections…"
          className="mb-4 w-full rounded-full border border-line bg-card px-4 py-2.5 text-[15px] text-ink outline-none placeholder:text-muted-foreground focus:border-forest/40"
        />
      )}

      {/* filters */}
      <div className="-mx-5 mb-5 flex gap-2.5 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {filters.map((f) => {
          const on = active === f.label;
          const Icon = f.label === 'Gratitude' ? Leaf : f.label === 'Reflection' ? HandHeart : f.label === 'Scripture' ? BookOpen : null;
          return (
            <button
              key={f.label}
              onClick={() => setActive(f.label)}
              className={cn(
                'flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-[13.5px] font-medium transition-colors',
                on ? 'border-transparent bg-forest text-primary-foreground' : 'border-line bg-card text-ink-soft',
              )}
            >
              {Icon && <Icon className="h-3.5 w-3.5" />}
              {f.label}
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <div className="mt-10 flex flex-col items-center px-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-forest-soft">
            <LeafSprig className="h-7 w-10 text-forest" />
          </div>
          <h2 className="mt-4 font-display text-[24px] font-semibold leading-tight text-ink">Your journal is<br />a sacred space</h2>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            {entries.length === 0 ? 'Start writing to reflect, grow, and draw closer to God.' : 'Nothing matches this filter yet.'}
          </p>
          {entries.length === 0 && (
            <button onClick={() => navigate('/journal/new-flow')} className="mt-5 rounded-full bg-forest px-6 py-3 font-sans text-[15px] font-semibold text-primary-foreground shadow-soft">Write your first entry
            </button>
          )}
        </div>
      ) : (
        <ul className="space-y-3.5">
          {visible.map((e, i) => {
            const tag = tagFor(e);
            return (
              <motion.li
                key={e.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.3) }}
              >
                <button
                  onClick={() => navigate(`/journal/${e.id}`)}
                  className="flex w-full gap-3.5 overflow-hidden rounded-[18px] border border-line bg-card p-4 pl-3 text-left shadow-soft"
                  style={{ borderLeft: `5px solid ${barColor[e.mood] || 'hsl(var(--line))'}` }}
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary text-[22px]" aria-hidden>
                    {moodEmojis[e.mood]}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between">
                      <span className="text-[12px] font-medium text-muted-foreground">{fmtDate(e)}</span>
                      <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                    </span>
                    <p className="mt-1.5 line-clamp-3 font-serif text-[16.5px] leading-snug text-ink">
                      {e.content || e.reflection || 'A quiet moment with God.'}
                    </p>
                    <span
                      className="mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                      style={{ backgroundColor: `hsl(${tag.hsl} / 0.14)`, color: `hsl(${tag.hsl})` }}
                    >
                      <tag.icon className="h-3 w-3" /> {tag.label}
                    </span>
                  </span>
                </button>
              </motion.li>
            );
          })}
        </ul>
      )}

      {/* FAB */}
      <button
        onClick={() => navigate('/journal/new-flow')}
        aria-label="New entry"
        className="fixed bottom-[100px] left-1/2 z-40 ml-[128px] flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-forest shadow-soft"
      >
        <Plus className="h-6 w-6 text-primary-foreground" strokeWidth={2.2} />
      </button>
    </SelahShell>
  );
};

export default SelahJournalPage;

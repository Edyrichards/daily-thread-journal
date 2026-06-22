import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Book, Crown, Search, Star, Bookmark, ChevronRight } from 'lucide-react';
import SelahShell from '@/components/selah/SelahShell';
import { SunSprout, LeafSprig } from '@/components/threads/Botanical';
import { getRandomVerse } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const plans = [
  { title: 'Chronological Bible', sub: '260 of 365 days', pct: 75, feature: true },
  { title: 'New Testament in 90 Days', sub: '36 of 90 days', pct: 40, feature: false },
  { title: 'Psalms of Peace', sub: '10 of 50 days', pct: 20, feature: false },
];

const bookmarks = [
  { text: '“For I know the plans I have for you,” declares the Lord, “plans to prosper you and not to harm you…”', ref: 'Jeremiah 29:11' },
  { text: '“I can do all this through him who gives me strength.”', ref: 'Philippians 4:13' },
];

const categories = [
  { label: 'Law', hsl: '95 21% 48%' },
  { label: 'History', hsl: '40 42% 50%' },
  { label: 'Poetry', hsl: '264 18% 58%' },
  { label: 'Prophets', hsl: '18 46% 54%' },
  { label: 'Gospels', hsl: '6 52% 52%' },
  { label: 'Epistles', hsl: '208 24% 56%' },
];
const catHsl: Record<string, string> = Object.fromEntries(categories.map((c) => [c.label, c.hsl]));
const books: { name: string; cat: string }[] = [
  { name: 'Genesis', cat: 'Law' }, { name: 'Exodus', cat: 'Law' }, { name: 'Leviticus', cat: 'Law' },
  { name: 'Numbers', cat: 'Law' }, { name: 'Joshua', cat: 'History' }, { name: 'Judges', cat: 'History' },
  { name: 'Ruth', cat: 'History' }, { name: '1 Samuel', cat: 'History' }, { name: '2 Samuel', cat: 'History' },
  { name: 'Psalms', cat: 'Poetry' }, { name: 'Proverbs', cat: 'Poetry' }, { name: 'Ecclesiastes', cat: 'Poetry' },
  { name: 'Isaiah', cat: 'Prophets' }, { name: 'Jeremiah', cat: 'Prophets' }, { name: 'Ezekiel', cat: 'Prophets' },
  { name: 'Matthew', cat: 'Gospels' }, { name: 'Mark', cat: 'Gospels' }, { name: 'Luke', cat: 'Gospels' },
  { name: 'John', cat: 'Gospels' }, { name: 'Acts', cat: 'History' }, { name: 'Romans', cat: 'Epistles' },
];

const Ring = ({ pct, light }: { pct: number; light?: boolean }) => {
  const size = 50, sw = 5, r = (size - sw) / 2, c = 2 * Math.PI * r;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={sw}
          stroke={light ? 'rgba(255,255,255,0.25)' : 'hsl(var(--secondary))'} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={sw} strokeLinecap="round"
          stroke={light ? '#fff' : 'hsl(var(--gold))'} strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} />
      </svg>
      <span className={cn('absolute inset-0 flex items-center justify-center text-[13px] font-bold', light ? 'text-white' : 'text-ink')}>{pct}%</span>
    </div>
  );
};

const SelahBiblePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [verse, setVerse] = useState<{ text: string; reference: string } | null>(null);
  const [starred, setStarred] = useState(false);

  useEffect(() => {
    getRandomVerse().then((v) => setVerse({ ...v, text: v.text.trim() }));
  }, []);

  return (
    <SelahShell title="Scripture">
      {/* header */}
      <div className="flex items-center justify-between pt-1">
        <Book className="h-6 w-6 text-forest" />
        <h1 className="font-display text-[34px] font-semibold tracking-tight text-forest">Scripture</h1>
        <Crown className="h-6 w-6 text-gold" />
      </div>

      {/* search */}
      <div className="mt-3 flex items-center gap-2.5 rounded-full border border-line bg-card px-4 py-3 shadow-soft">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          placeholder="Search Scripture, topics, or keywords"
          className="w-full bg-transparent text-[14px] text-ink outline-none placeholder:text-muted-foreground"
        />
      </div>

      {/* verse of the day */}
      <motion.section
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
        className="relative mt-4 overflow-hidden rounded-[20px] border border-gold/50 bg-card px-6 py-6 text-center shadow-soft"
      >
        <LeafSprig className="pointer-events-none absolute -left-3 bottom-2 h-16 w-24 -rotate-12 text-sage/25" />
        <button onClick={() => setStarred((s) => !s)} aria-label="Favorite" className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-forest text-primary-foreground">
          <Star className={cn('h-4 w-4', starred && 'fill-gold text-gold')} />
        </button>
        <div className="relative">
          <div className="flex items-center justify-center gap-2 text-gold">
            <SunSprout className="h-4 w-7" />
            <span className="eyebrow text-[10.5px]">Verse of the Day</span>
          </div>
          <blockquote className="mx-auto mt-3 max-w-[18rem] font-display text-[23px] font-medium italic leading-[1.3] text-ink">
            {verse ? `“${verse.text}”` : '…'}
          </blockquote>
          <p className="eyebrow mt-3 text-[11px] text-ink-soft">{verse?.reference}</p>
        </div>
      </motion.section>

      {/* reading plans */}
      <SectionHead title="Reading Plans" action="View all" onAction={() => navigate('/devotional')} />
      <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {plans.map((p) => (
          <button
            key={p.title}
            onClick={() => navigate('/devotional')}
            className={cn(
              'flex w-[200px] shrink-0 items-center gap-3 rounded-[18px] border p-4 text-left shadow-soft',
              p.feature ? 'border-transparent bg-forest text-primary-foreground' : 'border-line bg-card',
            )}
          >
            <Ring pct={p.pct} light={p.feature} />
            <span className="min-w-0">
              <span className={cn('block font-serif text-[15px] font-semibold leading-tight', p.feature ? 'text-white' : 'text-ink')}>{p.title}</span>
              <span className={cn('mt-0.5 block text-[12px]', p.feature ? 'text-white/80' : 'text-muted-foreground')}>{p.sub}</span>
            </span>
          </button>
        ))}
      </div>

      {/* bookmarked */}
      <SectionHead title="Bookmarked Verses" action="View all" onAction={() => toast({ title: 'Bookmarks', description: 'Your saved verses live here.' })} />
      <ul className="space-y-3">
        {bookmarks.map((b) => (
          <li key={b.ref}>
            <button className="flex w-full items-center gap-3.5 rounded-[18px] border border-line bg-card p-4 text-left shadow-soft">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-forest-soft text-forest"><Bookmark className="h-[18px] w-[18px]" /></span>
              <span className="min-w-0 flex-1">
                <span className="line-clamp-2 font-serif text-[14.5px] italic leading-snug text-ink-soft">{b.text}</span>
                <span className="eyebrow mt-1.5 block text-[10px] text-gold">{b.ref}</span>
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </button>
          </li>
        ))}
      </ul>

      {/* browse */}
      <SectionHead title="Browse the Bible" />
      <div className="-mx-5 mb-3 flex gap-4 overflow-x-auto px-5 pb-1 text-[12px] font-semibold [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((c) => (
          <span key={c.label} className="flex shrink-0 items-center gap-1.5" style={{ color: `hsl(${c.hsl})` }}>
            <span className="h-2 w-2 rounded-full" style={{ background: `hsl(${c.hsl})` }} /> {c.label}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        {books.map((b) => (
          <div key={b.name} className="rounded-[12px] border border-line bg-card px-2 py-2.5 text-center shadow-soft">
            <span className="font-serif text-[14px]" style={{ color: `hsl(${catHsl[b.cat]})` }}>{b.name}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-center text-[13px] text-muted-foreground">…and 48 more books</p>
    </SelahShell>
  );
};

const SectionHead = ({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) => (
  <div className="mb-3 mt-7 flex items-center justify-between">
    <h2 className="font-display text-[22px] font-semibold text-ink">{title}</h2>
    {action && (
      <button onClick={onAction} className="flex items-center gap-1 text-[12px] font-semibold text-gold">{action} <ChevronRight className="h-3.5 w-3.5" /></button>
    )}
  </div>
);

export default SelahBiblePage;

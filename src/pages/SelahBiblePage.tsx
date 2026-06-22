import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Book, Crown, Search, Star, Bookmark, ChevronRight } from 'lucide-react';
import SelahShell from '@/components/selah/SelahShell';
import { SunSprout, LeafSprig } from '@/components/threads/Botanical';
import {
  verseOfDay, BOOKS, CATEGORIES, CAT_HSL, PLANS, planPct, getBookmarks, isBookmarked,
  toggleBookmark, parseReference, Bookmark as Bk,
} from '@/lib/bible';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Ring = ({ pct, light }: { pct: number; light?: boolean }) => {
  const size = 50, sw = 5, r = (size - sw) / 2, c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={sw} stroke={light ? 'rgba(255,255,255,0.25)' : 'hsl(var(--secondary))'} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={sw} strokeLinecap="round" stroke={light ? '#fff' : 'hsl(var(--accent))'} strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} />
      </svg>
      <span className={cn('absolute inset-0 flex items-center justify-center text-[12px] font-bold', light ? 'text-white' : 'text-ink')}>{pct}%</span>
    </div>
  );
};

const SectionHead = ({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) => (
  <div className="mb-3 mt-7 flex items-center justify-between">
    <h2 className="font-display text-[22px] font-semibold text-ink">{title}</h2>
    {action && <button onClick={onAction} className="flex items-center gap-1 text-[12px] font-semibold text-accent">{action} <ChevronRight className="h-3.5 w-3.5" /></button>}
  </div>
);

const SelahBiblePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [verse, setVerse] = useState<{ text: string; reference: string } | null>(null);
  const [starred, setStarred] = useState(false);
  const [bookmarks, setBookmarks] = useState<Bk[]>([]);
  const [query, setQuery] = useState('');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    verseOfDay().then((v) => { const vv = { ...v, text: v.text.trim() }; setVerse(vv); setStarred(isBookmarked(vv.reference)); });
    setBookmarks(getBookmarks());
  }, []);

  const openRef = (reference: string) => {
    const p = parseReference(reference);
    if (p) navigate(`/bible/read?book=${encodeURIComponent(p.book)}&chapter=${p.chapter}`);
    else toast({ title: 'Hmm', description: `Couldn’t find “${reference}”.` });
  };
  const search = () => { if (query.trim()) openRef(query.trim()); };
  const star = () => {
    if (!verse) return;
    const added = toggleBookmark(verse);
    setStarred(added); setBookmarks(getBookmarks());
    toast({ title: added ? 'Saved to bookmarks' : 'Removed from bookmarks' });
  };

  const visibleBooks = showAll ? BOOKS : BOOKS.slice(0, 12);

  return (
    <SelahShell title="Scripture">
      <div className="flex items-center justify-between pt-1">
        <Book className="h-6 w-6 text-forest" strokeWidth={1.5} />
        <h1 className="font-display text-[34px] font-semibold tracking-tight text-forest">Scripture</h1>
        <Crown className="h-6 w-6 text-accent" strokeWidth={1.5} />
      </div>

      {/* search */}
      <div className="mt-3 flex items-center gap-2.5 rounded-full border border-border bg-card px-4 py-3 shadow-card">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && search()}
          placeholder="Search a reference, e.g. John 3"
          className="w-full bg-transparent text-[14px] text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>

      {/* verse of the day */}
      <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
        className="relative mt-4 overflow-hidden rounded-2xl border border-accent/50 bg-card px-6 py-6 text-center shadow-card">
        <LeafSprig className="pointer-events-none absolute -left-3 bottom-2 h-16 w-24 -rotate-12 text-sage/25" />
        <button onClick={star} aria-label="Bookmark verse" className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-forest text-primary-foreground">
          <Star className={cn('h-4 w-4', starred && 'fill-current')} />
        </button>
        <div className="relative">
          <div className="flex items-center justify-center gap-2 text-accent"><SunSprout className="h-4 w-7" /><span className="eyebrow text-[10.5px]">Verse of the Day</span></div>
          <blockquote className="mx-auto mt-3 max-w-[18rem] font-display text-[23px] font-medium italic leading-[1.3] text-ink">{verse ? `“${verse.text}”` : '…'}</blockquote>
          <button onClick={() => verse && openRef(verse.reference)} className="eyebrow mt-3 text-[11px] text-ink-soft underline-offset-4 hover:underline">{verse?.reference}</button>
        </div>
      </motion.section>

      {/* reading plans */}
      <SectionHead title="Reading Plans" />
      <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {PLANS.map((p, i) => {
          const pct = planPct(p.id);
          const feature = i === 0;
          return (
            <button key={p.id} onClick={() => navigate(`/bible/plan/${p.id}`)}
              className={cn('flex w-[210px] shrink-0 items-center gap-3 rounded-2xl border p-4 text-left shadow-card', feature ? 'border-transparent bg-forest text-primary-foreground' : 'border-border bg-card')}>
              <Ring pct={pct} light={feature} />
              <span className="min-w-0">
                <span className={cn('block text-[14px] font-semibold leading-tight', feature ? 'text-white' : 'text-ink')}>{p.title}</span>
                <span className={cn('mt-0.5 block text-[12px]', feature ? 'text-white/80' : 'text-muted-foreground')}>{p.days.length} days</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* bookmarks */}
      <SectionHead title="Bookmarked Verses" />
      {bookmarks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/60 p-5 text-center text-[14px] text-muted-foreground">
          Tap the <Star className="mx-0.5 inline h-3.5 w-3.5 -translate-y-px" /> on a verse to save it here.
        </div>
      ) : (
        <ul className="space-y-3">
          {bookmarks.slice(0, 4).map((b) => (
            <li key={b.reference}>
              <button onClick={() => openRef(b.reference)} className="flex w-full items-center gap-3.5 rounded-2xl border border-border bg-card p-4 text-left shadow-card">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-forest-soft text-forest"><Bookmark className="h-[18px] w-[18px]" /></span>
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-2 font-display text-[15px] italic leading-snug text-ink-soft">{b.text}</span>
                  <span className="eyebrow mt-1.5 block text-[10px] text-accent">{b.reference}</span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* browse */}
      <SectionHead title="Browse the Bible" />
      <div className="-mx-5 mb-3 flex gap-4 overflow-x-auto px-5 pb-1 text-[12px] font-semibold [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {CATEGORIES.map((c) => (
          <span key={c} className="flex shrink-0 items-center gap-1.5" style={{ color: `hsl(${CAT_HSL[c]})` }}>
            <span className="h-2 w-2 rounded-full" style={{ background: `hsl(${CAT_HSL[c]})` }} /> {c}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        {visibleBooks.map((b) => (
          <button key={b.name} onClick={() => navigate(`/bible/read?book=${encodeURIComponent(b.name)}&chapter=1`)}
            className="rounded-xl border border-border bg-card px-2 py-2.5 text-center shadow-card">
            <span className="font-display text-[14px] font-medium" style={{ color: `hsl(${CAT_HSL[b.cat]})` }}>{b.name}</span>
          </button>
        ))}
      </div>
      <button onClick={() => setShowAll((s) => !s)} className="mt-3 w-full text-center text-[13px] font-semibold text-accent">
        {showAll ? 'Show fewer' : `Show all ${BOOKS.length} books`}
      </button>
    </SelahShell>
  );
};

export default SelahBiblePage;

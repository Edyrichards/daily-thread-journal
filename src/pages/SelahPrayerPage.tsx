import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Menu, Flame, HandHeart, Heart, Bookmark, Globe, ChevronRight, Plus, X, MoreHorizontal, Sparkles,
} from 'lucide-react';
import SelahShell from '@/components/selah/SelahShell';
import { LeafSprig, SprigDivider } from '@/components/threads/Botanical';
import {
  Prayer, getPrayers, addPrayer, logPrayer, answerPrayer, getPrayerDays,
  PrayerRequest, getPrayerRequests, incrementPrayedCount,
} from '@/lib/storage';
import { isSameDay, streakFromDayKeys } from '@/lib/journal';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const DAY = 864e5;
const prayedToday = (p: Prayer) => !!p.lastPrayedAt && isSameDay(new Date(p.lastPrayedAt), new Date());
const daysPraying = (p: Prayer) => Math.floor((Date.now() - p.createdAt) / DAY);
const ptitle = (p: Prayer) => p.title || p.content;
const dotColors = ['hsl(var(--lavender))', 'hsl(var(--clay))', 'hsl(var(--sage))'];
const ago = (t: number) => {
  const h = Math.floor((Date.now() - t) / 36e5);
  if (h < 1) return 'just now';
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

const Toggle = ({ on, green, onClick }: { on: boolean; green?: boolean; onClick?: () => void }) => (
  <button
    onClick={onClick}
    className={cn(
      'relative h-[26px] w-[44px] rounded-full transition-colors',
      on ? (green ? 'bg-forest' : 'bg-lavender') : 'bg-secondary',
    )}
    aria-pressed={on}
  >
    <span className={cn('absolute top-[3px] h-5 w-5 rounded-full bg-white shadow transition-all', on ? 'left-[21px]' : 'left-[3px]')} />
  </button>
);

const SelahPrayerPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [prayers, setPrayers] = useState<Prayer[]>(() => getPrayers());
  const [wall, setWall] = useState<PrayerRequest[]>(() => getPrayerRequests());
  const [composing, setComposing] = useState(false);
  const [draft, setDraft] = useState('');

  const refresh = () => setPrayers(getPrayers());
  const streak = useMemo(() => streakFromDayKeys(getPrayerDays()), [prayers]);
  const mine = useMemo(
    () => [...prayers].sort((a, b) => (a.status === 'answered' ? 1 : 0) - (b.status === 'answered' ? 1 : 0) || b.createdAt - a.createdAt),
    [prayers],
  );

  const submit = () => {
    if (!draft.trim()) return;
    addPrayer(draft); setDraft(''); setComposing(false); refresh();
    toast({ title: 'Added to your prayers' });
  };
  const togglePrayed = (p: Prayer) => { if (!prayedToday(p)) { logPrayer(p.id); refresh(); } };
  const markAnswered = (p: Prayer) => { answerPrayer(p.id); refresh(); toast({ title: 'Prayer answered 🙏', description: 'Give thanks!' }); };
  const prayWall = (r: PrayerRequest) => { incrementPrayedCount(r.id); setWall(getPrayerRequests()); };

  return (
    <SelahShell title="Prayer">
      {/* header */}
      <div className="flex items-center justify-between pt-1">
        <Menu className="h-6 w-6 text-ink-soft" />
        <h1 className="font-display text-[34px] font-semibold tracking-tight text-forest">Prayer</h1>
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-card text-sage">
          <LeafSprig className="h-4 w-6" />
        </span>
      </div>
      <SprigDivider className="mb-4 mt-1" />

      {/* streak */}
      <div className="mb-5 flex items-center justify-center gap-3 rounded-[18px] border border-line bg-card px-5 py-3.5 shadow-soft">
        <Flame className="h-7 w-7 text-clay" />
        <div className="text-center">
          <p className="font-serif text-[19px] font-semibold text-ink">
            <span className="text-clay">{streak}</span> Day Prayer Streak
          </p>
          <p className="text-[12.5px] text-muted-foreground">Keep seeking. Keep believing.</p>
        </div>
      </div>

      {/* composer */}
      <AnimatePresence>
        {composing && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-4 overflow-hidden">
            <div className="rounded-[18px] border border-line bg-card p-4 shadow-soft">
              <textarea
                autoFocus value={draft} onChange={(e) => setDraft(e.target.value)}
                placeholder="What would you like to pray about?"
                className="min-h-[76px] w-full resize-none rounded-[14px] bg-secondary/60 p-3 font-serif text-[16px] text-ink outline-none placeholder:text-muted-foreground"
              />
              <div className="mt-2.5 flex justify-end gap-2">
                <button onClick={() => setComposing(false)} className="px-4 py-2 text-[14px] font-medium text-muted-foreground">Cancel</button>
                <button onClick={submit} className="rounded-full bg-forest px-5 py-2 text-[14px] font-semibold text-primary-foreground">Add prayer</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* my prayers */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-[24px] font-semibold text-ink">My Prayers</h2>
        <button onClick={() => navigate('/prayer/all')} className="flex items-center gap-1 text-[12px] font-semibold text-gold">View All <ChevronRight className="h-3.5 w-3.5" /></button>
      </div>

      {mine.length === 0 ? (
        <button onClick={() => setComposing(true)} className="mb-6 flex w-full items-center gap-3 rounded-[18px] border border-dashed border-line bg-lavender-soft/60 px-4 py-5 text-left">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-lavender-soft text-lavender"><HandHeart className="h-5 w-5" /></span>
          <span><span className="block font-serif text-[16px] text-ink">Bring it to God</span><span className="block text-[13px] text-muted-foreground">Add your first prayer →</span></span>
        </button>
      ) : (
        <ul className="mb-6 space-y-3">
          {mine.slice(0, 4).map((p, i) => {
            const answered = p.status === 'answered';
            return (
              <li key={p.id} className="rounded-[18px] bg-lavender-soft p-4">
                <div className="flex gap-3.5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-card text-lavender">
                    <HandHeart className="h-[22px] w-[22px]" strokeWidth={1.5} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-serif text-[16px] leading-snug text-ink">{ptitle(p)}</p>
                      {!answered && (
                        <button onClick={() => markAnswered(p)} aria-label="Mark answered"><MoreHorizontal className="h-4 w-4 shrink-0 text-muted-foreground" /></button>
                      )}
                    </div>
                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-ink-soft">
                        <span className="h-2 w-2 rounded-full" style={{ background: dotColors[i % dotColors.length] }} />
                        {answered ? 'Answered' : daysPraying(p) === 0 ? 'Today' : `${daysPraying(p)} days`}
                      </span>
                      <span className="flex items-center gap-2">
                        <span className={cn('text-[12px] font-semibold', answered ? 'text-forest' : 'text-ink-soft')}>{answered ? 'Answered' : 'Prayed'}</span>
                        <Toggle on={answered || prayedToday(p)} green={answered} onClick={() => !answered && togglePrayed(p)} />
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* prayer wall */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-display text-[24px] font-semibold text-ink"><Globe className="h-5 w-5 text-sage" /> Prayer Wall</h2>
        <button onClick={() => navigate('/community')} className="flex items-center gap-1 text-[12px] font-semibold text-gold">See All <ChevronRight className="h-3.5 w-3.5" /></button>
      </div>
      <ul className="space-y-3">
        {(wall.length ? wall.slice(0, 2) : []).map((r) => (
          <li key={r.id} className="rounded-[18px] border border-line bg-card p-4 shadow-soft">
            <div className="flex gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lavender-soft text-lavender"><Heart className="h-5 w-5" /></span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-ink">{r.isAnonymous ? 'Anonymous' : 'A friend'} <span className="ml-1 font-normal text-muted-foreground">{ago(r.createdAt)}</span></span>
                  <Bookmark className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="mt-1 font-serif text-[15.5px] leading-snug text-ink-soft">{r.text}</p>
                <div className="mt-2.5 flex items-center gap-5 text-[12.5px] font-semibold text-muted-foreground">
                  <button onClick={() => prayWall(r)} className="flex items-center gap-1.5 text-clay"><Heart className="h-4 w-4" /> {r.prayedCount}</button>
                  <span className="flex items-center gap-1.5"><HandHeart className="h-4 w-4" /> {r.comments?.length || 0}</span>
                </div>
              </div>
            </div>
          </li>
        ))}
        {wall.length === 0 && (
          <li className="rounded-[18px] border border-line bg-card p-5 text-center text-[14px] text-muted-foreground">
            The wall is quiet. Be the first to share a request with the community.
          </li>
        )}
      </ul>

      {/* guided prayer CTA */}
      <button
        onClick={() => navigate('/prayer/guided')}
        className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-full py-4 text-white shadow-soft"
        style={{ background: 'linear-gradient(135deg, hsl(30 36% 64%), hsl(24 28% 52%))' }}
      >
        <Sparkles className="h-[18px] w-[18px]" />
        <span className="font-sans text-[16px] font-semibold tracking-wide">Start Guided Prayer</span>
      </button>

      {/* FAB */}
      <button onClick={() => setComposing((c) => !c)} aria-label="Add prayer" className="fixed bottom-[100px] left-1/2 z-40 ml-[128px] flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-forest shadow-soft">
        {composing ? <X className="h-6 w-6 text-primary-foreground" /> : <Plus className="h-6 w-6 text-primary-foreground" strokeWidth={2.2} />}
      </button>
    </SelahShell>
  );
};

export default SelahPrayerPage;

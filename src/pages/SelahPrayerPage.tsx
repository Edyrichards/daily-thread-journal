import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Play, Heart, Check, Sparkles, X, HandHeart } from 'lucide-react';
import SelahShell from '@/components/selah/SelahShell';
import {
  Prayer, getPrayers, addPrayer, logPrayer, answerPrayer,
} from '@/lib/storage';
import { isSameDay } from '@/lib/journal';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const DAY = 24 * 60 * 60 * 1000;
const barColors = ['bg-clay', 'bg-sage', 'bg-gold', 'bg-plum', 'bg-sky'];

const prayedToday = (p: Prayer) => !!p.lastPrayedAt && isSameDay(new Date(p.lastPrayedAt), new Date());
const daysPraying = (p: Prayer) => Math.floor((Date.now() - p.createdAt) / DAY);
const prayerTitle = (p: Prayer) =>
  p.title || (p.content.split(/\s+/).slice(0, 6).join(' ') + (p.content.split(/\s+/).length > 6 ? '…' : ''));

const SelahPrayerPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [prayers, setPrayers] = useState<Prayer[]>(() => getPrayers());
  const [tab, setTab] = useState<'active' | 'answered'>('active');
  const [composing, setComposing] = useState(false);
  const [draft, setDraft] = useState('');

  const refresh = () => setPrayers(getPrayers());

  const active = useMemo(
    () => prayers.filter((p) => p.status !== 'answered').sort((a, b) => b.createdAt - a.createdAt),
    [prayers],
  );
  const answered = useMemo(
    () => prayers.filter((p) => p.status === 'answered').sort((a, b) => (b.answeredAt || 0) - (a.answeredAt || 0)),
    [prayers],
  );
  const answeredThisYear = useMemo(
    () => answered.filter((p) => p.answeredAt && new Date(p.answeredAt).getFullYear() === new Date().getFullYear()).length,
    [answered],
  );

  const submit = () => {
    if (!draft.trim()) return;
    addPrayer(draft);
    setDraft('');
    setComposing(false);
    refresh();
    toast({ title: 'Added to your prayers', description: 'We’ll help you carry it.' });
  };

  const onPray = (p: Prayer) => {
    if (prayedToday(p)) return;
    logPrayer(p.id);
    refresh();
  };

  const onAnswer = (p: Prayer) => {
    answerPrayer(p.id);
    refresh();
    toast({ title: 'Prayer answered 🙏', description: 'Moved to Answered — give thanks!' });
  };

  return (
    <SelahShell title="Prayer">
      {/* header */}
      <header className="mb-4 mt-2 flex items-center justify-between">
        <h1 className="font-serif text-[30px] font-semibold tracking-tight text-ink">Prayer</h1>
        <button
          onClick={() => setComposing((c) => !c)}
          className="flex h-11 w-11 items-center justify-center rounded-[14px] border border-line bg-card"
          aria-label="Add prayer"
        >
          {composing ? <X className="h-5 w-5 text-ink-soft" /> : <Plus className="h-[22px] w-[22px] text-ink-soft" />}
        </button>
      </header>

      {/* composer */}
      <AnimatePresence>
        {composing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <div className="rounded-[22px] border border-line bg-card p-4 shadow-soft">
              <textarea
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="What would you like to pray about?"
                className="min-h-[84px] w-full resize-none rounded-[16px] bg-secondary/60 p-3.5 font-serif text-[16px] leading-relaxed text-ink outline-none placeholder:text-muted-foreground"
              />
              <div className="mt-3 flex justify-end gap-2">
                <button onClick={() => setComposing(false)} className="rounded-[14px] px-4 py-2.5 text-[14px] font-semibold text-muted-foreground">
                  Cancel
                </button>
                <button onClick={submit} className="rounded-[14px] bg-clay px-5 py-2.5 text-[14px] font-bold text-white shadow-glow-clay">
                  Add prayer
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* tabs */}
      <div className="mb-4 flex gap-2">
        {([['active', `Active · ${active.length}`], ['answered', `Answered · ${answered.length}`]] as const).map(
          ([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={cn(
                'rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors',
                tab === key ? 'border-transparent bg-clay-soft text-clay' : 'border-line bg-card text-ink-soft',
              )}
            >
              {label}
            </button>
          ),
        )}
      </div>

      {tab === 'active' && (
        <>
          {/* guided session */}
          <button
            onClick={() => navigate('/prayer/guided')}
            className="relative mb-5 w-full overflow-hidden rounded-[26px] bg-sage-grad p-5 text-left text-white shadow-soft"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[12px] font-bold uppercase tracking-[1.2px] text-white/85">Guided session</p>
                <h2 className="mt-1.5 font-serif text-[21px] font-semibold">Pray through A.C.T.S.</h2>
                <p className="mt-1 text-[13px] text-white/90">Adoration · Confession · Thanks · Supplication</p>
              </div>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/20">
                <Play className="h-5 w-5 fill-current" />
              </span>
            </div>
          </button>

          {active.length === 0 ? (
            <EmptyState
              title="Bring it to God"
              body="Add your first prayer request and we’ll help you return to it each day."
              cta="Add a prayer"
              onCta={() => setComposing(true)}
            />
          ) : (
            <ul className="space-y-3">
              {active.map((p, i) => {
                const prayed = prayedToday(p);
                const days = daysPraying(p);
                return (
                  <li key={p.id} className="rounded-[22px] border border-line bg-card p-4 shadow-soft">
                    <div className="flex items-stretch gap-3.5">
                      <div className={cn('w-[5px] shrink-0 rounded-full', barColors[i % barColors.length])} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="font-semibold text-[16px] leading-snug text-ink">{prayerTitle(p)}</h3>
                          <span className="flex shrink-0 items-center gap-1 text-[12px] font-semibold text-muted-foreground">
                            <Heart className="h-3.5 w-3.5 fill-clay text-clay" /> {p.prayedCount || 0}
                          </span>
                        </div>
                        <p className="mt-0.5 text-[12px] font-semibold text-muted-foreground">
                          {days === 0 ? 'Praying since today' : `Praying ${days} ${days === 1 ? 'day' : 'days'}`}
                        </p>
                        <div className="mt-3 flex items-center gap-4">
                          <button
                            onClick={() => onPray(p)}
                            disabled={prayed}
                            className={cn(
                              'flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-bold transition-colors',
                              prayed ? 'bg-sage-soft text-sage' : 'bg-clay text-white shadow-glow-clay',
                            )}
                          >
                            {prayed ? <Check className="h-4 w-4" strokeWidth={2.6} /> : <HandHeart className="h-4 w-4" />}
                            {prayed ? 'Prayed today' : 'Pray now'}
                          </button>
                          <button onClick={() => onAnswer(p)} className="text-[13px] font-semibold text-sage">
                            Mark answered
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}

      {tab === 'answered' && (
        <>
          {answered.length > 0 && (
            <div className="mb-4 flex items-center gap-3 rounded-[22px] bg-gold-soft p-4">
              <Sparkles className="h-7 w-7 shrink-0 text-gold" />
              <div>
                <p className="font-bold text-[15px] text-ink">
                  {answeredThisYear} {answeredThisYear === 1 ? 'prayer' : 'prayers'} answered this year
                </p>
                <p className="text-[13px] text-ink-soft">A record of God’s faithfulness.</p>
              </div>
            </div>
          )}
          {answered.length === 0 ? (
            <EmptyState
              title="Watching for answers"
              body="When a prayer is answered, mark it here — a growing record of faithfulness to look back on."
            />
          ) : (
            <ul className="space-y-3">
              {answered.map((p) => (
                <li key={p.id} className="rounded-[22px] border border-line bg-card p-4 shadow-soft">
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-soft">
                      <Check className="h-5 w-5 text-gold" strokeWidth={2.6} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-[16px] leading-snug text-ink">{prayerTitle(p)}</h3>
                      {p.answerNote && <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">{p.answerNote}</p>}
                      <p className="mt-1.5 text-[12px] font-semibold text-muted-foreground">
                        Answered{' '}
                        {p.answeredAt &&
                          new Date(p.answeredAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </SelahShell>
  );
};

const EmptyState = ({
  title, body, cta, onCta,
}: { title: string; body: string; cta?: string; onCta?: () => void }) => (
  <div className="mt-10 flex flex-col items-center px-6 text-center">
    <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-clay-soft">
      <HandHeart className="h-7 w-7 text-clay" />
    </div>
    <h2 className="mt-4 font-serif text-[20px] font-semibold text-ink">{title}</h2>
    <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">{body}</p>
    {cta && (
      <button onClick={onCta} className="mt-5 rounded-[16px] bg-clay px-6 py-3 text-[15px] font-bold text-white shadow-glow-clay">
        {cta}
      </button>
    )}
  </div>
);

export default SelahPrayerPage;

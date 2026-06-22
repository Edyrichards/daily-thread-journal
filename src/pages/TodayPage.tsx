import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Flame, Bookmark, Feather, Share2, ChevronRight, BookOpen, Heart, Check,
} from 'lucide-react';
import SelahShell from '@/components/selah/SelahShell';
import { getRandomVerse } from '@/lib/api';
import { getJournalEntries, getPrayers, JournalEntry, Mood } from '@/lib/storage';
import { cn } from '@/lib/utils';

/* ----------------------------- helpers ----------------------------- */
const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
};

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

/** Consecutive days (ending today or yesterday) with at least one entry. */
const computeStreak = (entries: JournalEntry[]): number => {
  if (!entries.length) return 0;
  const days = new Set(
    entries.map((e) => {
      const d = new Date(e.createdAt || e.date);
      return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    }),
  );
  let streak = 0;
  const cursor = new Date();
  // allow the streak to "start" yesterday if today isn't logged yet
  if (!days.has(new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate()).getTime())) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (days.has(new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate()).getTime())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
};

const moodChips: { label: string; emoji: string; value: Mood; bg: string }[] = [
  { label: 'At peace', emoji: '😌', value: 'peaceful', bg: 'bg-sage-soft' },
  { label: 'Grateful', emoji: '😊', value: 'joyful', bg: 'bg-gold-soft' },
  { label: 'Anxious', emoji: '😟', value: 'anxious', bg: 'bg-clay-soft' },
  { label: 'Heavy', emoji: '😢', value: 'sad', bg: 'bg-sky/15' },
  { label: 'Numb', emoji: '😶', value: 'neutral', bg: 'bg-secondary' },
];

/* ------------------------------ page ------------------------------- */
const TodayPage = () => {
  const navigate = useNavigate();
  const [verse, setVerse] = useState<{ text: string; reference: string } | null>(null);
  const [loadingVerse, setLoadingVerse] = useState(true);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [prayedToday, setPrayedToday] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let active = true;
    getRandomVerse()
      .then((v) => active && setVerse({ ...v, text: v.text.trim() }))
      .finally(() => active && setLoadingVerse(false));
    setEntries(getJournalEntries());
    setPrayedToday(
      getPrayers().some((p) => p.lastPrayedAt && isSameDay(new Date(p.lastPrayedAt), new Date())),
    );
    return () => {
      active = false;
    };
  }, []);

  const streak = useMemo(() => computeStreak(entries), [entries]);
  const journaledToday = useMemo(
    () => entries.some((e) => isSameDay(new Date(e.createdAt || e.date), new Date())),
    [entries],
  );
  const userName = localStorage.getItem('userName') || 'friend';
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const rhythm = [
    { icon: BookOpen, label: 'Read the Word', sub: 'A few verses to dwell on', href: '/bible', done: false },
    { icon: Heart, label: 'Pray', sub: 'Bring your requests to God', href: '/prayer', done: prayedToday },
    {
      icon: Feather, label: 'Journal your reflection', sub: 'What is God saying to you?',
      href: '/journal/new-flow', done: journaledToday,
    },
  ];
  const doneCount = rhythm.filter((r) => r.done).length;

  const share = () => {
    if (verse && navigator.share) {
      navigator.share({ text: `“${verse.text}” — ${verse.reference}`, title: 'Selah' }).catch(() => {});
    }
  };

  return (
    <SelahShell title="Today">
      {/* header */}
      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-5 flex items-start justify-between"
      >
        <div>
          <p className="text-[13px] font-semibold text-muted-foreground">{today}</p>
          <h1 className="mt-0.5 font-serif text-[30px] font-semibold leading-tight tracking-tight text-ink">
            {greeting()},
            <br />
            <span className="capitalize">{userName}</span>
          </h1>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 rounded-full bg-gold-soft px-3 py-2 text-[15px] font-bold text-gold">
            <Flame className="h-4 w-4 fill-current" />
            {streak}
          </div>
          <button
            onClick={() => navigate('/settings')}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-clay to-gold text-[15px] font-bold text-white"
            aria-label="Profile"
          >
            {userName.charAt(0).toUpperCase()}
          </button>
        </div>
      </motion.header>

      {/* verse of the day */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="relative overflow-hidden rounded-[28px] bg-dawn p-6 text-white shadow-soft"
      >
        <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/10" />
        <p className="text-[12px] font-bold uppercase tracking-[1.4px] text-white/85">Verse of the day</p>
        {loadingVerse ? (
          <div className="mt-3 space-y-2.5">
            <div className="h-5 w-5/6 animate-pulse rounded-full bg-white/25" />
            <div className="h-5 w-2/3 animate-pulse rounded-full bg-white/20" />
          </div>
        ) : (
          <blockquote className="mt-3 font-serif text-[22px] font-medium leading-[1.45]">
            “{verse?.text}”
          </blockquote>
        )}
        <p className="mt-3 font-bold text-white/90">{verse?.reference}</p>
        <div className="mt-5 flex items-center gap-5 text-[13px] font-semibold">
          <button onClick={() => setSaved((s) => !s)} className="flex items-center gap-1.5">
            <Bookmark className={cn('h-[17px] w-[17px]', saved && 'fill-current')} />
            {saved ? 'Saved' : 'Save'}
          </button>
          <button onClick={() => navigate('/journal/new-flow')} className="flex items-center gap-1.5">
            <Feather className="h-[17px] w-[17px]" /> Reflect
          </button>
          <button onClick={share} className="flex items-center gap-1.5">
            <Share2 className="h-[17px] w-[17px]" /> Share
          </button>
        </div>
      </motion.section>

      {/* mood check-in */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.12 }}
        className="mt-6"
      >
        <h2 className="mb-3 font-serif text-[18px] font-semibold text-ink">How is your heart today?</h2>
        <div className="flex items-start justify-between">
          {moodChips.map((m) => (
            <button
              key={m.value}
              onClick={() => navigate(`/journal/new-flow?mood=${m.value}`)}
              className="group flex flex-col items-center gap-1.5"
            >
              <span
                className={cn(
                  'flex h-[54px] w-[54px] items-center justify-center rounded-[18px] text-[26px] transition-transform group-active:scale-95',
                  m.bg,
                )}
              >
                {m.emoji}
              </span>
              <span className="text-[11px] font-semibold text-ink-soft">{m.label}</span>
            </button>
          ))}
        </div>
      </motion.section>

      {/* today's rhythm */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.18 }}
        className="mt-7"
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif text-[18px] font-semibold text-ink">Today’s rhythm</h2>
          <span className="text-[13px] font-semibold text-muted-foreground">{doneCount} of 3</span>
        </div>
        <div className="rounded-[24px] border border-line bg-card px-4 shadow-soft">
          {rhythm.map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.href)}
                className={cn(
                  'flex w-full items-center gap-3.5 py-3.5 text-left',
                  i < rhythm.length - 1 && 'border-b border-line',
                )}
              >
                <span
                  className={cn(
                    'flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[10px]',
                    item.done ? 'bg-sage-soft' : 'bg-secondary',
                  )}
                >
                  {item.done ? (
                    <Check className="h-[17px] w-[17px] text-sage" strokeWidth={2.4} />
                  ) : (
                    <Icon className="h-[17px] w-[17px] text-muted-foreground" strokeWidth={2} />
                  )}
                </span>
                <span className="flex-1">
                  <span
                    className={cn(
                      'block text-[15px] font-semibold',
                      item.done ? 'text-muted-foreground line-through' : 'text-ink',
                    )}
                  >
                    {item.label}
                  </span>
                  {!item.done && <span className="block text-[12px] text-muted-foreground">{item.sub}</span>}
                </span>
                {!item.done && <ChevronRight className="h-[18px] w-[18px] text-muted-foreground" />}
              </button>
            );
          })}
        </div>
      </motion.section>
    </SelahShell>
  );
};

export default TodayPage;

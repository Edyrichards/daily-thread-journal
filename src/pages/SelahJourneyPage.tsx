import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, User, BookOpen, Flame, Heart } from 'lucide-react';
import SelahShell from '@/components/selah/SelahShell';
import { LeafSprig, SunSprout } from '@/components/threads/Botanical';
import { verseOfDay } from '@/lib/bible';
import { getJournalEntries, JournalEntry, Mood } from '@/lib/storage';
import { computeStreak } from '@/lib/journal';

type Cat = 'Happy' | 'Calm' | 'Anxious' | 'Grateful';
const catOf = (m: Mood): Cat =>
  m === 'joyful' ? 'Happy'
    : m === 'hopeful' || m === 'content' ? 'Grateful'
    : m === 'peaceful' || m === 'neutral' ? 'Calm'
    : 'Anxious';
const catHsl: Record<Cat, string> = { Happy: '105 18% 52%', Calm: '154 14% 49%', Anxious: '24 24% 54%', Grateful: '30 33% 60%' };
const score: Record<Mood, number> = {
  joyful: 4, hopeful: 4, content: 3, peaceful: 3, neutral: 2, anxious: 2, stressed: 2, overwhelmed: 1, sad: 1, angry: 1,
};

const Donut = ({ data, total }: { data: { cat: Cat; n: number }[]; total: number }) => {
  const size = 150, sw = 26, r = (size - sw) / 2, C = 2 * Math.PI * r;
  let acc = 0;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        {total === 0 && <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={sw} stroke="hsl(var(--secondary))" />}
        {data.map((d) => {
          const frac = total ? d.n / total : 0;
          const dash = frac * C;
          const rot = (acc / total) * 360 - 90;
          acc += d.n;
          return (
            <circle key={d.cat} cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={sw}
              stroke={`hsl(${catHsl[d.cat]})`} strokeDasharray={`${dash} ${C - dash}`}
              transform={`rotate(${rot} ${size / 2} ${size / 2})`} />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-[26px] font-semibold leading-none text-ink">{total}</span>
        <span className="text-[10px] text-muted-foreground">Total Entries</span>
      </div>
    </div>
  );
};

const SelahJourneyPage = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [verse, setVerse] = useState<{ text: string; reference: string } | null>(null);
  const [cursor, setCursor] = useState(new Date());

  useEffect(() => {
    setEntries(getJournalEntries());
    verseOfDay().then((v) => setVerse({ ...v, text: v.text.trim() }));
  }, []);

  const byDay = useMemo(() => {
    const map = new Map<string, Mood>();
    entries.forEach((e) => {
      const d = new Date(e.createdAt || e.date);
      map.set(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`, e.mood);
    });
    return map;
  }, [entries]);

  const dist = useMemo(() => {
    const cats: Cat[] = ['Happy', 'Calm', 'Anxious', 'Grateful'];
    const counts = cats.map((cat) => ({ cat, n: entries.filter((e) => catOf(e.mood) === cat).length }));
    return counts;
  }, [entries]);
  const total = entries.length;
  const streak = useMemo(() => computeStreak(entries), [entries]);
  const monthEntries = entries.filter((e) => {
    const d = new Date(e.createdAt || e.date);
    return d.getMonth() === cursor.getMonth() && d.getFullYear() === cursor.getFullYear();
  }).length;
  const topCat = [...dist].sort((a, b) => b.n - a.n)[0];

  // weekly line — last 7 days avg score
  const week = useMemo(() => {
    const days: { label: string; score: number | null }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const todays = entries.filter((e) => {
        const ed = new Date(e.createdAt || e.date);
        return ed.toDateString() === d.toDateString();
      });
      const avg = todays.length ? todays.reduce((s, e) => s + score[e.mood], 0) / todays.length : null;
      days.push({ label: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()], score: avg });
    }
    return days;
  }, [entries]);

  // calendar grid
  const y = cursor.getFullYear(), m = cursor.getMonth();
  const firstDow = new Date(y, m, 1).getDay();
  const daysIn = new Date(y, m + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(firstDow).fill(null), ...Array.from({ length: daysIn }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);

  const linePts = week.map((d, i) => {
    const x = (i / 6) * 300 + 10;
    const yv = d.score == null ? null : 70 - ((d.score - 1) / 3) * 60;
    return { x, y: yv };
  });
  const linePath = linePts.filter((p) => p.y != null).map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`).join(' ');

  return (
    <SelahShell title="Your Journey">
      {/* header */}
      <div className="flex items-center justify-between pt-1">
        <LeafSprig className="h-5 w-7 text-sage" />
        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5 text-gold"><SunSprout className="h-3.5 w-6" /></div>
          <h1 className="-mt-1 font-display text-[30px] font-semibold leading-tight tracking-tight text-forest">Your Journey</h1>
          <p className="eyebrow text-[9px] text-muted-foreground">Reflect · Grow · Align</p>
        </div>
        <User className="h-6 w-6 text-ink-soft" />
      </div>

      {/* mood calendar */}
      <div className="mt-5 flex items-center justify-between">
        <h2 className="font-display text-[20px] font-semibold text-ink">Mood Calendar</h2>
        <div className="flex items-center gap-3">
          <button onClick={() => setCursor(new Date(y, m - 1, 1))}><ChevronLeft className="h-4 w-4 text-muted-foreground" /></button>
          <span className="text-[14px] font-semibold text-ink">{cursor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
          <button onClick={() => setCursor(new Date(y, m + 1, 1))}><ChevronRight className="h-4 w-4 text-muted-foreground" /></button>
        </div>
      </div>
      <div className="mt-3 rounded-[16px] border border-line bg-card p-3 shadow-soft">
        <div className="grid grid-cols-7 text-center text-[10px] font-semibold text-muted-foreground">
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d) => <span key={d} className="py-1">{d}</span>)}
        </div>
        <div className="grid grid-cols-7 gap-y-1.5 text-center">
          {cells.map((c, i) => {
            const mood = c ? byDay.get(`${y}-${m}-${c}`) : undefined;
            return (
              <div key={i} className="flex flex-col items-center py-1">
                <span className={`text-[13px] ${c ? 'text-ink' : 'text-transparent'}`}>{c || 0}</span>
                <span className="mt-1 h-1.5 w-1.5 rounded-full" style={{ background: mood ? `hsl(${catHsl[catOf(mood)]})` : 'transparent' }} />
              </div>
            );
          })}
        </div>
      </div>

      {/* mood distribution */}
      <h2 className="mt-6 font-display text-[20px] font-semibold text-ink">Mood Distribution</h2>
      <div className="mt-3 flex items-center gap-5 rounded-[16px] border border-line bg-card p-4 shadow-soft">
        <Donut data={dist} total={total} />
        <ul className="flex-1 space-y-2.5">
          {dist.map((d) => (
            <li key={d.cat} className="flex items-center gap-2 text-[13px]">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: `hsl(${catHsl[d.cat]})` }} />
              <span className="flex-1 font-medium text-ink">{d.cat}</span>
              <span className="font-semibold text-ink-soft">{total ? Math.round((d.n / total) * 100) : 0}%</span>
            </li>
          ))}
        </ul>
      </div>

      {/* weekly insights */}
      <h2 className="mt-6 font-display text-[20px] font-semibold text-ink">Weekly Insights</h2>
      <div className="mt-3 rounded-[16px] border border-line bg-card p-4 shadow-soft">
        <svg viewBox="0 0 320 90" className="w-full" preserveAspectRatio="none" height="90">
          {[0, 1, 2, 3].map((g) => <line key={g} x1="10" x2="310" y1={10 + g * 20} y2={10 + g * 20} stroke="hsl(var(--line))" strokeDasharray="2 4" />)}
          {linePath && <path d={linePath} fill="none" stroke="hsl(var(--forest))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}
          {linePts.map((p, i) => p.y != null && <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="hsl(var(--forest))" />)}
        </svg>
        <div className="mt-1 flex justify-between text-[10px] font-medium text-muted-foreground">
          {week.map((d, i) => <span key={i}>{d.label}</span>)}
        </div>
      </div>

      {/* stat cards */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          { icon: BookOpen, n: monthEntries, l: 'Entries', s: 'This Month', hsl: '141 18% 24%' },
          { icon: Flame, n: streak, l: 'Day Streak', s: 'Keep going!', hsl: '24 24% 54%' },
          { icon: Heart, n: topCat?.n ? topCat.cat : '—', l: 'Most', s: 'This Month', hsl: '30 33% 60%' },
        ].map((c, i) => (
          <div key={i} className="rounded-[16px] border border-line bg-card p-3 text-center shadow-soft">
            <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full" style={{ background: `hsl(${c.hsl} / 0.15)`, color: `hsl(${c.hsl})` }}>
              <c.icon className="h-[18px] w-[18px]" />
            </span>
            <div className="mt-1.5 font-display text-[19px] font-semibold leading-none text-ink">{c.n}</div>
            <div className="text-[11px] font-semibold text-ink-soft">{c.l}</div>
            <div className="text-[10px] text-muted-foreground">{c.s}</div>
          </div>
        ))}
      </div>

      {/* scripture for your season */}
      <div className="mb-1 mt-6 flex items-center gap-2">
        <LeafSprig className="h-4 w-6 text-sage" />
        <div>
          <h2 className="font-display text-[18px] font-semibold leading-tight text-ink">Scripture for Your Season</h2>
          <p className="text-[11px] text-muted-foreground">Based on your recent mood patterns</p>
        </div>
      </div>
      <button onClick={() => navigate('/bible')} className="mt-2 flex w-full items-center gap-3.5 rounded-[16px] border border-line bg-card p-4 text-left shadow-soft">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold-soft"><LeafSprig className="h-5 w-7 text-gold" /></span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-[16px] italic leading-snug text-ink">“{verse?.text || 'Give thanks to the Lord, for He is good; His love endures forever.'}”</span>
          <span className="eyebrow mt-1 block text-[10px] text-gold">{verse?.reference || 'Psalm 107:1'}</span>
        </span>
        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
      </button>
    </SelahShell>
  );
};

export default SelahJourneyPage;

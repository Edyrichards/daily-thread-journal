import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Check, BookOpen } from 'lucide-react';
import { LeafSprig } from '@/components/threads/Botanical';
import { getPlan, getPlanProgress, togglePlanDay, markPlanDayDone } from '@/lib/bible';
import { cn } from '@/lib/utils';

const SelahPlanPage = () => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const plan = getPlan(id);
  const [done, setDone] = useState<Set<number>>(new Set(getPlanProgress(id)));

  if (!plan) { navigate('/bible'); return null; }

  const pct = Math.round((done.size / plan.days.length) * 100);
  const toggle = (i: number) => { togglePlanDay(id, i); setDone(new Set(getPlanProgress(id))); };
  const read = (i: number) => {
    markPlanDayDone(id, i);
    const d = plan.days[i];
    navigate(`/bible/read?book=${encodeURIComponent(d.book)}&chapter=${d.chapter}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-md px-5 pb-16">
        <div className="flex items-center justify-between pt-4">
          <button onClick={() => navigate('/bible')} aria-label="Back" className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
            <ChevronLeft className="h-5 w-5 text-ink-soft" />
          </button>
          <span className="eyebrow text-[11px] text-muted-foreground">Reading Plan</span>
          <span className="w-10" />
        </div>

        {/* header */}
        <div className="relative mt-5 overflow-hidden rounded-2xl bg-forest p-6 text-primary-foreground shadow-card">
          <LeafSprig className="pointer-events-none absolute -right-2 -top-2 h-16 w-24 rotate-12 text-white/15" />
          <h1 className="font-display text-[28px] font-semibold leading-tight">{plan.title}</h1>
          <p className="mt-1.5 text-[14px] opacity-90">{plan.blurb}</p>
          <div className="mt-4 h-2 rounded-full bg-white/20">
            <div className="h-2 rounded-full bg-white transition-all" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-2 text-[12px] font-medium opacity-90">{done.size} of {plan.days.length} days · {pct}%</p>
        </div>

        {/* days */}
        <ul className="mt-5 space-y-2.5">
          {plan.days.map((d, i) => {
            const isDone = done.has(i);
            return (
              <li key={i} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5 shadow-card">
                <button
                  onClick={() => toggle(i)} aria-label={isDone ? 'Mark incomplete' : 'Mark complete'}
                  className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors', isDone ? 'border-forest bg-forest text-primary-foreground' : 'border-border text-transparent')}>
                  <Check className="h-4 w-4" strokeWidth={2.6} />
                </button>
                <div className="flex-1">
                  <p className="eyebrow text-[10px] text-muted-foreground">Day {i + 1}</p>
                  <p className={cn('font-display text-[18px] font-semibold leading-tight', isDone ? 'text-muted-foreground' : 'text-foreground')}>
                    {d.book} {d.chapter}
                  </p>
                </div>
                <button onClick={() => read(i)} className="flex items-center gap-1.5 rounded-full bg-forest-soft px-3.5 py-2 text-[13px] font-semibold text-forest">
                  <BookOpen className="h-4 w-4" /> Read
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default SelahPlanPage;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { LeafSprig } from '@/components/threads/Botanical';
import { markPrayerDay } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const steps = [
  { key: 'Adoration', line: 'Praise God for who He is.', prompt: '“Holy, holy, holy is the Lord Almighty.”', ref: 'Isaiah 6:3', hint: 'Begin simply: “Father, You are…”' },
  { key: 'Confession', line: 'Bring what weighs on you into the light.', prompt: '“If we confess our sins, he is faithful and just.”', ref: '1 John 1:9', hint: 'Be honest — He already knows, and still loves you.' },
  { key: 'Thanksgiving', line: 'Give thanks for His gifts, large and small.', prompt: '“Give thanks in all circumstances.”', ref: '1 Thess. 5:18', hint: 'Name three things from today.' },
  { key: 'Supplication', line: 'Bring your requests — and others’ — to God.', prompt: '“Present your requests to God.”', ref: 'Philippians 4:6', hint: 'Who needs prayer right now?' },
];

const SelahGuidedPrayerPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [i, setI] = useState(0);
  const step = steps[i];
  const last = i === steps.length - 1;

  const next = () => {
    if (last) {
      markPrayerDay();
      toast({ title: 'Amen 🙏', description: 'Your prayer was recorded — well done.' });
      navigate('/prayer');
    } else setI((n) => n + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col px-6">
        {/* top bar */}
        <div className="flex items-center justify-between pt-4">
          <button onClick={() => navigate('/prayer')} aria-label="Close" className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
            <X className="h-5 w-5 text-ink-soft" />
          </button>
          <span className="eyebrow text-[11px] text-muted-foreground">A.C.T.S · {i + 1} of {steps.length}</span>
          <span className="w-10" />
        </div>

        {/* progress */}
        <div className="mt-5 flex gap-1.5">
          {steps.map((s, idx) => (
            <div key={s.key} className={cn('h-[5px] flex-1 rounded-full transition-colors', idx <= i ? 'bg-forest' : 'bg-border')} />
          ))}
        </div>

        {/* body */}
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={step.key}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center"
            >
              {/* breathing orb */}
              <motion.div
                animate={{ scale: [1, 1.08, 1], opacity: [0.9, 1, 0.9] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                className="relative flex h-44 w-44 items-center justify-center rounded-full"
                style={{ background: 'radial-gradient(circle at 38% 34%, hsl(105 24% 78%), hsl(155 24% 32%))', boxShadow: '0 20px 60px -20px hsl(155 24% 22% / 0.45)' }}
              >
                <LeafSprig className="h-10 w-14 text-white/85" />
              </motion.div>

              <p className="eyebrow mt-8 text-[12px] text-forest">{step.key}</p>
              <h1 className="mt-3 max-w-[20rem] font-display text-[27px] font-medium leading-[1.25] text-foreground">{step.line}</h1>
              <p className="mt-5 font-display text-[19px] italic leading-snug text-ink-soft">{step.prompt}</p>
              <p className="eyebrow mt-2 text-[10.5px] text-accent">{step.ref}</p>
              <p className="mt-6 max-w-[18rem] text-[14px] leading-relaxed text-muted-foreground">{step.hint}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* footer */}
        <div className="pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <p className="mb-4 text-center text-[12px] font-medium text-muted-foreground">Breathe slowly. There’s no hurry here.</p>
          <div className="flex items-center gap-3">
            {i > 0 && (
              <button onClick={() => setI((n) => n - 1)} className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card">
                <ChevronLeft className="h-5 w-5 text-ink-soft" />
              </button>
            )}
            <button onClick={next} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-forest py-3.5 text-[16px] font-semibold text-primary-foreground shadow-card">
              {last ? <><Check className="h-[18px] w-[18px]" /> Finish prayer</> : <>Continue to {steps[i + 1].key} <ChevronRight className="h-[18px] w-[18px]" /></>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelahGuidedPrayerPage;

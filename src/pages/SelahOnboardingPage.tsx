import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Sunrise, Sun, Moon, BellOff, ChevronLeft, Check, LucideIcon } from 'lucide-react';
import { Feather, LeafSprig, SprigDivider } from '@/components/threads/Botanical';

const reminders: { v: string; label: string; icon: LucideIcon }[] = [
  { v: 'morning', label: 'Morning', icon: Sunrise },
  { v: 'afternoon', label: 'Afternoon', icon: Sun },
  { v: 'evening', label: 'Evening', icon: Moon },
  { v: 'none', label: 'No reminder', icon: BellOff },
];
const versions = [
  { v: 'WEB', name: 'World English Bible' },
  { v: 'KJV', name: 'King James Version' },
];
const stepAnim = { initial: { opacity: 0, x: 28 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -28 }, transition: { duration: 0.35 } };

const OptionCard = ({ active, onClick, children }: { active?: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className={`flex w-full items-center gap-3.5 rounded-2xl border px-5 py-4 text-left transition-colors ${active ? 'border-forest bg-forest-soft' : 'border-border bg-card'}`}
  >
    {children}
  </button>
);

const SelahOnboardingPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [name, setName] = useState(localStorage.getItem('userName') || '');
  const [reminder, setReminder] = useState('');
  const [version, setVersion] = useState('');
  const total = 4;

  const begin = () => {
    localStorage.setItem('userName', name.trim() || 'friend');
    setStep(2);
  };
  const pickReminder = (v: string) => { setReminder(v); localStorage.setItem('reminderPreference', v); setTimeout(() => setStep(3), 180); };
  const pickVersion = (v: string) => { setVersion(v); localStorage.setItem('bibleVersionPreference', v); setTimeout(() => setStep(4), 180); };
  const finish = () => { localStorage.setItem('onboardingCompleted', 'true'); navigate('/', { replace: true }); };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-6">
        {/* progress */}
        <div className="flex items-center justify-between pt-5">
          {step > 1 ? (
            <button onClick={() => setStep((s) => s - 1)} className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card">
              <ChevronLeft className="h-5 w-5 text-ink-soft" />
            </button>
          ) : <span className="w-9" />}
          <div className="flex gap-1.5">
            {Array.from({ length: total }, (_, i) => (
              <span key={i} className={`h-1.5 rounded-full transition-all ${i + 1 === step ? 'w-6 bg-forest' : 'w-1.5 bg-border'}`} />
            ))}
          </div>
          {step > 1 && step < 4 ? (
            <button onClick={() => (step === 2 ? pickReminder('none') : pickVersion('WEB'))} className="text-[13px] font-medium text-muted-foreground">Skip</button>
          ) : <span className="w-9" />}
        </div>

        <div className="flex flex-1 flex-col">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="s1" {...stepAnim} className="flex flex-1 flex-col items-center justify-center text-center">
                <span className="flex h-24 w-24 items-center justify-center rounded-full" style={{ background: 'radial-gradient(circle at 38% 34%, hsl(105 24% 80%), hsl(155 24% 32%))' }}>
                  <Feather className="h-11 w-11 text-white" />
                </span>
                <h1 className="mt-7 font-display text-[44px] font-semibold leading-none tracking-tight text-forest">
                  Threads <span className="italic font-medium">of</span> Grace
                </h1>
                <p className="eyebrow mt-3 text-[12px] text-accent">Reflect · Grow · Align</p>
                <p className="mt-5 max-w-[18rem] text-[15px] leading-relaxed text-muted-foreground">
                  A quiet space to reflect, pray, and draw closer to God — one moment a day.
                </p>
                <div className="mt-9 w-full">
                  <label className="eyebrow block text-left text-[11px] text-muted-foreground">What should we call you?</label>
                  <input
                    value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name"
                    onKeyDown={(e) => e.key === 'Enter' && begin()}
                    className="mt-2 w-full rounded-xl border border-border bg-card px-4 py-3 text-[16px] text-foreground outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <button onClick={begin} className="mt-5 w-full rounded-full bg-forest py-3.5 text-[16px] font-semibold text-primary-foreground shadow-card">
                  Begin
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" {...stepAnim} className="flex flex-1 flex-col justify-center">
                <h2 className="font-display text-[30px] font-semibold leading-tight text-foreground">A gentle reminder?</h2>
                <p className="mt-2 text-[15px] text-muted-foreground">When would you like a soft nudge to pause and reflect?</p>
                <div className="mt-7 space-y-3">
                  {reminders.map((r) => (
                    <OptionCard key={r.v} active={reminder === r.v} onClick={() => pickReminder(r.v)}>
                      <r.icon className="h-5 w-5 text-forest" strokeWidth={1.6} />
                      <span className="flex-1 text-[16px] font-medium text-foreground">{r.label}</span>
                      {reminder === r.v && <Check className="h-5 w-5 text-forest" />}
                    </OptionCard>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="s3" {...stepAnim} className="flex flex-1 flex-col justify-center">
                <h2 className="font-display text-[30px] font-semibold leading-tight text-foreground">Your Bible translation</h2>
                <p className="mt-2 text-[15px] text-muted-foreground">Two free, public-domain translations, available fully offline.</p>
                <div className="mt-7 grid grid-cols-2 gap-3">
                  {versions.map((o) => (
                    <button
                      key={o.v} onClick={() => pickVersion(o.v)}
                      className={`rounded-2xl border py-6 text-center transition-colors ${version === o.v ? 'border-forest bg-forest-soft' : 'border-border bg-card'}`}
                    >
                      <span className="block font-display text-[26px] font-semibold text-forest">{o.v}</span>
                      <span className="mt-1 block px-2 text-[11px] font-medium text-muted-foreground">{o.name}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="s4" {...stepAnim} className="flex flex-1 flex-col items-center justify-center text-center">
                <p className="eyebrow text-[11px] text-accent">A blessing over you</p>
                <SprigDivider className="my-4" />
                <blockquote className="font-display text-[25px] font-medium italic leading-[1.4] text-foreground">
                  “The Lord bless you and keep you; the Lord make his face shine on you and be gracious to you.”
                </blockquote>
                <p className="mt-4 text-[13px] font-medium text-muted-foreground">Numbers 6:24–25</p>
                <LeafSprig className="mt-8 h-8 w-12 text-sage/50" />
                <button onClick={finish} className="mt-8 w-full rounded-full bg-forest py-3.5 text-[16px] font-semibold text-primary-foreground shadow-card">
                  Enter Threads of Grace
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="h-6" />
      </div>
    </div>
  );
};

export default SelahOnboardingPage;

import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Mic, BookOpen, Quote, Check, Sparkles, Square,
} from 'lucide-react';
import {
  Mood, JournalEntry, saveJournalEntry, generateId,
} from '@/lib/storage';
import { getVerseByMood } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const DRAFT_KEY = 'selah_draft';
const STEPS = ['Mood', 'Verse', 'Write', 'Reflect'] as const;

const moods: { label: string; emoji: string; value: Mood; bg: string }[] = [
  { label: 'At peace', emoji: '😌', value: 'peaceful', bg: 'bg-sage-soft' },
  { label: 'Grateful', emoji: '😊', value: 'joyful', bg: 'bg-gold-soft' },
  { label: 'Hopeful', emoji: '🙂', value: 'hopeful', bg: 'bg-sky/15' },
  { label: 'Anxious', emoji: '😟', value: 'anxious', bg: 'bg-clay-soft' },
  { label: 'Heavy', emoji: '😢', value: 'sad', bg: 'bg-secondary' },
  { label: 'Overwhelmed', emoji: '😣', value: 'overwhelmed', bg: 'bg-plum/15' },
];

const prompts: Partial<Record<Mood, string>> = {
  peaceful: 'What is bringing you peace right now?',
  joyful: 'What are you grateful for today?',
  hopeful: 'What are you hoping for, and why?',
  anxious: 'What’s weighing on your heart right now?',
  sad: 'What’s making your heart heavy today?',
  overwhelmed: 'What feels like too much right now?',
};

const SelahNewEntryPage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [mood, setMood] = useState<Mood | null>(null);
  const [verse, setVerse] = useState<{ text: string; reference: string } | null>(null);
  const [loadingVerse, setLoadingVerse] = useState(false);
  const [text, setText] = useState('');
  const [reflection, setReflection] = useState('');
  const [listening, setListening] = useState(false);
  const recRef = useRef<any>(null);

  /* hydrate from ?mood= or saved draft */
  useEffect(() => {
    const moodParam = params.get('mood') as Mood | null;
    const draftRaw = localStorage.getItem(DRAFT_KEY);
    const draft = draftRaw ? JSON.parse(draftRaw) : null;
    if (moodParam && moods.some((m) => m.value === moodParam)) {
      setMood(moodParam);
      setStep(2);
    } else if (draft) {
      setMood(draft.mood ?? null);
      setText(draft.text ?? '');
      setReflection(draft.reflection ?? '');
      setVerse(draft.verse ?? null);
      if (draft.mood) setStep(3);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* autosave draft */
  useEffect(() => {
    if (!mood && !text && !reflection) return;
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ mood, text, reflection, verse }));
  }, [mood, text, reflection, verse]);

  /* fetch a verse for the chosen mood when entering step 2 */
  useEffect(() => {
    if (step === 2 && mood && !verse) {
      setLoadingVerse(true);
      getVerseByMood(mood)
        .then((v) => setVerse({ ...v, text: v.text.trim() }))
        .catch(() => setVerse(null))
        .finally(() => setLoadingVerse(false));
    }
  }, [step, mood, verse]);

  /* stop speech recognition on unmount */
  useEffect(() => () => recRef.current?.stop?.(), []);

  const wordCount = useMemo(() => text.trim().split(/\s+/).filter(Boolean).length, [text]);
  const moodMeta = moods.find((m) => m.value === mood);

  const pickMood = (m: Mood) => {
    setMood(m);
    setVerse(null);
    setStep(2);
  };

  const toggleVoice = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      toast({ title: 'Voice unavailable', description: 'This browser doesn’t support voice journaling.' });
      return;
    }
    if (listening) {
      recRef.current?.stop();
      return;
    }
    const rec = new SR();
    rec.lang = 'en-US';
    rec.continuous = true;
    rec.interimResults = false;
    rec.onresult = (e: any) => {
      let t = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) t += e.results[i][0].transcript;
      }
      if (t) setText((p) => (p ? p.replace(/\s*$/, ' ') : '') + t.trim());
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    rec.start();
    setListening(true);
  };

  const save = () => {
    if (!mood) return;
    const entry: JournalEntry = {
      id: generateId(),
      date: new Date().toISOString().split('T')[0],
      mood,
      content: text.trim(),
      verse: verse || undefined,
      reflection: reflection.trim() || undefined,
      createdAt: Date.now(),
    };
    saveJournalEntry(entry);
    localStorage.removeItem(DRAFT_KEY);
    toast({ title: 'Saved', description: 'Your reflection is safely recorded.' });
    navigate('/journal');
  };

  const goBack = () => {
    if (step === 1) navigate('/');
    else setStep((s) => Math.max(1, s - 1));
  };

  return (
    <div className="min-h-screen bg-paper">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-paper px-5">
        {/* top bar */}
        <header className="flex items-center justify-between pt-4">
          <button
            onClick={goBack}
            className="flex h-10 w-10 items-center justify-center rounded-[13px] border border-line bg-card"
            aria-label="Back"
          >
            <ChevronLeft className="h-5 w-5 text-ink-soft" />
          </button>
          <span className="text-[13px] font-bold text-muted-foreground">New entry</span>
          <button
            onClick={() => {
              toast({ title: 'Draft saved', description: 'Pick up where you left off anytime.' });
              navigate('/journal');
            }}
            className="rounded-full bg-secondary px-3.5 py-2 text-[13px] font-semibold text-muted-foreground"
          >
            Save draft
          </button>
        </header>

        {/* progress */}
        <div className="mt-5 flex gap-1.5">
          {STEPS.map((label, i) => {
            const active = i + 1 <= step;
            return (
              <div key={label} className="flex-1">
                <div className={cn('h-[5px] rounded-full transition-colors', active ? 'bg-clay' : 'bg-line')} />
                <div className={cn('mt-1.5 text-[11px] font-bold', active ? 'text-clay' : 'text-muted-foreground')}>
                  {label}
                </div>
              </div>
            );
          })}
        </div>

        {/* steps */}
        <div className="flex flex-1 flex-col">
          <AnimatePresence mode="wait">
            {/* STEP 1 — mood */}
            {step === 1 && (
              <motion.div
                key="mood"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.3 }}
                className="flex flex-1 flex-col"
              >
                <h1 className="mb-6 mt-7 font-serif text-[26px] font-semibold leading-tight text-ink">
                  How are you feeling<br />right now?
                </h1>
                <div className="grid grid-cols-2 gap-3.5">
                  {moods.map((m) => (
                    <button
                      key={m.value}
                      onClick={() => pickMood(m.value)}
                      className={cn(
                        'flex flex-col items-center gap-2 rounded-[22px] border border-line py-6 transition-transform active:scale-[0.97]',
                        m.bg,
                      )}
                    >
                      <span className="text-[34px]">{m.emoji}</span>
                      <span className="text-[14px] font-semibold text-ink">{m.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 2 — verse */}
            {step === 2 && (
              <motion.div
                key="verse"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.3 }}
                className="flex flex-1 flex-col"
              >
                <p className="mb-2 mt-7 text-[13px] font-bold uppercase tracking-[1.2px] text-muted-foreground">
                  A word for your heart
                </p>
                <h1 className="mb-6 font-serif text-[24px] font-semibold leading-tight text-ink">
                  Because you feel {moodMeta?.label.toLowerCase()} {moodMeta?.emoji}
                </h1>

                {loadingVerse ? (
                  <div className="space-y-3 rounded-[28px] bg-sage-grad p-7">
                    <div className="h-5 w-5/6 animate-pulse rounded-full bg-white/30" />
                    <div className="h-5 w-3/4 animate-pulse rounded-full bg-white/25" />
                    <div className="h-5 w-2/3 animate-pulse rounded-full bg-white/20" />
                  </div>
                ) : (
                  <div className="relative overflow-hidden rounded-[28px] bg-sage-grad p-7 text-white shadow-soft">
                    <Quote className="absolute right-5 top-5 h-10 w-10 text-white/15" />
                    <blockquote className="font-serif text-[21px] font-medium leading-[1.5]">
                      “{verse?.text}”
                    </blockquote>
                    <p className="mt-4 font-bold text-white/90">{verse?.reference}</p>
                  </div>
                )}
                <p className="mt-5 text-center text-[14px] leading-relaxed text-muted-foreground">
                  Sit with this for a moment. When you’re ready, carry it into your writing.
                </p>
              </motion.div>
            )}

            {/* STEP 3 — write */}
            {step === 3 && (
              <motion.div
                key="write"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.3 }}
                className="flex flex-1 flex-col"
              >
                <div className="mb-3 mt-6 flex flex-wrap items-center gap-2">
                  {moodMeta && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-clay-soft px-3 py-1.5 text-[13px] font-semibold text-clay">
                      {moodMeta.emoji} {moodMeta.label}
                    </span>
                  )}
                  {verse && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-sage-soft px-3 py-1.5 text-[12px] font-bold text-sage">
                      <BookOpen className="h-3.5 w-3.5" /> {verse.reference}
                    </span>
                  )}
                </div>
                <h1 className="mb-4 font-serif text-[25px] font-semibold leading-tight text-ink">
                  {(mood && prompts[mood]) || 'What’s on your heart right now?'}
                </h1>

                <div className="relative flex-1">
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Begin writing, or tap the mic to speak…"
                    className="h-full min-h-[240px] w-full resize-none rounded-[24px] border border-line bg-card p-5 font-serif text-[17px] leading-[1.6] text-ink shadow-soft outline-none placeholder:text-muted-foreground/70 focus:border-clay/40"
                  />
                  <div className="pointer-events-none absolute bottom-4 left-5 text-[12px] font-semibold text-muted-foreground">
                    {wordCount} {wordCount === 1 ? 'word' : 'words'} · saved
                  </div>
                </div>

                {listening && (
                  <div className="mt-3 flex items-center gap-2.5 rounded-2xl bg-clay-soft px-4 py-3">
                    <span className="relative flex h-3 w-3">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-clay/60" />
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-clay" />
                    </span>
                    <span className="text-[13px] font-semibold text-clay">Listening… speak your reflection</span>
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 4 — reflect */}
            {step === 4 && (
              <motion.div
                key="reflect"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.3 }}
                className="flex flex-1 flex-col"
              >
                <div className="mb-3 mt-6 inline-flex items-center gap-1.5 self-start rounded-full bg-gold-soft px-3 py-1.5 text-[12px] font-bold text-gold">
                  <Sparkles className="h-3.5 w-3.5" /> One last pause
                </div>
                <h1 className="mb-4 font-serif text-[25px] font-semibold leading-tight text-ink">
                  What is God saying<br />to you in this?
                </h1>
                <textarea
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder="A sentence is enough. What will you carry with you?"
                  className="min-h-[150px] w-full resize-none rounded-[24px] border border-line bg-card p-5 font-serif text-[17px] leading-[1.6] text-ink shadow-soft outline-none placeholder:text-muted-foreground/70 focus:border-clay/40"
                />
                <div className="mt-5 rounded-[20px] border border-line bg-card p-4">
                  <p className="text-[12px] font-bold uppercase tracking-wide text-muted-foreground">Your entry</p>
                  <p className="mt-1.5 line-clamp-2 font-serif text-[15px] text-ink-soft">
                    {text || 'No writing yet.'}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* sticky footer */}
        <div className="sticky bottom-0 -mx-5 bg-paper/95 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-sm">
          {step === 3 ? (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={toggleVoice}
                    aria-label={listening ? 'Stop recording' : 'Voice journaling'}
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-[15px] border transition-colors',
                      listening ? 'border-transparent bg-clay text-white' : 'border-line bg-card text-ink-soft',
                    )}
                  >
                    {listening ? <Square className="h-5 w-5 fill-current" /> : <Mic className="h-[21px] w-[21px]" />}
                  </button>
                  <button className="flex h-12 w-12 items-center justify-center rounded-[15px] border border-line bg-card text-ink-soft">
                    <BookOpen className="h-[21px] w-[21px]" />
                  </button>
                  <button className="flex h-12 w-12 items-center justify-center rounded-[15px] bg-clay-soft text-[13px] font-bold text-clay">
                    AI
                  </button>
                </div>
                <button
                  onClick={() => setStep(4)}
                  className="flex items-center gap-1.5 rounded-[18px] bg-clay px-6 py-3.5 text-[16px] font-bold text-white shadow-glow-clay"
                >
                  Continue <ChevronRight className="h-[18px] w-[18px]" />
                </button>
              </div>
              <p className="mt-3 text-center text-[12px] font-medium text-muted-foreground">
                Your words stay private — encrypted on this device.
              </p>
            </>
          ) : (
            <div className="flex items-center gap-3">
              {step > 1 && (
                <button
                  onClick={goBack}
                  className="flex-1 rounded-[18px] border border-line bg-card py-3.5 text-[16px] font-bold text-ink-soft"
                >
                  Back
                </button>
              )}
              {step === 1 ? (
                <p className="w-full py-2 text-center text-[13px] font-medium text-muted-foreground">
                  Choose how you feel to begin.
                </p>
              ) : step === 4 ? (
                <button
                  onClick={save}
                  className="flex flex-[2] items-center justify-center gap-2 rounded-[18px] bg-clay py-3.5 text-[16px] font-bold text-white shadow-glow-clay"
                >
                  <Check className="h-[19px] w-[19px]" /> Save entry
                </button>
              ) : (
                <button
                  onClick={() => setStep(step + 1)}
                  className="flex flex-[2] items-center justify-center gap-1.5 rounded-[18px] bg-clay py-3.5 text-[16px] font-bold text-white shadow-glow-clay"
                >
                  Continue <ChevronRight className="h-[18px] w-[18px]" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelahNewEntryPage;

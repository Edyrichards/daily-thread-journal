import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronDown, X, Bookmark } from 'lucide-react';
import {
  BOOKS, findBook, fetchPassage, Passage, toggleBookmark, getBookmarks,
} from '@/lib/bible';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const SelahReaderPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [params, setParams] = useSearchParams();
  const book = params.get('book') || 'John';
  const chapter = Number(params.get('chapter') || 1);
  const meta = findBook(book);

  const [passage, setPassage] = useState<Passage | null>(null);
  const [loading, setLoading] = useState(true);
  const [picker, setPicker] = useState<null | 'books' | string>(null); // null | 'books' | <bookName for chapters>
  const [marks, setMarks] = useState<Set<string>>(new Set(getBookmarks().map((b) => b.reference)));

  useEffect(() => {
    let on = true;
    setLoading(true); setPassage(null);
    fetchPassage(book, chapter)
      .then((p) => on && setPassage(p))
      .catch(() => on && toast({ title: 'Could not load', description: 'Check your connection and try again.', variant: 'destructive' }))
      .finally(() => on && setLoading(false));
    window.scrollTo(0, 0);
    return () => { on = false; };
  }, [book, chapter, toast]);

  const go = (b: string, c: number) => { setParams({ book: b, chapter: String(c) }); setPicker(null); };
  const prev = () => { if (chapter > 1) go(book, chapter - 1); };
  const next = () => { if (meta && chapter < meta.chapters) go(book, chapter + 1); };

  const onVerse = (v: number, text: string) => {
    const reference = `${book} ${chapter}:${v}`;
    const added = toggleBookmark({ text, reference });
    setMarks((m) => { const n = new Set(m); added ? n.add(reference) : n.delete(reference); return n; });
    toast({ title: added ? 'Verse bookmarked' : 'Bookmark removed', description: added ? reference : undefined });
  };

  const pickerBook = typeof picker === 'string' ? findBook(picker) : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-md px-5 pb-24">
        {/* header */}
        <div className="sticky top-0 z-20 -mx-5 flex items-center justify-between bg-background/95 px-5 py-3 backdrop-blur">
          <button onClick={() => navigate('/bible')} aria-label="Back" className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
            <ChevronLeft className="h-5 w-5 text-ink-soft" />
          </button>
          <button onClick={() => setPicker('books')} className="flex items-center gap-1.5">
            <span className="font-display text-[22px] font-semibold text-forest">{book} {chapter}</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
          <span className="rounded-full border border-border bg-card px-3 py-1.5 text-[12px] font-semibold text-ink-soft">
            {passage?.translation ? passage.translation.split(' ').map((w) => w[0]).join('').slice(0, 4).toUpperCase() : '…'}
          </span>
        </div>

        {/* passage */}
        {loading ? (
          <div className="mt-6 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-4 animate-pulse rounded-full bg-muted" style={{ width: `${70 + (i % 3) * 10}%` }} />)}
          </div>
        ) : (
          <article className="mt-4 font-serif text-[20px] leading-[1.9] text-foreground">
            {passage?.verses.map((v) => {
              const ref = `${book} ${chapter}:${v.verse}`;
              const marked = marks.has(ref);
              return (
                <span key={v.verse} onClick={() => onVerse(v.verse, v.text)}
                  className={cn('cursor-pointer rounded transition-colors', marked && 'bg-accent/25 box-decoration-clone px-1')}>
                  <sup className="mr-0.5 font-sans text-[11px] font-semibold text-accent">{v.verse}</sup>
                  {v.text}{' '}
                </span>
              );
            })}
          </article>
        )}

        {/* chapter nav */}
        <div className="mt-8 flex items-center justify-between">
          <button onClick={prev} disabled={chapter <= 1}
            className={cn('flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2.5 text-[14px] font-medium', chapter <= 1 ? 'opacity-40' : 'text-foreground')}>
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>
          <button onClick={next} disabled={!meta || chapter >= meta.chapters}
            className={cn('flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2.5 text-[14px] font-medium', !meta || chapter >= meta.chapters ? 'opacity-40' : 'text-foreground')}>
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* picker */}
      <AnimatePresence>
        {picker && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/30" onClick={() => setPicker(null)}>
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'tween', duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[78vh] w-full max-w-md overflow-y-auto rounded-t-3xl border border-border bg-card p-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-display text-[22px] font-semibold text-foreground">
                  {pickerBook ? pickerBook.name : 'Choose a book'}
                </h2>
                <button onClick={() => (pickerBook ? setPicker('books') : setPicker(null))} className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                  <X className="h-4 w-4 text-ink-soft" />
                </button>
              </div>
              {pickerBook ? (
                <div className="grid grid-cols-5 gap-2.5 pb-2">
                  {Array.from({ length: pickerBook.chapters }, (_, i) => i + 1).map((c) => (
                    <button key={c} onClick={() => go(pickerBook.name, c)}
                      className={cn('rounded-xl border py-2.5 text-[15px] font-medium', c === chapter && pickerBook.name === book ? 'border-forest bg-forest-soft text-forest' : 'border-border text-foreground')}>
                      {c}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="pb-2">
                  {(['OT', 'NT'] as const).map((t) => (
                    <div key={t}>
                      <p className="eyebrow mb-2 mt-2 text-[10.5px] text-muted-foreground">{t === 'OT' ? 'Old Testament' : 'New Testament'}</p>
                      <div className="mb-2 flex flex-wrap gap-2">
                        {BOOKS.filter((b) => b.testament === t).map((b) => (
                          <button key={b.name} onClick={() => (b.chapters === 1 ? go(b.name, 1) : setPicker(b.name))}
                            className="rounded-full border border-border px-3 py-1.5 text-[13px] font-medium text-foreground">
                            {b.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SelahReaderPage;

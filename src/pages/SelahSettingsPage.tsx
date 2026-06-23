import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';
import {
  Bell, BookOpen, Moon, Type, Upload, UploadCloud, RotateCcw, Info, Shield,
  FileText, ChevronRight, LogOut, Cloud, CloudOff, LucideIcon,
} from 'lucide-react';
import SelahShell from '@/components/selah/SelahShell';
import { SprigDivider, LeafSprig } from '@/components/threads/Botanical';
import { getReminderTime, setDailyReminder, cancelDailyReminder } from '@/lib/reminders';
import { saveJson } from '@/lib/exporter';
import { useAuth } from '@/lib/cloud/auth';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const to12h = (hhmm: string) => {
  if (!hhmm) return 'Off';
  const [h, m] = hhmm.split(':').map(Number);
  const ap = h < 12 ? 'AM' : 'PM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ap}`;
};

const BACKUP_KEYS = ['journal_entries', 'prayers', 'prayer_requests', 'prayer_days', 'userName'];
const sizes = ['Small', 'Medium', 'Large'];
// TODO: replace with the hosted URLs (see legal/ for the source markdown).
const LEGAL = { privacy: 'https://threadsofgrace.app/privacy', terms: 'https://threadsofgrace.app/terms' };

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mt-6">
    <p className="eyebrow mb-2.5 px-1 text-[11px] text-muted-foreground">{title}</p>
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">{children}</div>
  </section>
);

const Row = ({
  icon: Icon, label, value, control, onClick, last,
}: { icon: LucideIcon; label: string; value?: string; control?: React.ReactNode; onClick?: () => void; last?: boolean }) => (
  <button
    onClick={onClick}
    disabled={!onClick && !control}
    className={cn('flex w-full items-center gap-3.5 px-4 py-3.5 text-left', !last && 'border-b border-border')}
  >
    <Icon className="h-5 w-5 shrink-0 text-forest" strokeWidth={1.5} />
    <span className="flex-1 text-[15px] font-medium text-foreground">{label}</span>
    {value && <span className="text-[14px] font-medium text-muted-foreground">{value}</span>}
    {control}
    {onClick && !control && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
  </button>
);

const SelahSettingsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { resolvedTheme, setTheme } = useTheme();
  const { configured, user, signOut } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [size, setSize] = useState(() => Number(localStorage.getItem('fontScale') ?? 1));
  const [version, setVersion] = useState(() => ((localStorage.getItem('bibleVersionPreference') || 'WEB').toUpperCase() === 'KJV' ? 'KJV' : 'WEB'));
  const [reminder, setReminder] = useState(() => getReminderTime());
  const fileRef = useRef<HTMLInputElement>(null);
  const timeRef = useRef<HTMLInputElement>(null);
  const userName = localStorage.getItem('userName') || 'Your Name';

  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === 'dark';

  const exportEntries = async () => {
    await saveJson('threads-of-grace-journal.json', localStorage.getItem('journal_entries') || '[]', 'Export journal');
    toast({ title: 'Exported', description: 'Your journal is ready to save or share.' });
  };
  const backup = async () => {
    const data = Object.fromEntries(BACKUP_KEYS.map((k) => [k, localStorage.getItem(k)]));
    await saveJson('threads-of-grace-backup.json', JSON.stringify(data, null, 2), 'Backup');
    toast({ title: 'Backup ready', description: 'A full backup is ready to save or share.' });
  };
  const pickReminder = async (value: string) => {
    if (!value) { await cancelDailyReminder(); setReminder(''); toast({ title: 'Reminder off' }); return; }
    const scheduled = await setDailyReminder(value);
    setReminder(value);
    toast({ title: `Reminder set for ${to12h(value)}`, description: scheduled ? 'We’ll nudge you each day.' : 'Saved — active in the installed app.' });
  };
  const restore = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        Object.entries(data).forEach(([k, v]) => v != null && localStorage.setItem(k, String(v)));
        toast({ title: 'Restored', description: 'Your data was restored.' });
      } catch {
        toast({ title: 'Could not restore', description: 'That file isn’t a valid backup.', variant: 'destructive' });
      }
    };
    reader.readAsText(file);
  };
  const changeSize = (v: number) => {
    setSize(v);
    localStorage.setItem('fontScale', String(v));
    document.documentElement.style.setProperty('--font-scale', String(0.94 + v * 0.06));
  };

  return (
    <SelahShell title="Settings">
      <input ref={fileRef} type="file" accept="application/json" hidden onChange={(e) => e.target.files?.[0] && restore(e.target.files[0])} />
      <input ref={timeRef} type="time" value={reminder || '08:00'} onChange={(e) => pickReminder(e.target.value)} className="sr-only" aria-hidden />

      <h1 className="mt-1 text-center font-display text-[36px] font-semibold tracking-tight text-forest">Settings</h1>
      <SprigDivider className="mb-5 mt-1" />

      {/* profile */}
      <button onClick={() => navigate('/onboarding')} className="flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left shadow-card">
        <span className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full" style={{ background: 'linear-gradient(135deg, hsl(105 22% 70%), hsl(155 24% 30%))' }}>
          <LeafSprig className="h-7 w-10 text-white/80" />
        </span>
        <span className="flex-1">
          <span className="block font-display text-[24px] font-semibold leading-tight text-foreground">{userName}</span>
          <span className="block text-[13px] text-muted-foreground">Member since May 2024</span>
        </span>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </button>

      <Section title="Account">
        {user ? (
          <Row icon={Cloud} label="Synced" value={user.email ?? 'Signed in'} last />
        ) : configured ? (
          <Row icon={Cloud} label="Sign in to sync & join Community" onClick={() => navigate('/auth')} last />
        ) : (
          <Row icon={CloudOff} label="Cloud sync" value="Not set up" last />
        )}
      </Section>

      <Section title="Preferences">
        <Row icon={Bell} label="Daily Reminder" value={to12h(reminder)} onClick={() => {
          const el = timeRef.current as any;
          if (el?.showPicker) el.showPicker(); else el?.click();
        }} />
        <Row icon={BookOpen} label="Bible Version" value={version} last onClick={() => {
          const next = version === 'WEB' ? 'KJV' : 'WEB';
          setVersion(next); localStorage.setItem('bibleVersionPreference', next);
          toast({ title: `${next === 'WEB' ? 'World English Bible' : 'King James Version'}`, description: 'Reader translation updated.' });
        }} />
      </Section>

      <Section title="Appearance">
        <Row
          icon={Moon} label="Dark Mode"
          control={
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              aria-pressed={isDark}
              className={cn('relative h-[26px] w-[44px] rounded-full transition-colors', isDark ? 'bg-forest' : 'bg-muted')}
            >
              <span className={cn('absolute top-[3px] h-5 w-5 rounded-full bg-white shadow transition-all', isDark ? 'left-[21px]' : 'left-[3px]')} />
            </button>
          }
        />
        <div className="flex items-center gap-3.5 px-4 py-3.5">
          <Type className="h-5 w-5 shrink-0 text-forest" strokeWidth={1.5} />
          <span className="text-[15px] font-medium text-foreground">Font Size</span>
          <input
            type="range" min={0} max={2} step={1} value={size}
            onChange={(e) => changeSize(Number(e.target.value))}
            className="ml-2 flex-1 accent-[hsl(var(--forest))]"
          />
          <span className="w-14 text-right text-[14px] font-medium text-muted-foreground">{sizes[size]}</span>
        </div>
      </Section>

      <Section title="Data">
        <Row icon={Upload} label="Export Entries" onClick={exportEntries} />
        <Row icon={UploadCloud} label="Backup" onClick={backup} />
        <Row icon={RotateCcw} label="Restore" last onClick={() => fileRef.current?.click()} />
      </Section>

      <Section title="About">
        <Row icon={Info} label="App Version" value="1.0.0" />
        <Row icon={Shield} label="Privacy Policy" onClick={() => window.open(LEGAL.privacy, '_blank')} />
        <Row icon={FileText} label="Terms of Service" last onClick={() => window.open(LEGAL.terms, '_blank')} />
      </Section>

      <button
        onClick={async () => { if (user) await signOut(); toast({ title: 'Signed out', description: 'Peace be with you.' }); navigate('/onboarding'); }}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-destructive/30 bg-destructive/10 py-3.5 text-[15px] font-semibold text-destructive"
      >
        <LogOut className="h-[18px] w-[18px]" strokeWidth={1.8} /> Sign Out
      </button>
    </SelahShell>
  );
};

export default SelahSettingsPage;

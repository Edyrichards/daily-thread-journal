import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Cloud } from 'lucide-react';
import { Feather, SprigDivider } from '@/components/threads/Botanical';
import { useAuth } from '@/lib/cloud/auth';
import { useToast } from '@/hooks/use-toast';

const SelahAuthPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { configured, signInWithPassword, signUp, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [name, setName] = useState(localStorage.getItem('userName') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!email || !password) { toast({ title: 'Almost there', description: 'Enter your email and password.' }); return; }
    setBusy(true);
    const res = mode === 'in'
      ? await signInWithPassword(email, password)
      : await signUp(email, password, name.trim() || 'friend');
    setBusy(false);
    if (res.error) { toast({ title: 'Couldn’t sign in', description: res.error, variant: 'destructive' }); return; }
    if (mode === 'up') toast({ title: 'Check your email', description: 'Confirm your address, then sign in.' });
    else navigate('/settings');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-6">
        <div className="pt-4">
          <button onClick={() => navigate(-1)} aria-label="Back" className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card">
            <ChevronLeft className="h-5 w-5 text-ink-soft" />
          </button>
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <div className="mb-6 text-center">
            <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full" style={{ background: 'radial-gradient(circle at 38% 34%, hsl(105 24% 80%), hsl(155 24% 32%))' }}>
              <Feather className="h-8 w-8 text-white" />
            </span>
            <h1 className="font-display text-[32px] font-semibold leading-tight text-forest">
              {mode === 'in' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="mt-1.5 text-[14px] text-muted-foreground">Sync your journal and join the prayer wall.</p>
          </div>

          {!configured && (
            <div className="mb-5 flex items-center gap-3 rounded-2xl border border-border bg-accent/10 p-4">
              <Cloud className="h-5 w-5 shrink-0 text-accent" />
              <p className="text-[13px] leading-relaxed text-ink-soft">
                Cloud sync isn’t connected yet. Your data stays safely on this device until it is.
              </p>
            </div>
          )}

          <div className="space-y-3">
            {mode === 'up' && (
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name"
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-[16px] text-foreground outline-none focus:ring-2 focus:ring-ring" />
            )}
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" autoCapitalize="none"
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-[16px] text-foreground outline-none focus:ring-2 focus:ring-ring" />
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password"
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-[16px] text-foreground outline-none focus:ring-2 focus:ring-ring" />
          </div>

          <button onClick={submit} disabled={busy || !configured}
            className="mt-5 w-full rounded-full bg-forest py-3.5 text-[16px] font-semibold text-primary-foreground shadow-card disabled:opacity-50">
            {busy ? 'Please wait…' : mode === 'in' ? 'Sign in' : 'Create account'}
          </button>

          <SprigDivider className="my-6" />

          <button onClick={() => signInWithGoogle()} disabled={!configured}
            className="w-full rounded-full border border-border bg-card py-3.5 text-[15px] font-semibold text-foreground disabled:opacity-50">
            Continue with Google
          </button>

          <button onClick={() => setMode((m) => (m === 'in' ? 'up' : 'in'))}
            className="mt-6 text-center text-[14px] text-muted-foreground">
            {mode === 'in' ? 'New here? ' : 'Already have an account? '}
            <span className="font-semibold text-accent">{mode === 'in' ? 'Create an account' : 'Sign in'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelahAuthPage;

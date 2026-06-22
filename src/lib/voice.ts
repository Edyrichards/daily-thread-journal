import { Capacitor } from '@capacitor/core';

export interface VoiceHandle { stop: () => void; }

/** Is speech-to-text available on this device/browser? */
export async function voiceAvailable(): Promise<boolean> {
  if (Capacitor.isNativePlatform()) {
    try {
      const { SpeechRecognition } = await import('@capacitor-community/speech-recognition');
      const { available } = await SpeechRecognition.available();
      return available;
    } catch { return false; }
  }
  return typeof window !== 'undefined' && !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
}

/**
 * Start dictation. `onText` receives the *full* transcript of the current
 * session (cumulative), so callers compose it onto whatever was already typed.
 */
export async function startVoice(opts: {
  onText: (sessionText: string) => void;
  onEnd?: () => void;
  onError?: (message: string) => void;
}): Promise<VoiceHandle | null> {
  if (Capacitor.isNativePlatform()) {
    try {
      const { SpeechRecognition } = await import('@capacitor-community/speech-recognition');
      const perm = await SpeechRecognition.requestPermissions();
      if ((perm as any).speechRecognition && (perm as any).speechRecognition !== 'granted') {
        opts.onError?.('Microphone permission denied'); return null;
      }
      const listener = await SpeechRecognition.addListener('partialResults', (data: { matches: string[] }) => {
        if (data?.matches?.length) opts.onText(data.matches[0]);
      });
      await SpeechRecognition.start({ language: 'en-US', partialResults: true, popup: false });
      return {
        stop: () => {
          SpeechRecognition.stop().catch(() => {});
          listener.remove();
          opts.onEnd?.();
        },
      };
    } catch (e) {
      opts.onError?.(String(e)); return null;
    }
  }

  // Web fallback — Web Speech API
  const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SR) { opts.onError?.('unavailable'); return null; }
  const rec = new SR();
  rec.lang = 'en-US';
  rec.continuous = true;
  rec.interimResults = true;
  rec.onresult = (e: any) => {
    let session = '';
    for (let i = 0; i < e.results.length; i++) session += e.results[i][0].transcript;
    opts.onText(session.trim());
  };
  rec.onend = () => opts.onEnd?.();
  rec.onerror = (e: any) => opts.onError?.(e?.error || 'error');
  rec.start();
  return { stop: () => { try { rec.stop(); } catch { /* noop */ } } };
}

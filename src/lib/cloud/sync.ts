import { supabase } from './client';
import {
  getJournalEntries, saveJournalEntry, JournalEntry,
  getPrayers, savePrayer, Prayer,
} from '@/lib/storage';

let running = false;

const jUpdated = (e: JournalEntry) => e.createdAt || +new Date(e.date) || 0;
const pUpdated = (p: Prayer) => p.updatedAt || p.createdAt || 0;

const rowToEntry = (r: any): JournalEntry => ({
  id: r.id, date: r.date, content: r.content, mood: r.mood,
  verse: r.verse ?? undefined, reflection: r.reflection ?? undefined, createdAt: r.created_at,
});
const entryToRow = (e: JournalEntry, userId: string) => ({
  id: e.id, user_id: userId, date: e.date, content: e.content, mood: e.mood,
  verse: e.verse ?? null, reflection: e.reflection ?? null,
  created_at: e.createdAt, updated_at: jUpdated(e), deleted: false,
});
const rowToPrayer = (r: any): Prayer => ({
  id: r.id, content: r.content, status: r.status, title: r.title ?? undefined,
  prayedCount: r.prayed_count ?? 0, lastPrayedAt: r.last_prayed_at ?? undefined,
  answeredAt: r.answered_at ?? undefined, answerNote: r.answer_note ?? undefined,
  createdAt: r.created_at, updatedAt: r.updated_at,
});
const prayerToRow = (p: Prayer, userId: string) => ({
  id: p.id, user_id: userId, title: p.title ?? null, content: p.content, status: p.status,
  prayed_count: p.prayedCount ?? 0, last_prayed_at: p.lastPrayedAt ?? null,
  answered_at: p.answeredAt ?? null, answer_note: p.answerNote ?? null,
  created_at: p.createdAt, updated_at: pUpdated(p), deleted: false,
});

/** Two-way, last-write-wins sync of journal entries + prayers. Safe to call often. */
export async function syncNow(): Promise<void> {
  if (!supabase || running) return;
  running = true;
  try {
    const { data: auth } = await supabase.auth.getUser();
    const userId = auth.user?.id;
    if (!userId) return;

    // ----- journal -----
    {
      const local = getJournalEntries();
      const localById = new Map(local.map((e) => [e.id, e]));
      const { data: remote } = await supabase.from('journal_entries').select('*').eq('user_id', userId);
      const pushes: any[] = [];
      (remote || []).forEach((r) => {
        const l = localById.get(r.id);
        if (!l || (r.updated_at || 0) > jUpdated(l)) {
          if (!r.deleted) saveJournalEntry(rowToEntry(r));
          localById.delete(r.id);
        }
      });
      // remaining locals are newer-or-unknown remotely → push
      const remoteById = new Map((remote || []).map((r) => [r.id, r]));
      local.forEach((e) => {
        const r = remoteById.get(e.id);
        if (!r || jUpdated(e) >= (r.updated_at || 0)) pushes.push(entryToRow(e, userId));
      });
      if (pushes.length) await supabase.from('journal_entries').upsert(pushes);
    }

    // ----- prayers -----
    {
      const local = getPrayers();
      const { data: remote } = await supabase.from('prayers').select('*').eq('user_id', userId);
      const remoteById = new Map((remote || []).map((r) => [r.id, r]));
      const localById = new Map(local.map((p) => [p.id, p]));
      (remote || []).forEach((r) => {
        const l = localById.get(r.id);
        if (!l || (r.updated_at || 0) > pUpdated(l)) { if (!r.deleted) savePrayer(rowToPrayer(r)); }
      });
      const pushes = local
        .filter((p) => { const r = remoteById.get(p.id); return !r || pUpdated(p) >= (r.updated_at || 0); })
        .map((p) => prayerToRow(p, userId));
      if (pushes.length) await supabase.from('prayers').upsert(pushes);
    }
  } catch {
    /* offline / transient — try again next time */
  } finally {
    running = false;
  }
}

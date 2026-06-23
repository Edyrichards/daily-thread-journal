import { supabase } from './client';

export interface WallRequest {
  id: string;
  text: string;
  authorName: string;
  isAnonymous: boolean;
  prayCount: number;
  createdAt: string;
  mine: boolean;
  prayedByMe: boolean;
}

export async function listWall(limit = 50): Promise<WallRequest[]> {
  if (!supabase) return [];
  const { data: auth } = await supabase.auth.getUser();
  const uid = auth.user?.id;
  const { data } = await supabase
    .from('prayer_requests').select('*')
    .order('created_at', { ascending: false }).limit(limit);

  let prayed = new Set<string>();
  if (uid) {
    const { data: p } = await supabase.from('prayer_request_prayers').select('request_id').eq('user_id', uid);
    prayed = new Set((p || []).map((x: any) => x.request_id));
  }
  return (data || []).map((r: any) => ({
    id: r.id,
    text: r.text,
    authorName: r.is_anonymous ? 'Anonymous' : (r.author_name || 'A friend'),
    isAnonymous: r.is_anonymous,
    prayCount: r.pray_count,
    createdAt: r.created_at,
    mine: r.user_id === uid,
    prayedByMe: prayed.has(r.id),
  }));
}

export async function postRequest(text: string, anonymous: boolean): Promise<void> {
  if (!supabase) return;
  const { data: auth } = await supabase.auth.getUser();
  const u = auth.user;
  if (!u) return;
  const name = (u.user_metadata as any)?.display_name || u.email?.split('@')[0] || 'A friend';
  await supabase.from('prayer_requests').insert({ user_id: u.id, text: text.trim(), is_anonymous: anonymous, author_name: name });
}

export async function togglePray(id: string, currentlyPrayed: boolean): Promise<void> {
  if (!supabase) return;
  const { data: auth } = await supabase.auth.getUser();
  const uid = auth.user?.id;
  if (!uid) return;
  if (currentlyPrayed) {
    await supabase.from('prayer_request_prayers').delete().eq('request_id', id).eq('user_id', uid);
  } else {
    await supabase.from('prayer_request_prayers').insert({ request_id: id, user_id: uid });
  }
}

export async function reportRequest(id: string, reason = 'inappropriate'): Promise<void> {
  if (!supabase) return;
  const { data: auth } = await supabase.auth.getUser();
  const uid = auth.user?.id;
  if (!uid) return;
  await supabase.from('reports').upsert({ reporter_id: uid, request_id: id, reason });
}

export async function deleteRequest(id: string): Promise<void> {
  if (!supabase) return;
  await supabase.from('prayer_requests').delete().eq('id', id);
}

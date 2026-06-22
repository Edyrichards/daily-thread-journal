import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Globe, MoreHorizontal, Heart, MessageCircle, Share2, Bookmark, HandHeart, Plus, ChevronRight } from 'lucide-react';
import SelahShell from '@/components/selah/SelahShell';
import { LeafSprig } from '@/components/threads/Botanical';
import { getPrayerRequests } from '@/lib/storage';
import { cn } from '@/lib/utils';

const grads = [
  'linear-gradient(135deg, hsl(105 22% 70%), hsl(141 20% 38%))',
  'linear-gradient(135deg, hsl(40 50% 72%), hsl(30 42% 56%))',
  'linear-gradient(135deg, hsl(154 16% 72%), hsl(154 14% 48%))',
  'linear-gradient(135deg, hsl(30 33% 76%), hsl(30 33% 58%))',
  'linear-gradient(135deg, hsl(30 33% 76%), hsl(24 28% 52%))',
  'linear-gradient(135deg, hsl(105 20% 64%), hsl(105 18% 48%))',
];
const Avatar = ({ name, i, size = 44 }: { name: string; i: number; size?: number }) => (
  <span className="flex shrink-0 items-center justify-center rounded-full font-display font-semibold text-white"
    style={{ width: size, height: size, fontSize: size * 0.4, background: grads[i % grads.length] }}>
    {name.charAt(0)}
  </span>
);

const stories = ['You', 'Grace', 'Daniel', 'Maya', 'Joshua', 'Hannah'];
const posts = [
  { name: 'Sarah Johnson', time: '2h ago', verse: true, text: '“Come to me, all you who are weary and burdened, and I will give you rest.”', ref: 'Matthew 11:28', likes: 124, comments: 18 },
  { name: 'Michael Thomas', time: '5h ago', verse: false, text: 'Grateful for another sunrise and the chance to grow closer to Him. His mercy is new every morning.', ref: 'Lamentations 3:22-23', likes: 98, comments: 12 },
];
const fallbackReqs = [
  { id: 'a', text: 'Please pray for healing for my mom.', name: 'Emma W.', t: '1h ago', count: 23 },
  { id: 'b', text: 'Pray for wisdom and direction in my career.', name: 'James L.', t: '3h ago', count: 18 },
  { id: 'c', text: 'Pray for peace and rest for my heart.', name: 'Sophia R.', t: '5h ago', count: 15 },
];

const SelahCommunityPage = () => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState<Record<number, boolean>>({});
  const reqs = (() => {
    const real = getPrayerRequests();
    if (real.length) return real.slice(0, 3).map((r, i) => ({ id: r.id, text: r.text, name: r.isAnonymous ? 'Anonymous' : 'A friend', t: `${i + 1}h ago`, count: r.prayedCount }));
    return fallbackReqs;
  })();

  return (
    <SelahShell title="Community">
      {/* header */}
      <div className="flex items-center justify-between pt-1">
        <span className="w-6" />
        <h1 className="font-display text-[34px] font-semibold tracking-tight text-forest">Community</h1>
        <Bell className="h-6 w-6 text-ink-soft" />
      </div>

      {/* stories */}
      <div className="-mx-5 mt-4 flex gap-4 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {stories.map((name, i) => (
          <div key={name} className="flex w-[58px] shrink-0 flex-col items-center gap-1.5">
            <div className={cn('relative rounded-full p-[2px]', i === 0 ? 'ring-2 ring-forest' : 'ring-2 ring-clay/60')}>
              <Avatar name={name} i={i} size={50} />
              {i === 0 && (
                <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-paper bg-forest text-primary-foreground">
                  <Plus className="h-3 w-3" strokeWidth={3} />
                </span>
              )}
            </div>
            <span className="text-[11px] font-medium text-ink-soft">{name}</span>
          </div>
        ))}
      </div>

      {/* feed */}
      <ul className="mt-5 space-y-3">
        {posts.map((p, i) => (
          <li key={p.name} className="rounded-[18px] border border-line bg-card p-4 shadow-soft">
            <div className="flex items-center gap-3">
              <Avatar name={p.name} i={i + 1} size={40} />
              <div className="flex-1">
                <p className="text-[14px] font-semibold text-ink">{p.name}</p>
                <p className="flex items-center gap-1 text-[12px] text-muted-foreground">{p.time} <Globe className="h-3 w-3" /></p>
              </div>
              <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className={cn('mt-3 text-ink', p.verse ? 'font-display text-[19px] italic leading-snug' : 'font-serif text-[16px] leading-relaxed')}>{p.text}</p>
            <p className="eyebrow mt-2 text-[10.5px] text-gold">{p.ref}</p>
            <div className="mt-3 flex items-center gap-6 text-[13px] font-semibold text-muted-foreground">
              <button onClick={() => setLiked((l) => ({ ...l, [i]: !l[i] }))} className={cn('flex items-center gap-1.5', liked[i] && 'text-clay')}>
                <Heart className={cn('h-[18px] w-[18px]', liked[i] && 'fill-clay')} /> {p.likes + (liked[i] ? 1 : 0)}
              </button>
              <span className="flex items-center gap-1.5"><MessageCircle className="h-[18px] w-[18px]" /> {p.comments}</span>
              <span className="flex items-center gap-1.5"><Share2 className="h-[18px] w-[18px]" /> Share</span>
              <Bookmark className="ml-auto h-[18px] w-[18px]" />
            </div>
          </li>
        ))}
      </ul>

      {/* daily challenge */}
      <div className="relative mt-5 flex items-center gap-3 overflow-hidden rounded-[18px] px-5 py-4 text-white shadow-soft"
        style={{ background: 'linear-gradient(135deg, hsl(30 33% 62%), hsl(24 28% 50%))' }}>
        <LeafSprig className="pointer-events-none absolute -right-2 bottom-0 h-16 w-24 text-white/20" />
        <div className="relative flex-1">
          <p className="eyebrow text-[10px] text-white/85">Daily Challenge</p>
          <p className="mt-1 font-serif text-[17px] leading-snug">Spend 10 minutes in silence with God today.</p>
        </div>
        <button className="relative shrink-0 rounded-full bg-white px-5 py-2 text-[14px] font-bold text-clay">Join</button>
      </div>

      {/* prayer requests */}
      <SectionHead title="Prayer Requests" onAction={() => navigate('/prayer')} />
      <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {reqs.map((r, i) => (
          <div key={r.id} className="flex w-[180px] shrink-0 flex-col rounded-[16px] border border-line bg-card p-3.5 shadow-soft">
            <div className="flex items-center gap-2">
              <Avatar name={r.name} i={i + 2} size={28} />
              <div className="leading-tight">
                <p className="text-[12px] font-semibold text-ink">{r.name}</p>
                <p className="text-[10.5px] text-muted-foreground">{r.t}</p>
              </div>
            </div>
            <p className="mt-2 line-clamp-2 font-serif text-[14px] leading-snug text-ink-soft">{r.text}</p>
            <p className="mt-2 flex items-center gap-1.5 text-[12px] font-semibold text-clay"><HandHeart className="h-4 w-4" /> {r.count}</p>
          </div>
        ))}
      </div>

      {/* shared insights */}
      <SectionHead title="Shared Insights" onAction={() => {}} />
      <div className="flex items-center gap-3.5 rounded-[18px] border border-line bg-card p-3 shadow-soft">
        <span className="relative flex h-[60px] w-[60px] shrink-0 items-center justify-center overflow-hidden rounded-[14px]" style={{ background: grads[3] }}>
          <LeafSprig className="h-7 w-10 text-white/55" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-serif text-[15px] leading-snug text-ink">God’s timing is perfect, even when we don’t understand the delay.</p>
          <div className="mt-1.5 flex items-center gap-4 text-[12px] text-muted-foreground">
            <span>By Olivia M.</span>
            <span className="flex items-center gap-1 text-clay"><Heart className="h-3.5 w-3.5" /> 76</span>
            <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" /> 11</span>
          </div>
        </div>
      </div>
    </SelahShell>
  );
};

const SectionHead = ({ title, onAction }: { title: string; onAction: () => void }) => (
  <div className="mb-3 mt-6 flex items-center justify-between">
    <h2 className="font-display text-[22px] font-semibold text-ink">{title}</h2>
    <button onClick={onAction} className="flex items-center gap-1 text-[12px] font-semibold text-gold">See all <ChevronRight className="h-3.5 w-3.5" /></button>
  </div>
);

export default SelahCommunityPage;

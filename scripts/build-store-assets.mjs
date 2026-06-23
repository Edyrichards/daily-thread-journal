// Generate Play Store assets (framed phone screenshots + feature graphic) from the live app.
// Requires the dev/preview server running at BASE.
import puppeteer from 'puppeteer';
import { readFileSync, mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const BASE = process.env.BASE || 'http://127.0.0.1:5188';
const OUT = resolve('store/screenshots');
mkdirSync(OUT, { recursive: true });

const now = Date.now(), DAY = 864e5;
const moods = ['joyful', 'peaceful', 'anxious', 'content', 'joyful', 'peaceful', 'hopeful', 'sad', 'joyful', 'content', 'peaceful', 'joyful'];
const entries = moods.map((m, i) => ({
  id: 'e' + i, date: new Date(now - i * DAY).toISOString().slice(0, 10), createdAt: now - i * DAY, mood: m,
  content: i === 0 ? 'Lord, today I lay down my plans and dreams before You. Help me trust Your timing over my own.' : 'Grateful for small mercies — sunlight, a kind word, and Your steady presence through it all.',
  verse: i % 2 ? { text: 'Be still, and know that I am God.', reference: 'Psalm 46:10' } : undefined,
  reflection: i % 3 === 0 ? 'Be present, not productive.' : undefined,
}));
const prayers = [
  { id: 'p1', title: 'Healing and strength for my mother’s recovery.', content: 'x', status: 'praying', createdAt: now - 9 * DAY, updatedAt: now, prayedCount: 12, lastPrayedAt: now },
  { id: 'p2', title: 'Wisdom for the decision ahead.', content: 'x', status: 'praying', createdAt: now - 4 * DAY, updatedAt: now, prayedCount: 5 },
  { id: 'p3', title: 'Thank You, Lord, for the new opportunity.', content: 'x', status: 'answered', createdAt: now - 30 * DAY, updatedAt: now, answeredAt: now - 2 * DAY },
];
const days = [0, 1, 2, 3, 4].map((d) => { const x = new Date(now - d * DAY); return new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime(); });
const bookmarks = [{ text: 'For I know the plans I have for you, declares the Lord.', reference: 'Jeremiah 29:11', createdAt: now }];

const shots = [
  { path: '/', file: '1-home.png', title: 'Begin each day in the Word', sub: 'A verse, a prayer, a quiet moment.' },
  { path: '/bible/read?book=Psalms&chapter=23', file: '2-bible.png', title: 'The whole Bible, offline', sub: 'WEB & KJV — read anywhere, no signal needed.', wait: 1600 },
  { path: '/journal', file: '3-journal.png', title: 'Your reflections, gathered', sub: 'Write or speak what’s on your heart.' },
  { path: '/prayer', file: '4-prayer.png', title: 'Pray, and remember His faithfulness', sub: 'Track prayers and answered ones.' },
  { path: '/analytics', file: '5-journey.png', title: 'See how God is meeting you', sub: 'Mood calendar, insights, and streaks.' },
  { path: '/prayer/guided', file: '6-guided.png', title: 'A calm, guided way to pray', sub: 'Move through Adoration to Supplication.' },
];

const frame = (b64, title, sub) => `<!doctype html><html><head><meta charset="utf-8"><style>
*{margin:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;overflow:hidden}
.bg{width:1080px;height:1920px;display:flex;flex-direction:column;align-items:center;
  background:linear-gradient(165deg,#3a5848 0%,#2D4A3E 45%,#1b2c24 100%);font-family:Georgia,'Times New Roman',serif}
.cap{padding:96px 90px 0;text-align:center;color:#F5F0E8}
.cap h2{font-size:66px;font-weight:600;line-height:1.08;letter-spacing:-0.5px}
.cap p{font-family:'Helvetica Neue',Arial,sans-serif;font-size:30px;color:#cdd8cf;margin-top:22px;font-weight:400}
.phone{margin-top:84px;width:612px;height:1330px;border-radius:60px;background:#0e120e;padding:16px;
  box-shadow:0 50px 110px rgba(0,0,0,.45);position:relative}
.scrn{width:100%;height:100%;border-radius:46px;object-fit:cover;object-position:top;display:block}
.notch{position:absolute;top:30px;left:50%;transform:translateX(-50%);width:150px;height:26px;border-radius:14px;background:#0e120e;z-index:2}
</style></head><body>
<div class="bg"><div class="cap"><h2>${title}</h2><p>${sub}</p></div>
<div class="phone"><div class="notch"></div><img class="scrn" src="${b64}"/></div></div>
</body></html>`;

const featureGraphic = () => `<!doctype html><html><head><meta charset="utf-8"><style>
*{margin:0;box-sizing:border-box}html,body{width:1024px;height:500px;overflow:hidden}
.bg{width:1024px;height:500px;display:flex;align-items:center;gap:46px;padding:0 90px;
  background:radial-gradient(120% 140% at 14% 30%,#3f6150,#24382e 70%);font-family:Georgia,serif;color:#F5F0E8}
.mark{width:150px;height:150px;border-radius:46px;display:flex;align-items:center;justify-content:center;flex:0 0 auto;
  background:radial-gradient(circle at 38% 34%,#7fa088,#2D4A3E 74%)}
.t h1{font-size:78px;font-weight:600;letter-spacing:-1px}
.t .i{font-style:italic;font-weight:500}
.t p{font-family:'Helvetica Neue',Arial,sans-serif;font-size:30px;color:#c9d6cc;margin-top:14px;letter-spacing:3px;text-transform:uppercase}
</style></head><body><div class="bg">
<div class="mark"><svg width="84" height="84" viewBox="0 0 24 24" fill="none" stroke="#F5F0E8" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
<path d="M20.5 4.5c-5.5-1-12 1.5-14.5 7C4.5 14.5 4.5 18 5 19.5"/><path d="M5.2 19.3 18 6.6"/>
<path d="M16.5 5.2 11 7M18.2 8.4 12.5 10.4M19 11.8 14 13.8M9.2 9.5 7.4 14.6M12.4 12.7 10.6 17.4"/></svg></div>
<div class="t"><h1>Threads <span class="i">of</span> Grace</h1><p>Reflect · Grow · Align</p></div>
</div></body></html>`;

const b = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none'] });
const app = await b.newPage();
await app.setViewport({ width: 402, height: 874, deviceScaleFactor: 2 });

// seed once
await app.goto(BASE + '/', { waitUntil: 'networkidle2' });
await app.evaluate((d) => {
  localStorage.setItem('journal_entries', JSON.stringify(d.entries));
  localStorage.setItem('prayers', JSON.stringify(d.prayers));
  localStorage.setItem('prayer_days', JSON.stringify(d.days));
  localStorage.setItem('bookmarked_verses', JSON.stringify(d.bookmarks));
  localStorage.setItem('userName', 'Ed');
  localStorage.setItem('theme', 'light');
}, { entries, prayers, days, bookmarks });

const framer = await b.newPage();
await framer.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });

for (const s of shots) {
  await app.goto(BASE + s.path, { waitUntil: 'networkidle2' });
  await app.evaluate(async () => { await (document.fonts ? document.fonts.ready : 0); });
  await new Promise((r) => setTimeout(r, s.wait || 900));
  const raw = await app.screenshot({ encoding: 'base64' });
  await framer.setContent(frame(`data:image/png;base64,${raw}`, s.title, s.sub), { waitUntil: 'load' });
  await new Promise((r) => setTimeout(r, 150));
  await framer.screenshot({ path: resolve(OUT, s.file) });
  console.log('shot', s.file);
}

await framer.setContent(featureGraphic(), { waitUntil: 'load' });
await framer.setViewport({ width: 1024, height: 500, deviceScaleFactor: 1 });
await framer.setContent(featureGraphic(), { waitUntil: 'load' });
await new Promise((r) => setTimeout(r, 150));
await framer.screenshot({ path: resolve('store/feature-graphic.png') });
console.log('feature-graphic.png');

await b.close();
console.log('DONE');

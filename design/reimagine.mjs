// Selah — UI reimagination: three distinct visual directions, rendered to phone PNGs.
// node design/reimagine.mjs
import puppeteer from 'puppeteer';
import { writeFileSync, mkdirSync, readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, 'mockups/reimagine');
mkdirSync(OUT, { recursive: true });
const FONTS = readFileSync(resolve(__dirname, 'fonts/fonts-inline.css'), 'utf8')
  + readFileSync(resolve(__dirname, 'fonts/fonts-extra.css'), 'utf8');

const W = 402, H = 874;

/* ---------- icons (lucide-ish, stroke=currentColor) ---------- */
const P = {
  sun:`<circle cx="12" cy="12" r="4.5"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5 5l1.4 1.4M17.6 17.6 19 19M19 5l-1.4 1.4M6.4 17.6 5 19"/>`,
  pencil:`<path d="M4 20h4l10-10a2.1 2.1 0 0 0-3-3L5 17v3Z"/><path d="M13.5 6.5l3 3"/>`,
  heart:`<path d="M12 20s-7-4.4-9.3-8.4C1.2 9 2.4 5.6 5.6 5.6c1.9 0 3.2 1.1 4 2.2.8-1.1 2.1-2.2 4-2.2 3.2 0 4.4 3.4 2.9 6C19 15.6 12 20 12 20Z"/>`,
  book:`<path d="M12 6c-1.6-1.2-3.8-1.8-6-1.8-1 0-1.8.2-1.8.2v13s.8-.2 1.8-.2c2.2 0 4.4.6 6 1.8M12 6c1.6-1.2 3.8-1.8 6-1.8 1 0 1.8.2 1.8.2v13s-.8-.2-1.8-.2c-2.2 0-4.4.6-6 1.8M12 6v13"/>`,
  chart:`<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>`,
  flame:`<path d="M12 3c.5 3-2.5 4-2.5 7.5A2.5 2.5 0 0 0 12 13a2.5 2.5 0 0 0 2.5-2.5C14.5 9 13 9 13.5 7c2 1.5 3.5 3.6 3.5 6a5 5 0 1 1-10 0c0-3.4 3-5 5-10Z"/>`,
  bookmark:`<path d="M6 4h12v16l-6-4-6 4V4Z"/>`,
  feather:`<path d="M20 4S9 5 6 12c-1 2.4-1 5-1 5l9-9M5 19l6-6"/>`,
  share:`<path d="M12 15V4M8 8l4-4 4 4M5 13v6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-6"/>`,
  search:`<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>`,
  plus:`<path d="M12 5v14M5 12h14"/>`,
  check:`<path d="m4 12 5 5L20 6"/>`,
  chev:`<path d="m9 6 6 6-6 6"/>`,
  play:`<path d="M7 5l12 7-12 7V5Z"/>`,
  sparkle:`<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/>`,
  note:`<path d="M4 4h16v12l-4 4H4V4Z"/><path d="M16 20v-4h4"/>`,
};
const prayersData = [['Mom’s health','Praying 9 days','14',false],['Wisdom for the job decision','Praying 4 days','3',true],['Patience with the kids','Praying 21 days','7',false]];
const bibleLines = [
  ['1','The Lord is my shepherd, I lack nothing.',false],
  ['2','He makes me lie down in green pastures, he leads me beside quiet waters,','hl'],
  ['3','he refreshes my soul. He guides me along the right paths for his name’s sake.',false],
  ['4','Even though I walk through the darkest valley, I will fear no evil, for you are with me.',false],
];
const ic = (n, w=24, sw=1.9) => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${P[n]}</svg>`;
const icf = (n, w=24) => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="currentColor" stroke="none">${P[n]}</svg>`;

const statusbar = (color) => `<div class="status" style="color:${color}">
  <span>9:41</span>
  <span class="sbicons">
    <svg width="18" height="12" viewBox="0 0 18 12" fill="${color}"><rect x="0" y="7" width="3" height="5" rx="1"/><rect x="5" y="4.5" width="3" height="7.5" rx="1"/><rect x="10" y="2" width="3" height="10" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg>
    <svg width="26" height="13" viewBox="0 0 26 13" fill="none"><rect x="1" y="1" width="21" height="11" rx="3" stroke="${color}" stroke-width="1.4" opacity=".45"/><rect x="3" y="3" width="15" height="7" rx="1.5" fill="${color}"/><rect x="23.5" y="4.5" width="1.6" height="4" rx="1" fill="${color}"/></svg>
  </span>
</div>`;

const moods = [['😌','At peace'],['😊','Grateful'],['😟','Anxious'],['😢','Heavy'],['😶','Numb']];
const rhythm = [['book','Read the Word','A few verses to dwell on',true],['heart','Pray','3 requests waiting',true],['feather','Journal your reflection','What is God saying to you?',false]];
const navItems = [['sun','Today'],['pencil','Journal'],['heart','Pray'],['book','Bible'],['chart','Insights']];
const entries = [
  ['😌','Resting in His timing','This week has felt loud. So many decisions pulling at me, but “be still” keeps echoing…','Psalm 46:10','Today'],
  ['😊','Grateful for small mercies','Three things I’m thankful for: the long call with Mom, sunlight on the floor, and…','Phil 4:4','Yest.'],
  ['😟','Wrestling with work','Anxious about the review tomorrow. Bringing it to God instead of spiraling…','1 Peter 5:7','Jun 19'],
];

/* =====================================================================
   DIRECTION 1 — NOCTURNE (bold, luminous, dark-first)
   ===================================================================== */
const nocturne = {
  id: 'nocturne',
  statusColor: '#EAF0FF',
  css: `
  :root{--bg:#0A0D14;--panel:rgba(255,255,255,.045);--stroke:rgba(255,255,255,.09);--ink:#ECF1FB;--mut:#7C88A6;}
  body{background:#0A0D14;font-family:'Inter',sans-serif;color:var(--ink);}
  .screen{background:radial-gradient(130% 80% at 78% -8%,rgba(124,92,255,.45),transparent 46%),radial-gradient(120% 70% at 8% 8%,rgba(45,224,200,.18),transparent 42%),#0A0D14;}
  .display{font-family:'Space Grotesk',sans-serif;letter-spacing:-.02em;}
  .panel{background:var(--panel);border:1px solid var(--stroke);border-radius:26px;backdrop-filter:blur(12px);}
  .grad{background:linear-gradient(118deg,#8A5CFF 0%,#4D7CFF 52%,#2FE0C8 100%);}
  .gradtext{background:linear-gradient(118deg,#A98CFF,#5EE0FF);-webkit-background-clip:text;background-clip:text;color:transparent;}
  .mut{color:var(--mut);}
  .nav{background:rgba(12,15,23,.82);border-top:1px solid var(--stroke);backdrop-filter:blur(16px);}
  `,
  today: `
    <div class="status-wrap">${statusbar('#EAF0FF')}</div>
    <div class="pad">
      <div class="row jb" style="align-items:flex-start;margin-top:6px;">
        <div>
          <div class="mut" style="font-size:13px;font-weight:600;">Saturday, June 21</div>
          <div class="display" style="font-size:33px;font-weight:600;line-height:1.04;margin-top:4px;">Good evening,<br>Ed</div>
        </div>
        <div class="panel" style="display:flex;align-items:center;gap:6px;padding:9px 13px;border-radius:999px;font-weight:700;"><span style="color:#FFB85C">${icf('flame',17)}</span><span class="gradtext">12</span></div>
      </div>

      <div class="panel" style="margin-top:20px;padding:0;overflow:hidden;position:relative;">
        <div class="grad" style="position:absolute;inset:0;opacity:.16;"></div>
        <div style="position:relative;padding:22px;">
          <div class="row jb">
            <div style="font-size:11px;font-weight:800;letter-spacing:2px;" class="gradtext">VERSE OF THE DAY</div>
            <span style="color:#8EA0FF">${icf('bookmark',18)}</span>
          </div>
          <div style="font-family:'Newsreader',serif;font-style:italic;font-size:25px;line-height:1.4;margin-top:14px;">“Be still, and know that I am God.”</div>
          <div class="display" style="font-weight:600;margin-top:14px;color:#B9C6FF;">Psalm 46:10</div>
          <div class="grad" style="height:1px;opacity:.4;margin:18px 0;"></div>
          <div class="row" style="gap:22px;font-size:13px;font-weight:600;color:#C7D2F0;">
            <span class="row" style="gap:6px;">${ic('feather',16)} Reflect</span>
            <span class="row" style="gap:6px;">${ic('share',16)} Share</span>
            <span class="row" style="gap:6px;">${ic('book',16)} Read</span>
          </div>
        </div>
      </div>

      <div class="display" style="font-size:18px;font-weight:600;margin:24px 0 13px;">How is your heart?</div>
      <div class="row jb">
        ${moods.map(([e,l],i)=>`<div style="text-align:center;"><div class="panel" style="width:56px;height:56px;border-radius:20px;display:flex;align-items:center;justify-content:center;font-size:26px;${i===0?'border-color:rgba(138,124,255,.8);box-shadow:0 0 24px rgba(124,92,255,.4);':''}">${e}</div><div class="mut" style="font-size:11px;font-weight:600;margin-top:7px;">${l}</div></div>`).join('')}
      </div>

      <div class="row jb" style="margin:26px 0 13px;"><div class="display" style="font-size:18px;font-weight:600;">Today’s rhythm</div><div class="mut" style="font-size:13px;font-weight:700;">2 / 3</div></div>
      <div class="panel" style="padding:6px 18px;">
        ${rhythm.map(([i,t,s,done],idx)=>`<div class="row" style="gap:14px;padding:14px 0;${idx<2?'border-bottom:1px solid var(--stroke);':''}">
          <div class="${done?'grad':''}" style="width:34px;height:34px;border-radius:11px;display:flex;align-items:center;justify-content:center;${done?'color:#fff;':'background:rgba(255,255,255,.05);color:var(--mut);'}">${done?ic('check',18,2.4):ic(i,18)}</div>
          <div style="flex:1;"><div style="font-weight:600;font-size:15px;${done?'color:var(--mut);text-decoration:line-through;':''}">${t}</div>${!done?`<div class="mut" style="font-size:12px;">${s}</div>`:''}</div>
          ${!done?`<span class="mut">${ic('chev',18)}</span>`:''}
        </div>`).join('')}
      </div>
    </div>
    ${navDark('Today')}
  `,
  journal: `
    <div class="status-wrap">${statusbar('#EAF0FF')}</div>
    <div class="pad">
      <div class="row jb" style="margin-top:6px;"><div class="display" style="font-size:31px;font-weight:600;">Journal</div>
        <div class="panel" style="width:46px;height:46px;border-radius:15px;display:flex;align-items:center;justify-content:center;color:#9FB0E0;">${ic('search',20)}</div></div>
      <div class="row" style="gap:9px;margin:16px 0;">
        <div class="grad" style="padding:9px 15px;border-radius:999px;font-size:13px;font-weight:700;color:#fff;">All</div>
        ${['Grateful','At peace','Heavy','Verse'].map(t=>`<div class="panel" style="padding:9px 15px;border-radius:999px;font-size:13px;font-weight:600;" class="mut">${t}</div>`).join('')}
      </div>
      <div class="row" style="gap:12px;margin-bottom:16px;">
        ${[['48','entries'],['12','streak'],['6','this week']].map(([n,l])=>`<div class="panel" style="flex:1;padding:15px;"><div class="display gradtext" style="font-size:27px;font-weight:700;">${n}</div><div class="mut" style="font-size:12px;font-weight:600;margin-top:2px;">${l}</div></div>`).join('')}
      </div>
      ${entries.map(([e,t,b,v,d])=>`<div class="panel" style="padding:16px;margin-bottom:12px;">
        <div class="row" style="gap:13px;align-items:flex-start;">
          <div style="width:42px;height:42px;border-radius:13px;background:rgba(255,255,255,.05);display:flex;align-items:center;justify-content:center;font-size:21px;">${e}</div>
          <div style="flex:1;min-width:0;">
            <div class="row jb"><div class="display" style="font-weight:600;font-size:16px;">${t}</div><div class="mut" style="font-size:12px;font-weight:600;">${d}</div></div>
            <div class="mut" style="font-size:13px;line-height:1.5;margin-top:4px;">${b}</div>
            <div class="row" style="gap:8px;margin-top:11px;"><span style="display:inline-flex;gap:5px;align-items:center;font-size:11px;font-weight:700;padding:5px 11px;border-radius:999px;" class="grad" >${ic('book',12,2)}<span style="color:#fff">${v}</span></span></div>
          </div>
        </div></div>`).join('')}
    </div>
    ${navDark('Journal')}
  `,
};
function navDark(active){return `<div class="nav navbar">${navItems.map(([i,l])=>{const on=l===active;return `<div class="navi" style="${on?'color:#fff':'color:#67738F'}"><div style="${on?'filter:drop-shadow(0 0 8px rgba(124,92,255,.9));':''}">${on?`<span class="gradtext">${ic(i,24,2.1)}</span>`:ic(i,24,1.8)}</div><span style="font-size:11px;font-weight:600;${on?'':'color:#67738F'}">${l}</span></div>`;}).join('')}</div>`;}

/* =====================================================================
   DIRECTION 2 — QUIET (editorial, light, minimal)
   ===================================================================== */
const quiet = {
  id: 'quiet',
  statusColor: '#16160F',
  css: `
  :root{--bg:#FBFBF8;--ink:#16160F;--mut:#9C9C90;--line:#E7E7DF;--ever:#22392F;}
  body{background:var(--bg);font-family:'Inter',sans-serif;color:var(--ink);}
  .screen{background:var(--bg);}
  .serif{font-family:'Newsreader',serif;}
  .kick{font-size:11px;font-weight:600;letter-spacing:2.4px;text-transform:uppercase;color:var(--mut);}
  .mut{color:var(--mut);}
  .rule{height:1px;background:var(--line);}
  .nav{background:var(--bg);border-top:1px solid var(--line);}
  `,
  today: `
    <div class="status-wrap">${statusbar('#16160F')}</div>
    <div class="pad" style="padding-left:26px;padding-right:26px;">
      <div class="row jb" style="margin-top:10px;align-items:center;">
        <div class="kick">Saturday · June 21</div>
        <div class="row" style="gap:7px;align-items:center;font-size:13px;font-weight:600;"><span style="color:var(--ever)">${icf('flame',15)}</span> 12 days</div>
      </div>
      <div class="serif" style="font-size:34px;font-weight:400;line-height:1.08;margin-top:18px;letter-spacing:-.01em;">Good evening, Ed.</div>

      <div class="rule" style="margin:26px 0;"></div>
      <div class="kick">Verse of the day</div>
      <div class="serif" style="font-size:30px;font-weight:400;line-height:1.34;margin-top:16px;letter-spacing:-.01em;">“Be still, and know<br>that I am God.”</div>
      <div class="row jb" style="margin-top:18px;align-items:center;">
        <div class="serif" style="font-style:italic;font-size:17px;color:var(--ever);">Psalm 46:10</div>
        <div class="row mut" style="gap:18px;">${ic('bookmark',18)}${ic('feather',18)}${ic('share',18)}</div>
      </div>
      <div class="rule" style="margin:26px 0;"></div>

      <div class="kick">How is your heart</div>
      <div class="row" style="gap:9px;margin-top:14px;flex-wrap:wrap;">
        ${moods.map(([e,l],i)=>`<div style="display:inline-flex;align-items:center;gap:7px;padding:9px 14px;border:1px solid ${i===0?'var(--ever)':'var(--line)'};border-radius:999px;font-size:13px;font-weight:500;${i===0?'color:var(--ever);':''}">${e} ${l}</div>`).join('')}
      </div>

      <div class="row jb" style="margin:30px 0 4px;align-items:baseline;"><div class="kick">Today’s rhythm</div><div class="mut" style="font-size:12px;font-weight:600;">Two of three</div></div>
      <div style="margin-top:8px;">
        ${rhythm.map(([i,t,s,done],idx)=>`<div class="row" style="gap:16px;padding:16px 0;border-bottom:1px solid var(--line);align-items:center;">
          <div style="width:22px;height:22px;border-radius:6px;border:1.5px solid ${done?'var(--ever)':'var(--line)'};background:${done?'var(--ever)':'transparent'};color:#fff;display:flex;align-items:center;justify-content:center;">${done?ic('check',13,2.6):''}</div>
          <div style="flex:1;"><div class="serif" style="font-size:18px;${done?'color:var(--mut);':''}">${t}</div></div>
          <span class="mut">${ic('chev',17)}</span>
        </div>`).join('')}
      </div>
    </div>
    ${navQuiet('Today')}
  `,
  journal: `
    <div class="status-wrap">${statusbar('#16160F')}</div>
    <div class="pad" style="padding-left:26px;padding-right:26px;">
      <div class="row jb" style="margin-top:12px;align-items:center;">
        <div class="serif" style="font-size:34px;font-weight:400;letter-spacing:-.01em;">Journal</div>
        <span class="mut">${ic('search',21)}</span>
      </div>
      <div class="row" style="gap:22px;margin-top:18px;border-bottom:1px solid var(--line);padding-bottom:2px;">
        ${['All','Grateful','At peace','Heavy'].map((t,i)=>`<div style="font-size:14px;font-weight:${i===0?'600':'500'};padding-bottom:12px;${i===0?'color:var(--ink);border-bottom:1.5px solid var(--ever);margin-bottom:-1px;':'color:var(--mut);'}">${t}</div>`).join('')}
      </div>
      <div class="row" style="gap:30px;margin:22px 0 8px;">
        ${[['48','Entries'],['12','Day streak'],['6','This week']].map(([n,l])=>`<div><div class="serif" style="font-size:30px;font-weight:400;">${n}</div><div class="kick" style="margin-top:3px;">${l}</div></div>`).join('')}
      </div>
      ${entries.map(([e,t,b,v,d],idx)=>`<div style="padding:20px 0;border-bottom:1px solid var(--line);">
        <div class="row jb" style="align-items:baseline;"><div class="kick">${d} · ${v}</div><div style="font-size:17px;">${e}</div></div>
        <div class="serif" style="font-size:21px;font-weight:400;line-height:1.25;margin-top:8px;letter-spacing:-.01em;">${t}</div>
        <div class="mut" style="font-size:14px;line-height:1.55;margin-top:7px;">${b}</div>
      </div>`).join('')}
    </div>
    ${navQuiet('Journal')}
  `,
};
function navQuiet(active){return `<div class="nav navbar">${navItems.map(([i,l])=>{const on=l===active;return `<div class="navi" style="color:${on?'#16160F':'#B4B4A8'}">${ic(i,23,on?2:1.6)}<span style="font-size:11px;font-weight:${on?'600':'500'};">${l}</span></div>`;}).join('')}</div>`;}

/* =====================================================================
   DIRECTION 3 — BLOOM (friendly, modern, periwinkle)
   ===================================================================== */
const bloom = {
  id: 'bloom',
  statusColor: '#1B2240',
  css: `
  :root{--bg:#F1F3FB;--card:#FFFFFF;--ink:#1B2240;--mut:#8089A6;--indigo:#5A6CFF;--indigo-s:#E7EAFF;--mint:#19C9A0;--mint-s:#D7F7EF;--coral:#FF7088;--coral-s:#FFE2E7;--amber:#FFB020;--amber-s:#FFEFCF;}
  body{background:var(--bg);font-family:'Plus Jakarta Sans',sans-serif;color:var(--ink);}
  .screen{background:var(--bg);}
  .card{background:var(--card);border-radius:28px;box-shadow:0 10px 30px -14px rgba(40,52,110,.22);}
  .mut{color:var(--mut);}
  .nav{background:#fff;border-top:1px solid #E9ECF7;box-shadow:0 -8px 24px -18px rgba(40,52,110,.5);}
  `,
  today: `
    <div class="status-wrap">${statusbar('#1B2240')}</div>
    <div class="pad">
      <div class="row jb" style="margin-top:6px;align-items:center;">
        <div><div class="mut" style="font-size:13px;font-weight:700;">Saturday, June 21</div>
          <div style="font-size:29px;font-weight:800;line-height:1.05;margin-top:3px;letter-spacing:-.02em;">Good evening,<br>Ed 👋</div></div>
        <div style="display:flex;align-items:center;gap:6px;background:var(--coral-s);color:var(--coral);padding:9px 13px;border-radius:999px;font-weight:800;">${icf('flame',17)} 12</div>
      </div>

      <div class="card" style="margin-top:20px;padding:0;overflow:hidden;position:relative;background:linear-gradient(135deg,#6E7CFF,#9A6CFF);color:#fff;">
        <div style="position:absolute;right:-30px;bottom:-40px;width:150px;height:150px;border-radius:50%;background:rgba(255,255,255,.14);"></div>
        <div style="position:relative;padding:22px;">
          <div style="font-size:11px;font-weight:800;letter-spacing:1.6px;opacity:.9;">VERSE OF THE DAY</div>
          <div style="font-size:23px;font-weight:700;line-height:1.4;margin-top:12px;letter-spacing:-.01em;">“Be still, and know that I am God.”</div>
          <div style="font-weight:800;margin-top:12px;opacity:.92;">Psalm 46:10</div>
          <div class="row" style="gap:10px;margin-top:18px;">
            ${['Reflect','Share','Save'].map(t=>`<div style="background:rgba(255,255,255,.2);padding:9px 16px;border-radius:999px;font-size:13px;font-weight:700;">${t}</div>`).join('')}
          </div>
        </div>
      </div>

      <div style="font-size:18px;font-weight:800;margin:24px 0 13px;letter-spacing:-.01em;">How is your heart? 💭</div>
      <div class="row jb">
        ${moods.map(([e,l],i)=>{const c=['indigo','mint','amber','coral','mut'][i];return `<div style="text-align:center;"><div style="width:58px;height:58px;border-radius:20px;background:var(--${c}-s,#ECEFF8);display:flex;align-items:center;justify-content:center;font-size:27px;${i===0?'outline:3px solid var(--indigo);outline-offset:2px;':''}">${e}</div><div class="mut" style="font-size:11px;font-weight:700;margin-top:8px;">${l}</div></div>`;}).join('')}
      </div>

      <div class="row jb" style="margin:26px 0 13px;align-items:center;"><div style="font-size:18px;font-weight:800;letter-spacing:-.01em;">Today’s rhythm</div>
        <div style="background:var(--mint-s);color:var(--mint);font-size:12px;font-weight:800;padding:5px 11px;border-radius:999px;">2 of 3 ✓</div></div>
      <div class="card" style="padding:8px 18px;">
        ${rhythm.map(([i,t,s,done],idx)=>{const c=['indigo','coral','amber'][idx];return `<div class="row" style="gap:14px;padding:14px 0;${idx<2?'border-bottom:1px solid #EEF1FA;':''}align-items:center;">
          <div style="width:38px;height:38px;border-radius:13px;background:var(--${c}-s);color:var(--${c});display:flex;align-items:center;justify-content:center;">${done?ic('check',19,2.6):ic(i,19,2)}</div>
          <div style="flex:1;"><div style="font-weight:700;font-size:15px;${done?'color:var(--mut);text-decoration:line-through;':''}">${t}</div>${!done?`<div class="mut" style="font-size:12px;font-weight:600;">${s}</div>`:''}</div>
          ${!done?`<span class="mut">${ic('chev',18,2.2)}</span>`:''}
        </div>`;}).join('')}
      </div>
    </div>
    ${navBloom('Today')}
  `,
  journal: `
    <div class="status-wrap">${statusbar('#1B2240')}</div>
    <div class="pad">
      <div class="row jb" style="margin-top:6px;align-items:center;"><div style="font-size:30px;font-weight:800;letter-spacing:-.02em;">Journal</div>
        <div style="width:46px;height:46px;border-radius:16px;background:#fff;box-shadow:0 8px 20px -12px rgba(40,52,110,.4);display:flex;align-items:center;justify-content:center;color:var(--indigo);">${ic('search',20,2)}</div></div>
      <div class="row" style="gap:9px;margin:16px 0;">
        <div style="background:var(--indigo);color:#fff;padding:9px 16px;border-radius:999px;font-size:13px;font-weight:800;">All</div>
        ${['Grateful','At peace','Heavy','Verse'].map(t=>`<div style="background:#fff;color:var(--mut);padding:9px 16px;border-radius:999px;font-size:13px;font-weight:700;">${t}</div>`).join('')}
      </div>
      <div class="row" style="gap:12px;margin-bottom:16px;">
        ${[['48','entries','indigo'],['12','streak','coral'],['6','this week','amber']].map(([n,l,c])=>`<div class="card" style="flex:1;padding:15px;"><div style="font-size:27px;font-weight:800;color:var(--${c});letter-spacing:-.02em;">${n}</div><div class="mut" style="font-size:12px;font-weight:700;margin-top:2px;">${l}</div></div>`).join('')}
      </div>
      ${entries.map(([e,t,b,v,d],idx)=>{const c=['indigo','amber','coral'][idx];return `<div class="card" style="padding:16px;margin-bottom:13px;">
        <div class="row" style="gap:13px;align-items:flex-start;">
          <div style="width:44px;height:44px;border-radius:15px;background:var(--${c}-s);display:flex;align-items:center;justify-content:center;font-size:22px;">${e}</div>
          <div style="flex:1;min-width:0;">
            <div class="row jb"><div style="font-weight:800;font-size:16px;letter-spacing:-.01em;">${t}</div><div class="mut" style="font-size:12px;font-weight:700;">${d}</div></div>
            <div class="mut" style="font-size:13px;line-height:1.5;margin-top:4px;font-weight:500;">${b}</div>
            <div class="row" style="gap:7px;margin-top:11px;"><span style="display:inline-flex;gap:5px;align-items:center;font-size:11px;font-weight:800;padding:5px 11px;border-radius:999px;background:var(--indigo-s);color:var(--indigo);">${ic('book',12,2.2)} ${v}</span></div>
          </div>
        </div></div>`;}).join('')}
    </div>
    ${navBloom('Journal')}
  `,
};
function navBloom(active){return `<div class="nav navbar">${navItems.map(([i,l])=>{const on=l===active;return `<div class="navi" style="color:${on?'var(--indigo)':'#A6AEC6'}">${on?`<div style="background:var(--indigo-s);padding:7px 16px;border-radius:999px;margin-bottom:3px;">${ic(i,22,2.2)}</div>`:`<div style="padding:7px 0;">${ic(i,22,1.9)}</div>`}<span style="font-size:11px;font-weight:${on?'800':'600'};">${l}</span></div>`;}).join('')}</div>`;}

/* ---------- shared layout css ---------- */
const baseCSS = `
*{box-sizing:border-box;-webkit-font-smoothing:antialiased;margin:0;padding:0;}
body{width:${W}px;height:${H}px;overflow:hidden;}
.screen{width:${W}px;height:${H}px;position:relative;display:flex;flex-direction:column;overflow:hidden;}
.status{height:50px;display:flex;align-items:flex-end;justify-content:space-between;padding:0 24px 7px;font-size:15px;font-weight:600;}
.sbicons{display:flex;gap:7px;align-items:center;}
.pad{flex:1;padding:4px 20px 0;overflow:hidden;}
.row{display:flex;align-items:center;}.jb{justify-content:space-between;}
.navbar{height:84px;display:flex;justify-content:space-around;align-items:flex-start;padding:12px 6px 0;}
.navi{display:flex;flex-direction:column;align-items:center;gap:5px;width:64px;}
svg{display:block;}
`;

/* ---- NOCTURNE: prayer + bible ---- */
nocturne.prayer = `
  <div class="status-wrap">${statusbar('#EAF0FF')}</div>
  <div class="pad">
    <div class="row jb" style="margin-top:6px;"><div class="display" style="font-size:31px;font-weight:600;">Prayer</div>
      <div class="panel" style="width:46px;height:46px;border-radius:15px;display:flex;align-items:center;justify-content:center;color:#9FB0E0;">${ic('plus',22,2)}</div></div>
    <div class="row" style="gap:9px;margin:16px 0;">
      <div class="grad" style="padding:9px 16px;border-radius:999px;font-size:13px;font-weight:700;color:#fff;">Active · 6</div>
      <div class="panel mut" style="padding:9px 16px;border-radius:999px;font-size:13px;font-weight:600;">Answered · 8</div>
    </div>
    <div class="panel" style="padding:0;overflow:hidden;position:relative;margin-bottom:18px;">
      <div class="grad" style="position:absolute;inset:0;opacity:.18;"></div>
      <div style="position:relative;padding:18px 20px;display:flex;align-items:center;justify-content:space-between;">
        <div><div class="gradtext" style="font-size:11px;font-weight:800;letter-spacing:2px;">GUIDED SESSION</div>
          <div class="display" style="font-size:20px;font-weight:600;margin-top:6px;">Pray through A.C.T.S.</div>
          <div class="mut" style="font-size:12px;margin-top:3px;">Adoration · Confession · Thanks</div></div>
        <div class="grad" style="width:46px;height:46px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;">${icf('play',18)}</div>
      </div>
    </div>
    ${prayersData.map(([t,s,n,done])=>`<div class="panel" style="padding:15px;margin-bottom:11px;">
      <div class="row jb"><div style="font-weight:600;font-size:16px;">${t}</div><div class="mut row" style="gap:5px;font-size:12px;font-weight:600;"><span style="color:#FF7A98">${icf('heart',13)}</span>${n}</div></div>
      <div class="mut" style="font-size:12px;margin-top:3px;">${s}</div>
      <div class="row" style="gap:14px;margin-top:12px;align-items:center;">
        <div class="${done?'':'grad'}" style="padding:8px 16px;border-radius:999px;font-size:13px;font-weight:700;${done?'background:rgba(45,224,200,.16);color:#48E6C8;':'color:#fff;'}">${done?'✓ Prayed today':'Pray now'}</div>
        <div class="mut" style="font-size:13px;font-weight:600;">Mark answered</div>
      </div>
    </div>`).join('')}
  </div>
  ${navDark('Pray')}
`;
nocturne.bible = `
  <div class="status-wrap">${statusbar('#EAF0FF')}</div>
  <div class="pad">
    <div class="row jb" style="margin-top:6px;align-items:center;">
      <div class="display row" style="font-size:24px;font-weight:600;gap:8px;align-items:center;">Psalm 23 <span class="mut">${ic('chev',20)}</span></div>
      <div class="panel" style="padding:9px 14px;border-radius:999px;font-size:12px;font-weight:700;">NIV</div>
    </div>
    <div style="font-family:'Newsreader',serif;font-size:21px;line-height:1.95;margin-top:22px;color:#D9E2F7;">
      ${bibleLines.map(([n,t,hl])=>`<p style="margin:0 0 16px;"><sup class="mut" style="font-size:12px;font-family:Inter;">${n}</sup> ${hl?t.replace('quiet waters',`<span class="grad" style="-webkit-background-clip:text;background-clip:text;color:transparent;font-style:italic;">quiet waters</span>`):t}</p>`).join('')}
    </div>
  </div>
  <div class="panel" style="position:absolute;left:20px;right:20px;bottom:98px;padding:13px;border-radius:24px;display:flex;justify-content:space-around;">
    ${[['bookmark','Highlight'],['note','Note'],['heart','Pray'],['play','Listen'],['share','Share']].map(([i,l])=>`<div style="display:flex;flex-direction:column;align-items:center;gap:5px;color:#AFC0EA;">${ic(i,20)}<span style="font-size:11px;font-weight:600;">${l}</span></div>`).join('')}
  </div>
  ${navDark('Bible')}
`;

/* ---- QUIET: prayer + bible ---- */
quiet.prayer = `
  <div class="status-wrap">${statusbar('#16160F')}</div>
  <div class="pad" style="padding-left:26px;padding-right:26px;">
    <div class="row jb" style="margin-top:12px;align-items:center;"><div class="serif" style="font-size:34px;">Prayer</div><span class="mut">${ic('plus',22)}</span></div>
    <div class="row" style="gap:24px;margin-top:18px;border-bottom:1px solid var(--line);">
      ${['Active','Answered'].map((t,i)=>`<div style="font-size:14px;font-weight:${i===0?600:500};padding-bottom:12px;${i===0?'border-bottom:1.5px solid var(--ever);margin-bottom:-1px;':'color:var(--mut);'}">${t}</div>`).join('')}
    </div>
    <div style="margin-top:20px;border:1px solid var(--line);border-radius:18px;padding:18px;display:flex;align-items:center;justify-content:space-between;">
      <div><div class="kick">Guided session</div><div class="serif" style="font-size:21px;margin-top:7px;">Pray through A.C.T.S.</div></div>
      <span style="color:var(--ever)">${icf('play',22)}</span>
    </div>
    ${prayersData.map(([t,s,n,done])=>`<div style="padding:19px 0;border-bottom:1px solid var(--line);">
       <div class="row jb" style="align-items:baseline;"><div class="serif" style="font-size:20px;">${t}</div><div class="kick">${n} prayers</div></div>
       <div class="row jb" style="margin-top:11px;align-items:center;">
         <div class="mut" style="font-size:13px;">${s}</div>
         <div style="font-size:13px;font-weight:600;color:${done?'var(--mut)':'var(--ever)'};">${done?'✓ Prayed today':'Pray now →'}</div>
       </div>
    </div>`).join('')}
  </div>
  ${navQuiet('Pray')}
`;
quiet.bible = `
  <div class="status-wrap">${statusbar('#16160F')}</div>
  <div class="pad" style="padding-left:26px;padding-right:26px;">
    <div class="row jb" style="margin-top:12px;align-items:baseline;"><div class="serif" style="font-size:31px;">Psalm 23</div><div class="kick">NIV · ${'▾'}</div></div>
    <div class="rule" style="margin:20px 0;"></div>
    <div class="serif" style="font-size:21px;line-height:2.0;">
      ${bibleLines.map(([n,t,hl])=>`<p style="margin:0 0 16px;"><sup class="mut" style="font-size:12px;font-family:Inter;">${n}</sup> ${hl?t.replace('quiet waters',`<span style="box-shadow:inset 0 -11px 0 rgba(34,57,47,.14);">quiet waters</span>`):t}</p>`).join('')}
    </div>
  </div>
  <div style="position:absolute;left:26px;right:26px;bottom:100px;border-top:1px solid var(--line);padding-top:16px;display:flex;justify-content:space-between;color:var(--mut);font-size:13px;font-weight:500;">
    <span>Highlight</span><span>Note</span><span>Pray</span><span>Listen</span><span>Share</span>
  </div>
  ${navQuiet('Bible')}
`;

/* ---- BLOOM: prayer + bible ---- */
bloom.prayer = `
  <div class="status-wrap">${statusbar('#1B2240')}</div>
  <div class="pad">
    <div class="row jb" style="margin-top:6px;align-items:center;"><div style="font-size:30px;font-weight:800;letter-spacing:-.02em;">Prayer</div>
      <div style="width:46px;height:46px;border-radius:16px;background:#fff;box-shadow:0 8px 20px -12px rgba(40,52,110,.4);display:flex;align-items:center;justify-content:center;color:var(--indigo);">${ic('plus',22,2.2)}</div></div>
    <div class="row" style="gap:9px;margin:16px 0;">
      <div style="background:var(--indigo);color:#fff;padding:9px 16px;border-radius:999px;font-size:13px;font-weight:800;">Active · 6</div>
      <div style="background:#fff;color:var(--mut);padding:9px 16px;border-radius:999px;font-size:13px;font-weight:700;">Answered · 8</div>
    </div>
    <div class="card" style="padding:18px;margin-bottom:16px;background:linear-gradient(135deg,#19C9A0,#0FB6C4);color:#fff;display:flex;align-items:center;justify-content:between;gap:12px;">
      <div style="flex:1;"><div style="font-size:11px;font-weight:800;letter-spacing:1.4px;opacity:.9;">GUIDED SESSION</div>
        <div style="font-size:20px;font-weight:800;margin-top:6px;letter-spacing:-.01em;">Pray through A.C.T.S.</div></div>
      <div style="width:46px;height:46px;border-radius:50%;background:rgba(255,255,255,.25);display:flex;align-items:center;justify-content:center;">${icf('play',18)}</div>
    </div>
    ${prayersData.map(([t,s,n,done],i)=>{const c=['indigo','coral','amber'][i];return `<div class="card" style="padding:16px;margin-bottom:12px;">
      <div class="row" style="gap:13px;align-items:stretch;">
        <div style="width:5px;border-radius:999px;background:var(--${c});"></div>
        <div style="flex:1;">
          <div class="row jb"><div style="font-weight:800;font-size:16px;letter-spacing:-.01em;">${t}</div><div style="color:var(--coral);font-size:12px;font-weight:800;display:flex;gap:4px;align-items:center;">${icf('heart',13)} ${n}</div></div>
          <div class="mut" style="font-size:12px;font-weight:700;margin-top:3px;">${s}</div>
          <div class="row" style="gap:12px;margin-top:12px;align-items:center;">
            <div style="padding:8px 16px;border-radius:999px;font-size:13px;font-weight:800;${done?'background:var(--mint-s);color:var(--mint);':'background:var(--indigo);color:#fff;'}">${done?'✓ Prayed today':'Pray now'}</div>
            <div class="mut" style="font-size:13px;font-weight:700;">Mark answered</div>
          </div>
        </div>
      </div></div>`;}).join('')}
  </div>
  ${navBloom('Pray')}
`;
bloom.bible = `
  <div class="status-wrap">${statusbar('#1B2240')}</div>
  <div class="pad">
    <div class="row jb" style="margin-top:6px;align-items:center;">
      <div class="row" style="gap:8px;align-items:center;font-size:24px;font-weight:800;letter-spacing:-.02em;">Psalm 23 <span class="mut">${ic('chev',20,2.2)}</span></div>
      <div style="background:var(--indigo-s);color:var(--indigo);padding:9px 15px;border-radius:999px;font-size:12px;font-weight:800;">NIV</div>
    </div>
    <div style="font-family:'Newsreader',serif;font-size:21px;line-height:1.95;margin-top:20px;color:#2A3150;">
      ${bibleLines.map(([n,t,hl])=>`<p style="margin:0 0 15px;"><sup style="color:var(--mut);font-size:12px;font-family:'Plus Jakarta Sans';font-weight:700;">${n}</sup> ${hl?t.replace('quiet waters',`<span style="background:var(--indigo-s);color:var(--indigo);border-radius:8px;padding:1px 6px;">quiet waters</span>`):t}</p>`).join('')}
    </div>
  </div>
  <div class="card" style="position:absolute;left:20px;right:20px;bottom:98px;padding:13px;border-radius:24px;display:flex;justify-content:space-around;">
    ${[['bookmark','Highlight','amber'],['note','Note','mint'],['heart','Pray','coral'],['play','Listen','indigo'],['share','Share','mut']].map(([i,l,c])=>`<div style="display:flex;flex-direction:column;align-items:center;gap:5px;color:var(--${c});"><div>${ic(i,20,2)}</div><span style="font-size:11px;font-weight:700;color:var(--ink);">${l}</span></div>`).join('')}
  </div>
  ${navBloom('Bible')}
`;

const dirs = [nocturne, quiet, bloom];
const html = (dir, body) => `<!doctype html><html><head><meta charset="utf-8"><style>${FONTS}</style><style>${baseCSS}${dir.css}</style></head><body><div class="screen">${body}</div></body></html>`;

const browser = await puppeteer.launch({ headless:'new', args:['--no-sandbox','--disable-setuid-sandbox','--font-render-hinting=none'] });
const page = await browser.newPage();
await page.setViewport({ width:W, height:H, deviceScaleFactor:3 });
for (const dir of dirs) {
  for (const screen of ['today','journal','prayer','bible']) {
    const doc = html(dir, dir[screen]);
    await page.setContent(doc, { waitUntil:'load' });
    await page.evaluate(async()=>{await document.fonts.ready;});
    await new Promise(r=>setTimeout(r,300));
    await page.screenshot({ path: resolve(OUT, `${dir.id}-${screen}.png`) });
    console.log('rendered', dir.id, screen);
  }
}
await browser.close();
console.log('DONE');

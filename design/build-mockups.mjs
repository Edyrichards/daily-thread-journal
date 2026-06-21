// Selah — mockup generator
// Renders every screen of the redesigned app to crisp phone-sized PNGs.
// Usage: node design/build-mockups.mjs
import puppeteer from 'puppeteer';
import { writeFileSync, mkdirSync, readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PNG = resolve(__dirname, 'mockups/png');
const OUT_HTML = resolve(__dirname, 'mockups/html');
mkdirSync(OUT_PNG, { recursive: true });
mkdirSync(OUT_HTML, { recursive: true });

const W = 402, H = 874; // logical phone size (iPhone 15-ish)

/* ----------------------------- design system ----------------------------- */
const CSS = `
:root{
  --bg:#F7F1E7;            /* warm ivory */
  --bg2:#F1E8D8;
  --surface:#FFFDF8;
  --surface2:#FBF5EA;
  --ink:#2C2622;          /* warm near-black */
  --ink2:#5A5048;
  --muted:#9A8F82;
  --line:#ECE2D2;
  --sage:#6E8E70;         /* calm primary */
  --sage-soft:#E4ECDF;
  --clay:#C26B4A;         /* warm terracotta CTA */
  --clay-soft:#F4DDD1;
  --gold:#D7A33E;         /* streak / highlight */
  --gold-soft:#F6E8C8;
  --plum:#7A6A86;
  --sky:#86A6C0;
}
*{box-sizing:border-box;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;}
html,body{margin:0;padding:0;}
body{width:${W}px;height:${H}px;overflow:hidden;background:var(--bg);
  font-family:'Inter',system-ui,sans-serif;color:var(--ink);}
.serif{font-family:'Fraunces','Georgia',serif;}
.screen{position:relative;width:${W}px;height:${H}px;background:var(--bg);overflow:hidden;display:flex;flex-direction:column;}
.dark{--bg:#211C26;--bg2:#1A1620;--surface:#2A2430;--surface2:#322B39;--ink:#F3ECE0;--ink2:#CBC0D2;--muted:#9D92A8;--line:#3A3342;--sage-soft:#2E3A30;--clay-soft:#43302A;--gold-soft:#3E3320;}
.dark.screen{background:var(--bg);}

/* status bar */
.status{height:52px;display:flex;align-items:flex-end;justify-content:space-between;padding:0 24px 6px;font-size:15px;font-weight:600;color:var(--ink);flex:0 0 auto;}
.status .r{display:flex;gap:7px;align-items:center;}
.status svg{display:block;}

/* content */
.body{flex:1 1 auto;overflow:hidden;padding:4px 20px 0;}
.body.flush{padding:0;}

/* nav */
.nav{flex:0 0 auto;height:88px;background:var(--surface);border-top:1px solid var(--line);
  display:flex;justify-content:space-around;align-items:flex-start;padding:12px 8px 0;}
.nav .t{display:flex;flex-direction:column;align-items:center;gap:5px;font-size:11px;font-weight:600;color:var(--muted);width:64px;}
.nav .t.on{color:var(--clay);}
.nav .t svg{width:24px;height:24px;}

/* bits */
.h1{font-size:30px;font-weight:600;letter-spacing:-.5px;line-height:1.05;}
.kicker{font-size:12px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:var(--muted);}
.card{background:var(--surface);border:1px solid var(--line);border-radius:24px;padding:18px;}
.soft{color:var(--ink2);}
.muted{color:var(--muted);}
.row{display:flex;align-items:center;}
.btn{display:flex;align-items:center;justify-content:center;gap:8px;background:var(--clay);color:#fff;
  font-weight:700;font-size:16px;border-radius:18px;padding:16px;border:none;}
.btn.ghost{background:transparent;color:var(--ink2);border:1px solid var(--line);}
.btn.sage{background:var(--sage);}
.pill{display:inline-flex;align-items:center;gap:6px;background:var(--surface2);border:1px solid var(--line);
  border-radius:999px;padding:8px 13px;font-size:13px;font-weight:600;color:var(--ink2);}
.pill.on{background:var(--clay-soft);border-color:transparent;color:var(--clay);}
.dot{width:9px;height:9px;border-radius:50%;}
.ring{--p:70;width:46px;height:46px;border-radius:50%;
  background:conic-gradient(var(--sage) calc(var(--p)*1%),var(--sage-soft) 0);
  display:flex;align-items:center;justify-content:center;}
.ring i{width:34px;height:34px;border-radius:50%;background:var(--surface);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;font-style:normal;color:var(--sage);}
.avatar{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,var(--clay),var(--gold));color:#fff;font-weight:700;display:flex;align-items:center;justify-content:center;font-size:15px;}
.fab{position:absolute;right:22px;bottom:104px;width:60px;height:60px;border-radius:22px;background:var(--clay);
  box-shadow:0 12px 24px rgba(194,107,74,.4);display:flex;align-items:center;justify-content:center;}
.tagchip{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:700;padding:5px 10px;border-radius:999px;background:var(--sage-soft);color:var(--sage);}
.grad-dawn{background:linear-gradient(150deg,#E9B98A 0%,#C26B4A 45%,#7A6A86 100%);}
.grad-sage{background:linear-gradient(150deg,#8FB089 0%,#6E8E70 100%);}
.grad-vesper{background:radial-gradient(120% 90% at 50% 18%,#3a2f49 0%,#241d2d 55%,#171320 100%);}
.shadow{box-shadow:0 10px 30px rgba(60,45,30,.08);}
`;

/* --------------------------------- icons --------------------------------- */
const I = {
  sun:`<circle cx="12" cy="12" r="4.5"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5 5l1.4 1.4M17.6 17.6 19 19M19 5l-1.4 1.4M6.4 17.6 5 19"/>`,
  pencil:`<path d="M4 20h4l10-10a2.1 2.1 0 0 0-3-3L5 17v3Z"/><path d="M13.5 6.5l3 3"/>`,
  heart:`<path d="M12 20s-7-4.4-9.3-8.4C1.2 9 2.4 5.6 5.6 5.6c1.9 0 3.2 1.1 4 2.2.8-1.1 2.1-2.2 4-2.2 3.2 0 4.4 3.4 2.9 6C19 15.6 12 20 12 20Z"/>`,
  bookopen:`<path d="M12 6c-1.6-1.2-3.8-1.8-6-1.8-1 0-1.8.2-1.8.2v13s.8-.2 1.8-.2c2.2 0 4.4.6 6 1.8M12 6c1.6-1.2 3.8-1.8 6-1.8 1 0 1.8.2 1.8.2v13s-.8-.2-1.8-.2c-2.2 0-4.4.6-6 1.8M12 6v13"/>`,
  chart:`<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>`,
  flame:`<path d="M12 3c.5 3-2.5 4-2.5 7.5A2.5 2.5 0 0 0 12 13a2.5 2.5 0 0 0 2.5-2.5C14.5 9 13 9 13.5 7c2 1.5 3.5 3.6 3.5 6a5 5 0 1 1-10 0c0-3.4 3-5 5-10Z"/>`,
  bell:`<path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z"/><path d="M10 19a2 2 0 0 0 4 0"/>`,
  gear:`<circle cx="12" cy="12" r="3.2"/><path d="M19.4 13.5a7.6 7.6 0 0 0 0-3l1.8-1.4-1.8-3.1-2.2.9a7.6 7.6 0 0 0-2.6-1.5L12 2H8.4l-.4 2.4a7.6 7.6 0 0 0-2 1.5l-2.2-.9-1.8 3.1L3.8 9.5a7.6 7.6 0 0 0 0 3l-1.8 1.4 1.8 3.1 2.2-.9c.6.6 1.3 1.1 2 1.5L8.4 22H12l.4-2.4c.9-.4 1.8-.9 2.6-1.5l2.2.9 1.8-3.1-1.6-1.3Z"/>`,
  search:`<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>`,
  plus:`<path d="M12 5v14M5 12h14"/>`,
  chev:`<path d="m9 6 6 6-6 6"/>`,
  share:`<path d="M12 15V4M8 8l4-4 4 4M5 13v6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-6"/>`,
  bookmark:`<path d="M6 4h12v16l-6-4-6 4V4Z"/>`,
  mic:`<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>`,
  check:`<path d="m4 12 5 5L20 6"/>`,
  play:`<path d="M7 5l12 7-12 7V5Z"/>`,
  hands:`<path d="M12 21c-3-1-7-4-7-8V7l3 1 4-3 4 3 3-1v6c0 4-4 7-7 8Z"/><path d="M12 8v9"/>`,
  sparkle:`<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/>`,
  lock:`<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>`,
  users:`<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3 2.7-5 6-5s6 2 6 5"/><path d="M16 5.2A3.2 3.2 0 0 1 16 11M21 20c0-2.4-1.4-4.2-3.5-4.8"/>`,
  award:`<circle cx="12" cy="9" r="5.2"/><path d="M9 13.5 7.5 21l4.5-2.4L16.5 21 15 13.5"/>`,
  feather:`<path d="M20 4S9 5 6 12c-1 2.4-1 5-1 5l9-9M5 19l6-6"/>`,
  quote:`<path d="M7 7h4v6c0 2-1.5 3.5-3.5 4M14 7h4v6c0 2-1.5 3.5-3.5 4" />`,
};
const ic = (n, w=24, sw=1.9, color='currentColor') =>
  `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${I[n]}</svg>`;
const icf = (n, w=24, color='currentColor') => // filled
  `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="${color}" stroke="none">${I[n]}</svg>`;

/* ----------------------------- shared chrome ----------------------------- */
const status = (dark=false) => {
  const c = dark ? '#F3ECE0' : '#2C2622';
  return `<div class="status">
    <div>9:41</div>
    <div class="r">
      <svg width="18" height="12" viewBox="0 0 18 12" fill="${c}"><rect x="0" y="7" width="3" height="5" rx="1"/><rect x="5" y="4.5" width="3" height="7.5" rx="1"/><rect x="10" y="2" width="3" height="10" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg>
      <svg width="17" height="12" viewBox="0 0 17 12" fill="none" stroke="${c}" stroke-width="1.6"><path d="M1 4.5C3.5 2 5.8 1 8.5 1S13.5 2 16 4.5"/><path d="M3.5 7C5 5.6 6.7 5 8.5 5s3.5.6 5 2"/><circle cx="8.5" cy="9.6" r="1.1" fill="${c}" stroke="none"/></svg>
      <svg width="26" height="13" viewBox="0 0 26 13" fill="none"><rect x="1" y="1" width="21" height="11" rx="3" stroke="${c}" stroke-width="1.4" opacity=".5"/><rect x="3" y="3" width="15" height="7" rx="1.5" fill="${c}"/><rect x="23.5" y="4.5" width="1.6" height="4" rx="1" fill="${c}"/></svg>
    </div>
  </div>`;
};

const tabs = [
  ['Today','sun'], ['Journal','pencil'], ['Pray','heart'], ['Bible','bookopen'], ['Insights','chart'],
];
const nav = (active) => `<div class="nav">${tabs.map(([label,icon])=>{
  const on = label===active;
  return `<div class="t ${on?'on':''}">${ic(icon,24,on?2.1:1.8)}<span>${label}</span></div>`;
}).join('')}</div>`;

/* ------------------------------- screens --------------------------------- */
const screens = [];
const add = (id, opts, body) => screens.push({ id, opts, body });

/* 01 — Onboarding ---------------------------------------------------------- */
add('01-welcome', { full:true }, `
<div class="screen grad-dawn" style="color:#fff;padding:0;justify-content:space-between;">
  ${status(true)}
  <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 36px;">
    <div style="width:96px;height:96px;border-radius:30px;background:rgba(255,255,255,.16);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;margin-bottom:30px;border:1px solid rgba(255,255,255,.25);">
      <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"><rect x="6" y="4" width="4" height="16" rx="2"/><rect x="14" y="4" width="4" height="16" rx="2"/></svg>
    </div>
    <div class="serif" style="font-size:54px;font-weight:600;letter-spacing:-1px;">Selah</div>
    <div style="font-size:17px;font-weight:600;letter-spacing:3px;opacity:.9;margin-top:6px;">PAUSE · PRAY · REFLECT</div>
    <p class="serif" style="font-size:21px;line-height:1.5;opacity:.95;margin-top:30px;font-weight:400;">A calm, private space to meet<br/>with God — one quiet<br/>moment a day.</p>
  </div>
  <div style="padding:0 28px 46px;">
    <div style="display:flex;gap:8px;justify-content:center;margin-bottom:26px;">
      <div style="width:26px;height:6px;border-radius:3px;background:#fff;"></div>
      <div style="width:6px;height:6px;border-radius:3px;background:rgba(255,255,255,.45);"></div>
      <div style="width:6px;height:6px;border-radius:3px;background:rgba(255,255,255,.45);"></div>
    </div>
    <div class="btn" style="background:#fff;color:var(--clay);">Begin your journey</div>
    <div style="text-align:center;margin-top:18px;font-weight:600;opacity:.9;font-size:15px;">I already have an account</div>
  </div>
</div>`);

/* 02 — Home / Today -------------------------------------------------------- */
add('02-today', { active:'Today' }, `
<div class="row" style="justify-content:space-between;margin:6px 0 16px;">
  <div>
    <div class="muted" style="font-size:13px;font-weight:600;">Saturday, June 21</div>
    <div class="h1 serif" style="margin-top:2px;">Good morning,<br/>Ed</div>
  </div>
  <div class="row" style="gap:10px;">
    <div class="pill" style="gap:5px;color:var(--gold);background:var(--gold-soft);border:none;font-weight:700;">${icf('flame',16,'var(--gold)')} 12</div>
    <div class="avatar">E</div>
  </div>
</div>

<div class="card grad-dawn shadow" style="color:#fff;border:none;padding:22px;position:relative;overflow:hidden;">
  <div style="position:absolute;right:-30px;top:-30px;width:140px;height:140px;border-radius:50%;background:rgba(255,255,255,.12);"></div>
  <div class="kicker" style="color:rgba(255,255,255,.85);">Verse of the day</div>
  <div class="serif" style="font-size:23px;line-height:1.45;margin-top:12px;font-weight:500;">“Be still, and know that I am God.”</div>
  <div style="font-weight:700;margin-top:12px;opacity:.92;">Psalm 46:10</div>
  <div class="row" style="gap:18px;margin-top:18px;">
    <div class="row" style="gap:6px;font-size:13px;font-weight:600;">${ic('bookmark',17)} Save</div>
    <div class="row" style="gap:6px;font-size:13px;font-weight:600;">${ic('feather',17)} Reflect</div>
    <div class="row" style="gap:6px;font-size:13px;font-weight:600;">${ic('share',17)} Share</div>
  </div>
</div>

<div style="margin-top:20px;">
  <div class="serif" style="font-size:18px;font-weight:600;margin-bottom:11px;">How is your heart today?</div>
  <div class="row" style="justify-content:space-between;">
    ${[['😌','At peace','var(--sage-soft)'],['😊','Grateful','var(--gold-soft)'],['😟','Anxious','var(--clay-soft)'],['😢','Heavy','#E2E9EF'],['😶','Numb','var(--surface2)']].map(([e,l,bg])=>
      `<div style="text-align:center;"><div style="width:54px;height:54px;border-radius:18px;background:${bg};display:flex;align-items:center;justify-content:center;font-size:26px;">${e}</div><div style="font-size:11px;font-weight:600;color:var(--ink2);margin-top:6px;">${l}</div></div>`).join('')}
  </div>
</div>

<div style="margin-top:22px;">
  <div class="row" style="justify-content:space-between;margin-bottom:11px;">
    <div class="serif" style="font-size:18px;font-weight:600;">Today’s rhythm</div>
    <div class="muted" style="font-size:13px;font-weight:600;">2 of 3</div>
  </div>
  <div class="card" style="padding:8px 16px;">
    ${[['check','Read — Psalms, Day 4','done','var(--sage)'],['check','Pray — 3 requests','done','var(--sage)'],['feather','Journal your reflection','todo','var(--muted)']].map(([icn,t,st,col],i)=>
      `<div class="row" style="gap:13px;padding:13px 0;${i<2?'border-bottom:1px solid var(--line);':''}">
        <div style="width:30px;height:30px;border-radius:10px;background:${st==='done'?'var(--sage-soft)':'var(--surface2)'};display:flex;align-items:center;justify-content:center;">${ic(st==='done'?'check':icn,17,2.2,col)}</div>
        <div style="flex:1;font-weight:600;font-size:15px;${st==='done'?'color:var(--muted);text-decoration:line-through;':''}">${t}</div>
        ${st==='todo'?ic('chev',18,2,'var(--muted)'):''}
      </div>`).join('')}
  </div>
</div>`);

/* 03 — Journal library ----------------------------------------------------- */
add('03-journal', { active:'Journal', fab:true }, `
<div class="row" style="justify-content:space-between;margin:6px 0 14px;">
  <div class="h1 serif">Journal</div>
  <div style="width:44px;height:44px;border-radius:14px;background:var(--surface);border:1px solid var(--line);display:flex;align-items:center;justify-content:center;">${ic('search',20,1.9,'var(--ink2)')}</div>
</div>
<div class="row" style="gap:9px;margin-bottom:16px;overflow:hidden;">
  <div class="pill on">All</div><div class="pill">Gratitude</div><div class="pill">Prayer</div><div class="pill">Verse</div><div class="pill">Voice</div>
</div>
<div class="row" style="gap:12px;margin-bottom:14px;">
  <div class="card" style="flex:1;padding:14px;"><div class="serif" style="font-size:26px;font-weight:600;color:var(--clay);">48</div><div class="muted" style="font-size:12px;font-weight:600;">entries</div></div>
  <div class="card" style="flex:1;padding:14px;"><div class="serif" style="font-size:26px;font-weight:600;color:var(--sage);">12</div><div class="muted" style="font-size:12px;font-weight:600;">day streak</div></div>
  <div class="card" style="flex:1;padding:14px;"><div class="serif" style="font-size:26px;font-weight:600;color:var(--gold);">6</div><div class="muted" style="font-size:12px;font-weight:600;">this week</div></div>
</div>
${[
  ['Jun 20','😌','var(--sage)','Resting in His timing','Lord, I keep trying to force doors open. Today I felt You asking me to wait and trust…','Psalm 27:14','Voice'],
  ['Jun 18','😊','var(--gold)','Grateful for small mercies','Three things I’m thankful for: the call with Mom, sunlight this morning, and…','Phil 4:6','Gratitude'],
  ['Jun 16','😟','var(--clay)','Wrestling with work','Anxious about the review. Brought it to God instead of spiraling. He reminded me…','Matt 6:34',''],
].map(([d,e,col,title,body,verse,tag])=>`
  <div class="card" style="margin-bottom:12px;padding:16px;">
    <div class="row" style="gap:12px;">
      <div style="width:40px;height:40px;border-radius:13px;background:var(--surface2);display:flex;align-items:center;justify-content:center;font-size:21px;">${e}</div>
      <div style="flex:1;">
        <div class="row" style="justify-content:space-between;">
          <div class="serif" style="font-size:17px;font-weight:600;">${title}</div>
          <div class="muted" style="font-size:12px;font-weight:600;">${d}</div>
        </div>
        <div class="soft" style="font-size:13px;line-height:1.5;margin-top:4px;">${body}</div>
        <div class="row" style="gap:8px;margin-top:10px;">
          <span class="tagchip">${ic('bookopen',12,2)} ${verse}</span>
          ${tag?`<span class="tagchip" style="background:var(--clay-soft);color:var(--clay);">${tag}</span>`:''}
        </div>
      </div>
    </div>
  </div>`).join('')}
`);

/* 04 — New entry (guided write step) -------------------------------------- */
add('04-new-entry', {}, `
<div class="row" style="justify-content:space-between;margin:6px 0 18px;">
  <div style="width:40px;height:40px;border-radius:13px;background:var(--surface);border:1px solid var(--line);display:flex;align-items:center;justify-content:center;transform:rotate(180deg);">${ic('chev',20,2,'var(--ink2)')}</div>
  <div class="muted" style="font-weight:700;font-size:13px;">New entry</div>
  <div class="pill" style="color:var(--muted);">Save draft</div>
</div>
<div class="row" style="gap:6px;margin-bottom:22px;">
  ${['Mood','Verse','Write','Reflect'].map((s,i)=>`<div style="flex:1;"><div style="height:5px;border-radius:3px;background:${i<3?'var(--clay)':'var(--line)'};"></div><div style="font-size:11px;font-weight:700;margin-top:6px;color:${i<3?'var(--clay)':'var(--muted)'};">${s}</div></div>`).join('')}
</div>

<div class="row" style="gap:8px;margin-bottom:16px;">
  <span class="pill on" style="font-size:13px;">😌 At peace</span>
  <span class="tagchip" style="padding:8px 11px;">${ic('bookopen',13,2)} Psalm 46:10</span>
</div>

<div class="serif" style="font-size:25px;font-weight:600;line-height:1.25;margin-bottom:14px;">What’s on your heart<br/>right now?</div>

<div class="card" style="padding:18px;min-height:236px;">
  <p class="serif" style="font-size:17px;line-height:1.6;color:var(--ink);margin:0;">This week has felt loud. So many decisions pulling at me. But sitting here, “be still” keeps echoing. I don’t have to figure it all out today — I just have to be present with You<span style="border-left:2px solid var(--clay);margin-left:1px;animation:none;">&nbsp;</span></p>
  <div class="muted" style="font-size:12px;font-weight:600;margin-top:14px;">142 words · saved</div>
</div>

<div class="row" style="justify-content:space-between;margin-top:18px;">
  <div class="row" style="gap:10px;">
    ${['mic','bookopen','quote'].map(n=>`<div style="width:48px;height:48px;border-radius:15px;background:var(--surface);border:1px solid var(--line);display:flex;align-items:center;justify-content:center;">${ic(n,21,1.9,'var(--ink2)')}</div>`).join('')}
    <div style="width:48px;height:48px;border-radius:15px;background:var(--clay-soft);display:flex;align-items:center;justify-content:center;color:var(--clay);font-size:13px;font-weight:700;">AI</div>
  </div>
  <div class="btn" style="padding:14px 26px;">Continue ${ic('chev',18,2.2,'#fff')}</div>
</div>
<div class="row" style="gap:8px;margin-top:14px;background:var(--sage-soft);padding:12px 14px;border-radius:16px;">
  ${ic('mic',18,2,'var(--sage)')}<div style="font-size:13px;font-weight:600;color:var(--sage);">Tap to speak — Selah will transcribe your prayer.</div>
</div>`);

/* 05 — Prayer ------------------------------------------------------------- */
add('05-prayer', { active:'Pray' }, `
<div class="row" style="justify-content:space-between;margin:6px 0 16px;">
  <div class="h1 serif">Prayer</div>
  <div style="width:44px;height:44px;border-radius:14px;background:var(--surface);border:1px solid var(--line);display:flex;align-items:center;justify-content:center;">${ic('plus',22,2,'var(--ink2)')}</div>
</div>
<div class="row" style="gap:8px;margin-bottom:16px;">
  <div class="pill on">Active · 6</div><div class="pill">Answered · 8</div><div class="pill">Lifting up</div>
</div>

<div class="card grad-sage shadow" style="color:#fff;border:none;padding:20px;margin-bottom:16px;">
  <div class="row" style="justify-content:space-between;align-items:flex-start;">
    <div>
      <div class="kicker" style="color:rgba(255,255,255,.85);">Guided session</div>
      <div class="serif" style="font-size:21px;font-weight:600;margin-top:6px;">Pray through A.C.T.S.</div>
      <div style="opacity:.9;font-size:13px;margin-top:4px;">Adoration · Confession · Thanks · Supplication</div>
    </div>
    <div style="width:48px;height:48px;border-radius:50%;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;">${icf('play',20,'#fff')}</div>
  </div>
</div>

<div class="serif" style="font-size:18px;font-weight:600;margin-bottom:11px;">My prayer list</div>
${[
  ['Mom’s health','Praying 9 days','var(--clay)',true,'14'],
  ['Wisdom for the job decision','Praying 4 days','var(--sage)',false,'3'],
  ['Patience with the kids','Praying 21 days','var(--gold)',false,'7'],
].map(([t,sub,col,done,n])=>`
  <div class="card" style="margin-bottom:11px;padding:15px;">
    <div class="row" style="gap:13px;">
      <div style="width:5px;height:40px;border-radius:3px;background:${col};"></div>
      <div style="flex:1;">
        <div class="row" style="justify-content:space-between;">
          <div style="font-weight:700;font-size:16px;">${t}</div>
          <div class="row" style="gap:5px;color:var(--muted);font-size:12px;font-weight:600;">${icf('heart',13,'var(--clay)')} ${n}</div>
        </div>
        <div class="muted" style="font-size:12px;font-weight:600;margin-top:3px;">${sub}</div>
      </div>
      <div style="width:38px;height:38px;border-radius:12px;background:${done?'var(--sage-soft)':'var(--surface2)'};display:flex;align-items:center;justify-content:center;">${ic('check',19,2.2,done?'var(--sage)':'var(--muted)')}</div>
    </div>
  </div>`).join('')}

<div class="card" style="background:var(--gold-soft);border:none;padding:16px;display:flex;align-items:center;gap:13px;">
  ${icf('sparkle',26,'var(--gold)')}
  <div style="flex:1;"><div style="font-weight:700;font-size:15px;">8 prayers answered this year</div><div class="soft" style="font-size:13px;">Look back and give thanks →</div></div>
</div>`);

/* 06 — Guided prayer (immersive) ------------------------------------------ */
add('06-guided-prayer', { full:true }, `
<div class="screen dark grad-vesper" style="color:#F3ECE0;padding:0;justify-content:space-between;">
  ${status(true)}
  <div class="row" style="justify-content:space-between;padding:6px 24px;">
    <div style="font-weight:700;opacity:.7;">✕</div>
    <div style="font-weight:700;letter-spacing:1px;font-size:13px;opacity:.8;">A.C.T.S · STEP 1 OF 4</div>
    <div style="font-weight:700;opacity:.7;">${ic('share',19,2,'#F3ECE0')}</div>
  </div>
  <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 40px;">
    <div style="width:200px;height:200px;border-radius:50%;background:radial-gradient(circle at 38% 35%,rgba(215,163,62,.65),rgba(194,107,74,.25) 60%,transparent 72%);display:flex;align-items:center;justify-content:center;margin-bottom:40px;">
      <div style="width:130px;height:130px;border-radius:50%;background:radial-gradient(circle at 40% 35%,#F3D58A,#C26B4A);box-shadow:0 0 60px rgba(215,163,62,.5);"></div>
    </div>
    <div style="font-size:13px;font-weight:700;letter-spacing:3px;opacity:.7;">ADORATION</div>
    <div class="serif" style="font-size:27px;line-height:1.45;font-weight:500;margin-top:16px;">Praise God for who He is.<br/>Begin simply: “Father, You are…”</div>
    <div class="serif" style="font-size:15px;opacity:.7;margin-top:22px;font-style:italic;">“Holy, holy, holy is the Lord Almighty.” — Isaiah 6:3</div>
  </div>
  <div style="padding:0 28px 42px;">
    <div style="height:4px;border-radius:2px;background:rgba(255,255,255,.18);margin-bottom:8px;"><div style="width:32%;height:4px;border-radius:2px;background:var(--gold);"></div></div>
    <div class="row" style="justify-content:space-between;font-size:12px;opacity:.7;font-weight:600;margin-bottom:24px;"><span>1:12</span><span>breathe slowly</span><span>3:30</span></div>
    <div class="btn" style="background:rgba(255,255,255,.14);backdrop-filter:blur(4px);">Continue to Confession ${ic('chev',18,2.2,'#fff')}</div>
  </div>
</div>`);

/* 07 — Bible reader ------------------------------------------------------- */
add('07-bible', { active:'Bible' }, `
<div class="row" style="justify-content:space-between;margin:6px 0 18px;">
  <div class="row" style="gap:8px;align-items:center;">
    <div class="serif" style="font-size:24px;font-weight:600;">Psalm 23</div>
    ${ic('chev',20,2.2,'var(--ink2)')}
  </div>
  <div class="row" style="gap:10px;">
    <div class="pill" style="font-weight:700;">NIV</div>
    <div style="width:40px;height:40px;border-radius:13px;background:var(--surface);border:1px solid var(--line);display:flex;align-items:center;justify-content:center;">${ic('search',19,1.9,'var(--ink2)')}</div>
  </div>
</div>

<div style="font-family:'Fraunces',serif;font-size:20px;line-height:1.85;color:var(--ink);">
  <p style="margin:0 0 16px;"><sup style="color:var(--muted);font-size:12px;font-family:Inter;">1</sup> The Lord is my shepherd, I lack nothing.</p>
  <p style="margin:0 0 16px;"><sup style="color:var(--muted);font-size:12px;font-family:Inter;">2</sup> He makes me lie down in green pastures, he leads me beside <span style="background:var(--gold-soft);border-radius:6px;padding:1px 4px;box-shadow:0 0 0 4px var(--gold-soft);">quiet waters,</span></p>
  <p style="margin:0 0 16px;"><sup style="color:var(--muted);font-size:12px;font-family:Inter;">3</sup> he refreshes my soul. He guides me along the right paths for his name’s sake.</p>
  <p style="margin:0 0 16px;"><sup style="color:var(--muted);font-size:12px;font-family:Inter;">4</sup> Even though I walk through the darkest valley, I will fear no evil, for you are with me.</p>
</div>

<div class="card" style="background:var(--sage-soft);border:none;padding:14px 16px;margin-top:6px;display:flex;gap:11px;align-items:flex-start;">
  ${ic('feather',19,2,'var(--sage)')}
  <div><div style="font-weight:700;font-size:14px;color:var(--sage);">Your note · v2</div><div class="serif" style="font-size:15px;color:var(--ink2);margin-top:2px;">“Quiet waters” — I need this kind of rest.</div></div>
</div>

<div class="card shadow" style="position:absolute;left:20px;right:20px;bottom:104px;padding:10px;display:flex;justify-content:space-around;border-radius:22px;">
  ${[['bookmark','Highlight','var(--gold)'],['feather','Note','var(--sage)'],['hands','Pray','var(--clay)'],['play','Listen','var(--plum)'],['share','Share','var(--ink2)']].map(([n,l,c])=>
    `<div style="display:flex;flex-direction:column;align-items:center;gap:5px;width:62px;">${ic(n,21,1.9,c)}<span style="font-size:11px;font-weight:600;color:var(--ink2);">${l}</span></div>`).join('')}
</div>`);

/* 08 — Plans & devotionals ------------------------------------------------ */
add('08-grow', { active:'Bible' }, `
<div class="h1 serif" style="margin:6px 0 4px;">Grow</div>
<div class="muted" style="font-weight:600;font-size:14px;margin-bottom:18px;">Plans & devotionals for your season</div>

<div class="card grad-dawn shadow" style="color:#fff;border:none;padding:20px;margin-bottom:18px;position:relative;overflow:hidden;">
  <div style="position:absolute;right:-20px;bottom:-30px;width:130px;height:130px;border-radius:50%;background:rgba(255,255,255,.12);"></div>
  <div class="tagchip" style="background:rgba(255,255,255,.2);color:#fff;">Featured · 7 days</div>
  <div class="serif" style="font-size:24px;font-weight:600;margin-top:12px;">Finding Peace in Anxiety</div>
  <div style="opacity:.9;font-size:14px;margin-top:6px;line-height:1.5;">A week of scripture & prayer for an overwhelmed heart.</div>
  <div class="btn" style="background:#fff;color:var(--clay);margin-top:16px;padding:13px;">Start plan</div>
</div>

<div class="serif" style="font-size:18px;font-weight:600;margin-bottom:11px;">Continue reading</div>
${[['Psalms in 30 Days','Day 4 of 30',13,'var(--sage)'],['The Gospel of John','Day 9 of 21',43,'var(--clay)']].map(([t,sub,p,c])=>`
  <div class="card" style="margin-bottom:11px;padding:15px;">
    <div class="row" style="justify-content:space-between;margin-bottom:10px;"><div style="font-weight:700;font-size:15px;">${t}</div><div class="muted" style="font-size:12px;font-weight:600;">${sub}</div></div>
    <div style="height:7px;border-radius:4px;background:var(--surface2);"><div style="width:${p}%;height:7px;border-radius:4px;background:${c};"></div></div>
  </div>`).join('')}

<div class="serif" style="font-size:18px;font-weight:600;margin:18px 0 11px;">Explore series</div>
<div class="row" style="gap:12px;">
  ${[['Gratitude','21 days','grad-sage'],['Rest & Sabbath','5 days','grad-vesper'],['Hope','7 days','grad-dawn']].map(([t,d,g])=>`
    <div style="flex:1;"><div class="${g}" style="height:96px;border-radius:18px;"></div><div style="font-weight:700;font-size:14px;margin-top:8px;">${t}</div><div class="muted" style="font-size:12px;font-weight:600;">${d}</div></div>`).join('')}
</div>`);

/* 09 — Insights ----------------------------------------------------------- */
add('09-insights', { active:'Insights' }, `
<div class="h1 serif" style="margin:6px 0 4px;">Insights</div>
<div class="muted" style="font-weight:600;font-size:14px;margin-bottom:18px;">June · your month of reflection</div>

<div class="card" style="padding:18px;margin-bottom:16px;">
  <div class="row" style="justify-content:space-between;margin-bottom:14px;"><div style="font-weight:700;font-size:15px;">Mood trend</div><div class="muted" style="font-size:12px;font-weight:600;">Last 30 days</div></div>
  <svg width="100%" height="92" viewBox="0 0 320 92" preserveAspectRatio="none">
    <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6E8E70" stop-opacity=".35"/><stop offset="1" stop-color="#6E8E70" stop-opacity="0"/></linearGradient></defs>
    <path d="M0 64 C40 60 50 38 80 40 C120 43 130 70 165 58 C200 47 210 22 250 28 C285 33 300 18 320 22 L320 92 L0 92 Z" fill="url(#g)"/>
    <path d="M0 64 C40 60 50 38 80 40 C120 43 130 70 165 58 C200 47 210 22 250 28 C285 33 300 18 320 22" fill="none" stroke="#6E8E70" stroke-width="3" stroke-linecap="round"/>
    <circle cx="320" cy="22" r="4.5" fill="#6E8E70"/>
  </svg>
  <div class="row" style="justify-content:space-between;margin-top:8px;font-size:11px;font-weight:600;color:var(--muted);"><span>Jun 1</span><span>Jun 10</span><span>Jun 20</span></div>
</div>

<div class="card" style="background:var(--clay-soft);border:none;padding:18px;margin-bottom:16px;">
  <div class="row" style="gap:9px;margin-bottom:10px;">${icf('sparkle',20,'var(--clay)')}<div style="font-weight:700;font-size:15px;color:var(--clay);">Selah noticed</div></div>
  <div class="serif" style="font-size:18px;line-height:1.5;color:var(--ink);">You’ve written about <b>peace</b> and <b>work stress</b> often this month — yet your entries grow calmer after prayer. Psalm 46 keeps returning to you.</div>
  <div class="row" style="gap:8px;margin-top:14px;flex-wrap:wrap;">
    <span class="pill" style="background:#fff;border:none;">#peace</span><span class="pill" style="background:#fff;border:none;">#work</span><span class="pill" style="background:#fff;border:none;">#gratitude</span><span class="pill" style="background:#fff;border:none;">#family</span>
  </div>
</div>

<div class="row" style="gap:12px;">
  ${[['12','Day streak','var(--gold)','flame'],['8','Prayers answered','var(--sage)','check'],['19','Days in the Word','var(--clay)','bookopen']].map(([n,l,c,i])=>`
    <div class="card" style="flex:1;padding:16px 12px;text-align:center;">
      <div style="display:inline-flex;width:40px;height:40px;border-radius:13px;background:var(--surface2);align-items:center;justify-content:center;margin-bottom:8px;">${ic(i,20,2,c)}</div>
      <div class="serif" style="font-size:26px;font-weight:600;color:${c};">${n}</div>
      <div class="muted" style="font-size:11px;font-weight:600;">${l}</div>
    </div>`).join('')}
</div>`);

/* 10 — Community / Prayer wall -------------------------------------------- */
add('10-community', { active:'Pray', fab:true }, `
<div class="row" style="justify-content:space-between;margin:6px 0 6px;">
  <div class="h1 serif">Community</div>
  <div class="avatar" style="background:linear-gradient(135deg,var(--sage),var(--sky));">E</div>
</div>
<div class="muted" style="font-weight:600;font-size:13px;margin-bottom:16px;">A safe, moderated wall to carry each other’s burdens.</div>

<div class="card" style="background:var(--sage-soft);border:none;padding:14px 16px;margin-bottom:16px;display:flex;align-items:center;gap:12px;">
  ${icf('hands',26,'var(--sage)')}<div style="flex:1;"><div style="font-weight:700;font-size:14px;color:var(--sage);">2,418 prayers lifted today</div><div class="soft" style="font-size:12px;">You prayed for 5 people this week 🙏</div></div>
</div>

${[
  ['A','Anna','2h','Starting chemo on Monday. Please pray for peace and steady hands for my doctors.','142','7',true,'var(--clay)'],
  ['•','Anonymous','5h','Marriage feels distant lately. Praying God softens both our hearts.','89','12',false,'var(--plum)'],
  ['J','James','1d','Got the job! Thank you all who prayed last month — God is faithful. 🙌','310','24',false,'var(--sage)'],
].map(([in_,name,time,body,pr,cm,praying,col])=>`
  <div class="card" style="margin-bottom:12px;padding:16px;">
    <div class="row" style="gap:11px;margin-bottom:10px;">
      <div class="avatar" style="width:36px;height:36px;font-size:14px;background:${col};">${in_}</div>
      <div style="flex:1;"><div style="font-weight:700;font-size:14px;">${name}</div><div class="muted" style="font-size:12px;font-weight:600;">${time} ago</div></div>
      ${name==='James'?'<span class="tagchip" style="background:var(--gold-soft);color:var(--gold);">Answered ✨</span>':''}
    </div>
    <div class="serif" style="font-size:16px;line-height:1.5;color:var(--ink2);">${body}</div>
    <div class="row" style="gap:16px;margin-top:13px;">
      <div class="row" style="gap:6px;font-weight:700;font-size:13px;color:${praying?'var(--clay)':'var(--ink2)'};">${icf('heart',17,praying?'var(--clay)':'none')}${!praying?ic('heart',17,1.9,'var(--ink2)'):''} I prayed · ${pr}</div>
      <div class="row" style="gap:6px;font-weight:600;font-size:13px;color:var(--ink2);">${ic('quote',16,1.9)} ${cm}</div>
    </div>
  </div>`).join('')}
`);

/* 11 — Journey / achievements --------------------------------------------- */
add('11-journey', { active:'Insights' }, `
<div class="h1 serif" style="margin:6px 0 16px;">Your journey</div>

<div class="card grad-dawn shadow" style="color:#fff;border:none;padding:22px;text-align:center;margin-bottom:18px;position:relative;overflow:hidden;">
  <div style="position:absolute;left:-30px;top:-30px;width:120px;height:120px;border-radius:50%;background:rgba(255,255,255,.12);"></div>
  ${icf('flame',46,'#fff')}
  <div class="serif" style="font-size:52px;font-weight:600;line-height:1;margin-top:6px;">12</div>
  <div style="font-weight:700;letter-spacing:1px;opacity:.9;">DAY STREAK</div>
  <div class="row" style="justify-content:center;gap:9px;margin-top:18px;">
    ${['M','T','W','T','F','S','S'].map((d,i)=>`<div style="text-align:center;"><div style="width:30px;height:30px;border-radius:50%;background:${i<6?'rgba(255,255,255,.9)':'rgba(255,255,255,.25)'};display:flex;align-items:center;justify-content:center;color:${i<6?'var(--clay)':'#fff'};font-weight:700;font-size:12px;">${i<6?'✓':d}</div></div>`).join('')}
  </div>
</div>

<div class="card" style="padding:16px;margin-bottom:18px;">
  <div class="row" style="justify-content:space-between;margin-bottom:9px;"><div style="font-weight:700;font-size:15px;">Next milestone · 21-day reflection</div><div class="muted" style="font-weight:700;font-size:13px;">12/21</div></div>
  <div style="height:8px;border-radius:5px;background:var(--surface2);"><div style="width:57%;height:8px;border-radius:5px;background:var(--gold);"></div></div>
  <div class="soft" style="font-size:13px;margin-top:9px;">9 more days to unlock the <b>Steadfast</b> badge.</div>
</div>

<div class="serif" style="font-size:18px;font-weight:600;margin-bottom:13px;">Badges earned</div>
<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;">
  ${[['First Words','award','var(--clay)',1],['7-Day','flame','var(--gold)',1],['50 Prayers','hands','var(--sage)',1],['Book of John','bookopen','var(--plum)',1],['Answered','sparkle','var(--gold)',1],['Gratitude','heart','var(--clay)',1],['Early Bird','sun','var(--sky)',0],['Steadfast','check','var(--sage)',0]].map(([l,i,c,earned])=>`
    <div style="text-align:center;opacity:${earned?1:.4};">
      <div style="width:60px;height:60px;border-radius:20px;background:${earned?'var(--surface)':'var(--surface2)'};border:1px solid var(--line);display:flex;align-items:center;justify-content:center;margin:0 auto;">${earned?icf(i,26,c):ic('lock',22,2,'var(--muted)')}</div>
      <div style="font-size:10.5px;font-weight:600;margin-top:6px;color:var(--ink2);line-height:1.2;">${l}</div>
    </div>`).join('')}
</div>`);

/* 12 — Settings / profile ------------------------------------------------- */
add('12-settings', { active:'Today' }, `
<div class="h1 serif" style="margin:6px 0 18px;">Profile</div>
<div class="card" style="padding:18px;display:flex;align-items:center;gap:15px;margin-bottom:16px;">
  <div class="avatar" style="width:58px;height:58px;font-size:22px;border-radius:20px;">E</div>
  <div style="flex:1;"><div class="serif" style="font-size:20px;font-weight:600;">Ed Richards</div><div class="muted" style="font-size:13px;font-weight:600;">Member since Jan 2026 · 48 entries</div></div>
  ${ic('chev',20,2,'var(--muted)')}
</div>

<div class="card" style="background:var(--sage-soft);border:none;padding:16px;margin-bottom:16px;display:flex;gap:13px;align-items:flex-start;">
  ${ic('lock',22,2,'var(--sage)')}
  <div><div style="font-weight:700;font-size:15px;color:var(--sage);">Private by design</div><div class="soft" style="font-size:13px;line-height:1.5;margin-top:3px;">Your journals are encrypted on your device. We never read, share, or sell your reflections. Ever.</div></div>
</div>

<div class="card" style="padding:6px 16px;margin-bottom:16px;">
  ${[['bell','Daily reminder','8:00 AM',false],['bookopen','Bible translation','NIV',false],['sun','Appearance','Vespers',false],['hands','Prayer reminders','On',true]].map(([i,t,v,last],idx)=>`
    <div class="row" style="gap:13px;padding:14px 0;${!last?'border-bottom:1px solid var(--line);':''}">
      <div style="width:34px;height:34px;border-radius:11px;background:var(--surface2);display:flex;align-items:center;justify-content:center;">${ic(i,18,1.9,'var(--ink2)')}</div>
      <div style="flex:1;font-weight:600;font-size:15px;">${t}</div>
      <div class="muted" style="font-weight:600;font-size:14px;">${v}</div>
      ${ic('chev',18,2,'var(--muted)')}
    </div>`).join('')}
</div>

<div class="card grad-dawn shadow" style="color:#fff;border:none;padding:18px;display:flex;align-items:center;gap:14px;">
  ${icf('sparkle',30,'#fff')}
  <div style="flex:1;"><div class="serif" style="font-size:19px;font-weight:600;">Selah Plus</div><div style="opacity:.9;font-size:13px;">Audio plans, AI insights & themes. Journaling stays free, always.</div></div>
</div>
<div class="row" style="justify-content:center;gap:7px;margin-top:18px;color:var(--muted);font-size:13px;font-weight:600;">${ic('share',16,1.9,'var(--muted)')} Export all my data</div>
`);

/* -------------------------------- render --------------------------------- */
const FONTS = readFileSync(resolve(__dirname, 'fonts/fonts-inline.css'), 'utf8');
const head = `<!doctype html><html><head><meta charset="utf-8">
<style>${FONTS}</style><style>${CSS}</style></head><body>`;

const wrap = (s) => {
  if (s.opts.full) return head + s.body + `</body></html>`;
  const fab = s.opts.fab ? `<div class="fab">${ic('plus',26,2.4,'#fff')}</div>` : '';
  return head + `<div class="screen">${status(false)}<div class="body">${s.body}</div>${fab}${nav(s.opts.active||'')}</div></body></html>`;
};

const browser = await puppeteer.launch({ headless:'new', args:['--no-sandbox','--disable-setuid-sandbox','--font-render-hinting=none'] });
const page = await browser.newPage();
await page.setViewport({ width:W, height:H, deviceScaleFactor:3 });

for (const s of screens) {
  const html = wrap(s);
  writeFileSync(resolve(OUT_HTML, s.id + '.html'), html);
  await page.setContent(html, { waitUntil:'load' });
  await page.evaluate(async () => { await document.fonts.ready; });
  await new Promise(r => setTimeout(r, 250));
  await page.screenshot({ path: resolve(OUT_PNG, s.id + '.png') });
  console.log('rendered', s.id);
}
await browser.close();
console.log('DONE', screens.length, 'screens');

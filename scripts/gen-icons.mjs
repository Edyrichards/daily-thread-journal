import puppeteer from 'puppeteer';
import { resolve } from 'path';
const FEATHER = `<svg viewBox="0 0 24 24" fill="none" stroke="#F5F0E8" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
<path d="M20.5 4.5c-5.5-1-12 1.5-14.5 7C4.5 14.5 4.5 18 5 19.5"/><path d="M5.2 19.3 18 6.6"/>
<path d="M16.5 5.2 11 7M18.2 8.4 12.5 10.4M19 11.8 14 13.8M9.2 9.5 7.4 14.6M12.4 12.7 10.6 17.4"/></svg>`;
const page = (size, pad, bg) => `<!doctype html><html><head><style>
*{margin:0;padding:0;box-sizing:border-box}html,body{width:${size}px;height:${size}px;overflow:hidden}
.wrap{width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;${bg}}
svg{width:${size*(1-2*pad)}px;height:${size*(1-2*pad)}px}</style></head>
<body><div class="wrap">${FEATHER}</div></body></html>`;
const dawn = 'background:radial-gradient(circle at 38% 32%, #4a6b56, #2D4A3E 70%);';
const b = await puppeteer.launch({headless:'new',args:['--no-sandbox','--disable-setuid-sandbox']});
const p = await b.newPage();
const shots = [
  ['icon-512.png', 512, 0.26, dawn],
  ['icon-192.png', 192, 0.26, dawn],
  ['maskable-512.png', 512, 0.34, dawn],            // extra safe-zone padding
  ['adaptive-fg-432.png', 432, 0.30, 'background:transparent;'], // Android adaptive foreground
  ['apple-180.png', 180, 0.26, dawn],
];
for (const [name, size, pad, bg] of shots) {
  await p.setViewport({width:size, height:size, deviceScaleFactor:1});
  await p.goto('data:text/html,'+encodeURIComponent(page(size,pad,bg)));
  await new Promise(r=>setTimeout(r,150));
  await p.screenshot({path: resolve('public/icons', name), omitBackground: bg.includes('transparent')});
  console.log('icon', name);
}
await b.close();

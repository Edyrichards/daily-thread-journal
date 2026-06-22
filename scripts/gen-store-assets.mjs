import puppeteer from 'puppeteer';
import { resolve } from 'path';
const FEATHER = (stroke,sw=1.3)=>`<svg viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">
<path d="M20.5 4.5c-5.5-1-12 1.5-14.5 7C4.5 14.5 4.5 18 5 19.5"/><path d="M5.2 19.3 18 6.6"/>
<path d="M16.5 5.2 11 7M18.2 8.4 12.5 10.4M19 11.8 14 13.8M9.2 9.5 7.4 14.6M12.4 12.7 10.6 17.4"/></svg>`;
const doc=(size,bg,svg,svgPct)=>`<!doctype html><html><head><style>*{margin:0;box-sizing:border-box}
html,body{width:${size}px;height:${size}px;overflow:hidden}
.w{width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;${bg}}
svg{width:${size*svgPct}px;height:${size*svgPct}px}</style></head><body><div class="w">${svg}</div></body></html>`;
const fg='background:radial-gradient(circle at 40% 34%, #4a6b56, #2D4A3E 72%);';
const dk='background:radial-gradient(circle at 40% 34%, #2a4034, #1A1F1C 72%);';
const items=[
  ['assets/icon-foreground.png',1024,'background:transparent;',FEATHER('#F5F0E8'),0.46,true],
  ['assets/icon-background.png',1024,fg,'',0,false],
  ['assets/icon-only.png',1024,fg,FEATHER('#F5F0E8'),0.5,false],
  ['assets/splash.png',2732,fg,FEATHER('#F5F0E8'),0.2,false],
  ['assets/splash-dark.png',2732,dk,FEATHER('#EDE6D8'),0.2,false],
];
const b=await puppeteer.launch({headless:'new',args:['--no-sandbox','--disable-setuid-sandbox']});
const p=await b.newPage();
for(const [path,size,bg,svg,pct,transparent] of items){
  await p.setViewport({width:size,height:size,deviceScaleFactor:1});
  await p.goto('data:text/html,'+encodeURIComponent(doc(size,bg,svg,pct)));
  await new Promise(r=>setTimeout(r,150));
  await p.screenshot({path:resolve(path),omitBackground:transparent});
  console.log('asset',path);
}
await b.close();

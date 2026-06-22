// Build compact offline Bible assets (public domain: WEB + KJV) into public/bible/<trans>/<slug>.json
// Structure: { "<chapter>": { "<verse>": "text" } }
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const OUT = resolve(root, 'public/bible');

const BOOK_NAMES = [
  'Genesis','Exodus','Leviticus','Numbers','Deuteronomy','Joshua','Judges','Ruth','1 Samuel','2 Samuel',
  '1 Kings','2 Kings','1 Chronicles','2 Chronicles','Ezra','Nehemiah','Esther','Job','Psalms','Proverbs',
  'Ecclesiastes','Song of Solomon','Isaiah','Jeremiah','Lamentations','Ezekiel','Daniel','Hosea','Joel','Amos',
  'Obadiah','Jonah','Micah','Nahum','Habakkuk','Zephaniah','Haggai','Zechariah','Malachi','Matthew',
  'Mark','Luke','John','Acts','Romans','1 Corinthians','2 Corinthians','Galatians','Ephesians','Philippians',
  'Colossians','1 Thessalonians','2 Thessalonians','1 Timothy','2 Timothy','Titus','Philemon','Hebrews','James','1 Peter',
  '2 Peter','1 John','2 John','3 John','Jude','Revelation',
];
const slug = (n) => n.toLowerCase().replace(/\s+/g, '');
const clean = (s) => s.replace(/\s+/g, ' ').trim();
const write = (trans, name, data) => {
  const dir = resolve(OUT, trans);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(resolve(dir, `${slug(name)}.json`), JSON.stringify(data));
};

/* ---------------- WEB ---------------- */
const webDir = resolve(root, 'node_modules/world-english-bible/json');
let webVerses = 0;
for (const name of BOOK_NAMES) {
  const items = JSON.parse(readFileSync(resolve(webDir, `${slug(name)}.json`), 'utf8'));
  const book = {};
  for (const it of items) {
    if ((it.type === 'paragraph text' || it.type === 'line text') && it.verseNumber && it.value) {
      const c = String(it.chapterNumber), v = String(it.verseNumber);
      (book[c] ||= {});
      book[c][v] = book[c][v] ? `${book[c][v]} ${it.value}` : it.value;
    }
  }
  for (const c of Object.keys(book)) for (const v of Object.keys(book[c])) { book[c][v] = clean(book[c][v]); webVerses++; }
  write('web', name, book);
}
console.log('WEB done —', webVerses, 'verses');

/* ---------------- KJV ---------------- */
const kjvRes = resolve(root, 'node_modules/bible-kjv/dist/resources');
const kjvBooks = JSON.parse(readFileSync(resolve(root, 'node_modules/bible-kjv/dist/content/books.json'), 'utf8'));
// Remove footnote blocks entirely, keep italic supplied-word text, drop remaining markers.
const stripTags = (s) => s.replace(/<RF>[\s\S]*?<Rf>/g, '').replace(/<[^>]*>/g, '');
let kjvVerses = 0;
kjvBooks.forEach((b, bi) => {
  const name = BOOK_NAMES[bi];
  const book = {};
  for (let c = 1; c <= b.chapters; c++) {
    const arr = JSON.parse(readFileSync(resolve(kjvRes, `${bi + 1}/${c}.json`), 'utf8'));
    book[String(c)] = {};
    arr.forEach((txt, vi) => { book[String(c)][String(vi + 1)] = clean(stripTags(txt)); kjvVerses++; });
  }
  write('kjv', name, book);
});
console.log('KJV done —', kjvVerses, 'verses');
console.log('Assets written to', OUT);

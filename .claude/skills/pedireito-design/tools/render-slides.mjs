// Renderiza cada .slide em PNG 1080×1350 (1:1) clonando-o pra fora do container preview
import puppeteer from 'puppeteer';
import { mkdirSync } from 'node:fs';

const HTML = process.argv[2];
const OUT = process.argv[3];
mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 1100, height: 1400, deviceScaleFactor: 1 });
await page.goto(`file://${HTML}`, { waitUntil: 'networkidle0' });

// pega só os slides do track (não os thumbnails)
const count = await page.evaluate(() => {
  return document.querySelectorAll('#track > .slide-holder').length;
});
console.log(`carrossel tem ${count} slides`);

for (let i = 0; i < count; i++) {
  // injeta um clone limpo do slide-N em 1080×1350 no body, fora do device
  await page.evaluate((idx) => {
    document.querySelectorAll('.iso-render').forEach(n => n.remove());
    const orig = document.querySelectorAll('#track > .slide-holder')[idx].querySelector('.slide');
    const origBg = orig.style.backgroundImage; // preserva inline background
    const clone = orig.cloneNode(true);
    clone.style.cssText = `position:fixed;top:0;left:0;width:1080px;height:1350px;transform:none;z-index:99999;${origBg ? `background-image:${origBg};background-size:cover;background-position:center;` : ''}`;
    clone.classList.add('iso-render');
    document.body.appendChild(clone);
  }, i);

  await new Promise(r => setTimeout(r, 400));
  const el = await page.$('.iso-render');
  const file = `${OUT}/slide-${String(i + 1).padStart(2, '0')}.png`;
  await el.screenshot({ path: file });
  console.log(`exportado: ${file}`);
}

await browser.close();

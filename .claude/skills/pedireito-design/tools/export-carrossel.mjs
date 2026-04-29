// Pé Direito · export completo de carrossel (PNGs + MP4s + ZIP)
//
// Uso:
//   node export-carrossel.mjs <HTML_PATH> [--out=DIR] [--duration=8]
//
// Workflow:
//   1. Identifica quais slides têm <video> e quais são estáticos.
//   2. Renderiza PNGs de TODOS os slides via puppeteer (slides com vídeo capturam frame estático
//      como fallback — o mp4 é o que vale pra entrega).
//   3. Pra cada slide com <video>: renderiza mp4 via render-video.mjs.
//   4. Empacota PNGs (dos estáticos) + MP4s (dos com vídeo) num único ZIP.
//
// Saída (relativo a --out, default = pasta do HTML):
//   <slug>-export/
//     ├── pedireito-slide-01.png
//     ├── pedireito-slide-02.png
//     ├── ...
//     ├── pedireito-slide-05.mp4    ← em vez do PNG, no slot do slide com vídeo
//     └── ...
//   <slug>-export.zip                ← zip do diretório acima

import puppeteer from 'puppeteer';
import { execFileSync } from 'node:child_process';
import { mkdirSync, copyFileSync, rmSync, readFileSync } from 'node:fs';
import { join, dirname, resolve, basename } from 'node:path';

const args = process.argv.slice(2);
if (args.length < 1) {
  console.error('uso: node export-carrossel.mjs <HTML_PATH> [--out=DIR] [--duration=8]');
  process.exit(1);
}

const HTML = resolve(args[0]);
const opts = Object.fromEntries(args.slice(1).map(a => a.replace(/^--/, '').split('=')));
const DURATION = Number(opts.duration || 8);
const slug = basename(dirname(HTML));
const OUT_DIR = resolve(opts.out || dirname(HTML), `${slug}-export`);

console.log(`[1/5] iniciando export do carrossel: ${slug}`);
mkdirSync(OUT_DIR, { recursive: true });

// abre o HTML e identifica slides com vídeo
const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 1500, deviceScaleFactor: 1 });
await page.goto(`file://${HTML}`, { waitUntil: 'networkidle0' });

const slidesInfo = await page.evaluate(() => {
  const holders = document.querySelectorAll('#track > .slide-holder');
  return [...holders].map((h, i) => {
    const slide = h.querySelector('.slide');
    const v = slide?.querySelector('video source');
    return { idx: i, hasVideo: !!v, videoSrc: v?.getAttribute('src') || null };
  });
});

console.log(`     carrossel tem ${slidesInfo.length} slides`);
const videoSlides = slidesInfo.filter(s => s.hasVideo);
console.log(`     ${videoSlides.length} slide(s) com vídeo: ${videoSlides.map(s => s.idx + 1).join(', ') || '—'}`);

// 2) renderiza PNGs de TODOS os slides (estáticos + frame placeholder pros com vídeo)
console.log(`[2/5] renderizando PNGs de slides estáticos...`);
for (const s of slidesInfo) {
  const num = String(s.idx + 1).padStart(2, '0');
  if (s.hasVideo) {
    // pula PNG dos slides com vídeo — vamos exportar só o mp4
    continue;
  }
  await page.evaluate((idx) => {
    document.querySelectorAll('.iso-render').forEach(x => x.remove());
    const src = document.querySelectorAll('#track > .slide-holder')[idx].querySelector('.slide');
    const c = src.cloneNode(true);
    c.style.cssText = 'position:fixed;top:0;left:0;width:1080px;height:1350px;transform:none;z-index:99999';
    c.classList.add('iso-render');
    document.body.appendChild(c);
  }, s.idx);
  await new Promise(r => setTimeout(r, 100));
  const el = await page.$('.iso-render');
  const file = join(OUT_DIR, `pedireito-slide-${num}.png`);
  await el.screenshot({ path: file });
  console.log(`     ✓ ${basename(file)}`);
}

await browser.close();

// 3) renderiza MP4s dos slides com vídeo (via render-video.mjs já testado)
console.log(`[3/5] renderizando MP4s dos slides com vídeo...`);
const renderVideoPath = '/tmp/pedireito-review/render-video.mjs';

for (const s of videoSlides) {
  const num = String(s.idx + 1).padStart(2, '0');
  const out = join(OUT_DIR, `pedireito-slide-${num}.mp4`);
  console.log(`     gerando slide-${num}.mp4 (slide ${s.idx + 1})...`);
  execFileSync('node', [
    renderVideoPath,
    HTML,
    out,
    `--slide=${s.idx + 1}`,
    `--duration=${DURATION}`,
  ], { stdio: ['ignore', 'pipe', 'inherit'] });
  console.log(`     ✓ ${basename(out)}`);
}

// 4a) bake dos mp4s em base64 → pedireito-videos-inline.js (na pasta do HTML do carrossel)
//     pra o botão "BAIXAR TUDO" do browser funcionar em file:// (sem servidor http)
if (videoSlides.length > 0) {
  console.log(`[4a/5] bakeando mp4s em base64 inline pro botão browser funcionar em file://...`);
  // copia mp4s pra pasta do HTML (caso ainda não estejam) — bake-videos.mjs lê de lá
  for (const s of videoSlides) {
    const num = String(s.idx + 1).padStart(2, '0');
    const src = join(OUT_DIR, `pedireito-slide-${num}.mp4`);
    const dst = join(dirname(HTML), `pedireito-slide-${num}.mp4`);
    try { copyFileSync(src, dst); } catch (_) {}
  }
  const bakePath = '/tmp/pedireito-review/bake-videos.mjs';
  execFileSync('node', [bakePath, dirname(HTML)], { stdio: 'inherit' });
}

// 4b) zipa
console.log(`[4b/5] empacotando ZIP...`);
const zipPath = `${OUT_DIR}.zip`;
try { rmSync(zipPath); } catch (_) {}
execFileSync('zip', ['-rq', zipPath, basename(OUT_DIR)], { cwd: dirname(OUT_DIR), stdio: 'inherit' });

// 5) report
const sizeBytes = readFileSync(zipPath).length;
const sizeMB = (sizeBytes / 1024 / 1024).toFixed(2);
console.log(`[5/5] done.`);
console.log(``);
console.log(`  📦 ${zipPath}`);
console.log(`     ${slidesInfo.length - videoSlides.length} PNG(s) + ${videoSlides.length} MP4(s) · ${sizeMB} MB`);
console.log(``);

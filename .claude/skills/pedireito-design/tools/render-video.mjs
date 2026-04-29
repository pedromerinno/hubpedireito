// Pé Direito · pipeline de export de post-vídeo (mp4)
//
// Uso:
//   node render-video.mjs <HTML_INPUT> <MP4_OUTPUT> [--duration=6] [--video=path] [--slide=N]
//
// Modos:
//   - Post único: o HTML tem um único .canvas com <video> de fundo. Não passe --slide.
//   - Slide de carrossel: o HTML tem múltiplos #track > .slide-holder. Passe --slide=N (1-indexed)
//     pra isolar e exportar só aquele slide como mp4.
//
// Como funciona:
//   1. Puppeteer abre o HTML, isola o canvas/slide alvo, esconde o <video>, mantém overlay+texto
//   2. Screenshot transparent (1080×1350) → overlay.png
//   3. ffmpeg compõe: vídeo de fundo (loop) + overlay PNG → mp4 final
//
// Vantagem dessa abordagem (vs frame-by-frame):
//   ~10× mais rápido. Fidelidade tipográfica 100% (CSS preservado). Funciona pra texto estático.
//   Pra texto animado, usar render-video-animated.mjs (futuro).

import puppeteer from 'puppeteer';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('uso: node render-video.mjs <HTML_INPUT> <MP4_OUTPUT> [--duration=6] [--video=path] [--slide=N]');
  process.exit(1);
}

const HTML = resolve(args[0]);
const OUT = resolve(args[1]);
const opts = Object.fromEntries(args.slice(2).map(a => a.replace(/^--/, '').split('=')));
const DURATION = Number(opts.duration || 6);
const VIDEO_OVERRIDE = opts.video ? resolve(opts.video) : null;
const SLIDE_IDX = opts.slide ? Number(opts.slide) - 1 : null;

const tmp = mkdtempSync(join(tmpdir(), 'pdvideo-'));
const overlay = join(tmp, 'overlay.png');

console.log(`[1/3] renderizando overlay PNG transparente...`);

const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 1500, deviceScaleFactor: 1 });
await page.goto(`file://${HTML}`, { waitUntil: 'networkidle0' });

// detectar caminho do vídeo de fundo a partir do HTML
const videoSrc = VIDEO_OVERRIDE ? null : await page.evaluate((idx) => {
  let target;
  if (idx !== null) {
    const holders = document.querySelectorAll('#track > .slide-holder');
    target = holders[idx]?.querySelector('.slide') || document.querySelectorAll('.slide')[idx];
  } else {
    target = document.querySelector('.canvas') || document.querySelector('.slide');
  }
  const el = target?.querySelector('.bg-video source, video source');
  return el?.getAttribute('src');
}, SLIDE_IDX);

if (!VIDEO_OVERRIDE && !videoSrc) {
  console.error(`nenhum <video> de fundo encontrado${SLIDE_IDX !== null ? ` no slide ${SLIDE_IDX + 1}` : ''}`);
  process.exit(1);
}
const videoAbs = VIDEO_OVERRIDE || resolve(dirname(HTML), videoSrc);

// preparar canvas pra screenshot transparente
await page.evaluate((idx) => {
  document.documentElement.style.background = 'transparent';
  document.body.style.background = 'transparent';
  document.body.style.padding = '0';
  document.body.style.margin = '0';
  let canvas;
  if (idx !== null) {
    const holders = document.querySelectorAll('#track > .slide-holder');
    canvas = holders[idx]?.querySelector('.slide') || document.querySelectorAll('.slide')[idx];
  } else {
    canvas = document.querySelector('.canvas') || document.querySelector('.slide');
  }
  canvas.style.transform = 'none';
  canvas.style.marginBottom = '0';
  canvas.style.background = 'transparent';
  // esconder o vídeo (preserva overlay + content)
  const v = canvas.querySelector('video');
  if (v) v.style.display = 'none';
  // levar canvas pro topo do body pra screenshot limpa
  document.body.innerHTML = '';
  document.body.appendChild(canvas);
}, SLIDE_IDX);

await new Promise(r => setTimeout(r, 200));
const canvasEl = await page.$('.canvas, .slide');
await canvasEl.screenshot({ path: overlay, omitBackground: true });

await browser.close();
console.log(`      overlay salvo em ${overlay}`);

console.log(`[2/3] compondo vídeo + overlay com ffmpeg...`);
mkdirSync(dirname(OUT), { recursive: true });

// ffmpeg compose: loop video bg + scale/crop pra 1080×1350 + overlay PNG
const filter = '[0:v]scale=1080:1350:force_original_aspect_ratio=increase,crop=1080:1350,setsar=1[bg];[bg][1:v]overlay=0:0[v]';

execFileSync('ffmpeg', [
  '-y',
  '-stream_loop', '-1',
  '-i', videoAbs,
  '-i', overlay,
  '-filter_complex', filter,
  '-map', '[v]',
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '22',
  '-pix_fmt', 'yuv420p',
  '-movflags', '+faststart',
  '-r', '30',
  '-t', String(DURATION),
  '-an',
  OUT,
], { stdio: ['ignore', 'inherit', 'inherit'] });

console.log(`[3/3] exportado: ${OUT}`);

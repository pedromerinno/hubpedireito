// Pé Direito · "bake" dos mp4s pré-gerados em base64 num arquivo .js auxiliar
//
// Por quê: em file:// o browser bloqueia fetch de arquivos locais. Embedando os mp4s como
// data URL num <script> auxiliar, o botão "BAIXAR TUDO" funciona em qualquer origem (inclusive
// abrindo o HTML direto sem servidor).
//
// Uso:
//   node bake-videos.mjs <PASTA_DO_CARROSSEL>
//   # Lê todos os pedireito-slide-NN.mp4 e gera pedireito-videos-inline.js
//
// O HTML do carrossel já tem suporte a esse arquivo (carrega sob demanda no clique).

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, resolve, basename } from 'node:path';

const DIR = resolve(process.argv[2] || '.');

const mp4s = readdirSync(DIR)
  .filter(f => /^pedireito-slide-\d+\.mp4$/.test(f))
  .sort();

if (mp4s.length === 0) {
  console.error(`nenhum mp4 encontrado em ${DIR} (espera arquivos pedireito-slide-NN.mp4)`);
  process.exit(1);
}

console.log(`bakeando ${mp4s.length} mp4(s) → base64...`);

const map = {};
let totalBytes = 0;
for (const f of mp4s) {
  const num = Number(f.match(/(\d+)/)[1]);
  const buf = readFileSync(join(DIR, f));
  const b64 = buf.toString('base64');
  map[num] = `data:video/mp4;base64,${b64}`;
  totalBytes += buf.length;
  console.log(`  ✓ ${f} → slot ${num} (${(buf.length / 1024 / 1024).toFixed(2)} MB)`);
}

const outPath = join(DIR, 'pedireito-videos-inline.js');
const content =
`/* Auto-gerado pelo bake-videos.mjs · NÃO editar manualmente.
   ${mp4s.length} mp4(s) embutido(s) como data URL pra o botão BAIXAR TUDO funcionar em file://.
   Total: ${(totalBytes / 1024 / 1024).toFixed(2)} MB. */
window.PEDIREITO_VIDEOS = ${JSON.stringify(map, null, 2)};
`;

writeFileSync(outPath, content);

const sizeMB = (Buffer.byteLength(content) / 1024 / 1024).toFixed(2);
console.log(`\n📄 ${outPath}\n   ${sizeMB} MB · pronto pra ser carregado pelo HTML do carrossel\n`);

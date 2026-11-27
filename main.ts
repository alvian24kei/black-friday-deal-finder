// Deal Beacon — the hand-in program (Node 22, standard library only).
//
// The site itself is app/: plain static files a browser opens at
// app/index.html, with its 32 checked Black Friday deals in app/data.js.
// Nothing it runs, styles or shows loads over the network; each deal links
// out to its store. This program copies app/ and screenshots/ from beside
// this file into the output directory and writes output/dossier.json, the
// summary the judge reads (the screenshots, the first load's files and
// bytes, and the source), using make.fun's vendored dossier library.
// vendor/makefun-frontend.ts is the kit's copy, unchanged.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Serve the site locally with `node serve.ts`, then open http://localhost:8080.

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const repoRoot = fileURLToPath(new URL(".", import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const shotsDir = join(repoRoot, "screenshots");

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, "app"), join(outputDir, "app"), { recursive: true });
if (existsSync(shotsDir)) {
  cpSync(shotsDir, join(outputDir, "screenshots"), { recursive: true });
}

const dossier = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(outputDir, "dossier.json"), dossier);
console.log(`Deal Beacon handed in: ${outputDir}/dossier.json written.`);

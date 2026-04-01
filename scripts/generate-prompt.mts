/**
 * scripts/generate-prompt.mts
 *
 * Generate system prompt programmatically.
 * Dijalankan dengan: npm run generate:prompt  (via tsx)
 */

import { writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { chartLibrary, chartPromptOptions } from "../lib/chart-library.cli.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");

const systemPrompt = chartLibrary.prompt(chartPromptOptions);

const outDir = resolve(rootDir, "generated");
mkdirSync(outDir, { recursive: true });

const outPath = resolve(outDir, "chart-system-prompt.txt");
writeFileSync(outPath, systemPrompt, "utf-8");

console.log(`✅ System prompt generated → generated/chart-system-prompt.txt`);
console.log(`   ${systemPrompt.length.toLocaleString()} characters`);

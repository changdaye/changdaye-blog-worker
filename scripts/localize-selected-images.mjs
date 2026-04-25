import { createWriteStream, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import path from 'node:path';

const repoRoot = process.cwd();
const postsDir = path.join(repoRoot, 'app/src/content/posts');
const outputDir = path.join(repoRoot, 'app/public/images/posts');
const reportPath = path.join(repoRoot, 'reports/missing-selected-images.json');
const imagePattern = /!\[[^\]]*\]\((https?:\/\/[^)]+)\)/g;

function buildLocalImagePath(url) {
  const parsed = new URL(url);
  return `/images/posts/${parsed.hostname}${parsed.pathname}`;
}

const missing = [];
const downloaded = new Set();

for (const file of readdirSync(postsDir)) {
  if (!file.endsWith('.md')) continue;
  const fullPath = path.join(postsDir, file);
  const markdown = readFileSync(fullPath, 'utf8');
  const matches = [...markdown.matchAll(imagePattern)];
  let nextMarkdown = markdown;

  for (const match of matches) {
    const url = match[1];
    const localWebPath = buildLocalImagePath(url);
    const parsed = new URL(url);
    const localFilePath = path.join(outputDir, parsed.hostname, parsed.pathname);

    try {
      mkdirSync(path.dirname(localFilePath), { recursive: true });
      if (!existsSync(localFilePath)) {
        const response = await fetch(url);
        if (!response.ok || !response.body) throw new Error(`HTTP ${response.status}`);
        await pipeline(response.body, createWriteStream(localFilePath));
      }
      downloaded.add(url);
      nextMarkdown = nextMarkdown.replaceAll(url, localWebPath);
    } catch (error) {
      missing.push({ file, url, error: error instanceof Error ? error.message : String(error) });
    }
  }

  writeFileSync(fullPath, nextMarkdown);
}

mkdirSync(path.dirname(reportPath), { recursive: true });
writeFileSync(reportPath, JSON.stringify(missing, null, 2) + '\n');
console.log(`localized ${downloaded.size} images, ${missing.length} failures`);

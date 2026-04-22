# Cloudflare Workers Blog Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a new Astro-based static blog inside `changdaye-blog-worker`, import content from `changdaye.github.io`, localize reachable images into static assets, and deploy the built site through Cloudflare Workers static assets.

**Architecture:** The new repository remains the primary workspace. Legacy content is copied into `imported/` from the sibling `changdaye.github.io` repo, transformed into Astro content collections, rendered through a small set of focused layouts/components, and built to `app/dist/`. Cloudflare Workers serves `app/dist/` as static assets with a lightweight asset-only Wrangler configuration.

**Tech Stack:** Astro, TypeScript, Cloudflare Workers + Wrangler, Vitest, Node.js built-in `fetch/fs/path`, Markdown content collections.

---

## Target File Structure

```text
changdaye-blog-worker/
├── app/
│   ├── astro.config.mjs
│   ├── package.json
│   ├── tsconfig.json
│   ├── wrangler.jsonc
│   ├── src/
│   │   ├── content.config.ts
│   │   ├── content/
│   │   │   └── posts/
│   │   ├── components/
│   │   │   ├── Footer.astro
│   │   │   ├── Header.astro
│   │   │   ├── PostCard.astro
│   │   │   ├── Prose.astro
│   │   │   └── TagList.astro
│   │   ├── data/
│   │   │   ├── about.ts
│   │   │   └── site.ts
│   │   ├── layouts/
│   │   │   ├── BaseLayout.astro
│   │   │   └── PostLayout.astro
│   │   ├── lib/
│   │   │   ├── about.ts
│   │   │   ├── content.ts
│   │   │   ├── import-frontmatter.ts
│   │   │   ├── import-images.ts
│   │   │   └── routes.ts
│   │   └── pages/
│   │       ├── 404.astro
│   │       ├── about.astro
│   │       ├── index.astro
│   │       ├── rss.xml.ts
│   │       ├── posts/[slug].astro
│   │       └── tags/
│   │           ├── [tag].astro
│   │           └── index.astro
│   ├── public/
│   │   └── images/
│   │       ├── posts/
│   │       └── site/
│   └── tests/
│       ├── about.test.ts
│       ├── import-frontmatter.test.ts
│       ├── import-images.test.ts
│       └── routes.test.ts
├── imported/
│   ├── _posts/
│   └── img/
├── scripts/
│   ├── import-legacy-source.mjs
│   ├── migrate-posts.mjs
│   ├── download-images.mjs
│   └── extract-about.mjs
├── reports/
│   └── missing-images.json
├── package.json
└── README.md
```

## File Responsibilities

- `scripts/import-legacy-source.mjs`: copy legacy `_posts/`, `img/`, `about.html`, and `_config.yml` from the sibling repo into `imported/`, and copy local site images into `app/public/images/site/`.
- `scripts/migrate-posts.mjs`: parse frontmatter, normalize slugs, rewrite image/internal links, and emit Astro content markdown files.
- `scripts/download-images.mjs`: fetch reachable remote images into `app/public/images/posts/` and record failures.
- `scripts/extract-about.mjs`: convert `about.html` into structured data for the new about page.
- `app/src/content.config.ts`: define the post collection schema.
- `app/src/lib/content.ts`: sort posts and list tags.
- `app/src/lib/routes.ts`: generate canonical post and tag URLs.
- `app/src/lib/import-frontmatter.ts`: testable legacy markdown frontmatter parsing helpers.
- `app/src/lib/import-images.ts`: deterministic remote-image-to-local-path mapping helpers.
- `app/src/lib/about.ts`: remove legacy scripts and split Chinese/English about content.
- `app/src/data/site.ts`: central blog metadata.
- `app/src/data/about.ts`: normalized about-page content.
- `app/src/layouts/*` + `app/src/components/*`: page shell and reusable rendering blocks.
- `app/src/pages/*`: static routes for home, post, tags, RSS, about, and 404.
- `app/wrangler.jsonc`: Workers static asset config.
- `app/tests/*`: unit coverage for import and routing logic.

### Task 1: Bootstrap the new repository structure and tooling

**Files:**
- Create: `package.json`
- Create: `app/package.json`
- Create: `app/tsconfig.json`
- Create: `app/astro.config.mjs`
- Create: `app/wrangler.jsonc`
- Create: `app/src/env.d.ts`
- Create: `app/src/lib/routes.ts`
- Create: `app/tests/routes.test.ts`
- Modify: `README.md`
- Test: `app/tests/routes.test.ts`

- [ ] **Step 1: Write the failing route helper test**

```ts
import { describe, expect, it } from 'vitest';
import { postPath, tagPath } from '../src/lib/routes';

describe('routes', () => {
  it('builds canonical post and tag paths', () => {
    expect(postPath('hello-world')).toBe('/posts/hello-world/');
    expect(tagPath('Spring Boot')).toBe('/tags/spring-boot/');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd app && npm test -- --run tests/routes.test.ts`
Expected: FAIL because `src/lib/routes.ts` does not exist yet.

- [ ] **Step 3: Create the root workspace package**

```json
{
  "name": "changdaye-blog-worker",
  "private": true,
  "scripts": {
    "import:source": "node scripts/import-legacy-source.mjs",
    "download:images": "node scripts/download-images.mjs",
    "migrate:posts": "node scripts/migrate-posts.mjs",
    "extract:about": "node scripts/extract-about.mjs",
    "prepare:content": "npm run import:source && npm run download:images && npm run migrate:posts && npm run extract:about",
    "check": "cd app && npm run check"
  }
}
```

- [ ] **Step 4: Create the app package and config skeleton**

```json
{
  "name": "changdaye-blog-worker-app",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "test": "vitest run",
    "typecheck": "astro check",
    "check": "npm run typecheck && npm run test",
    "deploy": "wrangler deploy"
  },
  "dependencies": {
    "@astrojs/rss": "^4.0.11",
    "@astrojs/sitemap": "^3.6.0",
    "astro": "^5.7.0"
  },
  "devDependencies": {
    "typescript": "^5.8.3",
    "vitest": "^3.2.4",
    "wrangler": "^4.13.2"
  }
}
```

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": "."
  }
}
```

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://changdaye-blog-worker.workers.dev',
  integrations: [sitemap()],
  output: 'static'
});
```

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "changdaye-blog-worker",
  "compatibility_date": "2026-04-22",
  "assets": {
    "directory": "./dist"
  },
  "observability": {
    "enabled": true
  }
}
```

```ts
/// <reference types="astro/client" />
```

- [ ] **Step 5: Implement the minimal route helper**

```ts
export function slugifySegment(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function postPath(slug: string): string {
  return `/posts/${slugifySegment(slug)}/`;
}

export function tagPath(tag: string): string {
  return `/tags/${slugifySegment(tag)}/`;
}
```

- [ ] **Step 6: Run the route test to verify it passes**

Run: `cd app && npm install && npm test -- --run tests/routes.test.ts`
Expected: PASS

- [ ] **Step 7: Update the README bootstrap section**

~~~md
## Development bootstrap

~~~bash
npm run prepare:content
cd app
npm install
npm run check
~~~
~~~

- [ ] **Step 8: Commit**

```bash
git add package.json README.md app/package.json app/tsconfig.json app/astro.config.mjs app/wrangler.jsonc app/src/env.d.ts app/src/lib/routes.ts app/tests/routes.test.ts
git commit -m "Establish the new Astro and Workers workspace for the blog migration"
```

### Task 2: Import the legacy source into the new repository

**Files:**
- Create: `scripts/import-legacy-source.mjs`
- Create: `imported/.gitkeep`
- Create: `app/src/lib/import-frontmatter.ts`
- Create: `app/tests/import-frontmatter.test.ts`
- Modify: `README.md`
- Test: `app/tests/import-frontmatter.test.ts`

- [ ] **Step 1: Write the failing import parser test**

```ts
import { describe, expect, it } from 'vitest';
import { splitFrontmatter, parseSimpleFrontmatter } from '../src/lib/import-frontmatter';

const sample = `---\ntitle: Hello\nsubtitle: World\ndate: 2017-09-06\nauthor: Mr Chang\nheader-img: img/post-bg-swift.jpg\ncatalog: true\ntags:\n  - Java\n  - Spring\n---\n\ncontent`;

describe('frontmatter import helpers', () => {
  it('splits markdown and parses known fields', () => {
    const { frontmatter, body } = splitFrontmatter(sample);
    expect(body.trim()).toBe('content');
    expect(parseSimpleFrontmatter(frontmatter)).toEqual({
      title: 'Hello',
      subtitle: 'World',
      date: '2017-09-06',
      author: 'Mr Chang',
      headerImage: 'img/post-bg-swift.jpg',
      catalog: true,
      tags: ['Java', 'Spring']
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd app && npm test -- --run tests/import-frontmatter.test.ts`
Expected: FAIL because `src/lib/import-frontmatter.ts` does not exist yet.

- [ ] **Step 3: Create the legacy import script**

```js
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const repoRoot = process.cwd();
const legacyDir = process.env.LEGACY_BLOG_DIR ?? path.resolve(repoRoot, '../changdaye.github.io');
const targets = [
  ['_posts', 'imported/_posts'],
  ['img', 'imported/img'],
  ['about.html', 'imported/about.html'],
  ['_config.yml', 'imported/_config.yml']
];

if (!existsSync(legacyDir)) {
  throw new Error(`Legacy blog directory not found: ${legacyDir}`);
}

for (const [, dest] of targets) {
  rmSync(path.join(repoRoot, dest), { recursive: true, force: true });
}

mkdirSync(path.join(repoRoot, 'imported'), { recursive: true });
mkdirSync(path.join(repoRoot, 'app/public/images/site'), { recursive: true });

for (const [source, dest] of targets) {
  cpSync(path.join(legacyDir, source), path.join(repoRoot, dest), { recursive: true });
}

cpSync(path.join(legacyDir, 'img'), path.join(repoRoot, 'app/public/images/site'), { recursive: true });

console.log(`Imported legacy content from ${legacyDir}`);
```

- [ ] **Step 4: Create the frontmatter helper module**

```ts
export function splitFrontmatter(markdown: string): { frontmatter: string; body: string } {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    throw new Error('Missing frontmatter block');
  }
  return { frontmatter: match[1], body: match[2] };
}

export function parseSimpleFrontmatter(frontmatter: string) {
  const result: {
    title: string;
    subtitle: string;
    date: string;
    author: string;
    headerImage: string;
    catalog: boolean;
    tags: string[];
  } = {
    title: '',
    subtitle: '',
    date: '',
    author: '',
    headerImage: '',
    catalog: false,
    tags: []
  };

  let inTags = false;
  for (const rawLine of frontmatter.split('\n')) {
    const line = rawLine.trimEnd();
    if (line.startsWith('tags:')) {
      inTags = true;
      continue;
    }
    if (inTags && line.trim().startsWith('- ')) {
      result.tags.push(line.trim().slice(2));
      continue;
    }
    inTags = false;
    if (line.startsWith('title:')) result.title = line.split(':').slice(1).join(':').trim().replace(/^"|"$/g, '');
    if (line.startsWith('subtitle:')) result.subtitle = line.split(':').slice(1).join(':').trim().replace(/^"|"$/g, '');
    if (line.startsWith('date:')) result.date = line.split(':').slice(1).join(':').trim();
    if (line.startsWith('author:')) result.author = line.split(':').slice(1).join(':').trim();
    if (line.startsWith('header-img:')) result.headerImage = line.split(':').slice(1).join(':').trim();
    if (line.startsWith('catalog:')) result.catalog = line.split(':').slice(1).join(':').trim() === 'true';
  }

  return result;
}
```

- [ ] **Step 5: Run the source import and parser tests**

Run: `npm run import:source && cd app && npm test -- --run tests/import-frontmatter.test.ts`
Expected: PASS, and `imported/_posts`, `imported/img`, `imported/about.html`, `imported/_config.yml`, and `app/public/images/site` exist.

- [ ] **Step 6: Document the source import requirement**

~~~md
The migration scripts expect the legacy repo to exist at `../changdaye.github.io` by default.
Override with `LEGACY_BLOG_DIR=/absolute/path/to/changdaye.github.io npm run import:source`.
~~~

- [ ] **Step 7: Commit**

```bash
git add README.md scripts/import-legacy-source.mjs imported/.gitkeep app/src/lib/import-frontmatter.ts app/tests/import-frontmatter.test.ts
git commit -m "Bring legacy blog source material into the new workspace"
```

### Task 3: Download reachable remote images and emit a failure report

**Files:**
- Create: `scripts/download-images.mjs`
- Create: `reports/.gitkeep`
- Create: `reports/missing-images.json`
- Create: `app/src/lib/import-images.ts`
- Create: `app/tests/import-images.test.ts`
- Test: `app/tests/import-images.test.ts`

- [ ] **Step 1: Write the failing image localization test**

```ts
import { describe, expect, it } from 'vitest';
import { buildLocalImagePath, replaceMarkdownImageUrl } from '../src/lib/import-images';

describe('image localization helpers', () => {
  it('maps remote URLs into deterministic local paths', () => {
    expect(buildLocalImagePath('https://cdn-blog.oss-cn-beijing.aliyuncs.com/17-10-12/14403343.jpg'))
      .toBe('/images/posts/cdn-blog.oss-cn-beijing.aliyuncs.com/17-10-12/14403343.jpg');
    expect(replaceMarkdownImageUrl('![](https://cdn-blog.oss-cn-beijing.aliyuncs.com/17-10-12/14403343.jpg)'))
      .toBe('![](/images/posts/cdn-blog.oss-cn-beijing.aliyuncs.com/17-10-12/14403343.jpg)');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd app && npm test -- --run tests/import-images.test.ts`
Expected: FAIL because `src/lib/import-images.ts` does not exist yet.

- [ ] **Step 3: Create the image helper module**

```ts
export function buildLocalImagePath(url: string): string {
  const parsed = new URL(url);
  return `/images/posts/${parsed.hostname}${parsed.pathname}`;
}

export function replaceMarkdownImageUrl(markdown: string): string {
  return markdown.replace(/!\[(.*?)\]\((https?:\/\/[^)]+)\)/g, (_all, alt, url) => {
    return `![${alt}](${buildLocalImagePath(url)})`;
  });
}
```

- [ ] **Step 4: Create the download script**

```js
import { createWriteStream, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import path from 'node:path';

const repoRoot = process.cwd();
const postsDir = path.join(repoRoot, 'imported/_posts');
const outputDir = path.join(repoRoot, 'app/public/images/posts');
const reportPath = path.join(repoRoot, 'reports/missing-images.json');

function extractImageUrls(markdown) {
  return [...markdown.matchAll(/!\[[^\]]*\]\((https?:\/\/[^)]+)\)/g)].map(match => match[1]);
}

const missing = [];
const seen = new Set();

for (const file of readdirSync(postsDir)) {
  const markdown = readFileSync(path.join(postsDir, file), 'utf8');
  for (const url of extractImageUrls(markdown)) {
    if (seen.has(url)) continue;
    seen.add(url);
    try {
      const parsed = new URL(url);
      const localPath = path.join(outputDir, parsed.hostname, parsed.pathname);
      mkdirSync(path.dirname(localPath), { recursive: true });
      if (!existsSync(localPath)) {
        const response = await fetch(url);
        if (!response.ok || !response.body) throw new Error(`HTTP ${response.status}`);
        await pipeline(response.body, createWriteStream(localPath));
      }
    } catch (error) {
      missing.push({ url, error: error instanceof Error ? error.message : String(error) });
    }
  }
}

mkdirSync(path.dirname(reportPath), { recursive: true });
writeFileSync(reportPath, JSON.stringify(missing, null, 2) + '\n');
console.log(`Downloaded ${seen.size - missing.length} images, ${missing.length} failed`);
```

- [ ] **Step 5: Run the image helper tests and downloader**

Run: `cd app && npm test -- --run tests/import-images.test.ts && cd .. && npm run download:images`
Expected: PASS for tests, `app/public/images/posts/` populated, and `reports/missing-images.json` created.

- [ ] **Step 6: Commit**

```bash
git add app/src/lib/import-images.ts app/tests/import-images.test.ts scripts/download-images.mjs reports/.gitkeep reports/missing-images.json
git commit -m "Localize reachable legacy blog images into the new static asset tree"
```

### Task 4: Convert legacy markdown into Astro content entries

**Files:**
- Create: `app/src/content.config.ts`
- Create: `app/src/lib/content.ts`
- Create: `app/src/content/posts/.gitkeep`
- Create: `scripts/migrate-posts.mjs`
- Modify: `app/tests/routes.test.ts`
- Test: `app/tests/routes.test.ts`

- [ ] **Step 1: Extend tests for sorted post metadata**

```ts
import { describe, expect, it } from 'vitest';
import { sortPostsByDate } from '../src/lib/content';

const posts = [
  { data: { date: new Date('2017-09-06') } },
  { data: { date: new Date('2019-11-20') } }
] as any[];

describe('content helpers', () => {
  it('sorts posts newest first', () => {
    const sorted = sortPostsByDate([...posts]);
    expect(sorted[0].data.date.toISOString()).toContain('2019-11-20');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd app && npm test -- --run tests/routes.test.ts`
Expected: FAIL because `sortPostsByDate` is missing.

- [ ] **Step 3: Define the Astro content collection schema**

```ts
import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string().default(''),
    date: z.coerce.date(),
    author: z.string().default('Mr Chang'),
    tags: z.array(z.string()).default([]),
    headerImage: z.string().optional(),
    catalog: z.boolean().default(false),
    legacyPath: z.string(),
    excerpt: z.string().default('')
  })
});

export const collections = { posts };
```

- [ ] **Step 4: Implement the content helper module**

```ts
import type { CollectionEntry } from 'astro:content';

export function sortPostsByDate(posts: CollectionEntry<'posts'>[]) {
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function uniqueTags(posts: CollectionEntry<'posts'>[]) {
  return [...new Set(posts.flatMap(post => post.data.tags))].sort((a, b) => a.localeCompare(b, 'zh-CN'));
}
```

- [ ] **Step 5: Create the migration script**

```js
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

function splitFrontmatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error('Missing frontmatter block');
  return { frontmatter: match[1], body: match[2] };
}

function parseSimpleFrontmatter(frontmatter) {
  const result = { title: '', subtitle: '', date: '', author: '', headerImage: '', catalog: false, tags: [] };
  let inTags = false;
  for (const rawLine of frontmatter.split('\n')) {
    const line = rawLine.trimEnd();
    if (line.startsWith('tags:')) {
      inTags = true;
      continue;
    }
    if (inTags && line.trim().startsWith('- ')) {
      result.tags.push(line.trim().slice(2));
      continue;
    }
    inTags = false;
    if (line.startsWith('title:')) result.title = line.split(':').slice(1).join(':').trim().replace(/^"|"$/g, '');
    if (line.startsWith('subtitle:')) result.subtitle = line.split(':').slice(1).join(':').trim().replace(/^"|"$/g, '');
    if (line.startsWith('date:')) result.date = line.split(':').slice(1).join(':').trim();
    if (line.startsWith('author:')) result.author = line.split(':').slice(1).join(':').trim();
    if (line.startsWith('header-img:')) result.headerImage = line.split(':').slice(1).join(':').trim();
    if (line.startsWith('catalog:')) result.catalog = line.split(':').slice(1).join(':').trim() === 'true';
  }
  return result;
}

function replaceMarkdownImageUrl(markdown) {
  return markdown.replace(/!\[(.*?)\]\((https?:\/\/[^)]+)\)/g, (_all, alt, url) => {
    const parsed = new URL(url);
    return `![${alt}](/images/posts/${parsed.hostname}${parsed.pathname})`;
  });
}

const repoRoot = process.cwd();
const inputDir = path.join(repoRoot, 'imported/_posts');
const outputDir = path.join(repoRoot, 'app/src/content/posts');

mkdirSync(outputDir, { recursive: true });

for (const file of readdirSync(inputDir)) {
  const source = readFileSync(path.join(inputDir, file), 'utf8');
  const { frontmatter, body } = splitFrontmatter(source);
  const meta = parseSimpleFrontmatter(frontmatter);
  const slug = file.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');
  const migratedBody = replaceMarkdownImageUrl(body);
  const migrated = `---\ntitle: ${JSON.stringify(meta.title)}\nsubtitle: ${JSON.stringify(meta.subtitle)}\ndate: ${meta.date}\nauthor: ${JSON.stringify(meta.author || 'Mr Chang')}\ntags: ${JSON.stringify(meta.tags)}\nheaderImage: ${JSON.stringify(meta.headerImage ? `/images/site/${path.basename(meta.headerImage)}` : undefined)}\ncatalog: ${meta.catalog}\nlegacyPath: ${JSON.stringify(file)}\nexcerpt: ${JSON.stringify(migratedBody.split('\n').find(Boolean)?.slice(0, 120) ?? '')}\n---\n\n${migratedBody}`;
  writeFileSync(path.join(outputDir, `${slug}.md`), migrated);
}
```

- [ ] **Step 6: Run the migration and verification**

Run: `npm run migrate:posts && cd app && npm test -- --run tests/routes.test.ts`
Expected: PASS, and `app/src/content/posts/*.md` are created.

- [ ] **Step 7: Commit**

```bash
git add app/src/content.config.ts app/src/lib/content.ts scripts/migrate-posts.mjs app/src/content/posts/.gitkeep app/tests/routes.test.ts
git commit -m "Convert legacy markdown posts into Astro content entries"
```

### Task 5: Extract the about page and build the site data layer

**Files:**
- Create: `scripts/extract-about.mjs`
- Create: `app/src/data/site.ts`
- Create: `app/src/lib/about.ts`
- Create: `app/src/data/about.ts`
- Create: `app/tests/about.test.ts`
- Modify: `README.md`
- Test: `app/tests/about.test.ts`

- [ ] **Step 1: Write the failing about extraction test**

```ts
import { describe, expect, it } from 'vitest';
import { normalizeAboutHtml } from '../src/lib/about';

describe('about extraction', () => {
  it('keeps Chinese and English sections and removes legacy scripts', () => {
    const normalized = normalizeAboutHtml('<div class="zh post-container">中文</div><script>alert(1)</script><div class="en post-container">English</div>');
    expect(normalized.zh).toContain('中文');
    expect(normalized.en).toContain('English');
    expect(normalized.zh).not.toContain('<script');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd app && npm test -- --run tests/about.test.ts`
Expected: FAIL because `src/lib/about.ts` does not exist yet.

- [ ] **Step 3: Create the site metadata module**

```ts
export const site = {
  title: 'MrChang Blog',
  description: 'Modernized archive of Mr Chang technical blog posts.',
  siteUrl: 'https://changdaye-blog-worker.workers.dev',
  author: 'Mr Chang',
  githubUrl: 'https://github.com/changdaye',
  filing: '粤ICP备17125314号'
};
```

- [ ] **Step 4: Create the about helper and extractor**

```ts
export function normalizeAboutHtml(html: string) {
  const cleaned = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/\{\%[\s\S]*?\%\}/g, '').trim();
  const zh = cleaned.match(/<div class="zh post-container">([\s\S]*?)<\/div>/)?.[1] ?? '';
  const en = cleaned.match(/<div class="en post-container">([\s\S]*?)<\/div>/)?.[1] ?? '';
  return { zh, en };
}
```

```js
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const aboutHtml = readFileSync(path.join(repoRoot, 'imported/about.html'), 'utf8');
const cleaned = aboutHtml.replace(/<script[\s\S]*?<\/script>/g, '').replace(/\{\%[\s\S]*?\%\}/g, '');
const zh = cleaned.match(/<div class="zh post-container">([\s\S]*?)<\/div>/)?.[1] ?? '';
const en = cleaned.match(/<div class="en post-container">([\s\S]*?)<\/div>/)?.[1] ?? '';

writeFileSync(path.join(repoRoot, 'app/src/data/about.ts'), `export const about = ${JSON.stringify({ zh, en }, null, 2)} as const;\n`);
```

- [ ] **Step 5: Run the extractor test and generate data**

Run: `cd app && npm test -- --run tests/about.test.ts && cd .. && npm run extract:about`
Expected: PASS, and `app/src/data/about.ts` exists.

- [ ] **Step 6: Commit**

```bash
git add app/src/data/site.ts app/src/lib/about.ts app/src/data/about.ts scripts/extract-about.mjs app/tests/about.test.ts README.md
git commit -m "Prepare shared site metadata and migrate the legacy about page"
```

### Task 6: Build the Astro pages, layouts, and components

**Files:**
- Create: `app/src/layouts/BaseLayout.astro`
- Create: `app/src/layouts/PostLayout.astro`
- Create: `app/src/components/Header.astro`
- Create: `app/src/components/Footer.astro`
- Create: `app/src/components/PostCard.astro`
- Create: `app/src/components/TagList.astro`
- Create: `app/src/components/Prose.astro`
- Create: `app/src/pages/index.astro`
- Create: `app/src/pages/about.astro`
- Create: `app/src/pages/404.astro`
- Create: `app/src/pages/tags/index.astro`
- Create: `app/src/pages/tags/[tag].astro`
- Create: `app/src/pages/posts/[slug].astro`
- Create: `app/src/pages/rss.xml.ts`
- Modify: `app/src/lib/content.ts`
- Test: `cd app && npm run build`

- [ ] **Step 1: Write a failing build expectation**

Run: `cd app && npm run build`
Expected: FAIL because the required routes and layouts do not exist yet.

- [ ] **Step 2: Create the base and post layouts**

```astro
---
import { site } from '../data/site';
const { title = site.title, description = site.description } = Astro.props;
---
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
  </head>
  <body>
    <slot />
  </body>
</html>
```

```astro
---
import BaseLayout from './BaseLayout.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import TagList from '../components/TagList.astro';
const { post } = Astro.props;
---
<BaseLayout title={post.data.title} description={post.data.excerpt}>
  <Header />
  <main>
    <h1>{post.data.title}</h1>
    <p>{post.data.subtitle}</p>
    <TagList tags={post.data.tags} />
    <slot />
  </main>
  <Footer />
</BaseLayout>
```

- [ ] **Step 3: Create the shared components**

```astro
---
import { site } from '../data/site';
---
<header>
  <nav>
    <a href="/">首页</a>
    <a href="/tags/">标签</a>
    <a href="/about/">About</a>
    <a href={site.githubUrl}>GitHub</a>
  </nav>
</header>
```

```astro
---
import { site } from '../data/site';
---
<footer>
  <p>{site.title}</p>
  <p>{site.filing}</p>
</footer>
```

```astro
---
const { post } = Astro.props;
---
<article>
  <h2><a href={`/posts/${post.slug}/`}>{post.data.title}</a></h2>
  <p>{post.data.subtitle}</p>
  <p>{post.data.date.toISOString().slice(0, 10)}</p>
</article>
```

```astro
---
import { tagPath } from '../lib/routes';
const { tags = [] } = Astro.props;
---
<ul>
  {tags.map((tag: string) => <li><a href={tagPath(tag)}>{tag}</a></li>)}
</ul>
```

```astro
---
---
<div class="prose">
  <slot />
</div>
```

- [ ] **Step 4: Create the pages and RSS route**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import PostCard from '../components/PostCard.astro';
import { getCollection } from 'astro:content';
import { sortPostsByDate } from '../lib/content';

const posts = sortPostsByDate(await getCollection('posts'));
---
<BaseLayout>
  <Header />
  <main>
    <h1>MrChang Blog</h1>
    {posts.map(post => <PostCard post={post} />)}
  </main>
  <Footer />
</BaseLayout>
```

```astro
---
import PostLayout from '../../layouts/PostLayout.astro';
import Prose from '../../components/Prose.astro';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('posts');
  return posts.map(post => ({ params: { slug: post.slug }, props: { post } }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---
<PostLayout post={post}>
  <Prose><Content /></Prose>
</PostLayout>
```

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Header from '../../components/Header.astro';
import Footer from '../../components/Footer.astro';
import { getCollection } from 'astro:content';
import { uniqueTags, sortPostsByDate } from '../../lib/content';
import { tagPath, slugifySegment } from '../../lib/routes';
import PostCard from '../../components/PostCard.astro';

const allPosts = sortPostsByDate(await getCollection('posts'));
const tags = uniqueTags(allPosts);

export async function getStaticPaths() {
  return tags.map(tag => ({ params: { tag: slugifySegment(tag) }, props: { tag } }));
}

const { tag } = Astro.props;
const posts = allPosts.filter(post => post.data.tags.some(item => slugifySegment(item) === tag));
---
<BaseLayout title={`标签：${tag}`} description={`标签 ${tag} 的文章`}>
  <Header />
  <main>
    <h1>{tag}</h1>
    {posts.map(post => <PostCard post={post} />)}
  </main>
  <Footer />
</BaseLayout>
```

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Header from '../../components/Header.astro';
import Footer from '../../components/Footer.astro';
import { getCollection } from 'astro:content';
import { uniqueTags } from '../../lib/content';
import { tagPath } from '../../lib/routes';

const tags = uniqueTags(await getCollection('posts'));
---
<BaseLayout title="标签" description="全部标签">
  <Header />
  <main>
    <h1>标签</h1>
    <ul>{tags.map(tag => <li><a href={tagPath(tag)}>{tag}</a></li>)}</ul>
  </main>
  <Footer />
</BaseLayout>
```

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import { about } from '../data/about';
---
<BaseLayout title="About" description="关于我">
  <Header />
  <main>
    <section set:html={about.zh} />
    <section set:html={about.en} />
  </main>
  <Footer />
</BaseLayout>
```

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="404" description="页面未找到">
  <main>
    <h1>404</h1>
    <p>页面不存在，返回首页继续阅读。</p>
    <a href="/">返回首页</a>
  </main>
</BaseLayout>
```

```ts
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { sortPostsByDate } from '../lib/content';
import { site } from '../data/site';

export async function GET(context) {
  const posts = sortPostsByDate(await getCollection('posts'));
  return rss({
    title: site.title,
    description: site.description,
    site: context.site ?? site.siteUrl,
    items: posts.map(post => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.excerpt,
      link: `/posts/${post.slug}/`
    }))
  });
}
```

- [ ] **Step 5: Run build verification**

Run: `cd app && npm run build`
Expected: PASS, generating `dist/` with home, posts, tags, about, 404, and RSS output.

- [ ] **Step 6: Commit**

```bash
git add app/src/layouts app/src/components app/src/pages app/src/lib/content.ts
git commit -m "Render the imported blog content through Astro pages and layouts"
```

### Task 7: Verify the Workers deployment path and end-to-end content preparation

**Files:**
- Modify: `README.md`
- Modify: `app/wrangler.jsonc`
- Modify: `reports/missing-images.json`
- Test: repo-level verification commands

- [ ] **Step 1: Run the full content preparation pipeline**

Run: `npm run prepare:content`
Expected: PASS, with `imported/`, `app/public/images/posts/`, `app/src/content/posts/`, and `app/src/data/about.ts` populated.

- [ ] **Step 2: Run the full application verification suite**

Run: `cd app && npm run check && npm run build`
Expected: PASS with no TypeScript, Astro, or Vitest failures.

- [ ] **Step 3: Verify Workers local serving**

Run: `cd app && npx wrangler dev`
Expected: local Worker serves the built static site from the `dist/` asset directory.

- [ ] **Step 4: Update the README deployment section**

~~~md
## Deploy to Cloudflare Workers

~~~bash
npm run prepare:content
cd app
npm install
npm run build
npm run deploy
~~~

If the legacy source repo is not in `../changdaye.github.io`, set `LEGACY_BLOG_DIR` before running `npm run prepare:content`.
~~~

- [ ] **Step 5: Commit**

```bash
git add README.md app/wrangler.jsonc reports/missing-images.json
git commit -m "Document and verify the end-to-end Cloudflare Workers deployment path"
```

## Plan Self-Review

- **Spec coverage:** This plan covers the new repo bootstrap, legacy source import, image localization, markdown migration, about-page migration, Astro page rendering, and Cloudflare Workers deployment path defined in the approved spec.
- **Placeholder scan:** No `TODO`/`TBD` placeholders are intentionally left in the implementation steps.
- **Type consistency:** Route helpers, frontmatter import helpers, image helpers, content helpers, and about helpers are introduced before downstream tasks rely on them.

# Rewrite-First Astro Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `changdaye-blog-worker` as a new Astro static blog for Cloudflare Workers, then selectively bring in legacy posts and local images only after the new architecture is working.

**Architecture:** Start from a clean Astro app with fresh layouts, components, style primitives, and content schema. Treat the old `changdaye.github.io` repo as a reference library only. Select a small first batch of posts, convert them into the new content model, localize only their required images, and deploy the finished static build through Cloudflare Workers assets.

**Tech Stack:** Astro, TypeScript, Vitest, Wrangler, static assets in `app/public/`, selective content curation from the legacy repo.

---

## Target File Structure

```text
changdaye-blog-worker/
├── app/
│   ├── src/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── content/
│   │   │   └── posts/
│   │   ├── data/
│   │   └── lib/
│   ├── public/
│   │   └── images/
│   │       ├── site/
│   │       └── posts/
│   ├── astro.config.mjs
│   ├── package.json
│   ├── tsconfig.json
│   └── wrangler.jsonc
├── content-source/
│   ├── selected-posts/
│   └── assets/
├── scripts/
├── docs/
└── README.md
```

## File Responsibilities

- `app/src/layouts/*`: page shell and article shell for the new site.
- `app/src/components/*`: reusable UI blocks for nav, footer, post cards, tags, and prose.
- `app/src/content.config.ts`: Astro content schema.
- `app/src/content/posts/*`: new curated article content only.
- `app/src/data/*`: site metadata and curated home/about content.
- `app/src/lib/*`: route helpers, content sorting, tag grouping, and selective content utilities.
- `app/public/images/site/*`: site-owned images used by the new design.
- `app/public/images/posts/*`: only images needed by selected imported posts.
- `content-source/selected-posts/*`: staging area for manually chosen legacy posts.
- `scripts/*`: focused helpers for selective content/image preparation, not full-site migration.

### Task 1: Bootstrap the clean Astro + Workers workspace

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
  it('builds canonical paths for posts and tags', () => {
    expect(postPath('hello-world')).toBe('/posts/hello-world/');
    expect(tagPath('Spring Boot')).toBe('/tags/spring-boot/');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd app && npm test -- --run tests/routes.test.ts`
Expected: FAIL because `src/lib/routes.ts` does not exist.

- [ ] **Step 3: Create the minimal workspace and Astro config**

Add the root package, Astro app package, TypeScript config, Astro config, and Wrangler config.

- [ ] **Step 4: Implement the route helper**

Add `slugifySegment`, `postPath`, and `tagPath`.

- [ ] **Step 5: Run test to verify it passes**

Run: `cd app && npm install && npm test -- --run tests/routes.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add package.json README.md app/package.json app/tsconfig.json app/astro.config.mjs app/wrangler.jsonc app/src/env.d.ts app/src/lib/routes.ts app/tests/routes.test.ts
git commit -m "Bootstrap the clean Astro and Workers workspace for the rewrite"
```

### Task 2: Build the new design system and page shell

**Files:**
- Create: `app/src/layouts/BaseLayout.astro`
- Create: `app/src/layouts/PostLayout.astro`
- Create: `app/src/components/Header.astro`
- Create: `app/src/components/Footer.astro`
- Create: `app/src/components/Hero.astro`
- Create: `app/src/components/PostCard.astro`
- Create: `app/src/components/TagList.astro`
- Create: `app/src/components/Prose.astro`
- Create: `app/src/styles/global.css`
- Create: `app/public/images/site/`
- Test: `cd app && npm run build`

- [ ] **Step 1: Run build first to verify it fails without layouts/pages**
- [ ] **Step 2: Create the base layout, styles, and shared components**
- [ ] **Step 3: Run build to verify the shell compiles**
- [ ] **Step 4: Commit**

### Task 3: Define the new content model and primary pages

**Files:**
- Create: `app/src/content.config.ts`
- Create: `app/src/lib/content.ts`
- Create: `app/src/data/site.ts`
- Create: `app/src/data/about.ts`
- Create: `app/src/pages/index.astro`
- Create: `app/src/pages/about.astro`
- Create: `app/src/pages/404.astro`
- Create: `app/src/pages/tags/index.astro`
- Create: `app/src/pages/tags/[tag].astro`
- Create: `app/src/pages/posts/[slug].astro`
- Create: `app/src/pages/rss.xml.ts`
- Create: `app/src/content/posts/.gitkeep`
- Test: `app/tests/content.test.ts`

- [ ] **Step 1: Write the failing content helper test**
- [ ] **Step 2: Run the test to verify it fails**
- [ ] **Step 3: Implement the new content schema and helpers**
- [ ] **Step 4: Create all primary pages against the new content model**
- [ ] **Step 5: Run tests and build**
- [ ] **Step 6: Commit**

### Task 4: Curate the first batch of legacy posts for the rewrite

**Files:**
- Create: `content-source/selected-posts/`
- Modify: `app/src/content/posts/*`
- Test: `cd app && npm run build`

- [ ] **Step 1: Choose a small initial batch of legacy posts**
- [ ] **Step 2: Convert them manually or semi-manually into the new content format**
- [ ] **Step 3: Run build to verify they render correctly**
- [ ] **Step 4: Commit**

### Task 5: Localize only the images required by selected posts

**Files:**
- Create: `scripts/localize-selected-images.mjs`
- Create: `app/public/images/posts/`
- Modify: selected post content files
- Create: `reports/missing-selected-images.json`
- Test: `app/tests/images.test.ts`

- [ ] **Step 1: Write the failing image-path helper test**
- [ ] **Step 2: Run the test to verify it fails**
- [ ] **Step 3: Implement selective image localization**
- [ ] **Step 4: Rewrite selected post image references to local static paths**
- [ ] **Step 5: Run tests and build**
- [ ] **Step 6: Commit**

### Task 6: Finalize Cloudflare Workers deployment path

**Files:**
- Modify: `README.md`
- Modify: `app/wrangler.jsonc`
- Test: repo-level build and wrangler verification

- [ ] **Step 1: Run the full verification suite**
- [ ] **Step 2: Verify local Workers serving**
- [ ] **Step 3: Document deployment**
- [ ] **Step 4: Commit**

## Plan Self-Review

- **Spec coverage:** This plan follows the rewrite-first direction: fresh Astro architecture first, selective content import second, selective image localization third, Workers deployment last.
- **Placeholder scan:** No `TODO`/`TBD` placeholders are left as implementation instructions.
- **Type consistency:** Route helpers, content helpers, and image helpers are introduced before downstream pages depend on them.

import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const legacyRoot = process.env.LEGACY_BLOG_DIR || '/Users/changdaye/Documents/changdaye.github.io';
const legacyPostsDir = path.join(legacyRoot, '_posts');
const legacyImgDir = path.join(legacyRoot, 'img');
const outputPostsDir = path.join(repoRoot, 'app/src/content/posts');
const outputSiteImagesDir = path.join(repoRoot, 'app/public/images/site');

if (!existsSync(legacyPostsDir)) {
  throw new Error(`Legacy posts directory not found: ${legacyPostsDir}`);
}
if (!existsSync(legacyImgDir)) {
  throw new Error(`Legacy image directory not found: ${legacyImgDir}`);
}

function trimWrappedQuotes(value) {
  return value.trim().replace(/^"|"$/g, '').replace(/^'|'$/g, '');
}

function parseLegacyPost(markdown, filename) {
  const match = markdown.match(/^\s*---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error(`Missing frontmatter block in ${filename}`);
  const frontmatter = match[1];
  const body = match[2].trim();
  const result = {
    filename,
    title: '',
    subtitle: '',
    date: '',
    author: '',
    headerImage: '',
    tags: [],
    body,
  };

  let inTags = false;
  for (const rawLine of frontmatter.split('\n')) {
    const trimmed = rawLine.trim();
    if (trimmed.startsWith('tags:')) {
      inTags = true;
      continue;
    }
    if (inTags && trimmed.startsWith('- ')) {
      result.tags.push(trimWrappedQuotes(trimmed.slice(2)));
      continue;
    }
    inTags = false;
    if (trimmed.startsWith('title:')) result.title = trimWrappedQuotes(trimmed.slice('title:'.length));
    if (trimmed.startsWith('subtitle:')) result.subtitle = trimWrappedQuotes(trimmed.slice('subtitle:'.length));
    if (trimmed.startsWith('date:')) result.date = trimWrappedQuotes(trimmed.slice('date:'.length));
    if (trimmed.startsWith('author:')) result.author = trimWrappedQuotes(trimmed.slice('author:'.length));
    if (trimmed.startsWith('header-img:')) result.headerImage = trimWrappedQuotes(trimmed.slice('header-img:'.length));
  }
  return result;
}

function slugifySegment(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'post';
}

function toExcerpt(body) {
  const line = body
    .split('\n')
    .map((item) => item.trim())
    .find((item) => item && !item.startsWith('!['));
  if (!line) return '';
  return line
    .replace(/^#+\s*/, '')
    .replace(/^>+\s*/, '')
    .replace(/`/g, '')
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .slice(0, 120);
}

const featuredOverrides = new Set([
  'aliyun-oss-mounted-on-linux',
  'spring-boot-admin-guide',
  'mq-idempotent-consumption'
]);

const coverOverrides = {
  'aliyun-oss-mounted-on-linux': '/images/site/covers/oss.svg',
  'spring-boot-admin-guide': '/images/site/covers/admin.svg',
  'mq-idempotent-consumption': '/images/site/covers/mq.svg',
};

rmSync(outputPostsDir, { recursive: true, force: true });
mkdirSync(outputPostsDir, { recursive: true });
mkdirSync(outputSiteImagesDir, { recursive: true });
cpSync(legacyImgDir, outputSiteImagesDir, { recursive: true, force: true });

const usedSlugs = new Map();
let imported = 0;
for (const file of readdirSync(legacyPostsDir).filter((name) => name.endsWith('.md')).sort()) {
  const parsed = parseLegacyPost(readFileSync(path.join(legacyPostsDir, file), 'utf8'), file);
  const baseSlug = slugifySegment(file.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, ''));
  const collisionCount = usedSlugs.get(baseSlug) || 0;
  usedSlugs.set(baseSlug, collisionCount + 1);
  const slug = collisionCount === 0 ? baseSlug : `${baseSlug}-${collisionCount + 1}`;
  const cover = coverOverrides[slug] || (parsed.headerImage ? `/images/site/${path.basename(parsed.headerImage)}` : undefined);
  const frontmatter = [
    '---',
    `title: ${JSON.stringify(parsed.title)}`,
    `subtitle: ${JSON.stringify(parsed.subtitle)}`,
    `description: ${JSON.stringify(toExcerpt(parsed.body))}`,
    `date: ${parsed.date}`,
    parsed.author ? `author: ${JSON.stringify(parsed.author)}` : 'author: "Mr Chang"',
    'tags:',
    ...parsed.tags.map((tag) => `  - ${tag}`),
    cover ? `cover: ${JSON.stringify(cover)}` : null,
    `featured: ${featuredOverrides.has(slug) ? 'true' : 'false'}`,
    'draft: false',
    '---',
    ''
  ].filter(Boolean);
  writeFileSync(path.join(outputPostsDir, `${slug}.md`), frontmatter.join('\n') + parsed.body + '\n');
  imported += 1;
}

console.log(`imported ${imported} legacy posts`);

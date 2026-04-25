export type LegacyPost = {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  author: string;
  headerImage: string;
  tags: string[];
  body: string;
};

function trimWrappedQuotes(value: string): string {
  return value.trim().replace(/^"|"$/g, '').replace(/^'|'$/g, '');
}

export function parseLegacyPost(markdown: string, filename: string): LegacyPost {
  const match = markdown.match(/^\s*---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    throw new Error(`Missing frontmatter block in ${filename}`);
  }

  const frontmatter = match[1];
  const body = match[2].trim();
  const result: LegacyPost = {
    slug: filename.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, ''),
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
    const line = rawLine.trimEnd();
    const trimmed = line.trim();

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

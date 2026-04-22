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

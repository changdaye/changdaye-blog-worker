export function sortPostsByDate<T extends { data: { date: Date } }>(posts: T[]): T[] {
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function uniqueTags<T extends { data: { tags: string[] } }>(posts: T[]): string[] {
  const seen = new Set<string>();
  const tags: string[] = [];

  for (const post of posts) {
    for (const tag of post.data.tags) {
      if (seen.has(tag)) continue;
      seen.add(tag);
      tags.push(tag);
    }
  }

  return tags;
}

export function getAdjacentPosts<T extends { slug: string }>(posts: T[], slug: string): { previous?: T; next?: T } {
  const index = posts.findIndex((post) => post.slug === slug);
  if (index === -1) return {};
  return {
    previous: index > 0 ? posts[index - 1] : undefined,
    next: index < posts.length - 1 ? posts[index + 1] : undefined
  };
}

export function getPrimaryTopic<T extends { data: { tags: string[] } }>(post: T): string {
  return post.data.tags[0] ?? '未分类';
}

export function estimateReadingMinutes(body: string): number {
  const text = body.replace(/[`#>*\-_[\]()]/g, ' ').trim();
  const units = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(units / 220));
}

export function buildTopicOverview<T extends { data: { tags: string[]; description?: string; title?: string } }>(posts: T[]) {
  const counts = new Map<string, { tag: string; count: number }>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      counts.set(tag, { tag, count: (counts.get(tag)?.count ?? 0) + 1 });
    }
  }
  return [...counts.values()].sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'zh-CN'));
}

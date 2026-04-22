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

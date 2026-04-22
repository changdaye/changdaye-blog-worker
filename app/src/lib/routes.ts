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

export function buildLocalImagePath(url: string): string {
  const parsed = new URL(url);
  return `/images/posts/${parsed.hostname}${parsed.pathname}`;
}

export function replaceMarkdownImageUrl(markdown: string): string {
  return markdown.replace(/!\[(.*?)\]\((https?:\/\/[^)]+)\)/g, (_all, alt, url) => {
    return `![${alt}](${buildLocalImagePath(url)})`;
  });
}

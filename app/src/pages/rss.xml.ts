import type { APIContext } from 'astro';
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { sortPostsByDate } from '../lib/content';
import { site } from '../data/site';
import { postPath } from '../lib/routes';

export async function GET(context: APIContext) {
  const posts = sortPostsByDate((await getCollection('posts')).filter((post) => !post.data.draft));
  return rss({
    title: site.title,
    description: site.description,
    site: context.site ?? site.siteUrl,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: postPath(post.slug)
    }))
  });
}

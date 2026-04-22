import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://changdaye-blog-worker.workers.dev',
  integrations: [sitemap()],
  output: 'static'
});

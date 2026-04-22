# changdaye-blog-worker

Rewrite-first Astro blog rebuilt from the old `changdaye.github.io` content library for Cloudflare Workers.

## Current scope

- Build a brand-new Astro blog architecture in this repository
- Curate legacy articles in small batches instead of bulk migration
- Localize only the images required by selected content
- Serve the final static build through Cloudflare Workers assets

## Development

```bash
cd app
npm install
npm run check
npm run build
```

## Deploy to Cloudflare Workers

```bash
cd app
npm install
npm run build
npm run deploy
```

## Legacy source policy

The old `changdaye.github.io` repository is reference material only. New pages, styles, components, and content structure are defined in this repository first; legacy content is then selectively rewritten into the new model.

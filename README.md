# changdaye-blog-worker

Modern static blog rebuilt from `changdaye.github.io` for Cloudflare Workers.

## Status

Planning in progress. See:

- `docs/superpowers/specs/2026-04-22-cf-workers-blog-migration-design.md`
- `docs/superpowers/plans/2026-04-22-cf-workers-blog-migration.md`

## Development bootstrap

```bash
npm run prepare:content
cd app
npm install
npm run check
```

The migration scripts expect the legacy repo to exist at `../changdaye.github.io` by default.
Override with `LEGACY_BLOG_DIR=/absolute/path/to/changdaye.github.io npm run import:source`.

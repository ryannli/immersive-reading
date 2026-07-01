# Deployment

The generated reader is a static site. It can be deployed to Vercel, Netlify, GitHub Pages, or any static host.

## Local Preview

```bash
node /path/to/skill/scripts/serve-reader.mjs /path/to/generated-reader --port 8791
```

Open `http://127.0.0.1:8791/`.

## Vercel

From the generated reader folder:

```bash
vercel --prod
```

No Upstash, Redis, or metrics environment variables are required. The template intentionally excludes production analytics.

## Before Publishing

Run:

```bash
node /path/to/skill/scripts/validate-article-data.mjs src/articles/<article-id>/data.js
node /path/to/skill/scripts/smoke-test-reader.mjs .
```

Then verify the share title, source attribution, desktop layout, mobile layout, theme toggle, search, highlights, and notes.

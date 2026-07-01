---
name: immersive-reading
description: Turn long-form source material into bespoke interactive learning spaces. Use when the user wants to convert a blog post, essay, transcript, note, paper, or other long content into a polished static reader with chapters, sections, quotes, search, highlights, notes, optional bilingual support, light/dark mode, and source attribution.
---

# Immersive Reading

## Overview

Create a self-contained static reading site from new source material by reusing the bundled reader template. Do not redesign the UI from scratch unless the user explicitly asks; the template already encodes the polished interaction details.

The skill separates judgment from deterministic work:

- Use the model for source structure, chapter/section titles, quotes, summaries, translation, and editorial judgment.
- Use bundled scripts for scaffolding, schema validation, and smoke tests.

## Workflow

1. **Intake**
   Ask only for missing essentials:
   - source content, source URL, or source file
   - whether to include bilingual mode and target language, if not already clear

   Do not ask for an output folder by default. Choose a sensible local folder
   name from the source title or article slug, then tell the user where the site
   was created. Only ask for a destination when the user has special placement
   or deployment requirements.

2. **Source Handling**
   Treat the project as a local reading/study space by default. Do not block
   the workflow with ownership questions. Preserve source title, author, and
   original link when they are known.

3. **Content Conversion**
   Read `references/content-model.md` and produce one `article-data.js` file matching the template schema.
   If the source lacks structure, create 5-14 chapters and 1-4 sections per chapter. Each section needs:
   - `take`: clear section title
   - `quote`: short anchor quote or excerpt
   - `paragraphs`: source text, summary text, or translated/source-aligned text
   - optional `footnotes`

4. **Scaffold**
   Run:

   ```bash
   node skills/immersive-reading/scripts/scaffold-reader.mjs --article-data /path/to/article-data.js --out /path/to/output
   ```

5. **Validate**
   Run:

   ```bash
   node skills/immersive-reading/scripts/validate-article-data.mjs /path/to/output/src/articles/<article-id>/data.js
   node skills/immersive-reading/scripts/smoke-test-reader.mjs /path/to/output
   ```

6. **Preview**
   Serve the generated folder with the bundled local server, inspect desktop and mobile, and fix data/layout problems before delivery:

   ```bash
   node skills/immersive-reading/scripts/serve-reader.mjs /path/to/output --port 8791
   ```

7. **Deploy**
   Read `references/deployment.md` only when the user asks to publish.

## Template Boundary

Use `assets/reader-template/` as the source of truth for the generated site. The template intentionally excludes production analytics, dashboards, Upstash/Vercel secrets, and project-specific branding.

Preserve these features unless the user asks otherwise:

- chapter/section reading flow
- search
- highlights
- notes and copyable notes
- optional bilingual display
- light/dark mode
- mobile limited-functionality notice
- source attribution and original link
- 3D particle background and scroll-driven transitions

Read `references/design-contract.md` before changing template layout, animation, or visual hierarchy.

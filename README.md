# Immersive Reading

A Claude Code / Codex skill for turning long-form material into cinematic
reading websites.

Give your agent a dense essay, blog post, transcript, research note, or lecture
script. Instead of getting a summary, you get a local Reading Edition: structured
chapters, quiet cinematic transitions, searchable text, highlights, notes,
optional bilingual reading, and a polished interface that feels worth sharing.

Immersive Reading is an Agent Skill plus a reusable static reader template. The
skill teaches the agent how to reshape the source; the template gives the output
its finished reading experience.

## The Promise

One source file in. One beautiful reading site out.

The generated edition is meant for material you actually want to spend time
with: a long article you keep returning to, a class reading, a technical essay,
an interview transcript, or your own notes after a research sprint.

The agent handles the editorial work:

- find the natural chapter structure
- split each chapter into readable sections
- write cinematic chapter and section openings
- choose short anchor quotes
- add bilingual text when requested
- preserve source attribution when a source is provided
- scaffold and validate the finished website

## Install

Clone the repo:

```bash
git clone https://github.com/ryannli/immersive-reading.git
cd immersive-reading
```

Install for Claude Code:

```bash
sh setup claude
```

Install for Codex:

```bash
sh setup codex
```

Install for a generic `SKILL.md`-compatible agent:

```bash
sh setup agent
```

Or copy the skill folder yourself:

```bash
mkdir -p ~/.claude/skills ~/.codex/skills ~/.agents/skills
cp -R skills/immersive-reading ~/.claude/skills/immersive-reading
cp -R skills/immersive-reading ~/.codex/skills/immersive-reading
cp -R skills/immersive-reading ~/.agents/skills/immersive-reading
```

The important part is that the installed folder contains:

```text
immersive-reading/
  SKILL.md
  agents/openai.yaml
  assets/
  references/
  scripts/
```

## First Run

Open a new Claude Code or Codex session and ask:

```text
Use $immersive-reading to turn ./article.md into a Reading Edition at ./reading-edition.
Add Chinese bilingual mode.
```

For an English-only edition:

```text
Use $immersive-reading to turn ./essay.md into a Reading Edition at ./essay-reader.
No bilingual mode.
```

The agent should create the data file, scaffold the site, run validation, and
give you a local preview command.

## Local Demo

Generate the bundled sample reader:

```bash
node skills/immersive-reading/scripts/scaffold-reader.mjs \
  --article-data skills/immersive-reading/assets/reader-template/src/articles/sample-reading/data.js \
  --out /tmp/immersive-reading-demo \
  --force
```

Preview it:

```bash
cd /tmp/immersive-reading-demo
python3 -m http.server 8791
```

Open `http://127.0.0.1:8791`.

## What It Builds

- Static website that can run locally or deploy to Vercel
- Chapter and section-based reading flow
- Cinematic chapter openings and scroll transitions
- Search
- Highlights
- Notes and copyable notes
- Optional bilingual line-by-line reading mode
- Light and dark mode
- Mobile notice for limited annotation functionality
- Source title, author, and original-link fields when available
- 3D particle background
- Validation scripts for generated article data and template smoke tests

The template deliberately leaves out production analytics, dashboards,
Upstash/Redis, private domains, and project-specific secrets.

## Repository Layout

```text
setup
skills/
  immersive-reading/
    SKILL.md
    agents/openai.yaml
    assets/reader-template/
    references/
    scripts/
```

## License

MIT.

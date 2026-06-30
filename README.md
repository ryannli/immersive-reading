<div align="center">

# Immersive Reading

<strong>A reusable skill for turning long-form material into immersive Reading Editions.</strong>

Bring an essay, post, transcript, note, or paper. Get back a polished static
reading site with chapters, transitions, search, highlights, notes, and optional
bilingual reading.

<br>

[![Start](https://img.shields.io/badge/Quick_Start-Install_now-111111?style=for-the-badge&labelColor=9A5A25)](#quick-start)
[![Skill](https://img.shields.io/badge/Reusable_Skill-immersive--reading-111111?style=for-the-badge&labelColor=5B6675)](skills/immersive-reading/SKILL.md)
[![Demo](https://img.shields.io/badge/Demo-Watch_the_X_post-111111?style=for-the-badge&labelColor=B87941)](https://x.com/ranli_thinker/status/2071738620860682365)

</div>

<br>

## A Reading Edition, Not A Summary

Example: Paul Graham's epic essay,
[How to Do Great Work](https://paulgraham.com/greatwork.html).

| Before | After |
| --- | --- |
| [![Before: plain essay page](docs/media/how-to-do-great-work-before.gif)](https://paulgraham.com/greatwork.html) | [![After: immersive Reading Edition](docs/media/how-to-do-great-work-after.gif)](https://x.com/ranli_thinker/status/2071738620860682365) |
| [Open original essay](https://paulgraham.com/greatwork.html) | [Open X post to watch the video](https://x.com/ranli_thinker/status/2071738620860682365) |

<br>

## What It Builds

<table>
  <tr>
    <td width="33%" valign="top">
      <strong>Chaptered reading flow</strong><br>
      <sub>Chapter openings, section beats, anchor quotes, and scroll-driven transitions.</sub>
    </td>
    <td width="33%" valign="top">
      <strong>Study tools</strong><br>
      <sub>Search, highlights, notes, copyable notes, and source-aware reading flow.</sub>
    </td>
    <td width="33%" valign="top">
      <strong>Reusable template</strong><br>
      <sub>Swap in new content and produce a static site ready for local use or Vercel.</sub>
    </td>
  </tr>
  <tr>
    <td width="33%" valign="top">
      <strong>Optional bilingual mode</strong><br>
      <sub>Line-by-line reading support when the source should be studied across languages.</sub>
    </td>
    <td width="33%" valign="top">
      <strong>Light and dark mode</strong><br>
      <sub>A calm porcelain reading surface plus a focused dark mode.</sub>
    </td>
    <td width="33%" valign="top">
      <strong>Agent-friendly scaffolding</strong><br>
      <sub>Bundled scripts validate data, scaffold the reader, and smoke-test the output.</sub>
    </td>
  </tr>
</table>

<br>

## How It Works

<table>
  <tr>
    <td align="center" width="33%">
      <strong>1. Bring source material</strong><br>
      <sub>Essay, blog post, lecture, transcript, note, or paper.</sub>
    </td>
    <td align="center" width="33%">
      <strong>2. Let the skill shape it</strong><br>
      <sub>Chapters, sections, quotes, optional translation, and reader data.</sub>
    </td>
    <td align="center" width="33%">
      <strong>3. Open the site</strong><br>
      <sub>A polished Reading Edition with the interaction details already wired.</sub>
    </td>
  </tr>
</table>

<br>

## Quick Start

<details open>
<summary><strong>Claude Code</strong></summary>

Install from the public repo as a Claude Code plugin.

Run these as two separate Claude Code messages:

```text
/plugin marketplace add ryannli/immersive-reading
```

Then:

```text
/plugin install immersive-reading@immersive-reading
```

Use it in Claude Code with:

```text
/immersive-reading:immersive-reading
```

</details>

<details>
<summary><strong>Codex</strong></summary>

Codex uses this repo as a skill, not a plugin.

```text
$skill-installer https://github.com/ryannli/immersive-reading/tree/main/skills/immersive-reading
```

Or use the npx installer:

```bash
npx --yes github:ryannli/immersive-reading install codex
```

</details>

<details>
<summary><strong>Cursor</strong></summary>

Install the skill resources and a project rule into the current project:

```bash
npx --yes github:ryannli/immersive-reading install cursor .
```

</details>

<details>
<summary><strong>Antigravity CLI</strong></summary>

```bash
agy plugin install https://github.com/ryannli/immersive-reading.git
```

</details>

<details>
<summary><strong>Other SKILL.md-compatible agents</strong></summary>

The `npx` commands run a small installer that copies `skills/immersive-reading`
into the target skills folder. They do not install app dependencies.

For a generic agent skills folder:

```bash
npx --yes github:ryannli/immersive-reading install agent
```

For a local clone:

```bash
git clone https://github.com/ryannli/immersive-reading.git
cd immersive-reading
sh setup codex
```

</details>

<br>

## First Prompt

```text
Use $immersive-reading to turn ./article.md into a Reading Edition at ./reading-edition.
Add Chinese bilingual mode.
```

For an English-only edition:

```text
Use $immersive-reading to turn ./essay.md into a Reading Edition at ./essay-reader.
No bilingual mode.
```

## License

MIT.

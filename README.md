<div align="center">

# Immersive Reading

<strong>Turn dense long-form ideas into reading experiences people want to enter.</strong>

Drop in a link, essay, transcript, note, or paper. Get back a study-ready
Reading Edition with chapters, source attribution, search, highlights, notes,
and optional bilingual text.

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

<p align="center">
  <img src="docs/media/how-it-works.png" alt="Source material flowing through an agent into an interactive reading space" width="100%">
</p>

<table>
  <tr>
    <td align="center" width="33%">
      <strong>1. Drop in the source</strong><br>
      <sub>Paste a link, upload a file, or point the agent at a long-form note.</sub>
    </td>
    <td align="center" width="33%">
      <strong>2. Let the agent shape it</strong><br>
      <sub>It finds chapters, sections, anchor quotes, study tools, and optional bilingual text.</sub>
    </td>
    <td align="center" width="33%">
      <strong>3. Open the reading space</strong><br>
      <sub>A polished interactive site is generated with the reader experience already wired.</sub>
    </td>
  </tr>
</table>

<br>

## Quick Start

<details open>
<summary><strong>Claude Code</strong></summary>

Option A: install as a Claude Code plugin.

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

Option B: install as an open agent skill.

```bash
npx --yes skills@latest add ryannli/immersive-reading --skill immersive-reading -g -a claude-code -y
```

Then start a new Claude Code session and ask for `immersive-reading`.

</details>

<details>
<summary><strong>Codex</strong></summary>

Install the skill into your local Codex skills folder:

```bash
npx --yes skills@latest add ryannli/immersive-reading --skill immersive-reading -g -a codex -y
```

Then start a new Codex session and use:

```text
Use $immersive-reading on this article:
https://paulgraham.com/greatwork.html
```

</details>

<details>
<summary><strong>Cursor</strong></summary>

Install the skill into Cursor:

```bash
npx --yes skills@latest add ryannli/immersive-reading --skill immersive-reading -g -a cursor -y
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

The Skills CLI can install this repo into supported coding agents. It fetches
the `skills/immersive-reading` folder directly from GitHub; this repo does not
need to be published as an npm package.

Replace `codex` with your agent name:

```bash
npx --yes skills@latest add ryannli/immersive-reading --skill immersive-reading -g -a codex -y
```

For a local clone:

```bash
git clone https://github.com/ryannli/immersive-reading.git
cd immersive-reading
sh setup agent
```

</details>

<br>

## Start With Anything

```text
Use $immersive-reading on this article:
https://paulgraham.com/greatwork.html
```

For bilingual reading:

```text
Use $immersive-reading on this link and add Spanish bilingual mode:
https://paulgraham.com/greatwork.html
```

You can also paste text or point to a local file. The agent chooses where to
create the site and tells you when it is ready.

## License

MIT.

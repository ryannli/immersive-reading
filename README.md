<div align="center">

# Immersive Reading

<strong>Turn dense long-form ideas into bespoke learning spaces that are delightful to explore.</strong>

Bring a link, essay, transcript, note, or paper. Get back a polished learning
space with chapters, source attribution, search, highlights, notes, and optional
bilingual support.

<br>

[![Start](https://img.shields.io/badge/Quick_Start-Install_now-111111?style=for-the-badge&labelColor=9A5A25)](#quick-start)
[![Skill](https://img.shields.io/badge/Reusable_Skill-immersive--reading-111111?style=for-the-badge&labelColor=5B6675)](skills/immersive-reading/SKILL.md)
[![Demo](https://img.shields.io/badge/Demo-Watch_the_X_post-111111?style=for-the-badge&labelColor=B87941)](https://x.com/ranli_thinker/status/2071738620860682365)

</div>

<br>

## Not A Summary. A Reading Space.

Example: Paul Graham's epic essay,
[How to Do Great Work](https://paulgraham.com/greatwork.html).

| Before | After |
| --- | --- |
| [![Before: plain essay page](docs/media/how-to-do-great-work-before.gif)](https://paulgraham.com/greatwork.html) | [![After: immersive reading space](docs/media/how-to-do-great-work-after.gif)](https://x.com/ranli_thinker/status/2071738620860682365) |
| [Open original essay](https://paulgraham.com/greatwork.html) | [Open live reading space](http://ranli.me/read-paul-graham) · [Watch the X post](https://x.com/ranli_thinker/status/2071738620860682365) |

<br>

## What It Builds

<table>
  <tr>
    <td width="42%" valign="top">
      <sup>SOURCE MATERIAL</sup><br><br>
      <strong>Plain long-form text</strong><br>
      <sub>Essays, posts, transcripts, notes, papers, or local files.</sub><br><br>
      <kbd>raw text</kbd> <kbd>source link</kbd> <kbd>local file</kbd>
    </td>
    <td width="16%" align="center" valign="middle">
      <strong>→</strong><br>
      <kbd>agent shapes</kbd><br>
      <strong>→</strong>
    </td>
    <td width="42%" valign="top">
      <sup>GENERATED SPACE</sup><br><br>
      <strong>A place to read, mark, and return</strong><br>
      <sub>A structured site with chapters, highlights, notes, search, and reusable scaffolding.</sub><br><br>
      <kbd>chapters</kbd> <kbd>highlights</kbd> <kbd>notes</kbd> <kbd>search</kbd>
    </td>
  </tr>
</table>

<table>
  <tr>
    <td width="22%" valign="top" align="center">
      <kbd>01</kbd><br><br>
      <strong>Reading Path</strong>
    </td>
    <td width="78%" valign="top">
      Chapter openings, section beats, anchor quotes, and scroll-driven transitions turn a wall of text into a path.
    </td>
  </tr>
  <tr>
    <td width="22%" valign="top" align="center">
      <kbd>02</kbd><br><br>
      <strong>Study Surface</strong>
    </td>
    <td width="78%" valign="top">
      Search, highlights, notes, copyable notes, optional bilingual support, and light/dark mode make the source usable.
    </td>
  </tr>
  <tr>
    <td width="22%" valign="top" align="center">
      <kbd>03</kbd><br><br>
      <strong>Reusable Template</strong>
    </td>
    <td width="78%" valign="top">
      Bundled scripts validate article data, scaffold the reader, and smoke-test the output for local use or Vercel.
    </td>
  </tr>
</table>

<br>

## Quick Start

<details open>
<summary><strong>Claude Code</strong></summary>

Install and run it as a Claude Code plugin. Send these as four separate
Claude Code messages:

```text
/plugin marketplace add ryannli/immersive-reading
```

```text
/plugin install immersive-reading@immersive-reading
```

```text
/reload-plugins
```

```text
/immersive-reading:immersive-reading
```

Then paste any essay, post, transcript, note, paper, URL, or local file you
want to turn into a learning space.

Or install it as an open agent skill:

```bash
npx skills add ryannli/immersive-reading
```

Choose Claude Code if the installer asks. Then start a new Claude Code session
and ask for `immersive-reading`.

No-prompt install:

```bash
npx skills add ryannli/immersive-reading -g -a claude-code -y
```

</details>

<details>
<summary><strong>Codex</strong></summary>

Install the skill into your local Codex skills folder:

```bash
npx skills add ryannli/immersive-reading
```

Choose Codex if the installer asks. Then start a new Codex session and use:

```text
Use $immersive-reading on this article:
https://paulgraham.com/greatwork.html
```

</details>

<details>
<summary><strong>Cursor</strong></summary>

Install the skill into Cursor:

```bash
npx skills add ryannli/immersive-reading
```

Choose Cursor if the installer asks.

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
npx skills add ryannli/immersive-reading -g -a codex -y
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

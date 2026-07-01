# Content Model

Use this reference when generating or editing article data for the reader template.

## Article Object

The generated file must default-export one JavaScript object:

```js
const article = {
  id: "kebab-case-id",
  slug: "kebab-case-id",
  template: "immersive-reading",
  title: { en: "Article Title" },
  author: "Author Name",
  description: { en: "Short share-card description." },
  source: {
    label: "Source material",
    authorLine: "by Author Name",
    url: "https://example.com/original",
    urlLabel: "example.com/original"
  },
  languages: [
    { code: "en", shortLabel: "EN", label: "English", menuTitle: "English", menuDescription: "Original text only", primary: true }
  ],
  defaultLanguage: "en",
  door: {
    ariaLabel: "Reading entrance",
    video: "assets/door-entrance-8s-scrub.mp4",
    poster: "assets/door-entrance-8s-poster.jpg",
    purpose: "Independent learning space",
    cue: "Enter"
  },
  hero: {
    note: "A generated learning space for the source material.",
    typedLine: "This source has a structure you can learn.",
    primaryAction: "Start reading",
    scrollCue: "Scroll",
    originalLinkLabel: "See the original source"
  },
  footer: {
    quote: { en: "Closing quote." },
    quoteEmphasis: "",
    credit: "Generated as a learning space for close study."
  },
  chapters: [],
  footnotes: {}
};

export default article;
```

## Chapters And Sections

Use `chapters[]` for the major learning arc. In normal long-form content, prefer 5-14 chapters. Very short content can use 2-4 chapters.

Each chapter:

```js
{
  n: 1,
  title: { en: "Chapter Title" },
  essence: { en: "One sentence explaining what this chapter teaches." },
  words: 420,
  ideas: []
}
```

Each section inside `ideas[]`:

```js
{
  take: { en: "Section title written as a clear claim" },
  quote: { en: "Short memorable quote or excerpt." },
  paragraphs: [
    { text: { en: "Paragraph text." } }
  ],
  footnotes: [
    { n: 1, text: { en: "Note text." } }
  ]
}
```

## Bilingual Mode

When the user requests bilingual mode, add a language entry and add the same language code to localized fields:

```js
languages: [
  { code: "en", shortLabel: "EN", label: "English", menuTitle: "English", menuDescription: "Original text only", primary: true },
  { code: "zh", shortLabel: "中", label: "中文", menuTitle: "English + 中文", menuDescription: "Line-by-line study mode" }
]
```

Then add translated values:

```js
paragraphs: [
  {
    text: {
      en: "Original paragraph.",
      zh: "译文段落。"
    }
  }
]
```

Do not claim the translation is official unless the source says so.

## Structure Heuristics

- Prefer chapter titles that name the learning function, not vague moods.
- Use section `take` values as claims the reader can remember.
- Keep `quote` short enough to work as a visual anchor.
- If source paragraphs are long, preserve paragraph boundaries or summarize tightly depending on the reading goal.
- Compute `words` from the primary-language text; approximate is acceptable, but do not leave it as zero.

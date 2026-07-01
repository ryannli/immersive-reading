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

Keep the bundled `door.video` and `door.poster` paths unless the user provides
custom entrance media. Do not replace the entrance with only a static hero
image; the default video is what gives the opening its scroll-scrub motion.

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
  media: [
    {
      type: "image",
      src: "assets/source/diagram-1.jpg",
      alt: { en: "Diagram showing the source author's core model." },
      caption: { en: "Original diagram from the source article." },
      credit: "Source author"
    }
  ],
  paragraphs: [
    {
      text: { en: "Paragraph text." },
      media: [
        {
          type: "image",
          src: "https://example.com/source-image.jpg",
          alt: { en: "Screenshot from the original source." },
          caption: { en: "A source image kept in context." }
        }
      ]
    }
  ],
  footnotes: [
    { n: 1, text: { en: "Note text." } }
  ]
}
```

## Source Media

If the original material includes meaningful media, do not silently drop it.
Capture images, diagrams, screenshots, audio, video, and embeds that carry
meaning for the reader.

Represent media on either a section (`idea.media`) or a specific paragraph
(`paragraph.media`). Use:

```js
{
  type: "image", // image, video, audio, or link
  src: "assets/source/example.jpg",
  alt: { en: "Concise accessibility description." },
  caption: { en: "Optional caption shown under the media." },
  credit: "Optional source credit",
  href: "https://example.com/original-media"
}
```

Prefer local files under `assets/source/` for stable images and diagrams. If
downloading is not practical, use the original media URL as `src` and keep an
`href` back to the source. Always include useful `alt` text for images. Use
captions to explain why the media matters instead of decorating the page.

## Bilingual Mode

When the user requests bilingual mode, add a language entry and add the same language code to localized fields:

```js
languages: [
  { code: "en", shortLabel: "EN", label: "English", menuTitle: "English", menuDescription: "Original text only", primary: true },
  { code: "es", shortLabel: "ES", label: "Spanish", menuTitle: "English + Spanish", menuDescription: "Line-by-line study mode" }
]
```

Then add translated values:

```js
paragraphs: [
  {
    text: {
      en: "Original paragraph.",
      es: "Parrafo traducido."
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

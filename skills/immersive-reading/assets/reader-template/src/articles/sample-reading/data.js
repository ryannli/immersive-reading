const article = {
  id: "sample-reading",
  slug: "sample-reading",
  template: "immersive-reading",
  title: {
    en: "Sample Reading"
  },
  author: "Source Author",
  description: {
    en: "A bespoke learning space for close study, notes, and source attribution."
  },
  source: {
    label: "Source material",
    authorLine: "by Source Author",
    url: "https://example.com/original",
    urlLabel: "example.com/original"
  },
  languages: [
    {
      code: "en",
      shortLabel: "EN",
      label: "English",
      menuTitle: "English",
      menuDescription: "Original text only",
      primary: true
    }
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
    quote: {
      en: "Replace this closing line with a final quote from the source."
    },
    quoteEmphasis: "",
    credit: "Generated as a learning space for close study."
  },
  chapters: [
    {
      n: 1,
      title: {
        en: "The Opening Idea"
      },
      essence: {
        en: "A concise orientation sentence that frames the first movement of the material."
      },
      words: 74,
      ideas: [
        {
          take: {
            en: "Start with the main promise of the source"
          },
          quote: {
            en: "A short quoted line anchors the section."
          },
          paragraphs: [
            {
              text: {
                en: "This sample paragraph shows the expected data shape. Replace it with the source text, a summary, or a translated study note."
              }
            },
            {
              text: {
                en: "The reader builds search, navigation, highlights, notes, and bilingual display from this article data."
              }
            }
          ],
          footnotes: []
        }
      ]
    },
    {
      n: 2,
      title: {
        en: "The Core Mechanism"
      },
      essence: {
        en: "The second chapter explains how the central idea works and why it matters."
      },
      words: 63,
      ideas: [
        {
          take: {
            en: "Separate claims, examples, and implications"
          },
          quote: {
            en: "The strongest sentence should be easy to find again."
          },
          paragraphs: [
            {
              text: {
                en: "Each section can contain multiple paragraphs, optional footnotes, and optional translations. The reader builds search, navigation, highlights, and notes from this data."
              }
            }
          ],
          footnotes: []
        }
      ]
    }
  ],
  footnotes: {}
};

export default article;

#!/usr/bin/env node
import fs from "node:fs";

const file = process.argv[2];
if (!file) {
  fail("Usage: node scripts/validate-article-data.mjs <article-data.js>");
}

const article = await loadArticle(file);
const errors = [];
const warnings = [];

function fail(message) {
  console.error(message);
  process.exit(1);
}

async function loadArticle(path) {
  try {
    const source = fs.readFileSync(path, "utf8");
    const url = `data:text/javascript;base64,${Buffer.from(source).toString("base64")}#${Date.now()}`;
    const mod = await import(url);
    return mod.default || mod.article;
  } catch (error) {
    fail(`Could not import article data: ${error.message}`);
  }
}

function textOf(value, lang = "en") {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return "";
  return value[lang] || value.en || Object.values(value)[0] || "";
}

function requireText(path, value) {
  if (!textOf(value).trim()) errors.push(`${path} must contain text`);
}

function wordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function validateMedia(path, media) {
  if (!media) return;
  if (!Array.isArray(media)) {
    warnings.push(`${path} should be an array when present`);
    return;
  }
  media.forEach((item, index) => {
    const itemPath = `${path}[${index}]`;
    const src = item?.src || item?.url || item?.href;
    if (!src) warnings.push(`${itemPath} is missing src/url/href`);
    const type = item?.type || "";
    if ((!type || type === "image") && !textOf(item?.alt).trim()) {
      warnings.push(`${itemPath} image media should include alt text`);
    }
  });
}

if (!article || typeof article !== "object") errors.push("default export must be an article object");
if (!article.id || !/^[a-z0-9-]+$/.test(article.id || "")) errors.push("article.id must be kebab-case");
requireText("title", article.title);
requireText("description", article.description);
if (!article.author) warnings.push("article.author is empty");
if (!article.source?.label) warnings.push("article.source.label is empty");
if (!article.source?.url) warnings.push("article.source.url is empty");

const languages = Array.isArray(article.languages) ? article.languages : [];
if (!languages.length) errors.push("article.languages must include at least one language");
const primary = languages.find((lang) => lang.primary) || languages[0];
if (!primary?.code) errors.push("primary language must have a code");
const translationLangs = languages.filter((lang) => lang.code && lang.code !== primary?.code);

const chapters = Array.isArray(article.chapters) ? article.chapters : [];
if (!chapters.length) errors.push("article.chapters must include at least one chapter");

let paragraphCount = 0;
let sectionCount = 0;
let translatedParagraphs = 0;
let totalWords = 0;

chapters.forEach((chapter, chapterIndex) => {
  const chapterPath = `chapters[${chapterIndex}]`;
  requireText(`${chapterPath}.title`, chapter.title);
  requireText(`${chapterPath}.essence`, chapter.essence);
  const ideas = Array.isArray(chapter.ideas) ? chapter.ideas : [];
  if (!ideas.length) errors.push(`${chapterPath}.ideas must include at least one section`);
  ideas.forEach((idea, ideaIndex) => {
    sectionCount += 1;
    const ideaPath = `${chapterPath}.ideas[${ideaIndex}]`;
    requireText(`${ideaPath}.take`, idea.take);
    requireText(`${ideaPath}.quote`, idea.quote);
    validateMedia(`${ideaPath}.media`, idea.media);
    const paragraphs = Array.isArray(idea.paragraphs) ? idea.paragraphs : [];
    if (!paragraphs.length) errors.push(`${ideaPath}.paragraphs must include at least one paragraph`);
    paragraphs.forEach((paragraph, paragraphIndex) => {
      paragraphCount += 1;
      const paragraphPath = `${ideaPath}.paragraphs[${paragraphIndex}].text`;
      requireText(paragraphPath, paragraph.text);
      validateMedia(`${ideaPath}.paragraphs[${paragraphIndex}].media`, paragraph.media);
      totalWords += wordCount(textOf(paragraph.text, primary?.code));
      if (translationLangs.some((lang) => textOf(paragraph.text, lang.code))) {
        translatedParagraphs += 1;
      }
    });
  });
});

if (translationLangs.length && translatedParagraphs < paragraphCount) {
  warnings.push(`Only ${translatedParagraphs}/${paragraphCount} paragraphs include translation text`);
}

if (errors.length) {
  console.error("Article data validation failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  if (warnings.length) {
    console.error("\nWarnings:");
    warnings.forEach((warning) => console.error(`- ${warning}`));
  }
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  id: article.id,
  title: textOf(article.title, primary?.code),
  chapters: chapters.length,
  sections: sectionCount,
  paragraphs: paragraphCount,
  primaryWords: totalWords,
  translationLanguages: translationLangs.map((lang) => lang.code),
  warnings
}, null, 2));

#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.resolve(here, "..");
const templateDir = path.join(skillRoot, "assets", "reader-template");

const args = parseArgs(process.argv.slice(2));
if (!args["article-data"] || !args.out) {
  fail("Usage: node scripts/scaffold-reader.mjs --article-data <data.js> --out <output-dir>");
}

const articleDataPath = path.resolve(args["article-data"]);
const outDir = path.resolve(args.out);
const article = await loadArticle(articleDataPath);

if (!article?.id || !/^[a-z0-9-]+$/.test(article.id)) {
  fail("article.id must exist and be kebab-case before scaffolding");
}

if (fs.existsSync(outDir) && fs.readdirSync(outDir).length && !args.force) {
  fail(`Output directory is not empty: ${outDir}. Pass --force to overwrite template files.`);
}

fs.mkdirSync(outDir, { recursive: true });
fs.cpSync(templateDir, outDir, { recursive: true, force: true });

const articlesDir = path.join(outDir, "src", "articles");
fs.rmSync(articlesDir, { recursive: true, force: true });
fs.mkdirSync(path.join(articlesDir, article.id), { recursive: true });
fs.copyFileSync(articleDataPath, path.join(articlesDir, article.id, "data.js"));
fs.writeFileSync(path.join(articlesDir, "index.js"), articleRegistry(article.id));

const indexPath = path.join(outDir, "index.html");
let html = fs.readFileSync(indexPath, "utf8");
const title = textOf(article.title);
const description = textOf(article.description) || "A bespoke learning space for close study.";
html = html
  .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)} · Immersive Reading</title>`)
  .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${escapeAttr(description)}">`)
  .replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${escapeAttr(title)} · Immersive Reading">`)
  .replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${escapeAttr(description)}">`)
  .replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${escapeAttr(title)} · Immersive Reading">`)
  .replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${escapeAttr(description)}">`);
fs.writeFileSync(indexPath, html);

console.log(JSON.stringify({
  ok: true,
  outDir,
  article: article.id,
  next: [
    `node ${path.join(skillRoot, "scripts", "serve-reader.mjs")} ${outDir} --port 8791`
  ]
}, null, 2));

function parseArgs(values) {
  const result = {};
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (!value.startsWith("--")) continue;
    const key = value.slice(2);
    const next = values[index + 1];
    if (!next || next.startsWith("--")) {
      result[key] = true;
    } else {
      result[key] = next;
      index += 1;
    }
  }
  return result;
}

async function loadArticle(file) {
  try {
    const source = fs.readFileSync(file, "utf8");
    const url = `data:text/javascript;base64,${Buffer.from(source).toString("base64")}#${Date.now()}`;
    const mod = await import(url);
    return mod.default || mod.article;
  } catch (error) {
    fail(`Could not import article data: ${error.message}`);
  }
}

function articleRegistry(articleId) {
  const importName = articleId.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase()).replace(/^[0-9]/, "article$&");
  return `import ${importName} from './${articleId}/data.js?v=1';

export const articles = {
  [${importName}.id]: ${importName}
};

export const defaultArticleId = ${importName}.id;

export function getArticle(id = defaultArticleId) {
  return articles[id] || articles[defaultArticleId];
}
`;
}

function textOf(value) {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return "";
  return value.en || Object.values(value)[0] || "";
}

function escapeHtml(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/"/g, "&quot;");
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

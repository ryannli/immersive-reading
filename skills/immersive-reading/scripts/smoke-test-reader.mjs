#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.argv[2] || ".");
const required = [
  "index.html",
  "src/app.js",
  "src/frontier.js",
  "src/styles.css",
  "src/articles/index.js",
  "assets/door-entrance-8s-scrub.mp4",
  "assets/door-entrance-8s-poster.jpg"
];
const forbidden = [
  "createReaderMetrics",
  "/api/pulse",
  "/api/metrics",
  "READ_PAUL_GRAHAM",
  "great-work-eta",
  "ranli.me",
  "paulgraham.com/greatwork",
  "Cinematic Reader"
];

const errors = [];
for (const file of required) {
  if (!fs.existsSync(path.join(root, file))) errors.push(`Missing ${file}`);
}

for (const file of walk(root)) {
  if (!/\.(html|js|css|json|md)$/.test(file)) continue;
  const text = fs.readFileSync(file, "utf8");
  if (file.includes(`${path.sep}src${path.sep}articles${path.sep}`)) {
    checkLocalSourceMedia(file, text);
  }
  for (const needle of forbidden) {
    if (text.includes(needle)) {
      errors.push(`Forbidden string "${needle}" found in ${path.relative(root, file)}`);
    }
  }
}

if (errors.length) {
  console.error("Reader smoke test failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(JSON.stringify({ ok: true, root }, null, 2));

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else files.push(full);
  }
  return files;
}

function checkLocalSourceMedia(file, text) {
  const matches = text.matchAll(/["'`](assets\/source\/[^"'`]+)["'`]/g);
  for (const match of matches) {
    const rel = match[1];
    if (!fs.existsSync(path.join(root, rel))) {
      errors.push(`Missing source media ${rel} referenced in ${path.relative(root, file)}`);
    }
  }
}

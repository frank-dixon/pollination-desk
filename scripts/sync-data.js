#!/usr/bin/env node
/**
 * Copy src/data JSON into docs/data for the static PWA.
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const src = path.join(root, "src", "data");
const dest = path.join(root, "docs", "data");

fs.mkdirSync(dest, { recursive: true });
for (const name of fs.readdirSync(src)) {
  if (!name.endsWith(".json")) continue;
  fs.copyFileSync(path.join(src, name), path.join(dest, name));
  console.log("synced", name, "→ docs/data/" + name);
}

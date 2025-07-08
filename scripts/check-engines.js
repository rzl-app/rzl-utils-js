#!/usr/bin/env node

import * as semver from "semver";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pkg = JSON.parse(
  readFileSync(join(__dirname, "../package.json"), "utf8")
);

const requiredNodeVersion = pkg.engines.node;

if (!semver.satisfies(process.version, requiredNodeVersion)) {
  console.error(`
🚨 Your Node.js version is ${process.version}, but this package requires ${requiredNodeVersion}.
Please upgrade your Node.js to a compatible version.
`);
  process.exit(1);
}

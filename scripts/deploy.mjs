/**
 * Build and publish to the gh-pages branch.
 *
 * Works with a plain `repo` token — no Actions and no `workflow` OAuth scope
 * needed. GitHub Pages then serves the branch directly.
 *
 *   npm run deploy
 *
 * Base path and site URL are derived from the `origin` remote, so there is
 * nothing to hardcode: a repo named `<owner>.github.io` publishes at the domain
 * root, anything else publishes under `/<repo>/`.
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const run = (cmd, args, opts = {}) =>
  execFileSync(cmd, args, { encoding: "utf8", stdio: "pipe", ...opts });

const runLoud = (cmd, args, opts = {}) =>
  execFileSync(cmd, args, { stdio: "inherit", ...opts });

function fail(message) {
  console.error(`\n  ${message}\n`);
  process.exit(1);
}

// --- Work out where this is going ----------------------------------------

let remote;
try {
  remote = run("git", ["remote", "get-url", "origin"]).trim();
} catch {
  fail(
    "No `origin` remote. Create the repo first, e.g.:\n" +
      "    gh repo create ai-compass --public --source=. --remote=origin --push"
  );
}

const match = remote.match(/github\.com[:/]([^/]+)\/(.+?)(?:\.git)?$/);
if (!match) fail(`Could not parse a GitHub owner/repo out of: ${remote}`);

const [, owner, repo] = match;
const isUserSite = repo.toLowerCase() === `${owner.toLowerCase()}.github.io`;
const base = isUserSite ? "/" : `/${repo}/`;
const siteUrl = `https://${owner.toLowerCase()}.github.io`;

console.log(`\n  owner    ${owner}`);
console.log(`  repo     ${repo}`);
console.log(`  base     ${base}`);
console.log(`  site     ${siteUrl}${base}\n`);

// --- Build ----------------------------------------------------------------

const dist = path.resolve("dist");
fs.rmSync(dist, { recursive: true, force: true });

runLoud("npm", ["run", "build"], {
  env: { ...process.env, VITE_BASE: base, VITE_SITE_URL: siteUrl },
});

// Stops GitHub Pages from running the output through Jekyll.
fs.writeFileSync(path.join(dist, ".nojekyll"), "");

// --- Publish --------------------------------------------------------------

// A throwaway repo inside dist/ keeps the branch history from polluting this
// working tree, and works on any git version.
fs.rmSync(path.join(dist, ".git"), { recursive: true, force: true });

const inDist = { cwd: dist };
run("git", ["init", "-q"], inDist);
run("git", ["checkout", "-q", "-b", "gh-pages"], inDist);
run("git", ["add", "-A"], inDist);
run(
  "git",
  ["-c", "user.name=deploy", "-c", "user.email=deploy@local", "commit", "-q", "-m", "Deploy AI Compass"],
  inDist
);

console.log("\n  pushing to gh-pages…");
runLoud("git", ["push", "-q", "-f", remote, "gh-pages:gh-pages"], inDist);
fs.rmSync(path.join(dist, ".git"), { recursive: true, force: true });

console.log(`
  Pushed.

  If this is the first deploy, turn Pages on once:
    gh api -X POST repos/${owner}/${repo}/pages \\
      -f source[branch]=gh-pages -f source[path]=/

  Or in the browser: Settings -> Pages -> Source: "Deploy from a branch"
  -> Branch: gh-pages / (root)

  Live at ${siteUrl}${base}   (first build takes a minute or two)
`);

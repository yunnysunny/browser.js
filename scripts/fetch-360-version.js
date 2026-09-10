/**
 * Fetch the latest Chrome/Chromium kernel version used by 360 browsers
 * and update MAX_360_CHROME_VERSION in browser.js if a newer version is found.
 *
 * Uses only Node.js built-in APIs (Node 18+).
 * Exit 0 = success (updated or no change needed)
 * Exit 1 = failure (both fetches failed or no version found)
 */

const fs = require('fs');
const path = require('path');

const URLS = [
  'https://browser.360.cn/se/',
  'https://browser.360.cn/ee/',
];

const BROWSER_JS = path.resolve(__dirname, '..', 'browser.js');
const TIMEOUT_MS = 15_000;

async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

function extractChromiumVersions(html) {
  const re = /Chromium\s*(\d+)/gi;
  const versions = [];
  let m;
  while ((m = re.exec(html)) !== null) {
    versions.push(parseInt(m[1], 10));
  }
  return versions;
}

async function main() {
  // Fetch all pages concurrently; tolerate partial failures
  const results = await Promise.allSettled(
    URLS.map(async (url) => {
      console.log(`Fetching ${url} ...`);
      const html = await fetchWithTimeout(url, TIMEOUT_MS);
      const versions = extractChromiumVersions(html);
      console.log(`  Found Chromium versions: ${versions.length ? versions.join(', ') : '(none)'}`);
      return versions;
    })
  );

  const allVersions = [];
  let failures = 0;
  for (const r of results) {
    if (r.status === 'fulfilled') {
      allVersions.push(...r.value);
    } else {
      failures++;
      console.error(`  Fetch failed: ${r.reason?.message || r.reason}`);
    }
  }

  if (allVersions.length === 0) {
    console.error('ERROR: Could not extract any Chromium version from 360 browser pages.');
    process.exit(1);
  }

  const latestVersion = Math.max(...allVersions);
  console.log(`\nLatest 360 Chromium version detected: ${latestVersion}`);

  // Read browser.js and find current value
  const src = fs.readFileSync(BROWSER_JS, 'utf-8');
  const match = src.match(/MAX_360_CHROME_VERSION\s*=\s*(\d+)/);
  if (!match) {
    console.error('ERROR: Could not find MAX_360_CHROME_VERSION in browser.js');
    process.exit(1);
  }

  const currentVersion = parseInt(match[1], 10);
  console.log(`Current MAX_360_CHROME_VERSION: ${currentVersion}`);

  if (latestVersion <= currentVersion) {
    console.log('No update needed.');
    process.exit(0);
  }

  // Update the file
  const updated = src.replace(
    /MAX_360_CHROME_VERSION\s*=\s*\d+/,
    `MAX_360_CHROME_VERSION = ${latestVersion}`
  );
  fs.writeFileSync(BROWSER_JS, updated, 'utf-8');
  console.log(`Updated MAX_360_CHROME_VERSION: ${currentVersion} → ${latestVersion}`);
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});

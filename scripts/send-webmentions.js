import fetch from "node-fetch";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { parseStringPromise } from "xml2js";
import dotenv from "dotenv";
import { prepareWebmentions } from "./prepare-webmentions.js";

dotenv.config();

const token = process.env.WEBMENTION_APP_TOKEN;
const sitemapPath = "_site/sitemap.xml";
const dataDir = "src/_data";
const outputPath = `${dataDir}/webmentions.json`;
const isDev = process.env.NODE_ENV === "development";

if (!token) {
  console.error("Missing WEBMENTION_APP_TOKEN in .env");
  process.exit(1);
}

async function getUrlsFromSitemap(path) {
  const xml = readFileSync(path, "utf8");
  const parsed = await parseStringPromise(xml);
  if (!parsed.urlset || !parsed.urlset.url) return [];
  return parsed.urlset.url.map((u) => u.loc[0]);
}

async function sendWebmention(url) {
  const api = `https://webmention.app/check?token=${token}&url=${encodeURIComponent(
    url,
  )}`;
  try {
    const res = await fetch(api, { method: "POST" });
    if (!res.ok) {
      console.error(`Failed: ${url} →`, res.status, await res.text());
      return [];
    }
    const json = await res.json();
    return json.urls || [];
  } catch (err) {
    console.error(`Error with ${url}:`, err);
    return [];
  }
}

function savePreparedWebmentions(allMentions) {
  if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
  writeFileSync(outputPath, JSON.stringify(allMentions, null, 2), "utf8");
  console.log(`Saved ${allMentions.length} webmentions to ${outputPath}`);
}

async function main() {
  let allMentions = [];

  if (!isDev) {
    // На проде собираем реальные webmentions
    const urls = await getUrlsFromSitemap(sitemapPath);
    console.log(`Found ${urls.length} URLs in sitemap`);

    for (const url of urls) {
      const mentions = await sendWebmention(url);
      allMentions.push(...mentions);
    }
  } else {
    console.log("Development mode — using fake webmentions only");
  }

  // Подготовка данных с учётом dev/prod
  const prepared = prepareWebmentions(allMentions);

  savePreparedWebmentions(prepared);
  console.log("Done sending webmentions");
}

main();

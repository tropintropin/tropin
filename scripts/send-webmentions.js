// scripts/send-webmentions.js
import fetch from "node-fetch";
import { readFileSync } from "fs";
import { parseStringPromise } from "xml2js";
import dotenv from "dotenv";

dotenv.config();

const token = process.env.WEBMENTION_APP_TOKEN;
const sitemapPath = "_site/sitemap.xml"; // путь к sitemap после билда

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
    url
  )}`;
  try {
    const res = await fetch(api, { method: "POST" });
    if (!res.ok) {
      console.error(`Failed: ${url} →`, res.status, await res.text());
      return;
    }
    const json = await res.json();
    console.log(`Checked: ${url} → ${JSON.stringify(json.urls)}`);
  } catch (err) {
    console.error(`Error with ${url}:`, err);
  }
}

async function main() {
  const urls = await getUrlsFromSitemap(sitemapPath);
  console.log(`Found ${urls.length} URLs in sitemap`);

  for (const url of urls) {
    await sendWebmention(url);
  }

  console.log("Done sending webmentions");
}

main();

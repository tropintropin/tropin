import EleventyFetch from "@11ty/eleventy-fetch";

export default async function () {
  const DOMAIN = process.env.WEBMENTION_DOMAIN;
  const TOKEN = process.env.WEBMENTION_TOKEN;

  if (!DOMAIN || !TOKEN) {
    console.warn("⚠️ Webmention DOMAIN or TOKEN missing in .env");
    return [];
  }

  const url = `https://webmention.io/api/mentions.jf2?domain=${DOMAIN}&token=${TOKEN}&per-page=1000`;

  try {
    const json = await EleventyFetch(url, {
      duration: "1h",
      type: "json",
      directory: ".cache",
    });

    return json.children || [];
  } catch (e) {
    console.error("❌ Webmention.io fetch failed:", e);
    return [];
  }
}

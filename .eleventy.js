// @ts-nocheck

// Eleventy configuration file

// Import Eleventy plugins
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import timeToRead from "eleventy-plugin-time-to-read";
import sitemap from "@quasibit/eleventy-plugin-sitemap";
import calendarPlugin from "@codegouvfr/eleventy-plugin-calendar";

// Other dependencies
import { DateTime } from "luxon";
import { execSync } from "child_process";
import dotenv from "dotenv";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import MarkdownIt from "markdown-it";

const md = new MarkdownIt();
const feedDataPath = path.resolve("./src/_data/feed.json");
const feedData = JSON.parse(fs.readFileSync(feedDataPath, "utf-8"));

dotenv.config();

/** @param {any} eleventyConfig */
export default async function (eleventyConfig) {
  // Passthrough for static assets
  eleventyConfig.addPassthroughCopy({ "src/root": "/" });
  eleventyConfig.addPassthroughCopy({ "src/assets/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/assets/css": "assets/css" });
  eleventyConfig.addPassthroughCopy({ "src/assets/images": "assets/images" });
  eleventyConfig.addPassthroughCopy({ "src/assets/js": "assets/js" });
  eleventyConfig.addPassthroughCopy({ "src/assets/pdf": "assets/pdf" });
  // Passthrough for Pagefind assets
  eleventyConfig.addPassthroughCopy({
    "node_modules/@pagefind/pagefind/dist": "pagefind",
  });

  /**
   * Helper: Filter drafts, sort by date, and inject prev/next navigation
   * @param {any} collectionApi
   * @param {string} tag
   */
  function getStandardCollection(collectionApi, tag) {
    const posts = collectionApi
      .getFilteredByTag(tag)
      .filter((item) => !item.data.draft);

    posts.sort((a, b) => b.date - a.date);

    posts.forEach((post, i) => {
      const newer = i > 0 ? posts[i - 1] : null;
      const older = i < posts.length - 1 ? posts[i + 1] : null;
      post.data.nav = {
        prev: older ? { url: older.url, title: older.data.title } : null,
        next: newer ? { url: newer.url, title: newer.data.title } : null,
      };
    });
    return posts;
  }

  // Collections

  eleventyConfig.addCollection("blog", (api) =>
    getStandardCollection(api, "blog"),
  );

  eleventyConfig.addCollection("research", (api) =>
    getStandardCollection(api, "research"),
  );

  eleventyConfig.addCollection("projects", (api) =>
    getStandardCollection(api, "projects"),
  );

  eleventyConfig.addCollection("events", (collectionApi) => {
    const now = new Date();

    const posts = collectionApi
      .getFilteredByTag("events")
      .filter((item) => !item.data.draft)
      .filter((item) => item.date >= now);

    posts.sort((a, b) => a.date - b.date);

    for (let i = 0; i < posts.length; i += 1) {
      const newer = i > 0 ? posts[i - 1] : null;
      const older = i < posts.length - 1 ? posts[i + 1] : null;
      posts[i].data.nav = {
        prev: newer ? { url: newer.url, title: newer.data.title } : null,
        next: older ? { url: older.url, title: older.data.title } : null,
      };
    }

    return posts;
  });

  eleventyConfig.addCollection("pastEvents", (collectionApi) => {
    const now = new Date();

    const posts = collectionApi
      .getFilteredByTag("events")
      .filter((item) => !item.data.draft)
      .filter((item) => item.date < now);

    posts.sort((a, b) => b.date - a.date);

    for (let i = 0; i < posts.length; i += 1) {
      const newer = i > 0 ? posts[i - 1] : null;
      const older = i < posts.length - 1 ? posts[i + 1] : null;
      posts[i].data.nav = {
        prev: newer ? { url: newer.url, title: newer.data.title } : null,
        next: older ? { url: older.url, title: older.data.title } : null,
      };
    }

    return posts;
  });

  eleventyConfig.addCollection("allPosts", function (collectionApi) {
    const blog = collectionApi.getFilteredByGlob("src/blog/*.md");
    const projects = collectionApi.getFilteredByGlob("src/projects/*.md");
    const research = collectionApi.getFilteredByGlob("src/research/*.md");
    const events = collectionApi.getFilteredByGlob("src/events/*.md");
    return [...blog, ...projects, ...research, ...events].sort(
      (a, b) => b.date - a.date,
    );
  });

  eleventyConfig.addCollection("sitemap", function (collectionApi) {
    return collectionApi.getAll().filter((item) => {
      return !item.data.eleventyExcludeFromCollections;
    });
  });

  // Plugins

  await eleventyConfig.addPlugin(syntaxHighlight);

  await eleventyConfig.addPlugin(calendarPlugin, {
    defaultLocation: "online",
    defaultOrganizer: {
      name: "Valery Tropin",
    },
  });

  await eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: ["webp", "jpeg"],
    widths: [300, 600, 1200, "auto"],
    // optional, attributes assigned on <img> nodes override these values
    htmlOptions: {
      imgAttributes: {
        loading: "lazy",
        decoding: "async",
      },
    },
  });

  await eleventyConfig.addPlugin(timeToRead, {
    speed: "1000 characters per minute",
    language: "ru",
    style: "long",
    type: "unit",
    hours: "auto",
    minutes: true,
    seconds: false,
    digits: 1,
    output: function (data) {
      return data.timing;
    },
  });

  eleventyConfig.addPlugin(sitemap, {
    lastModifiedProperty: "modified",
    sitemap: {
      hostname: "https://tropin.one",
    },
  });

  eleventyConfig.addPlugin(feedPlugin, {
    type: "atom",
    outputPath: "/feed.atom.xml",
    collection: {
      name: "allPosts",
      limit: 0,
    },
    metadata: {
      language: feedData.language || "ru",
      title: feedData.title,
      subtitle: feedData.descriptions.all,
      base: feedData.url,
      author: {
        name: feedData.author,
        email: "",
      },
    },
  });

  // Filters

  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return new Date(dateObj).toLocaleDateString("ru-RU");
  });

  eleventyConfig.addFilter("date", (dateInput, format = "dd.MM.yyyy HH:mm") => {
    let dt;
    if (typeof dateInput === "string") {
      dt = DateTime.fromISO(dateInput, { setZone: true });
    } else {
      dt = DateTime.fromJSDate(dateInput, { zone: "Europe/Moscow" });
    }
    return dt.setLocale("ru").toFormat(format);
  });

  /** @param {any[]} events */
  eleventyConfig.addFilter("mapEventForCalendar", function (events) {
    return events
      .filter((ev) => ev.data?.start)
      .map((ev) => {
        let start = ev.data.start;
        let end = ev.data.end;

        // if end is missing or before start, set end to one hour after start
        if (!end || new Date(end) < new Date(start)) {
          const dt = DateTime.fromISO(start);
          end = dt.plus({ hours: 1 }).toISO();
        }

        return {
          data: {
            ...ev.data,
            start,
            end,
            location: `${ev.data.location?.name || ""}, ${
              ev.data.location?.address || ""
            }`.trim(),
            organizer: {
              name: ev.data.organizer?.name || "",
              email: ev.data.organizer?.email || "noreply@example.com",
            },
          },
        };
      });
  });

  eleventyConfig.addFilter("gitLastMod", (filePath) => {
    if (!filePath) return new Date();
    try {
      const cleanPath = filePath.replace(/^\.\//, "");
      const result = execSync(`git log -1 --format=%at -- "${cleanPath}"`);
      const timestamp = parseInt(result.toString().trim(), 10);

      if (isNaN(timestamp)) return new Date();

      return new Date(timestamp * 1000);
    } catch (e) {
      return new Date();
    }
  });

  // Shortcodes & Global Data

  eleventyConfig.addGlobalData(
    "thunderforestKey",
    process.env.THUNDERFOREST_KEY,
  );

  eleventyConfig.addGlobalData("webmentions", async () => {
    const domain = process.env.WEBMENTION_DOMAIN;
    const token = process.env.WEBMENTION_TOKEN;

    // NB! For dev:
    if (process.env.NODE_ENV === "development") {
      return [];
    }

    if (!domain || !token) {
      console.warn("WEBMENTION_DOMAIN or WEBMENTION_TOKEN is missing!");
      return [];
    }
    try {
      const res = await fetch(
        `https://webmention.io/api/mentions.jf2?domain=${domain}&token=${token}`,
      );
      const data = await res.json();
      return data.children || [];
    } catch (err) {
      console.error("Failed to fetch webmentions:", err);
      return [];
    }
  });

  /** @param {{url: string, alt?: string, caption?: string}[]} images */
  eleventyConfig.addShortcode("carousel", function (images) {
    if (!images || !images.length) return "";

    const items = images
      .map(
        (img, index) => `
      <figure class="carousel-item">
        <img src="${img.url}" alt="${img.alt || ""}" ${index > 0 ? 'loading="lazy"' : ""}>
        <figcaption>${index + 1}. ${img.caption || ""}</figcaption>
      </figure>
    `,
      )
      .join("");

    return `
      <div class="figure-content carousel-container">
        <div class="carousel-counter">1 / ${images.length}</div>
        <button class="carousel-btn prev" aria-label="Назад">‹</button>
        <button class="carousel-btn next" aria-label="Вперед">›</button>
        <div class="carousel-track">
          ${items}
        </div>
      </div>
    `;
  });

  /** @param {any} data */
  eleventyConfig.addShortcode("img", function (data) {
    const renderFigure = (item) => `
    <figure class="figure-content">
      <img src="${item.url}" alt="${item.alt || item.caption || ""}" loading="lazy">
      ${item.caption ? `<figcaption>${item.caption}</figcaption>` : ""}
    </figure>
  `;

    if (Array.isArray(data)) {
      const gridItems = data.map((item) => renderFigure(item)).join("");
      return `<div class="image-grid">${gridItems}</div>`;
    }

    return renderFigure(data);
  });

  eleventyConfig.addPairedShortcode("quote", function (content, caption) {
    const figcaption = caption
      ? `<figcaption class="quote-caption">${caption}</figcaption>`
      : "";

    return `
    <figure class="quote">
      <blockquote>${content.trim()}</blockquote>
      ${figcaption}
    </figure>
  `;
  });

  eleventyConfig.addPairedShortcode("dropcap", (content) => {
    const rendered = md.renderInline(content.trim());
    return `<p class="drop-cap">${rendered}</p>`;
  });

  eleventyConfig.addShortcode("googleMap", (url, caption = "") => {
    return `
    <div class="map-frame map-frame--google-embed">
      <iframe
        src="${url}"
        loading="lazy"
        fetchpriority="low"
        title="${caption}"
        style="border:0;"
        allowfullscreen=""
        referrerpolicy="no-referrer-when-downgrade">
      </iframe>
    </div>  `;
  });

  eleventyConfig.addShortcode("pdf", (url, page = 1, title = "PDF Viewer") => {
    return `
    <div class="pdf-frame">
      <iframe
        src="${url}#zoom=page-fit&page=${page}"
        title="${title}"
        loading="lazy"
        frameborder="0">
      </iframe>
    </div>
  `;
  });

  eleventyConfig.addShortcode("gif", function (name, alt, width) {
    const gifAlt = alt || "";
    const gifWidth = width || "480";
    const finalWidth = /[%|px|em|rem|vw]/.test(gifWidth)
      ? gifWidth
      : `${gifWidth}px`;
    const basePath = "/assets/images/gifs/";

    return `
<figure class="gif-frame" style="max-width: ${finalWidth};">
  <video
    autoplay loop muted playsinline
    poster="${basePath}${name}-poster.webp"
    preload="none"
    style="width: 100%; height: auto; display: block; border-radius: inherit;"
    aria-label="${gifAlt}">
      <source src="${basePath}${name}.webm" type="video/webm">
      <source src="${basePath}${name}.mp4" type="video/mp4">
  </video>
  ${gifAlt ? `<figcaption>${gifAlt}</figcaption>` : ""}
</figure>`.trim();
  });

  // Directory options
  eleventyConfig.ignores.add("src/_templates/**");
  return {
    dir: { input: "src", output: "_site" },
  };
}

// @ts-check

import pluginRss from "@11ty/eleventy-plugin-rss";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import timeToRead from "eleventy-plugin-time-to-read";
import sitemap from "@quasibit/eleventy-plugin-sitemap";
import calendarPlugin from "@codegouvfr/eleventy-plugin-calendar";
import { DateTime } from "luxon";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

export default async function (eleventyConfig) {
  // Plugins
  await eleventyConfig.addPlugin(pluginRss);
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
    speed: '1000 characters per minute',
    language: 'ru',
    style: 'long',
    type: 'unit',
    hours: 'auto',
    minutes: true,
    seconds: false,
    digits: 1,
    output: function(data) {
      return data.timing;
    } 
  });
  eleventyConfig.addPlugin(sitemap, {
    lastModifiedProperty: "modified",
    sitemap: {
      hostname: "https://tropin.one",
    },
  });

  // Passthrough for static assets
  eleventyConfig.addPassthroughCopy({ "src/root": "/" });
  eleventyConfig.addPassthroughCopy({ "src/assets/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/assets/css": "assets/css" });
  eleventyConfig.addPassthroughCopy({ "src/assets/images": "assets/images" });
  eleventyConfig.addPassthroughCopy({ "src/assets/js": "assets/js" });
  eleventyConfig.addPassthroughCopy({
    "node_modules/@pagefind/pagefind/dist": "pagefind",
  });

  // Collections
  eleventyConfig.addCollection("blog", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/blog/*.md").toReversed();
  });
  eleventyConfig.addCollection("projects", (collectionApi) =>
    collectionApi.getFilteredByGlob("src/projects/*.md").toReversed()
  );
  eleventyConfig.addCollection("research", (collectionApi) =>
    collectionApi.getFilteredByGlob("src/research/*.md").toReversed()
  );
  eleventyConfig.addCollection("events", (collectionApi) =>
    collectionApi.getFilteredByGlob("src/events/*.md").toReversed()
  );
  eleventyConfig.addCollection("sitemap", function (collectionApi) {
    return collectionApi.getAll().filter((item) => {
      return !item.data.eleventyExcludeFromCollections;
    });
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

  eleventyConfig.addGlobalData(
    "thunderforestKey",
    process.env.THUNDERFOREST_KEY
  );

  eleventyConfig.addGlobalData("webmentions", async () => {
    const domain = process.env.WEBMENTION_DOMAIN;
    const token = process.env.WEBMENTION_TOKEN;

    if (!domain || !token) {
      console.warn("WEBMENTION_DOMAIN or WEBMENTION_TOKEN is missing!");
      return [];
    }

    try {
      const res = await fetch(
        `https://webmention.io/api/mentions.jf2?domain=${domain}&token=${token}`
      );
      const data = await res.json();
      return data.children || [];
    } catch (err) {
      console.error("Failed to fetch webmentions:", err);
      return [];
    }
  });

  // Directory options
  eleventyConfig.ignores.add("src/_templates/**");
  return {
    dir: { input: "src", output: "_site" },
  };
}

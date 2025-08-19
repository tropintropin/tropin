// @ts-check

import pluginRss from "@11ty/eleventy-plugin-rss";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import calendarPlugin from "@codegouvfr/eleventy-plugin-calendar";
import { DateTime } from "luxon";
import dotenv from "dotenv";

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

  // Directory options
  eleventyConfig.ignores.add("src/_templates/**");
  return {
    dir: { input: "src", output: "_site" },
  };
}

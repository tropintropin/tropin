// @ts-check

import pluginRss from "@11ty/eleventy-plugin-rss";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

export default async function (eleventyConfig) {
  // Plugins
  await eleventyConfig.addPlugin(pluginRss);
  await eleventyConfig.addPlugin(syntaxHighlight);
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
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({
    "node_modules/@pagefind/pagefind/dist": "pagefind",
  });

  // Collections
  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/blog/*.md").reverse();
  });
  eleventyConfig.addCollection("projects", (collectionApi) =>
    collectionApi.getFilteredByGlob("src/projects/*.md").reverse()
  );
  eleventyConfig.addCollection("publications", (collectionApi) =>
    collectionApi.getFilteredByGlob("src/publications/*.md").reverse()
  );
  eleventyConfig.addCollection("videos", (collectionApi) =>
    collectionApi.getFilteredByGlob("src/videos/*.md").reverse()
  );

  // Filters
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return new Date(dateObj).toLocaleDateString("ru-RU");
  });

  // Directory options
  return {
    dir: { input: "src", output: "_site" },
  };
}

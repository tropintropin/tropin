// .eleventy.js
const pluginRss = require("@11ty/eleventy-plugin-rss");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const Image = require("@11ty/eleventy-img");

module.exports = function (eleventyConfig) {
  // Plugins
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(syntaxHighlight);

  // Passthrough for static assets
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

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

  // Shortcode: responsive image (example)
  async function imageShortcode(src, alt, sizes = "100vw") {
    if (!alt) throw new Error("Missing `alt` on image.");
    let metadata = await Image(src, {
      widths: [300, 600, 1200],
      formats: ["webp", "jpeg"],
      outputDir: "_site/assets/images/",
    });
    return Image.generateHTML(metadata, {
      alt,
      sizes,
      loading: "lazy",
      decoding: "async",
    });
  }
  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);

  // Directory options
  return {
    dir: { input: "src", output: "_site" },
  };
};

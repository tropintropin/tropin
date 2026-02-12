// scripts/prepare-webmentions.js

/**
 * Подготавливает массив webmentions для Eleventy
 * - В dev возвращает фейковые данные
 * - В prod возвращает реальные (allMentions)
 *
 * @param {Array} allMentions - массив реальных webmentions
 * @returns {Array} подготовленный массив для Eleventy
 */
export function prepareWebmentions(allMentions) {
  if (process.env.NODE_ENV === "development") {
    // Фейковые данные для разработки
    return [
      {
        "wm-target": "/blog/test-post-1/",
        "wm-property": "in-reply-to",
        url: "https://example.com/post1",
        author: { name: "Alice", url: "https://alice.example.com" },
        content: { text: "Комментарий к посту 1. Очень интересная статья!" },
      },
      {
        "wm-target": "/blog/test-post-2/",
        "wm-property": "like-of",
        url: "https://example.com/post2",
        author: { name: "Bob", url: "https://bob.example.com" },
        content: { text: "Мне понравился этот пост!" },
      },
      {
        "wm-target": "/blog/test-post-3/",
        "wm-property": "repost-of",
        url: "https://example.com/post3",
        author: { name: "Carol", url: "https://carol.example.com" },
        content: { text: "Репост интересного материала." },
      },
    ];
  }

  // На проде возвращаем только реальные webmentions
  return allMentions || [];
}

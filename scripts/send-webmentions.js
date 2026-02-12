import dotenv from "dotenv";
import fs from "fs";
import path from "path";
dotenv.config();

const SITEMAP_PATH = path.join(process.cwd(), "_site/sitemap.xml");
const TOKEN = process.env.WEBMENTION_APP_TOKEN;

async function run() {
  if (!TOKEN) {
    console.error("❌ Ошибка: WEBMENTION_APP_TOKEN не найден");
    return;
  }

  try {
    console.log(`🚀 Анализирую локальный sitemap...`);
    const xml = fs.readFileSync(SITEMAP_PATH, "utf-8");

    // Регулярка для вытаскивания блоков <url>...</url>
    const urlBlockRegex = /<url>([\s\S]*?)<\/url>/g;
    const today = new Date().toISOString().split("T")[0]; // ГГГГ-ММ-ДД

    const urlsToProcess = [];
    let match;

    while ((match = urlBlockRegex.exec(xml)) !== null) {
      const block = match[1];
      const loc = block.match(/<loc>(.*?)<\/loc>/)?.[1];
      const lastmod = block.match(/<lastmod>(.*?)<\/lastmod>/)?.[1];

      if (loc && lastmod) {
        // Проверяем, совпадает ли дата изменения с сегодняшней
        if (lastmod.startsWith(today)) {
          urlsToProcess.push(loc);
        }
      }
    }

    if (urlsToProcess.length === 0) {
      console.log(
        "grey",
        `☕️ Сегодня обновлений не найдено (${today}). Отдыхаем.`,
      );
      return;
    }

    console.log(
      `🎯 Найдено обновленных страниц сегодня: ${urlsToProcess.length}`,
    );

    for (const source of urlsToProcess) {
      console.log(`📡 Запрос на проверку: ${source}`);

      try {
        const response = await fetch("https://webmention.app/check", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: source }),
        });

        const data = await response.json();
        if (response.ok) {
          console.log(
            `  ✅ Готово. Ссылок обработано: ${data.links?.length || 0}`,
          );
        } else {
          console.log(`  ⚠️ Ошибка API: ${data.error || response.statusText}`);
        }
      } catch (e) {
        console.error(`  ❌ Ошибка сети для ${source}`);
      }

      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    console.log("🏁 Рассылка завершена.");
  } catch (error) {
    console.error("❌ Ошибка скрипта:", error.message);
  }
}

run();

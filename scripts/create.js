#!/usr/bin/env node

import { existsSync, readFileSync, mkdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { createInterface } from "readline";

const CONFIG = {
  blog: { template: "blog.md", folder: "blog" },
  event: { template: "event.md", folder: "events" },
  project: { template: "project.md", folder: "projects" },
  research: { template: "research.md", folder: "research" },
};

const TIMEZONE = "+03:00";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (q) => new Promise((res) => rl.question(q, res));

/* ---------- helpers ---------- */

const pad = (n) => String(n).padStart(2, "0");

const today = () => {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

const nowTime = () => {
  const now = new Date();
  return `${pad(now.getHours())}:${pad(now.getMinutes())}`;
};

const isValidDate = (str) => /^\d{4}-\d{2}-\d{2}$/.test(str);
const isValidTime = (str) => /^\d{2}:\d{2}$/.test(str);

const iso = (date, time = "00:00") => `${date}T${time}:00${TIMEZONE}`;

const slugify = (str) => {
  const map = {
    ё: "yo",
    й: "j",
    ц: "ts",
    у: "u",
    к: "k",
    е: "e",
    н: "n",
    г: "g",
    ш: "sh",
    щ: "sch",
    з: "z",
    х: "h",
    ъ: "",
    ф: "f",
    ы: "y",
    в: "v",
    а: "a",
    п: "p",
    р: "r",
    о: "o",
    л: "l",
    д: "d",
    ж: "zh",
    э: "e",
    я: "ya",
    ч: "ch",
    с: "s",
    м: "m",
    и: "i",
    т: "t",
    ь: "",
    б: "b",
    ю: "yu",
  };

  return str
    .toLowerCase()
    .split("")
    .map((c) => map[c] || c)
    .join("")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

function replaceFrontmatterField(content, field, value) {
  const regex = new RegExp(`^${field}: ".*?"`, "m");
  return content.replace(regex, `${field}: "${value}"`);
}

/* ---------- main ---------- */

async function main() {
  console.log("--- 11ty Content Generator ---");

  const typeKeys = Object.keys(CONFIG);
  let type = process.argv[2];

  if (!type || !CONFIG[type]) {
    console.log("\nВыберите тип контента:");
    typeKeys.forEach((key, index) => {
      console.log(`${index + 1}. ${key}`);
    });

    const choice = await ask("\nВведите номер или название: ");
    const index = parseInt(choice) - 1;

    if (index >= 0 && index < typeKeys.length) {
      type = typeKeys[index];
    } else {
      type = choice;
    }
  }

  const conf = CONFIG[type];
  if (!conf) {
    console.error("\n[Ошибка] Неверный тип контента.");
    process.exit(1);
  }

  console.log(`\nСоздаем: ${type.toUpperCase()}`);
  const title = await ask("Заголовок: ");

  let dateInput =
    (await ask("Дата (YYYY-MM-DD, Enter = сегодня): ")) || today();

  if (!isValidDate(dateInput)) {
    console.error("[Ошибка] Дата должна быть в формате YYYY-MM-DD");
    process.exit(1);
  }

  let startTime = "00:00";
  let endTime = "00:00";

  if (type === "event" || type === "project") {
    const startInput =
      (await ask("Время начала (HH:MM, Enter = 00:00): ")) || "00:00";
    if (!isValidTime(startInput)) {
      console.error("[Ошибка] Неверный формат времени.");
      process.exit(1);
    }

    const endInput =
      (await ask("Время окончания (HH:MM, Enter = начало): ")) || startInput;
    if (!isValidTime(endInput)) {
      console.error("[Ошибка] Неверный формат времени.");
      process.exit(1);
    }

    startTime = startInput;
    endTime = endInput;
  } else {
    if (dateInput === today()) {
      startTime = nowTime();
    }
  }

  const slug = slugify(title) || "untitled";
  const filename = `${dateInput}-${slug}.md`;

  const templatePath = join("src/_templates", conf.template);
  const targetPath = join("src", conf.folder, filename);

  if (!existsSync(templatePath)) {
    console.error(`[Ошибка] Шаблон ${templatePath} не найден.`);
    process.exit(1);
  }

  if (existsSync(targetPath)) {
    console.error(`[Ошибка] Файл ${targetPath} уже существует.`);
    process.exit(1);
  }

  let content = readFileSync(templatePath, "utf8");

  content = replaceFrontmatterField(content, "title", title);

  if (type === "blog" || type === "research") {
    content = replaceFrontmatterField(
      content,
      "date",
      iso(dateInput, startTime),
    );
  } else {
    content = replaceFrontmatterField(
      content,
      "start",
      iso(dateInput, startTime),
    );
    content = replaceFrontmatterField(content, "end", iso(dateInput, endTime));
  }

  mkdirSync(dirname(targetPath), { recursive: true });
  writeFileSync(targetPath, content);

  console.log(`\nГотово! Создан файл: ${targetPath}`);
  rl.close();
}

main();

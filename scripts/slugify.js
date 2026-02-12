const map = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ё: "yo",
  ж: "zh",
  з: "z",
  и: "i",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "kh",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "shch",
  ъ: "",
  ы: "y",
  ь: "",
  э: "e",
  ю: "yu",
  я: "ya",
};

const combos = [
  ["ий", "y"],
  ["ый", "y"],
  ["ой", "oy"],
  ["ая", "aya"],
  ["яя", "ya"],
  ["ия", "ia"],
  ["ье", "ye"],
  ["ья", "ya"],
  ["ые", "ye"],
  ["ое", "oe"],
  ["ъ", ""],
  ["ь", ""],
];

export function slugify(str) {
  if (!str) return "untitled";

  let s = str.toLowerCase();

  combos.forEach(([ru, en]) => {
    s = s.replace(new RegExp(ru, "g"), en);
  });

  s = s
    .split("")
    .map((c) => map[c] || c)
    .join("");

  s = s.replace(/[^a-z0-9-]+/g, "-");

  s = s.replace(/^-+|-+$/g, "");

  return s || "untitled";
}

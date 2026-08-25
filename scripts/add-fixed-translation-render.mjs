import fs from "node:fs";
const file = new URL("../components/BusinessJapanesePlayer.tsx", import.meta.url);
const source = fs.readFileSync(file, "utf8");
const before = 'annotation?.meaning ?? "整句翻译生成中……"';
const after = 'fixedBusinessMeaning(text, page.page) ?? annotation?.meaning ?? "整句翻译生成中……"';
if (!source.includes(before)) throw new Error("Translation render target not found");
fs.writeFileSync(file, source.replace(before, after));

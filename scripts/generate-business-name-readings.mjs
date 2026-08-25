import fs from "node:fs";

const pages = JSON.parse(fs.readFileSync("data/business-pages.json", "utf8"));
const corrections = JSON.parse(fs.readFileSync("data/business-pages-corrections-92-96.json", "utf8"));
const notes = JSON.parse(fs.readFileSync("data/business-language-notes.json", "utf8"));
const corrected = pages.map(page => corrections.find(item => item.page === page.page) ?? page);
const names = [...new Set(corrected.flatMap(page => page.groups.flatMap(group => group.lines))
  .map(line => line.match(/^[①-㊿❶-❿女男\s]*([^：:]{1,12})[：:]/)?.[1]?.trim())
  .filter(name => name && /^[一-龯々]{1,8}$/.test(name)))];
const counts = {};
for (const analysis of Object.values(notes)) {
  for (const item of analysis.readings ?? []) {
    if (!names.includes(item.surface)) continue;
    counts[item.surface] ??= {};
    counts[item.surface][item.reading] = (counts[item.surface][item.reading] ?? 0) + 1;
  }
}
const excluded = new Set(["研", "第", "受付", "面接官", "日米", "常物", "粤", "厖", "履", "参一", "明々軒"]);
const output = {};
for (const name of names) {
  if (excluded.has(name) || !counts[name]) continue;
  output[name] = Object.entries(counts[name]).sort((a, b) => b[1] - a[1])[0][0];
}
Object.assign(output, {
  "畔川": "あぜかわ", "伍堂": "ごどう", "鈴元": "すずもと", "梨元": "なしもと",
  "小金沢": "こがねざわ", "佐坂": "ささか", "住谷": "すみたに", "政岡": "まさおか",
  "岩倉": "いわくら", "宮沢": "みやざわ", "大林": "おおばやし", "伊勢": "いせ",
  "富山": "とやま", "清水": "しみず", "香川": "かがわ", "松阪": "まつさか"
});
fs.writeFileSync("data/business-name-readings.json", JSON.stringify(output, null, 2) + "\n");
console.log(`Wrote ${Object.keys(output).length} Japanese name readings.`);

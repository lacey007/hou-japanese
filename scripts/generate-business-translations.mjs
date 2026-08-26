import fs from "node:fs";

const pages = JSON.parse(fs.readFileSync("data/business-pages.json", "utf8"));
const correctionFiles = [
  "data/business-pages-corrections-8-18.json",
  "data/business-pages-corrections-92-96.json",
  "data/business-pages-corrections-97-110.json",
];
const corrections = correctionFiles.flatMap(file => JSON.parse(fs.readFileSync(file, "utf8")));
const curated = JSON.parse(fs.readFileSync("data/business-translations-79-90.json", "utf8"));
const outputPath = "data/business-translations-all.json";
const output = fs.existsSync(outputPath) ? JSON.parse(fs.readFileSync(outputPath, "utf8")) : {};
for (const page of Object.values(curated)) Object.assign(output, page);
const corrected = pages.map(page => corrections.find(item => item.page === page.page) ?? page);
const isHeading = line => /^[0-9０-９]{1,2}[.．、]?(?![0-9０-９])/.test(line)
  && line.length < 60
  && !/[.!?。！？]$/.test(line);
const lines = [...new Set(corrected.flatMap(page => page.groups.flatMap(group => group.lines)))]
  .filter(line => line && !isHeading(line) && !/^[（(].*[）)]$/.test(line) && /[ぁ-んァ-ヶ一-龯々]/.test(line));

async function translate(text) {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const url = `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=ja&tl=zh-CN&q=${encodeURIComponent(text)}`;
      const response = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = await response.text();
      if (!payload) throw new Error("Empty response");
      const data = JSON.parse(payload);
      const value = (Array.isArray(data) ? data[0] : "")?.trim();
      if (value) return value;
    } catch (error) {
      if (attempt === 3) console.error(`FAILED ${text} | ${error}`);
      await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)));
    }
  }
  return "";
}

const pending = lines.filter(line => !output[line] || /校订|本句要点|暂时无法/.test(output[line]));
let cursor = 0;
const workers = Array.from({ length: 6 }, async () => {
  while (cursor < pending.length) {
    const index = cursor++;
    const line = pending[index];
    const value = await translate(line);
    if (value) output[line] = value;
    if ((index + 1) % 25 === 0) {
      fs.writeFileSync(outputPath, JSON.stringify(output, null, 2) + "\n");
      console.log(`PROGRESS ${index + 1}/${pending.length}`);
    }
  }
});
await Promise.all(workers);
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2) + "\n");
console.log(`DONE translated=${Object.keys(output).length} readable=${lines.length}`);

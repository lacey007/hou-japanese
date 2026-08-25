import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const packageRoot = process.env.KUROMOJI_PACKAGE;
if (!packageRoot) throw new Error("KUROMOJI_PACKAGE is required");
const kuromoji = require(path.join(packageRoot, "src", "kuromoji.js"));
const pages = JSON.parse(fs.readFileSync("data/business-pages.json", "utf8"));
const kataToHira = value => (value || "").replace(/[ァ-ヶ]/g, char => String.fromCharCode(char.charCodeAt(0) - 0x60));
const hasKanji = value => /[一-龯々〆ヵヶ]/.test(value);

const tokenizer = await new Promise((resolve, reject) => kuromoji.builder({ dicPath: path.join(packageRoot, "dict") }).build((error, value) => error ? reject(error) : resolve(value)));
const lines = [...new Set(pages.flatMap(page => page.groups.flatMap(group => group.lines)))];
const output = {};

for (const line of lines) {
  const tokens = tokenizer.tokenize(line);
  const readings = [];
  const verbs = [];
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (hasKanji(token.surface_form) && token.reading) {
      let surface = token.surface_form;
      let reading = kataToHira(token.reading);
      const next = tokens[index + 1];
      if (token.pos === "動詞" && next && /^[てで]$/.test(next.surface_form)) {
        surface += next.surface_form;
        reading += kataToHira(next.reading);
      }
      readings.push({ surface, reading });
    }
    if (token.pos === "動詞" && token.basic_form && token.basic_form !== "*") {
      const baseToken = tokenizer.tokenize(token.basic_form)[0];
      let shown = token.surface_form;
      const next = tokens[index + 1];
      if (next && /^[てで]$/.test(next.surface_form)) shown += next.surface_form;
      verbs.push({ surface: shown, base: token.basic_form, reading: kataToHira(baseToken?.reading || token.reading) });
    }
  }
  if (/おつなぎいたします/.test(line)) verbs.unshift({ surface: "おつなぎいたします", base: "つなぐ", reading: "つなぐ" });
  output[line] = {
    readings: [...new Map(readings.map(item => [`${item.surface}|${item.reading}`, item])).values()],
    verbs: [...new Map(verbs.map(item => [`${item.surface}|${item.base}`, item])).values()],
  };
}

fs.writeFileSync("data/business-language-notes.json", JSON.stringify(output) + "\n");
console.log(`Generated language notes for ${lines.length} unique lines.`);

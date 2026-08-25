import fs from "node:fs";
const file = new URL("../components/BusinessJapanesePlayer.tsx", import.meta.url);
let source = fs.readFileSync(file, "utf8");
source = source.replace("Nanami · 自然女声", "设备日语女声优先").replace("Keita · 自然男声", "设备日语男声优先");
fs.writeFileSync(file, source);

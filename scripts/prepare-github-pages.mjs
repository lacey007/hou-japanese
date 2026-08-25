import fs from "node:fs";

const listening = new URL("../components/ListeningPlayer.tsx", import.meta.url);
let source = fs.readFileSync(listening, "utf8");
source = source.replace(
  'export default function ListeningPlayer({ lesson }: { lesson: Lesson }) {',
  'export default function ListeningPlayer({ lesson }: { lesson: Lesson }) {\n  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";'
);
source = source.replace('src={`/audio/neural/${voice}/${lesson.id}-${index}.mp3`}', 'src={`${basePath}/audio/neural/${voice}/${lesson.id}-${index}.mp3`}');
fs.writeFileSync(listening, source);

const business = new URL("../app/business-japanese/page.tsx", import.meta.url);
source = fs.readFileSync(business, "utf8");
source = source.replace(
  'export default function BusinessJapanesePage() {',
  'export default function BusinessJapanesePage() {\n  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";\n  const staticPages = pages.map(page => ({ ...page, image: `${basePath}${page.image}` }));'
);
source = source.replace('<BusinessJapanesePlayer pages={pages}/>', '<BusinessJapanesePlayer pages={staticPages}/>');
source = source.replace('自然男声或女声朗读', '设备内置日语语音朗读');
fs.writeFileSync(business, source);

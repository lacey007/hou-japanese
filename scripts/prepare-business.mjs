import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const source = JSON.parse(fs.readFileSync(path.join(root, "work/business-ocr-pages.json"), "utf8").replace(/^\uFEFF/, ""));
const imageSource = path.join(root, "work/business-pdf-pages");
const imageTarget = path.join(root, "public/business-japanese-v2");
fs.mkdirSync(imageTarget, { recursive: true });

const japanese = /[ぁ-んァ-ヶ一-龯々〆ヵヶ]/;
function cleanLine(value) {
  let line = value.trim();
  if (!japanese.test(line)) return "";
  line = line.replace(/[A-Za-z]+(?:[ .,'’\-]+[A-Za-z]+)*/g, "");
  line = line.replace(/[ \t　]+/g, "");
  line = line.replace(/^[・.·,，、]+|[・.·,，、]+$/g, "");
  if (!japanese.test(line)) return "";
  if (/^[一-龯々]$/.test(line)) return "";
  if (/^[ぁ-んァ-ヶー]+$/.test(line) && line.length <= 15 && line !== "まえがき") return "";
  const kanaCount = (line.match(/[ぁ-んァ-ヶー]/g) ?? []).length;
  const kanjiCount = (line.match(/[一-龯々]/g) ?? []).length;
  if (line.length <= 15 && kanaCount >= 3 && kanjiCount <= 1 && !/[。！？!?：:]/.test(line) && line !== "まえがき") return "";
  line = line.replace(/^[ー－一く＜<]+(?=得意先|新しい担当)/, "");
  line = line.replace(/^([一-龯ァ-ヶ々]{1,12})[.．](?=[ぁ-んァ-ヶ一-龯々])/, "$1：");
  const heading = line.replace(/[【】〈〉［］\[\]()（）]/g, "");
  if (["基本会話", "戦略表現", "実用会話"].includes(heading) || heading.endsWith("決まり文句")) return `【${heading}】`;
  return line;
}

function makeSegments(text) {
  const lines = text.split(/\r?\n/);
  const notes = lines.findIndex(line => /^\s*Notes\s*$/i.test(line));
  const sourceLines = notes >= 0 ? lines.slice(0, notes) : lines;
  const result = [];
  let practical = 0;
  for (const rawLine of sourceLines) {
    const compact = rawLine.replace(/[ \t　]+/g, "");
    const scenarioBody = compact.replace(/^[ー－][く、＜<]?/, "");
    const kanjiCount = (scenarioBody.match(/[一-龯々]/g) ?? []).length;
    const scenario = /^[ー－][く、＜<]?/.test(compact) && kanjiCount >= 3 && !/[：:。！？!?]/.test(scenarioBody) && !scenarioBody.includes("成功への10章");
    if (scenario) {
      practical += 1;
      result.push(`【実用会話－${practical}】`);
    }
    const line = cleanLine(scenario ? scenarioBody : rawLine);
    if (!line) continue;
    const previous = result[result.length - 1];
    const isContinuation = previous && /[：:]/.test(previous) && !/[。！？!?…）)]$/.test(previous) && !/[：:]/.test(line) && !/^【/.test(line) && !/^[①-⑳㉑-㊿]/.test(line);
    if (isContinuation) result[result.length - 1] = previous + line;
    else result.push(line);
  }
  return result;
}

function contentLines(page) {
  if (!page.lines?.length) return [];
  const notesMarker = page.lines
    .filter(line => {
      const letters = line.text.replace(/[^A-Za-z0-9]/g, "").toLowerCase();
      return /^notes?$/.test(letters) || (line.y > 1220 && line.x < 380 && /^[\s'"“”]*N[O0]/i.test(line.text));
    })
    .sort((a, b) => a.y - b.y)[0];
  return notesMarker ? page.lines.filter(line => line.y < notesMarker.y - 5) : page.lines;
}

function layoutOrderedText(lines) {
  const rows = [];
  for (const box of [...lines].sort((a, b) => a.y - b.y || a.x - b.x)) {
    let row = rows.find(item => Math.abs(item.y - box.y) <= 12);
    if (!row) { row = { y: box.y, boxes: [] }; rows.push(row); }
    row.boxes.push(box);
  }
  return rows.sort((a, b) => a.y - b.y).map(row => row.boxes.sort((a, b) => a.x - b.x).map(box => box.text).join(" ")).join("\n");
}

const overrides = {
  53: [
    "11．冠婚葬祭",
    "【基本会話】",
    "（同僚の結婚式で）",
    "森田：この度はおめでとうございます。いつまでもお幸せにね。",
    "上田：どうも、ありがとう。",
    "【戦略表現】",
    "1．お祝いの時の決まり文句",
    "①この度はおめでとうございます。",
    "②おめでとうございます。",
    "③おめでとう。",
    "2．お悔やみの時の決まり文句",
    "①この度はとんだことで……。どうか、お力落としのないよう……。",
    "②この度は、どうも……。",
    "③この度はまことにご愁傷さまでした。",
    "④お母さんのこと、聞いたよ……。早く元気になってね。",
    "⑤大変だろうけど、がんばってね。",
  ],
  24: [
    "【実用会話－1】",
    "得意先に上司を紹介する",
    "⑤川崎：課長の田中です。課長、こちらは営業部長の塚田様です。",
    "（田中と塚田、名刺を交換しながら）",
    "塚田：どうも。塚田でございます。",
    "田中：田中でございます。いつもたいへんお世話になっております。",
    "【実用会話－2】",
    "得意先に二人の上司を紹介する",
    "⑤川崎：部長の堀部と、課長の田中です。こちらは営業部長の塚田様です。",
    "塚田：塚田と申します。よろしくどうぞ。川崎さんにはいつもお世話になってまして……。",
    "川崎：いえいえ、こちらこそ。",
    "堀部：いつも川崎がお世話になっております。",
    "【実用会話－3】",
    "新しい担当を取引先に紹介する",
    "山下：いつもお世話になっております。実は、私、今度大阪へ転勤することになりまして、ご挨拶かたがた、本日は後任の者を連れてまいりました。",
    "浅井：それはそれはご丁寧に。",
    "⑤横尾：初めまして。今度、御社を担当させていただきます横尾と申します。よろしくお願いいたします。",
    "浅井：浅井です。よろしく。担当の方がずいぶん若返りましたね。",
    "山下：ええ、若いですけどしっかりしておりますので、よろしくご指導のほど、お願いいたします。",
    "横尾：今後ともよろしくお願いいたします。",
  ],
  71: [
    "【実用会話－5】", "改めてかけ直してきたが、まだ目的の相手は話中だった",
    "長谷川：まだ長くかかりそうですか。",
    "⑤金井：なんとも申し上げられませんが……。お待ちになりますか。",
    "長谷川：いや、わたしもこれから出てしまうんでね。",
    "金井：そうですか、ちょっとお待ちいただけますか。",
    "（メモをわたしにいく）",
    "杉山：（電話を保留にして）もうすぐだから、ちょっと待っててもらって。",
    "金井：お待たせいたしました。終わりそうなので、このままお待ちください。",
    "長谷川：あ、どうも。",
    "【実用会話－6】", "取り次ごうとしたが、実は不在だった",
    "②奥野：お待たせいたしました。たいへん申しわけありませんが、毛利は本日から出張でして、来週月曜日の出社予定になっておりました。",
    "若狭：えっ、そうですか。困ったなあ。本日中に連絡いただきたいことがあるんですが。",
    "奥野：定期的に連絡が入ることになっておりますので、その時お伝えできますが……。",
    "若狭：そうですか、それではお願いします。午後3時ぐらいまではオフィスで待っていますが、それ以降は鈴木か山本宛にお返事くださるようにお伝えください。",
    "奥野：かしこまりました。念のために、お電話番号お願いできますでしょうか。",
    "若狭：はい。よろしいですか。3323の5551です。",
  ],
  72: [
    "【実用会話－7】", "取り次ぐ相手がでたがらない",
    "③イスラエル：お待ちください。",
    "（電話を保留にして、取り次ぐ相手に）",
    "イスラエル：青山さん、平川商事の太田さんという方からです。",
    "④青山：えー！ いないって言って！ 今日一日中出てるって。",
    "イスラエル：お待たせしました。申しわけありません。青山は本日一日中取引先を回っておりまして……。",
    "太田：あ、そう。何時ごろお戻りですか。",
    "イスラエル：本日は、たぶん戻ってこないと思うんですが。ただ出先から電話が入ることにはなっておりますが。",
    "太田：そう。じゃあ、電話があったら、明日こちらにご連絡いただきたいと伝えてください。",
    "イスラエル：わかりました。伝えておきます。念のため、お電話番号お願いします。",
    "【実用会話－8】", "伝言を頼む",
    "野口：平川商事の野口ですが、松尾部長はいらっしゃいますか。",
    "③ナンシー：ただ今、ちょっと席をはずしておりますが。",
    "野口：あっそう。じゃあね、至急電話をいただきたいんですが、これからほかの部屋に移りますんで、ちょっとひかえてもらえますか。",
    "ナンシー：はい、どうぞ。",
    "野口：1533の9871、こちらにかけていただきたいんですが。",
    "ナンシー：わかりました。伝えておきます。",
  ],
  73: [
    "6．本人にかわって応対する",
    "【基本会話】",
    "瀬名：AC自動車の瀬名と申しますが、広報部の丸山さんいらっしゃいますか。",
    "コッシュ：申しわけありませんが、ただ今外出しております。",
    "瀬名：何時ごろお帰りになりますか。",
    "コッシュ：夕方4時の予定になっておりますが……。",
    "瀬名：じゃあ、お帰りになりましたら、お電話いただけますでしょうか。",
    "コッシュ：承知いたしました。",
    "【戦略表現】",
    "1．現在自分しかいないことを伝える",
    "①今、わたししかいないんですが。",
    "②わたしのほかは、だれもおりません。",
    "③ほかのものは、全員ではらっております。",
    "2．補助的な情報を与える",
    "①もう戻らないと思います。",
    "②鈴木は、3時ごろ戻ると申しておりました。",
    "③渡辺の帰社予定は、4時になっております。",
    "④山田は、5分ぐらいで戻ると思います。",
    "⑤申しわけありませんが、もう一度かけていただけませんか。",
    "⑥ちょっと、席をはずしています。",
    "⑦お待ちいただけますか。",
  ],
  74: [
    "3．日本語がまだうまくないことを伝える",
    "①わたしは、まだ日本語よくわかりません。",
    "②すみません、まだ日本語がよくわからないので……。",
    "③簡単な日本語でお願いできますか。",
    "④英語でお願いできますか。",
    "⑤すみません、ゆっくり話してください。まだ日本語がよくわかりませんので……。",
    "⑥ゆっくりお願いします。",
    "4．伝言を受ける",
    "①ご伝言、うけたまわりましょうか。",
    "②あ、ちょっとお待ちください。（書くものが見あたらないので……。）",
    "③（伝言、）お願いします。",
    "④お名前をもう一度お願いします。",
    "⑤オノダ産業の……？",
    "⑥ハヤカワ……様ですか。",
    "⑦オノダ産業の早川様ですね。",
    "⑧佐々木がお電話する、ということですか。",
    "⑨お電話いただける、ということですか。",
    "⑩念のために、お電話番号、お願いできますか。",
    "⑪わかりました。わたし、カルロス＝ペレと申します。",
    "⑫伝えておきますので。",
    "⑬申し伝えますので。",
    "⑭帰ってきたら、すぐ電話するんですね。",
    "⑮ファックスを見るように伝えておきます。",
    "⑯明日の会議は中止ということですか。",
  ],
  75: [
    "5．伝言を伝える",
    "①佐々木から電話がありました。",
    "②佐々木から伝言をあずかっております。",
    "③たった今、本人から電話がありまして、5分ほど遅れるとのことです。",
    "④先ほど、出先から連絡がはいりまして、もうそちらにむかっているそうです。",
    "⑤20分ほど前にこちらを出ましたが……。",
    "⑥ご迷惑をおかけしますが、よろしくお願いいたします。",
    "6．急いでいることを伝える",
    "①急いでいるんですが、連絡つけてもらえませんか。",
    "②急いでお伝えしたいことがあるので、連絡取っていただけないでしょうか。",
    "③至急連絡を取りたいんですが。",
    "④緊急な用件なんですが。",
    "⑤急用なんですが。",
    "⑥なんとかつかまらないでしょうか。",
    "7．連絡の手配をする",
    "①ちょっと連絡取ってみます。",
    "②すぐに連絡を取ってみますので、少々お待ちいただけますか。",
    "③そのままお待ちください。",
    "④電話をきってお待ちください。つかまりしだい、こちらからおかけします。",
    "8．期待にそえない旨伝える",
    "①ポケットベルで呼んでいるんですが、まだ連絡ないんです。",
    "②電波の届かないところにいるようなんですが。",
    "③申しわけありません。どうしても席をはずせませんので。",
  ],
  76: [
    "【実用会話－1】", "夜8時、自分以外は全員帰ってしまった",
    "①カルロス：はい、シスター工業、広報部です。",
    "早川：小野田産業の早川と申しますが、布施さん、いらっしゃいますか。",
    "カルロス：今、わたししかいないんですが。",
    "早川：もう、皆様、お帰りですか。",
    "カルロス：はい、みんな、帰りました。",
    "早川：もう、戻られません？",
    "カルロス：戻らないと思います。",
    "早川：じゃあ、伝言、お願いできますか。",
    "カルロス：すみません、わたしは、まだ日本語がよくわかりません。英語ができますか。",
    "早川：困ったなあ。英語は苦手だなあ。できません。",
    "カルロス：じゃあ、簡単な日本語でお願いします。",
    "早川：わかりました。布施さんに、お電話いただけるように伝えてください。",
    "カルロス：布施がお電話するんですね。",
    "早川：はい、そうです。",
    "カルロス：いつすればいいですか。",
    "早川：明日の朝いちばんにください。",
    "カルロス：明日の朝9時でいいですか。",
    "早川：はい。お願いします。",
    "カルロス：すみません。お名前をもう一度、お願いします。",
    "早川：小野田産業の早川です。",
    "カルロス：オノダサンギョウのハヤカワ様ですね。わかりました。私、カルロス＝ペレと申します。伝えておきますので。",
    "早川：じゃあ、よろしく。",
    "カルロス：はい、失礼します。",
  ],
  77: [
    "【実用会話－2】", "出先の上司から緊急の伝言を受けた",
    "③ジェフ：ロードン通信、広報部です。",
    "朝岡：スター電機の朝岡と申しますが、御社の池永様と、11時に待ち合わせをしておりましたところ、この時間になっても、お目にかかれませんので、そちらにお電話、さしあげたわけなんですが……。",
    "ジェフ：ああ、はい。先ほど、池永から電話がありました。「電車の事故があったので、お約束の時間に間にあわないかもしれません。でも、必ずまいりますので、そこで待っていてください。」と伝えるように頼まれました。",
    "朝岡：わかりました。じゃあ、もうしばらくお待ちいたします。",
    "ジェフ：ご迷惑、おかけしますが、よろしくお願いいたします。",
    "【実用会話－3】", "出先の営業マンに連絡を取るように言われた",
    "⑦工藤：申しわけありません。岡林は、ただ今出ておりますが。",
    "⑧水野：そうですか……。実は急いでいるんですが、連絡つけてもらえませんか。",
    "工藤：ええ、じゃあ、ちょっと連絡取ってみますので。",
    "水野：じゃあ、至急お願いします。",
    "工藤：（30分後）すみません、先ほどお電話いただいた平川商事の工藤ですが。",
    "水野：あ、どうも。電話入りました？",
    "工藤：それが、ポケットベルで呼んでいるんですが、まだ連絡ないんです。いかがいたしましょう。",
    "水野：そうですね、しょうがないですね。",
    "工藤：申しわけありません。",
    "水野：わかりました。まあ、とにかく待っていますから、お願いしますね。",
  ],
};

const basicConversationOverrides = {
  53: [
    "（同僚の結婚式で）",
    "森田：この度はおめでとうございます。いつまでもお幸せにね。",
    "上田：どうも、ありがとう。",
  ],
};

const pageTextCorrections = {
  23: { "題取引先に社内の人を紹介する": "1．取引先に社内の人を紹介する" },
  67: { "題取り次ぐべき人が不在であることを伝える": "1．取り次ぐべき人が不在であることを伝える" },
  69: { "住取り次ぐ相手が出たがらない": "2．取り次ぐ相手が出たがらない" },
  74: { "題伝言を受ける": "2．伝言を受ける" },
  89: { "住中断しなければならなくなった0叩": "6．中断しなければならなくなった" },
  95: { "題遠回しに催促する": "1．遠回しに催促する" },
  103: { "鞋略表現": "【戦略表現】", "返事を保留する": "1．返事を保留する" },
  123: { "題禁止する": "1．禁止する" },
  133: { "3前置きする": "5．前置きする", "住連絡する": "6．連絡する", "質問を受けつける": "7．質問を受けつける" },
  134: { "住補足する": "8．補足する" },
  155: { "住前提条件を述べる": "4．前提条件を述べる" },
};

function makeGroups(segments) {
  const groups = [];
  let title = "";
  let lines = [];
  const flush = () => { if (title || lines.length) groups.push({ title, lines }); title = ""; lines = []; };
  for (let i = 0; i < segments.length; i += 1) {
    const line = segments[i];
    if (/^【(?:実用会話－\d+|基本会話|戦略表現)】$/.test(line)) {
      flush();
      const scene = /^【実用会話/.test(line) && segments[i + 1] && !segments[i + 1].startsWith("【") ? segments[++i] : "";
      title = scene ? `${line} ${scene}` : line;
    } else lines.push(line);
  }
  flush();
  return groups;
}

function compactForMatch(value) {
  return value.replace(/[\s　【】〈〉［］\[\]()（）]/g, "");
}

// PaddleOCR sometimes returns the speaker column and the dialogue column as
// separate boxes.  Rebuild only the 基本会話 area by visual rows so that a
// speaker such as "瀬名" is joined to the ": ..." box on the same printed row.
function rebuildBasicConversation(page, segments) {
  if (!page.lines?.length) return segments;
  const basicHeading = page.lines.find(line => compactForMatch(line.text) === "基本会話");
  const nextHeading = page.lines
    .filter(line => line.y > (basicHeading?.y ?? Infinity))
    .filter(line => /^(?:戦略表現|実用会話)/.test(compactForMatch(line.text)))
    .sort((a, b) => a.y - b.y)[0];
  if (!basicHeading || !nextHeading) return segments;

  const boxes = page.lines
    .filter(line => line.y > basicHeading.y + 12 && line.y < nextHeading.y - 8)
    .sort((a, b) => a.y - b.y || a.x - b.x);
  const rows = [];
  for (const box of boxes) {
    let row = rows.find(item => Math.abs(item.y - box.y) <= 12);
    if (!row) { row = { y: box.y, boxes: [] }; rows.push(row); }
    row.boxes.push(box);
  }
  const rowText = rows
    .sort((a, b) => a.y - b.y)
    .map(row => {
      const ordered = row.boxes.sort((a, b) => a.x - b.x);
      if (ordered.length >= 2) {
        const speaker = cleanLine(ordered[0].text);
        const dialogue = cleanLine(ordered.slice(1).map(box => box.text).join(" "));
        if (/^[一-龯ァ-ヶ々]{1,12}$/.test(speaker) && dialogue && !/^[：:]/.test(dialogue)) return `${speaker}：${dialogue}`;
      }
      return ordered.map(box => box.text).join(" ");
    })
    .join("\n");
  const rebuilt = makeSegments(rowText);
  const dialogues = rebuilt.filter(line => /[：:]/.test(line)).length;
  if (dialogues < 2) return segments;

  const start = segments.indexOf("【基本会話】");
  const end = segments.indexOf("【戦略表現】", start + 1);
  if (start < 0 || end < 0) return segments;
  return [...segments.slice(0, start + 1), ...rebuilt, ...segments.slice(end)];
}

const pages = source.map((page) => {
  const usableLines = contentLines(page);
  let segments = overrides[page.page] ?? makeSegments(usableLines.length ? usableLines.map(line => line.text).join("\n") : page.text);
  if (!overrides[page.page]) {
    const initialPracticalGroups = makeGroups(segments).filter(group => /^【実用会話/.test(group.title));
    const layoutIssue = initialPracticalGroups.some(group => group.lines.some(line => /^[一-龯ァ-ヶ々]{1,12}$/.test(line) || /^[：:]/.test(line)));
    if (layoutIssue) segments = makeSegments(layoutOrderedText(usableLines));
  }
  if (!overrides[page.page] && page.lines?.length) {
    const basic = segments.indexOf("【基本会話】");
    const strategy = segments.indexOf("【戦略表現】");
    const initialGroups = makeGroups(segments);
    const basicGroup = initialGroups.find(group => group.title === "【基本会話】");
    const strategyGroup = initialGroups.find(group => group.title === "【戦略表現】");
    const basicDialogues = basicGroup?.lines.filter(line => /[：:]/.test(line)).length ?? 0;
    const strategyDialogues = strategyGroup?.lines.filter(line => /[：:]/.test(line)).length ?? 0;
    if ((basic >= 0 && strategy >= 0 && strategy < basic) || (basicDialogues < 2 && strategyDialogues >= 2)) {
      const ordered = [...usableLines].sort((a, b) => a.y - b.y || a.x - b.x).map(line => line.text).join("\n");
      segments = makeSegments(ordered);
    }
    const auditedBasicGroup = makeGroups(segments).find(group => group.title === "【基本会話】");
    const hasDetachedSpeaker = auditedBasicGroup?.lines.some(line => /^[一-龯ァ-ヶ々]{1,12}$/.test(line)) ?? false;
    const dialogueCount = auditedBasicGroup?.lines.filter(line => /[：:]/.test(line)).length ?? 0;
    if (hasDetachedSpeaker || dialogueCount < 2) segments = rebuildBasicConversation(page, segments);
  }
  if (basicConversationOverrides[page.page]) {
    const start = segments.indexOf("【基本会話】");
    const end = segments.indexOf("【戦略表現】", start + 1);
    if (start >= 0 && end > start) segments = [...segments.slice(0, start + 1), ...basicConversationOverrides[page.page], ...segments.slice(end)];
  }
  if (pageTextCorrections[page.page]) segments = segments.map(line => pageTextCorrections[page.page][line] ?? line);
  return { page: page.page, image: `/business-japanese-v2/page-${String(page.page).padStart(3, "0")}.jpg`, segments, groups: makeGroups(segments) };
});

for (const page of pages) {
  const name = `page-${String(page.page).padStart(3, "0")}.jpg`;
  fs.copyFileSync(path.join(imageSource, name), path.join(imageTarget, name));
}

fs.writeFileSync(path.join(root, "data/business-pages.json"), JSON.stringify(pages), "utf8");
console.log(`PREPARED pages=${pages.length} segments=${pages.reduce((n, p) => n + p.segments.length, 0)}`);

export type BusinessWord = { surface: string; reading: string; meaning: string };

export const businessWords: BusinessWord[] = [
  { surface: "電話", reading: "でんわ", meaning: "电话" }, { surface: "伝言", reading: "でんごん", meaning: "留言、口信" },
  { surface: "連絡", reading: "れんらく", meaning: "联系" }, { surface: "会議", reading: "かいぎ", meaning: "会议" },
  { surface: "会社", reading: "かいしゃ", meaning: "公司" }, { surface: "産業", reading: "さんぎょう", meaning: "产业；公司名称用语" },
  { surface: "部長", reading: "ぶちょう", meaning: "部长" }, { surface: "課長", reading: "かちょう", meaning: "科长" },
  { surface: "社長", reading: "しゃちょう", meaning: "社长、总经理" }, { surface: "専務", reading: "せんむ", meaning: "专务董事" },
  { surface: "担当", reading: "たんとう", meaning: "负责；负责人" }, { surface: "取引先", reading: "とりひきさき", meaning: "客户、交易对象" },
  { surface: "予定", reading: "よてい", meaning: "预定、计划" }, { surface: "出張", reading: "しゅっちょう", meaning: "出差" },
  { surface: "外出", reading: "がいしゅつ", meaning: "外出" }, { surface: "帰社", reading: "きしゃ", meaning: "返回公司" },
  { surface: "不在", reading: "ふざい", meaning: "不在" }, { surface: "席", reading: "せき", meaning: "座位；工作岗位" },
  { surface: "急用", reading: "きゅうよう", meaning: "急事" }, { surface: "至急", reading: "しきゅう", meaning: "紧急、火速" },
  { surface: "用件", reading: "ようけん", meaning: "事情、来意" }, { surface: "名前", reading: "なまえ", meaning: "姓名" },
  { surface: "確認", reading: "かくにん", meaning: "确认" }, { surface: "報告", reading: "ほうこく", meaning: "报告" },
  { surface: "説明", reading: "せつめい", meaning: "说明" }, { surface: "資料", reading: "しりょう", meaning: "资料" },
  { surface: "お願い", reading: "おねがい", meaning: "请求、拜托" }, { surface: "申しわけ", reading: "もうしわけ", meaning: "歉意（常用于道歉）" },
  { surface: "承知", reading: "しょうち", meaning: "知悉、明白" }, { surface: "失礼", reading: "しつれい", meaning: "失礼；告辞" },
  { surface: "日本語", reading: "にほんご", meaning: "日语" }, { surface: "英語", reading: "えいご", meaning: "英语" },
  { surface: "明日", reading: "あした", meaning: "明天" }, { surface: "今日", reading: "きょう", meaning: "今天" },
];

export const wordsForBusinessLine = (line: string) => businessWords.filter(word => line.includes(word.surface));
const page74Annotations: Record<string, { reading: string; meaning: string }> = {
  "①わたしは、まだ日本語よくわかりません。": { reading: "わたしは、まだ にほんご よく わかりません。", meaning: "我还不太懂日语。" },
  "②すみません、まだ日本語がよくわからないので……。": { reading: "すみません、まだ にほんごが よく わからないので……。", meaning: "对不起，因为我还不太懂日语……" },
  "③簡単な日本語でお願いできますか。": { reading: "かんたんな にほんごで おねがい できますか。", meaning: "可以请您用简单的日语说吗？" },
  "④英語でお願いできますか。": { reading: "えいごで おねがい できますか。", meaning: "可以请您用英语说吗？" },
  "⑤すみません、ゆっくり話してください。まだ日本語がよくわかりませんので……。": { reading: "すみません、ゆっくり はなして ください。まだ にほんごが よく わかりませんので……。", meaning: "对不起，请说慢一点。因为我还不太懂日语……" },
  "⑥ゆっくりお願いします。": { reading: "ゆっくり おねがいします。", meaning: "请说慢一点。" },
  "①ご伝言、うけたまわりましょうか。": { reading: "ごでんごん、うけたまわりましょうか。", meaning: "需要我替您留言吗？" },
  "②あ、ちょっとお待ちください。（書くものが見あたらないので……。）": { reading: "あ、ちょっと おまち ください。（かくものが みあたらないので……。）", meaning: "啊，请稍等一下。（因为一时找不到可以写字的东西……）" },
  "③（伝言、）お願いします。": { reading: "（でんごん、）おねがいします。", meaning: "麻烦您帮我留言。" },
  "④お名前をもう一度お願いします。": { reading: "おなまえを もういちど おねがいします。", meaning: "请再说一遍您的姓名。" },
  "⑤オノダ産業の……？": { reading: "オノダさんぎょうの……？", meaning: "您是小野田产业的……？" },
  "⑥ハヤカワ……様ですか。": { reading: "ハヤカワ……さまですか。", meaning: "您是……早川先生（女士）吗？" },
  "⑦オノダ産業の早川様ですね。": { reading: "オノダさんぎょうの はやかわさまですね。", meaning: "您是小野田产业的早川先生（女士），对吧？" },
  "⑧佐々木がお電話する、ということですか。": { reading: "ささきが おでんわする、ということですか。", meaning: "您的意思是让佐佐木给您打电话吗？" },
  "⑨お電話いただける、ということですか。": { reading: "おでんわ いただける、ということですか。", meaning: "您的意思是希望对方给您打电话吗？" },
  "⑩念のために、お電話番号、お願いできますか。": { reading: "ねんのために、おでんわばんごう、おねがい できますか。", meaning: "为保险起见，可以请您留下电话号码吗？" },
  "⑪わかりました。わたし、カルロス＝ペレと申します。": { reading: "わかりました。わたし、カルロス＝ペレと もうします。", meaning: "明白了。我叫卡洛斯·佩雷。" },
  "⑫伝えておきますので。": { reading: "つたえて おきますので。", meaning: "我会转告他的。" },
  "⑬申し伝えますので。": { reading: "もうしつたえますので。", meaning: "我会代为转告的。" },
  "⑭帰ってきたら、すぐ電話するんですね。": { reading: "かえって きたら、すぐ でんわするんですね。", meaning: "他回来后马上给您打电话，对吧？" },
  "⑮ファックスを見るように伝えておきます。": { reading: "ファックスを みるように つたえて おきます。", meaning: "我会转告他查看传真的。" },
  "⑯明日の会議は中止ということですか。": { reading: "あしたの かいぎは ちゅうし ということですか。", meaning: "您的意思是明天的会议取消了吗？" },
};
export const manualBusinessAnnotation = (line: string, page?: number) => page === 74 ? page74Annotations[line] : undefined;

export const readingForBusinessLine = (line: string, page?: number) => {
  if (page === 74 && page74Annotations[line]) return page74Annotations[line].reading;
  const stripped = line.replace(/^.*?[：:]\s*/, "").replace(/[①-⑳㉑-㊿]/g, "");
  return wordsForBusinessLine(stripped).reduce((value, word) => value.replaceAll(word.surface, word.reading), stripped);
};
export const meaningForBusinessLine = (line: string, page?: number) => {
  if (page === 74 && page74Annotations[line]) return page74Annotations[line].meaning;
  const words = wordsForBusinessLine(line);
  return words.length ? words.map(word => `${word.surface}：${word.meaning}`).join("　") : "本句暂无词义注释";
};

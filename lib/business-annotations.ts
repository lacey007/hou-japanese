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
const fixedMeanings: Record<number, Record<string, string>> = {
  77: {
    "③ジェフ：ロードン通信、広報部です。": "杰夫：这里是劳顿通信公关部。",
    "朝岡：スター電機の朝岡と申しますが、御社の池永様と、11時に待ち合わせをしておりましたところ、この時間になっても、お目にかかれませんので、そちらにお電話、さしあげたわけなんですが……。": "朝冈：我是星电机的朝冈。我原本和贵公司的池永先生约好11点见面，可到了这个时间还没见到他，所以就给贵公司打了电话……",
    "ジェフ：ああ、はい。先ほど、池永から電話がありました。「電車の事故があったので、お約束の時間に間にあわないかもしれません。でも、必ずまいりますので、そこで待っていてください。」と伝えるように頼まれました。": "杰夫：池永刚才来过电话。他说电车发生事故，可能赶不上约定时间，但一定会过去，请您在那里等候。",
    "朝岡：わかりました。じゃあ、もうしばらくお待ちいたします。": "朝冈：明白了。那么我再等一会儿。", "ジェフ：ご迷惑、おかけしますが、よろしくお願いいたします。": "杰夫：给您添麻烦了，拜托您了。",
    "⑦工藤：申しわけありません。岡林は、ただ今出ておりますが。": "工藤：非常抱歉，冈林现在外出了。", "⑧水野：そうですか……。実は急いでいるんですが、連絡つけてもらえませんか。": "水野：这样啊……事情很急，能请您设法联系到他吗？", "工藤：ええ、じゃあ、ちょっと連絡取ってみますので。": "工藤：好的，那我试着联系一下。", "水野：じゃあ、至急お願いします。": "水野：那就请尽快联系。", "工藤：（30分後）すみません、先ほどお電話いただいた平川商事の工藤ですが。": "工藤：（30分钟后）您好，我是刚才接到您电话的平川商事工藤。", "水野：あ、どうも。電話入りました？": "水野：您好。联系上了吗？", "工藤：それが、ポケットベルで呼んでいるんですが、まだ連絡ないんです。いかがいたしましょう。": "工藤：我一直在用寻呼机呼他，但还没有回音。您看怎么办呢？", "水野：そうですね、しょうがないですね。": "水野：这样啊，那也没办法。", "工藤：申しわけありません。": "工藤：实在抱歉。", "水野：わかりました。まあ、とにかく待っていますから、お願いしますね。": "水野：明白了。总之我会等着，麻烦您了。"
  },
  78: {
    "⑦佐野：栗栖さん、お願いします。": "佐野：请帮我找栗栖先生（女士）。", "⑥児玉：はい、お待ちください。失礼ですが……。": "儿玉：好的，请稍等。请问您是……", "佐野：佐野と申します。": "佐野：我叫佐野。", "児玉：（電話を保留にして）クリスさん！ 2番にお電話です。佐野さんという方。": "儿玉：（把电话转为保留）克里斯！2号线有你的电话，是一位叫佐野的人。", "女②クリス：佐野さん？ はーい、すいません。（電話にでて）お電話かわりました。クリスです。": "克里斯：佐野先生？来了，不好意思。让您久等了，我是克里斯。", "佐野：あ、どうも。さっそくですけど、例の春キャン、銀座のホコ天でオッケーだそうです。": "佐野：您好。上次提到的春季宣传活动，在银座步行街举办已经获准了。", "クリス：あ、ちょっと……、どちらの佐野さんですか。": "克里斯：请等一下……请问您是哪位佐野？", "佐野：作報堂の佐野ですけど。": "佐野：我是作报堂的佐野。", "クリス：ちょっとお待ちください。（電話を保留にする）児玉さん、この電話よくわからないんですけど、ちょっとかわってもらえますか。": "克里斯：请稍等。儿玉，我听不太懂这个电话，能请你替我接一下吗？", "児玉：ええ、いいですよ。（電話に出る）すみません、いまの者、日本語がよくわからないものですから、お電話かわりました。": "儿玉：好的。对不起，刚才那位不太懂日语，所以由我来接听。", "佐野：え？ そちら、ダイヤ企画さんじゃないんですか。": "佐野：咦？你们不是钻石企划公司吗？", "児玉：ええ、違いますが……。": "儿玉：不是，您打错了……", "佐野：あ、どうも失礼いたしました。間違えました。": "佐野：实在抱歉，我打错了。", "児玉：ああ、どういたしまして。（電話をきる）": "儿玉：没关系。（挂断电话）", "クリス：何の電話だったの？": "克里斯：是什么电话？", "児玉：間違い電話だよ。たぶんあの人、「栗栖さん、お願いします。」って言ったんじゃない？": "儿玉：是打错的电话。那个人大概说的是“请找栗栖先生”吧？", "クリス：日本人の名前にも“Chris”って、あるの？": "克里斯：日本人的姓里也有“Chris”吗？", "児玉：「く・る・す」っていう名字があるの。めずらしいけど。おかしいよね。": "儿玉：有一个读作“Ku-ru-su”的姓，虽然很少见。挺有意思吧。"
  }
};
export const fixedBusinessMeaning = (line: string, page?: number) => page ? fixedMeanings[page]?.[line] : undefined;
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
  return words.length ? `本句要点：${words.map(word => `${word.surface}（${word.meaning}）`).join("、")}` : "本句的中文释义正在校订。";
};

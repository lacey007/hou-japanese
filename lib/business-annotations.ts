import languageNotes from "@/data/business-language-notes.json";
import deepseekGrammar from "@/data/business-grammar-deepseek.json";

export type BusinessWord = { surface: string; reading: string; meaning: string };
type LanguageAnalysis = { readings: { surface: string; reading: string }[]; verbs: { surface: string; base: string; reading: string }[] };
const analyzedLines = languageNotes as Record<string, LanguageAnalysis>;
const deepseekGrammarByLine = deepseekGrammar as Record<string, string>;
const contextMeanings: Record<string, string> = {
  "(章ことの特長)": "（各章的特点）",
  "（田中と塚田、名刺を交換しながら）": "（田中和塚田一边交换名片一边交谈）",
  "(山田、中野と一緒にいる隣の外国人が気になって見ている)": "（山田注意到中野身旁的外国人，正看着对方）",
  "(あーあ、またか。)(あー、ショック!)": "（唉，又来了。）（啊，真受打击！）",
  "（同僚の結婚式で）": "（在同事的婚礼上）",
  "(電話を保留にして、内線で課長を呼び出す)": "（将电话设为保留，通过内线呼叫课长）",
  "（メモをわたしにいく）": "（去递交便条）",
  "（電話を保留にして、取り次ぐ相手に）": "（将电话设为保留，对要转接的人说）",
  "（沈黙）": "（沉默）",
  "(リーさんが出社したところです)": "（李先生刚到公司）",
  "(えーっ!)(なんで?)": "（什么！）（为什么？）",
  "(電話で)": "（通过电话）",
  "(入社試験の面接で)": "（在入职考试的面试中）",
  "(朝礼で)": "（在晨会上）",
  "(部長の席に行く)": "（走到部长的座位旁）",
  "(】(川.)": "（原页 OCR 残留符号，无有效语义）",
};

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

const extraKanjiReadings: BusinessWord[] = [
  { surface: "依頼", reading: "いらい", meaning: "请求、委托" }, { surface: "研修会", reading: "けんしゅうかい", meaning: "研修会" },
  { surface: "申し込み", reading: "もうしこみ", meaning: "申请、报名" }, { surface: "今度", reading: "こんど", meaning: "这次；下次" },
  { surface: "早め", reading: "はやめ", meaning: "尽早" }, { surface: "仕事", reading: "しごと", meaning: "工作" },
  { surface: "無理", reading: "むり", meaning: "勉强；难以做到" }, { surface: "話", reading: "はなし", meaning: "话；事情" },
  { surface: "打って", reading: "うって", meaning: "打字；录入" }, { surface: "一度", reading: "いちど", meaning: "一次" },
  { surface: "頼める", reading: "たのめる", meaning: "能够拜托" }, { surface: "聞いて", reading: "きいて", meaning: "听" },
  { surface: "人", reading: "ひと", meaning: "人" },
  { surface: "申し上げる", reading: "もうしあげる", meaning: "说（谦逊语）" }, { surface: "申しわけ", reading: "もうしわけ", meaning: "歉意" },
  { surface: "いただく", reading: "いただく", meaning: "接受；承蒙" }, { surface: "差し上げる", reading: "さしあげる", meaning: "给予（谦逊语）" },
  { surface: "相手", reading: "あいて", meaning: "对方" }, { surface: "言葉", reading: "ことば", meaning: "语言；说法" },
  { surface: "意味", reading: "いみ", meaning: "意思" }, { surface: "内容", reading: "ないよう", meaning: "内容" },
  { surface: "通話中", reading: "つうわちゅう", meaning: "通话中" }, { surface: "突然", reading: "とつぜん", meaning: "突然" },
  { surface: "操作", reading: "そうさ", meaning: "操作" }, { surface: "間違う", reading: "まちがう", meaning: "弄错" },
  { surface: "簡単", reading: "かんたん", meaning: "简单" }, { surface: "質問", reading: "しつもん", meaning: "问题" },
  { surface: "感情的", reading: "かんじょうてき", meaning: "情绪激动" }, { surface: "中断", reading: "ちゅうだん", meaning: "中断" },
  { surface: "折り返し", reading: "おりかえし", meaning: "回电话" }, { surface: "少々", reading: "しょうしょう", meaning: "稍许" },
  { surface: "興味", reading: "きょうみ", meaning: "兴趣" }, { surface: "教育", reading: "きょういく", meaning: "教育" },
  { surface: "従業員", reading: "じゅうぎょういん", meaning: "员工" }, { surface: "外国人", reading: "がいこくじん", meaning: "外国人" },
  { surface: "総務", reading: "そうむ", meaning: "总务" }, { surface: "受付", reading: "うけつけ", meaning: "前台；接待" },
  { surface: "規則", reading: "きそく", meaning: "规定" }, { surface: "自宅", reading: "じたく", meaning: "住宅" },
  { surface: "番号", reading: "ばんごう", meaning: "号码" }, { surface: "市外局番", reading: "しがいきょくばん", meaning: "区号" },
  { surface: "市内局番", reading: "しないきょくばん", meaning: "市内局号" }, { surface: "発音", reading: "はつおん", meaning: "发音" },
  { surface: "小銭", reading: "こぜに", meaning: "零钱" },
  { surface: "確認", reading: "かくにん", meaning: "确认" }, { surface: "聞き取る", reading: "ききとる", meaning: "听懂" },
  { surface: "広告代理店", reading: "こうこくだいりてん", meaning: "广告代理公司" }, { surface: "研究室", reading: "けんきゅうしつ", meaning: "研究室" },
];

export const kanjiReadingsForBusinessLine = (line: string) => {
  const analyzed = analyzedLines[line]?.readings;
  if (analyzed?.length) return analyzed.map(item => ({ ...item, meaning: "" }));
  const candidates = [...businessWords, ...extraKanjiReadings].sort((a, b) => b.surface.length - a.surface.length);
  const found: BusinessWord[] = [];
  let remaining = line;
  for (const word of candidates) {
    if (!/[一-龯々]/.test(word.surface) || !remaining.includes(word.surface)) continue;
    found.push(word);
    remaining = remaining.replaceAll(word.surface, " ");
  }
  return found;
};

export const grammarMemoForBusinessLine = (line: string) => {
  if (/[A-Za-z]{3}/.test(line) && !/[ぁ-んァ-ン一-龯]/.test(line)) {
    const englishRules = [
      { test: /has been designed/, title: "Present perfect passive", detail: "“has been designed” 是现在完成时的被动语态：has/have + been + 过去分词。表示设计这一动作已经完成，而且结果与现在仍有关联。" },
      { test: /who have mastered/, title: "Relative clause", detail: "“who have mastered ...” 是由 who 引导的定语从句，修饰前面的 people。who 在从句中作主语，have mastered 使用现在完成时，强调已经掌握基础日语。" },
      { test: /in order to/, title: "Purpose: in order to", detail: "“in order to + 动词原形”表示目的，即“为了……”。语气比单独使用 to 更明确，否定形式是 in order not to。" },
      { test: /should (?:not )?be used/, title: "Modal passive", detail: "“should + be + 过去分词”是情态动词的被动结构，表示某事应该或不应该被怎样处理。should 后始终使用动词原形 be。" },
      { test: /can(?:'t|not)? be/, title: "Modal verb + passive", detail: "can/cannot 后接动词原形；“can be + 过去分词”构成被动语态，表示某事能够被完成或被使用。" },
      { test: /When /, title: "Time clause with when", detail: "when 引导时间状语从句，说明主句动作发生的时间或场景。用于目录标题时常省略主句，把它理解为“当……时所使用的表达”。" },
      { test: /Making|Introducing|Expressing|Giving|Asking|Turning|Inviting|Accepting|Reporting|Explaining|Confirming/, title: "Gerund phrase", detail: "这里使用动名词（动词 + -ing）作为标题中心语，把一个动作当作主题或事项，例如 Making a request 表示“提出请求”这一行为。" },
    ].filter(rule => rule.test.test(line));
    return englishRules.length ? englishRules : [{ title: "English structure", detail: "本行是英文标题或说明。目录标题通常采用名词短语或动名词短语，省略完整句子的主语和谓语，使表达简洁。页码前的短语表示该章节所讲的交际功能。" }];
  }
  const rules: { test: RegExp; title: string; detail: string }[] = [
    { test: /と申します/, title: "～と申します", detail: "「～と言います」的谦逊表达，用于商务自我介绍。" },
    { test: /ていただけ(?:ます|ません)/, title: "～ていただけますか", detail: "接续：动词て形＋いただけますか。表示“能否请您……”，把对方的动作视为自己承蒙的恩惠，因此比「～てください」更郑重。否定疑问「～ていただけませんか」语气更委婉。" },
    { test: /ており(?:ます|まして)/, title: "～ております", detail: "「～ています」的谦逊、郑重表达。" },
    { test: /かねます/, title: "～かねます", detail: "接续：动词ます形去掉「ます」＋かねます。用于委婉拒绝或表示客观上难以做到，相当于“恐怕无法……”。商务场合通常比直接说「できません」柔和。" },
    { test: /ことになっている/, title: "～ことになっています", detail: "表示由规则、制度或安排所决定。" },
    { test: /てしま(?:い|う|って)/, title: "～てしまう", detail: "接续：动词て形＋しまう。既可表示动作彻底完成，也可表达遗憾、失误或不希望发生的结果。本句在电话故障语境中带有歉意。礼貌过去式常为「～てしまいました」。" },
    { test: /なければなら/, title: "～なければならない", detail: "表示必须做某事。" },
    { test: /ように(?:いたし|し|お願い|頼)/, title: "～ように", detail: "表示要求、转告或努力达到某种状态。" },
    { test: /という(?:こと|話|名前|方)/, title: "～という", detail: "用于引用、说明名称或解释内容。" },
    { test: /ので/, title: "～ので", detail: "接续：普通形＋ので；名词、ナ形容词后用「なので」。表示原因或理由，比「から」更客观柔和，适合说明情况、提出请求或婉拒。" },
    { test: /んですが|のですが|んですけど|のですけれど/, title: "～んですが", detail: "「のです＋が」的口语形式。先补充背景或理由，再委婉引出请求、询问或不同意见。句末省略后项时，会把判断留给对方，语气更柔和。" },
    { test: /でしょうか/, title: "～でしょうか", detail: "比「ですか」更委婉、郑重的询问方式。" },
    { test: /ておき/, title: "～ておく", detail: "表示事先做某事，或让某种状态保持下去。" },
    { test: /そうです/, title: "～そうです", detail: "根据上下文可表示传闻“听说……”或样态“看起来……”。" },
    { test: /て(?:もら|くれ)/, title: "～てもらう／くれる", detail: "表示请别人做某事或接受别人给予的帮助。" },
    { test: /たい(?:ん|の|です|と思|$)/, title: "～たい", detail: "接续：动词ます形去掉「ます」＋たい。表示说话人想做某事。商务场合直接询问对方愿望可能显得生硬，常改用「ご希望ですか」；自己的愿望加「んですが」可作为委婉请求的铺垫。" },
    { test: /てください/, title: "～てください", detail: "接续：动词て形＋ください，表示请对方做某事。属于礼貌请求，但对客户或上级仍可能偏直接；更郑重时使用「～ていただけますか」。动词原形需由て形还原后记忆。" },
    { test: /ませんか/, title: "～ませんか", detail: "接续：动词ます形去掉「ます」＋ませんか。用否定疑问形式邀请或建议对方一起行动，相当于“要不要……？”。比「～ましょう」给对方留下更多选择余地。" },
    { test: /ましょう(?:か)?/, title: "～ましょう／～ましょうか", detail: "接续：动词ます形去掉「ます」＋ましょう。「～ましょう」表示提议一起行动；「～ましょうか」还可表示主动提出为对方做某事。" },
    { test: /なさいますか|になさいます/, title: "なさる／～になさる", detail: "「なさる」是「する」的尊敬语，用来抬高对方的动作。「何になさいますか」意为“您要选择什么”，常见于点餐、购物和预约场景。原形：なさる。" },
    { test: /かしこまりました/, title: "かしこまりました", detail: "服务与商务场合的固定回应，比「わかりました」更郑重，表示已经理解并接受对方的要求。原形可视为「かしこまる」，实际多以固定过去礼貌形使用。" },
    { test: /てもいい|てもかまいません|かまいませんか/, title: "～てもいい／かまわない", detail: "接续：动词て形＋もいい／もかまわない。用于许可“可以……”，疑问形式用于请求许可。「かまいませんか」比「いいですか」稍正式。原形：かまう。" },
    { test: /と思(?:います|って|う)/, title: "～と思う", detail: "接续：普通形＋と思う，表示判断、想法或打算。说自己的计划时常用意志形＋と思う；加「んですが」可柔和地引出后续请求。原形：思う（おもう）。" },
    { test: /たら/, title: "～たら", detail: "接续：动词た形＋ら，表示假定条件或动作完成后的时间条件，相当于“如果……／……之后”。后项可接建议、请求或结果。" },
    { test: /なら/, title: "～なら", detail: "接续：名词或普通形＋なら。根据已经提到的信息设定条件，表示“如果是……的话”。常用于针对对方的话提出建议或判断。" },
    { test: /しか.*ない|しか.*ません/, title: "～しか～ない", detail: "「しか」必须与否定形式搭配，表示限定“只有……”。语气强调除此以外没有其他选择，例如「金曜日しかあいていない」即“只有星期五有空”。" },
    { test: /なくちゃ|なきゃ/, title: "～なくちゃ／～なきゃ", detail: "分别是「～なくてはならない／～なければならない」的口语缩略，表示必须做某事。适合熟人会话，正式商务表达应使用完整形式。" },
    { test: /ことにした|ことにする/, title: "～ことにする", detail: "接续：动词辞书形或ない形＋ことにする，表示说话人经过考虑后作出决定。过去形「ことにした」表示决定已经作出。" },
    { test: /たがら|たがる/, title: "～たがる", detail: "接续：动词ます形去掉「ます」＋たがる，用来描述第三者表现出的愿望。自己的愿望通常用「～たい」，不能直接用「～たがる」。" },
    { test: /ものですから|もんで/, title: "～ものですから", detail: "接续：普通形＋ものですから，说明带有辩解或歉意色彩的理由，相当于“因为……”。口语中可缩略为「もんで」。比单纯的「から」更突出客观缘由。" },
    { test: /ところ/, title: "～ところ", detail: "「ところ」把动作定位在某个阶段：辞书形＋ところ表示正要做，ている＋ところ表示正在做，た形＋ところ表示刚做完；「～たところ」也可表示尝试后得到的结果。" },
    { test: /かもしれません|かもしれない/, title: "～かもしれない", detail: "接续：普通形＋かもしれない，表示可能性不确定，相当于“也许……”。礼貌形是「かもしれません」，语气比「でしょう」更缺乏把握。" },
    { test: /てみ(?:ます|る|よう)/, title: "～てみる", detail: "接续：动词て形＋みる，表示尝试做某事并观察结果。这里的「みる」通常写成平假名。原形：みる。" },
    { test: /てから/, title: "～てから", detail: "接续：动词て形＋から，表示完成前项之后再进行后项，强调动作顺序。与表示原因的「から」不同。" },
    { test: /ばかり/, title: "～たばかり", detail: "接续：动词た形＋ばかり，表示说话人主观感觉某事刚刚发生；时间长短由语境决定，不一定真的是几分钟前。" },
    { test: /じゃない(?:か|ですか)?/, title: "～じゃないか／じゃないですか", detail: "「ではない」的口语形式。除否定外，也可用于确认、提醒或表达惊讶；句末「じゃないか」语气较直接，「じゃないですか」相对礼貌。" },
    { test: /だろう|でしょう/, title: "～だろう／でしょう", detail: "表示推测或向对方确认。普通体「だろう」较直接，礼貌体「でしょう」较柔和；升调时常含“对吧”的确认语气。" },
    { test: /わけにはいかない/, title: "～わけにはいかない", detail: "接续：动词辞书形＋わけにはいかない。并非能力上不能，而是由于立场、常识、责任或人情关系而“不便／不能那样做”。" },
    { test: /させ(?:て|れば|る)/, title: "使役形 ～させる", detail: "使役形表示让、使或允许某人做某事。五段动词词尾变为 a 段＋せる，一段动词去「る」＋させる；商务敬语中「～させていただく」表示获得许可后去做。" },
    { test: /ございます|でございます/, title: "ございます／でございます", detail: "「ございます」是「あります」的郑重语；「でございます」是「です」的郑重表达。常见于电话接待、酒店、票务和客服场景，用来提高整体礼貌程度。原形：ござる（现代日语主要使用礼貌形）。" },
    { test: /ちゃ(?:う|った|います|いました)|じゃ(?:う|った)/, title: "～ちゃう／～じゃう", detail: "口语缩略：动词て形＋しまう→ちゃう，で形＋しまう→じゃう。例如「予約いれちゃった」＝「予約を入れてしまった」。可表示动作完成，也常带意外、遗憾或无奈语气。原形：しまう。" },
    { test: /って(?:いう|言|思)/, title: "～って", detail: "「って」是口语引用助词，相当于「と」或「という」。可引用别人说的话、想法或名称，例如「行こうって言ってる」＝“说要去”。正式场合宜改用「と」。" },
    { test: /らしい/, title: "～らしい", detail: "接续：普通形或名词＋らしい。根据听到的信息作判断，表示“听说／似乎”。与外观推测「～そうだ」不同，「らしい」通常依据间接信息。" },
    { test: /ほうがいい/, title: "～ほうがいい", detail: "用来比较或提出建议。“Aのほうがいい”表示A更好；动词た形＋ほうがいい表示最好做某事，ない形＋ほうがいい表示最好不要做。" },
    { test: /よかったら/, title: "よかったら", detail: "「よい」的过去条件形，字面是“如果方便／如果愿意的话”。用于邀请和建议前，能给对方保留拒绝空间，使语气比直接邀请更柔和。原形：よい／いい。" },
    { test: /んですよ|のですよ/, title: "～んですよ", detail: "「のです」的口语形式，用于补充对方可能不知道的背景、强调理由或纠正理解。「よ」把该信息提示给对方；语气取决于上下文，可解释为“其实是……”。" },
    { test: /ないんで|たんで|なんで/, title: "～んで", detail: "「ので」的口语形式，表示原因或理由。前面接普通形，名词和ナ形容词使用「なんで」。会话中自然，但正式书面语通常使用完整的「ので」。" },
    { test: /だけど|ですけど/, title: "～けど／だけど", detail: "表示转折“但是”，也常放在句末省略后项，以柔和地引出请求或让对方推断未说出的意思。名词和ナ形容词后常用「だけど」。" },
    { test: /なくて/, title: "～なくて", detail: "动词ない形去「い」＋くて。可连接否定状态、说明原因，或构成对比。要表达明确条件“如果不……”时通常使用「～なければ」。" },
    { test: /お一人様/, title: "お一人様", detail: "「一人」前加美化语「お」，后加敬称「様」，是餐饮、酒店和票务行业称呼每位顾客的郑重表达。「お一人様5000円」表示每位5000日元。" },
    { test: /恐れ入ります/, title: "恐れ入ります", detail: "商务服务中的固定礼貌表达，可表示歉意、感谢或打扰对方，相当于“实在不好意思／劳驾”。原形：恐れ入る（おそれいる）。后面常接询问或请求。" },
  ];
  const special = [
    { test: /もう一度/, title: "もう一度", detail: "表示“再一次”。「もう」表示追加或再次，「一度」表示一次。用于请求重复操作时，比单说「もう一回」更适合正式场合。" },
    { test: /おつなぎいたします/, title: "お＋动词ます形＋いたします", detail: "「おつなぎいたします」是「つなぐ」的谦逊表达。变化：つなぐ→つなぎ（ます形词干）→おつなぎいたします。说话人压低自己的动作，礼貌表示“我为您转接”。" },
    { test: /たいへん失礼いたしました/, title: "たいへん失礼いたしました", detail: "商务道歉的固定表达。「たいへん」加强程度；「失礼する」变为谦逊语「失礼いたす」，再用过去式「いたしました」，表示对刚才发生的失误郑重道歉。" },
    { test: /まして[……。]*$/, title: "～まして……", detail: "「ます」的て形是「まして」。句末用「～まして……」说明原因后故意不把后项说完，让对方理解歉意或后续请求，是商务电话中常见的委婉表达。" },
  ].filter(rule => rule.test.test(line));
  const deepseekDetail = deepseekGrammarByLine[line];
  const deepseekMemo = deepseekDetail && !/(乱码|无法解析|不適用)/.test(deepseekDetail)
    ? [{ title: "本句语法详解", detail: deepseekDetail.replace(/^「[^」]+」(?:是|即)?/, "本句中的该表达") }]
    : [];
  const verbs = analyzedLines[line]?.verbs ?? [];
  const verbMemo = verbs.length ? [{ title: "本句动词原形", detail: verbs.map(verb => `${verb.surface} → ${verb.base}（${verb.reading}）`).join("；") + "。箭头左侧是句中形式，右侧是词典原形。" }] : [];
  const matches = [...deepseekMemo, ...verbMemo, ...special, ...rules.filter(rule => rule.test.test(line))]
    .filter((memo, index, items) => items.findIndex(item => item.title === memo.title) === index)
    .slice(0, 6);
  return matches.length ? matches : [{ title: "句型与语气", detail: "本句以普通的名词、助词或礼貌形构成，没有需要单独记忆的复杂固定句型。阅读时重点确认「は／が」提示的主题与主语、「を／に」提示的动作对象，并留意句末「です／ます」所表达的正式礼貌语气。" }];
};
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
  if (contextMeanings[line]) return contextMeanings[line];
  if (page === 74 && page74Annotations[line]) return page74Annotations[line].meaning;
  const words = wordsForBusinessLine(line);
  return words.length ? `本句要点：${words.map(word => `${word.surface}（${word.meaning}）`).join("、")}` : "请展开“语法解释”结合句型学习本句；完整中文译文会随原文校对逐页补充。";
};

export type Sentence = { id: number; start: number; end: number; jp: string; kana: string; cn: string; words: { surface: string; reading: string; meaning: string }[] };
export type Lesson = { id: string; title: string; subtitle: string; level: "N5" | "N4" | "N3" | "N2" | "N1"; category: string; duration: number; color: string; sentences: Sentence[] };

export const lessons: Lesson[] = [
  {
    id: "morning-routine", title: "わたしの朝", subtitle: "从日常问候开始，听懂简单的生活表达", level: "N5", category: "日常", duration: 24, color: "#e8b7a9",
    sentences: [
      { id: 1, start: 0, end: 5.5, jp: "毎朝、七時に起きます。", kana: "まいあさ、しちじに おきます。", cn: "每天早上七点起床。", words: [{ surface: "毎朝", reading: "まいあさ", meaning: "每天早上" }, { surface: "起きます", reading: "おきます", meaning: "起床" }] },
      { id: 2, start: 5.5, end: 11.5, jp: "顔を洗って、朝ご飯を食べます。", kana: "かおを あらって、あさごはんを たべます。", cn: "洗脸，然后吃早饭。", words: [{ surface: "顔", reading: "かお", meaning: "脸" }, { surface: "朝ご飯", reading: "あさごはん", meaning: "早饭" }] },
      { id: 3, start: 11.5, end: 17.5, jp: "八時に家を出ます。", kana: "はちじに いえを でます。", cn: "八点出门。", words: [{ surface: "家", reading: "いえ", meaning: "家" }, { surface: "出ます", reading: "でます", meaning: "出去" }] },
      { id: 4, start: 17.5, end: 24, jp: "今日も一日、頑張りましょう。", kana: "きょうも いちにち、がんばりましょう。", cn: "今天一整天也一起加油吧。", words: [{ surface: "一日", reading: "いちにち", meaning: "一整天" }, { surface: "頑張る", reading: "がんばる", meaning: "努力、加油" }] }
    ]
  },
  {
    id: "kyoto-autumn", title: "京都の秋", subtitle: "跟着一段短文，感受京都的秋日风景", level: "N3", category: "旅行", duration: 27, color: "#d59a73",
    sentences: [
      { id: 1, start: 0, end: 6.5, jp: "秋になると、京都の山々が赤く染まります。", kana: "あきに なると、きょうとの やまやまが あかく そまります。", cn: "一到秋天，京都的群山就被染成红色。", words: [{ surface: "山々", reading: "やまやま", meaning: "群山" }, { surface: "染まる", reading: "そまる", meaning: "染上颜色" }] },
      { id: 2, start: 6.5, end: 13.5, jp: "古いお寺の庭では、美しい紅葉が見られます。", kana: "ふるい おてらの にわでは、うつくしい こうようが みられます。", cn: "在古寺的庭院里，可以看到美丽的红叶。", words: [{ surface: "庭", reading: "にわ", meaning: "庭院" }, { surface: "紅葉", reading: "こうよう", meaning: "红叶" }] },
      { id: 3, start: 13.5, end: 20, jp: "静かな道を歩くだけで、心が落ち着きます。", kana: "しずかな みちを あるくだけで、こころが おちつきます。", cn: "只是在安静的小路上走走，心情就会平静下来。", words: [{ surface: "落ち着く", reading: "おちつく", meaning: "平静、安定" }] },
      { id: 4, start: 20, end: 27, jp: "いつか、秋の京都を訪れてみませんか。", kana: "いつか、あきの きょうとを おとずれて みませんか。", cn: "有机会的话，要不要去看看秋天的京都呢？", words: [{ surface: "訪れる", reading: "おとずれる", meaning: "访问、到访" }] }
    ]
  },
  {
    id: "small-habits", title: "小さな習慣の力", subtitle: "关于习惯与坚持的迷你日语随笔", level: "N2", category: "随笔", duration: 30, color: "#89a69a",
    sentences: [
      { id: 1, start: 0, end: 7, jp: "大きな目標を達成するには、毎日の小さな習慣が欠かせません。", kana: "おおきな もくひょうを たっせいするには、まいにちの ちいさな しゅうかんが かかせません。", cn: "要实现远大的目标，每天的小习惯不可或缺。", words: [{ surface: "達成", reading: "たっせい", meaning: "达成" }, { surface: "欠かせない", reading: "かかせない", meaning: "不可或缺" }] },
      { id: 2, start: 7, end: 14.5, jp: "短い時間でも、続けることに意味があります。", kana: "みじかい じかんでも、つづける ことに いみが あります。", cn: "即使时间很短，坚持也有意义。", words: [{ surface: "続ける", reading: "つづける", meaning: "继续、坚持" }] },
      { id: 3, start: 14.5, end: 22, jp: "完璧を求めすぎず、昨日の自分より一歩だけ前へ進みましょう。", kana: "かんぺきを もとめすぎず、きのうの じぶんより いっぽだけ まえへ すすみましょう。", cn: "不要过分追求完美，只需比昨天的自己前进一步。", words: [{ surface: "完璧", reading: "かんぺき", meaning: "完美" }, { surface: "求める", reading: "もとめる", meaning: "追求、寻求" }] },
      { id: 4, start: 22, end: 30, jp: "その積み重ねが、いつか大きな自信になります。", kana: "その つみかさねが、いつか おおきな じしんに なります。", cn: "这些积累，终有一天会变成巨大的自信。", words: [{ surface: "積み重ね", reading: "つみかさね", meaning: "积累" }, { surface: "自信", reading: "じしん", meaning: "自信" }] }
    ]
  }
];

export const getLesson = (id: string) => lessons.find((lesson) => lesson.id === id);

export const runtime = "nodejs";
type Annotation = { text: string; reading: string; meaning: string };

async function generate(text: string): Promise<Annotation> {
  const clean = text.replace(/[①-⑳㉑-㊿]/g, "");
  const [readingResult, translationResult] = await Promise.allSettled([
    fetch("https://yomi.onrender.com/analyze", {
      method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ text: clean, mode: "spaced", to: "hiragana" }), signal: AbortSignal.timeout(15000),
    }).then(response => response.ok ? response.json() : Promise.reject(new Error("reading failed"))),
    fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=ja&tl=zh-CN&dt=t&q=${encodeURIComponent(clean)}`, { signal: AbortSignal.timeout(15000) })
      .then(response => response.ok ? response.json() : Promise.reject(new Error("translation failed"))),
  ]);
  const rawReading = readingResult.status === "fulfilled" ? readingResult.value : {};
  const readingData = typeof rawReading === "string" ? JSON.parse(rawReading) as { converted?: string } : rawReading as { converted?: string };
  const translationData = translationResult.status === "fulfilled" ? translationResult.value as unknown[][] : [];
  const meaning = Array.isArray(translationData?.[0]) ? (translationData[0] as unknown[][]).map(item => String(item?.[0] ?? "")).join("") : "";
  return { text, reading: readingData.converted || clean, meaning: meaning || "整句翻译暂时无法生成，请联网后重试。" };
}

export async function POST(request: Request) {
  const body = await request.json() as { lines?: string[] };
  const lines = [...new Set((body.lines ?? []).filter(Boolean))].slice(0, 60);
  const result = await Promise.all(lines.map(generate));
  return Response.json(result);
}

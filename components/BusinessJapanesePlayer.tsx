"use client";

import { BookmarkPlus, Check, ChevronLeft, ChevronRight, Gauge, Image as ImageIcon, Languages, LoaderCircle, Pause, Play, Repeat1 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { manualBusinessAnnotation, readingForBusinessLine, wordsForBusinessLine } from "@/lib/business-annotations";

type Page = { page: number; image: string; segments: string[]; groups: { title: string; lines: string[] }[] };

const isSubheading = (text: string) => /^[0-9０-９]{1,2}[.．、]?(?![0-9０-９])/.test(text) && !/^[0-9０-９]+分/.test(text);

export default function BusinessJapanesePlayer({ pages }: { pages: Page[] }) {
  const audioPlayer = useRef<HTMLAudioElement | null>(null);
  const audioUrl = useRef("");
  const [pageIndex, setPageIndex] = useState(0);
  const [segment, setSegment] = useState(0);
  const [voice, setVoice] = useState<"nanami" | "keita">("nanami");
  const [speed, setSpeed] = useState(1);
  const [loop, setLoop] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [audioError, setAudioError] = useState("");
  const [activeVoice, setActiveVoice] = useState("");
  const [showImage, setShowImage] = useState(true);
  const [showKana, setShowKana] = useState(true), [showCn, setShowCn] = useState(true), [saved, setSaved] = useState<string[]>([]);
  const [activeLine, setActiveLine] = useState("");
  const [annotations, setAnnotations] = useState<Record<string, { reading: string; meaning: string }>>({});
  const page = pages[pageIndex];
  const group = page.groups[segment];
  useEffect(() => {
    fetch("/api/progress?lessonId=business-japanese").then(r => r.json()).then(value => {
      if (value?.position) setPageIndex(Math.min(pages.length - 1, Math.floor(value.position)));
    });
  }, [pages.length]);
  useEffect(() => {
    audioPlayer.current?.pause();
    if (audioUrl.current) URL.revokeObjectURL(audioUrl.current);
    setPlaying(false); setAudioError(""); setActiveVoice(""); setActiveLine("");
  }, [pageIndex, segment, voice, speed]);
  useEffect(() => () => { audioPlayer.current?.pause(); if (audioUrl.current) URL.revokeObjectURL(audioUrl.current); }, []);
  useEffect(() => {
    if (!group) return;
    const lines = group.lines.filter(line => !isSubheading(line) && !manualBusinessAnnotation(line, page.page) && !annotations[line]);
    if (!lines.length) return;
    let cancelled = false;
    fetch("/api/business-annotations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lines }) })
      .then(response => response.ok ? response.json() : Promise.reject())
      .then((items: { text: string; reading: string; meaning: string }[]) => { if (!cancelled) setAnnotations(current => ({ ...current, ...Object.fromEntries(items.map(item => [item.text, { reading: item.reading, meaning: item.meaning }])) })); })
      .catch(() => undefined);
    return () => { cancelled = true; };
  }, [group, page.page]);

  const save = (nextPage: number) => fetch("/api/progress", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lessonId: "business-japanese", position: nextPage, percent: Math.round((nextPage + 1) / pages.length * 100), completed: nextPage === pages.length - 1 }) });
  const changePage = (next: number) => { const bounded = Math.max(0, Math.min(pages.length - 1, next)); setPageIndex(bounded); setSegment(0); void save(bounded); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const changeSegment = (next: number) => {
    if (next < 0) return segment > 0 ? setSegment(segment - 1) : changePage(pageIndex - 1);
    if (next >= page.groups.length) return changePage(pageIndex + 1);
    setSegment(next);
  };
  const cleanSpokenText = (text: string) => text.replace(/^.*?[：:]\s*/, "").replace(/[①-⑳㉑-㉟㊱-㊿❶-❿]/g, "").replace(/^\s*[（(]?[0-9０-９]+[）).．、]\s*/, "").trim();
  const stopAudio = () => { audioPlayer.current?.pause(); audioPlayer.current = null; setPlaying(false); setLoading(false); setActiveLine(""); };
  const playNatural = async (text: string, lineKey = "", onEnded?: () => void) => {
    stopAudio(); setLoading(true); setAudioError("");
    try {
      const source = `/api/business-audio?voice=${voice}&text=${encodeURIComponent(text)}`;
      const audio = new Audio(source); audio.preload = "auto"; audio.playbackRate = speed; audioPlayer.current = audio;
      audio.onplay = () => { setLoading(false); setPlaying(true); setActiveLine(lineKey); setActiveVoice(voice === "nanami" ? "Microsoft Nanami Neural" : "Microsoft Keita Neural"); };
      audio.onended = () => { setPlaying(false); setActiveLine(""); onEnded?.(); };
      audio.onerror = () => { setLoading(false); setPlaying(false); setActiveLine(""); setAudioError("自然语音播放失败，请确认电脑已联网后重试。"); };
      await audio.play();
    } catch {
      setLoading(false); setPlaying(false); setActiveLine(""); setAudioError("自然语音生成失败，请确认电脑已联网后重试。");
    }
  };
  const speak = async () => {
    if (!group) return;
    const spokenText = group.lines
      .filter(line => !/^[（(].*[）)]$/.test(line))
      .filter(line => !isSubheading(line))
      .map(cleanSpokenText)
      .filter(Boolean)
      .join("。 ");
    if (!spokenText) { setLoading(false); changeSegment(segment + 1); return; }
    await playNatural(spokenText, "", () => { if (loop) setTimeout(() => void speak(), 100); else changeSegment(segment + 1); });
  };
  const toggle = () => { if (playing || loading) stopAudio(); else void speak(); };
  const groupWords = group ? [...new Map(group.lines.flatMap(wordsForBusinessLine).map(word => [word.surface, word])).values()] : [];
  const saveWord = async (word: { surface: string; reading: string; meaning: string }) => { await fetch("/api/vocabulary", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lessonId: "business-japanese", ...word }) }); setSaved(items => [...new Set([...items, word.surface])]); };
  const speakLine = async (text: string, key: string) => {
    await playNatural(cleanSpokenText(text), key);
  };

  return <div className={`grid gap-6 ${showImage ? "xl:grid-cols-[minmax(360px,.9fr)_minmax(440px,1.1fr)]" : "grid-cols-1"}`}>
    <aside className={`${showImage ? "block" : "hidden"} h-fit overflow-hidden rounded-[1.75rem] border border-[#dedbd1] bg-[#e9e6de] xl:sticky xl:top-24`}>
      <img src={page.image} alt={`実用ビジネス日本語 第${page.page}页`} className="mx-auto max-h-[82vh] w-full object-contain"/>
    </aside>
    <section className="overflow-hidden rounded-[1.75rem] border border-[#dedbd1] bg-white">
      <div className="border-b border-[#e5e2da] bg-[#f0eee7] p-5 md:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold tracking-[.14em] text-sakura">PAGE {String(page.page).padStart(3, "0")} / 203</p><p className="mt-1 text-sm text-[#747c78]">第 {segment + 1} 段，共 {Math.max(page.groups.length, 1)} 段 · 整段连续朗读</p></div><button onClick={() => setShowImage(!showImage)} className="flex items-center gap-2 rounded-full border border-[#d1cec6] bg-white px-3 py-2 text-xs"><ImageIcon size={15}/>{showImage ? "隐藏原页" : "显示原页"}</button></div>
        <div className="mt-5 flex items-center gap-3"><button onClick={toggle} disabled={!page.groups.length || loading} className="grid h-14 w-14 place-items-center rounded-full bg-matcha text-white shadow-lg shadow-matcha/20">{loading ? <LoaderCircle className="animate-spin"/> : playing ? <Pause fill="currentColor"/> : <Play className="ml-1" fill="currentColor"/>}</button><div className="flex flex-1 flex-wrap gap-2"><button onClick={() => changeSegment(segment - 1)} className="flex items-center rounded-full border bg-white px-3 py-2 text-xs"><ChevronLeft size={15}/>上一段</button><button onClick={() => changeSegment(segment + 1)} className="flex items-center rounded-full border bg-white px-3 py-2 text-xs">下一段<ChevronRight size={15}/></button><button onClick={() => setLoop(!loop)} className={`flex items-center gap-1 rounded-full px-3 py-2 text-xs ${loop ? "bg-sakura text-white" : "border bg-white"}`}><Repeat1 size={15}/>整段循环</button></div></div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs"><div className="flex items-center gap-2"><span>自然语音</span><select value={voice} onChange={e => setVoice(e.target.value as "nanami" | "keita")} className="rounded-full border bg-white px-3 py-2"><option value="nanami">Nanami · 自然女声</option><option value="keita">Keita · 自然男声</option></select></div><div className="flex items-center gap-1"><Gauge size={15}/>{[.5,.75,1,1.25,1.5].map(rate => <button key={rate} onClick={() => setSpeed(rate)} className={`rounded-lg px-2 py-1 ${speed === rate ? "bg-matcha text-white" : "hover:bg-white"}`}>{rate}×</button>)}</div></div>
        {activeVoice && <p className="mt-3 text-xs text-[#75807a]">当前使用：{activeVoice}</p>}
        {audioError && <p className="mt-4 rounded-xl bg-[#f7e4e1] px-4 py-3 text-sm text-[#955b57]">{audioError}</p>}
      </div>
      <div className="p-5 md:p-7"><div className="mb-5 flex items-center justify-between"><button onClick={() => changePage(pageIndex - 1)} disabled={pageIndex === 0} className="rounded-full border px-4 py-2 text-sm disabled:opacity-30">← 上一页</button><select value={pageIndex} onChange={e => changePage(Number(e.target.value))} className="rounded-full border bg-white px-4 py-2 text-sm">{pages.map((item, i) => <option key={item.page} value={i}>第 {item.page} 页</option>)}</select><button onClick={() => changePage(pageIndex + 1)} disabled={pageIndex === pages.length - 1} className="rounded-full border px-4 py-2 text-sm disabled:opacity-30">下一页 →</button></div>
        <div className="mb-5 flex flex-wrap items-center gap-2 text-xs"><Languages size={16} className="mr-1 text-matcha"/><span className="rounded-full bg-matcha px-3 py-1.5 text-white">日文</span><button onClick={() => setShowKana(!showKana)} className={`rounded-full px-3 py-1.5 ${showKana ? "bg-[#e1ebe6] text-matcha" : "bg-[#eee] text-[#888]"}`}>假名</button><button onClick={() => setShowCn(!showCn)} className={`rounded-full px-3 py-1.5 ${showCn ? "bg-[#f4e5e3] text-[#985f5c]" : "bg-[#eee] text-[#888]"}`}>中文</button></div>
        {page.groups.length ? <div className="space-y-5">{page.groups.map((item, i) => <div key={i} onClick={() => setSegment(i)} className={`block w-full cursor-pointer rounded-2xl border p-5 text-left transition ${i === segment ? "border-matcha bg-[#eef4f1] text-[#26463a]" : "border-[#e4e1d8] hover:bg-[#f7f6f2]"}`}>{item.title && <p className="mb-3 text-lg font-bold leading-8">{item.title}</p>}<div className="space-y-3">{item.lines.map((text, lineIndex) => { const lineKey = `${page.page}-${i}-${lineIndex}`; const heading = isSubheading(text); const annotation = manualBusinessAnnotation(text, page.page) ?? annotations[text]; return <div key={lineIndex} onClick={event => { if (heading) return; event.stopPropagation(); setSegment(i); void speakLine(text, lineKey); }} className={`rounded-xl px-3 py-2 transition ${heading ? "" : "cursor-pointer hover:bg-white/70"} ${activeLine === lineKey ? "bg-white ring-1 ring-matcha" : ""}`}><p className={`text-lg leading-8 ${heading ? "font-bold" : ""}`}>{text}</p>{showKana && !heading && <p className="mt-0.5 text-sm leading-6 text-[#70857b]">{annotation?.reading ?? readingForBusinessLine(text, page.page)}</p>}{showCn && !heading && <p className="text-sm leading-6 text-[#7d817f]">{annotation?.meaning ?? "整句翻译生成中……"}</p>}</div>; })}</div></div>)}</div> : <div className="rounded-2xl bg-cream p-10 text-center text-[#777f7b]">本页没有识别到日文内容，请查看左侧原页。</div>}
        {groupWords.length > 0 && <div className="mt-6 rounded-2xl border border-[#dedbd1] bg-cream p-5"><p className="text-xs font-bold tracking-[.15em] text-sakura">WORDS IN THIS SECTION</p><h2 className="mt-2 text-xl font-bold">本段商务词汇</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{groupWords.map(word => <div key={word.surface} className="rounded-xl bg-white p-4"><div className="flex items-start justify-between"><div><p className="font-bold">{word.surface}</p><p className="mt-1 text-xs text-matcha">{word.reading}</p></div><button onClick={event => { event.stopPropagation(); void saveWord(word); }} className={`grid h-8 w-8 place-items-center rounded-full ${saved.includes(word.surface) ? "bg-matcha text-white" : "bg-cream text-matcha"}`}>{saved.includes(word.surface) ? <Check size={15}/> : <BookmarkPlus size={15}/>}</button></div><p className="mt-3 border-t border-[#dedbd1] pt-3 text-sm text-[#737a76]">{word.meaning}</p></div>)}</div></div>}
      </div>
    </section>
  </div>;
}

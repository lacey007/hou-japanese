"use client";

import { BookmarkPlus, Check, ChevronLeft, ChevronRight, CloudUpload, Gauge, Image as ImageIcon, Languages, LoaderCircle, NotebookPen, Pause, Play, Repeat1, Save, StickyNote } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { fixedBusinessMeaning, grammarMemoForBusinessLine, kanjiReadingsForBusinessLine, manualBusinessAnnotation, meaningForBusinessLine, wordsForBusinessLine } from "@/lib/business-annotations";
import businessTranslations from "@/data/business-translations-79-90.json";
import allBusinessTranslations from "@/data/business-translations-all.json";
import businessNameReadings from "@/data/business-name-readings.json";
import businessAudioManifest from "@/data/business-audio-manifest.json";
import deepseek2030 from "@/data/business-deepseek-20-30.json";
import deepseek111120 from "@/data/business-deepseek-111-120.json";
import deepseek121130 from "@/data/business-deepseek-121-130.json";
import deepseek131140 from "@/data/business-deepseek-131-140.json";
import deepseek141150 from "@/data/business-deepseek-141-150.json";
import deepseek151160 from "@/data/business-deepseek-151-160.json";
import deepseek161170 from "@/data/business-deepseek-161-170.json";
import deepseek171180 from "@/data/business-deepseek-171-180.json";
import { getLessonProgress, saveProgress, saveWord as saveLocalWord } from "@/lib/local-study";

type Page = { page: number; image: string; segments: string[]; groups: { title: string; lines: string[] }[] };
type AudioEntry = { src: string; voice: "female" | "male"; speaker: string; language?: "ja" | "en" };
const neuralAudio = businessAudioManifest as Record<string, AudioEntry>;
const audioBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
type DeepSeekSentenceNote = { page: number; line: string; translation: string; grammar: string };
const deepseek2030Translations = Object.fromEntries(
  (deepseek2030 as DeepSeekSentenceNote[]).map(item => [item.line, item.translation]),
) as Record<string, string>;
const deepseek111120Translations = Object.fromEntries(
  (deepseek111120 as DeepSeekSentenceNote[]).map(item => [item.line, item.translation]),
) as Record<string, string>;
const deepseek121130Translations = Object.fromEntries(
  (deepseek121130 as DeepSeekSentenceNote[]).map(item => [item.line, item.translation]),
) as Record<string, string>;
const deepseek131140Translations = Object.fromEntries(
  (deepseek131140 as DeepSeekSentenceNote[]).map(item => [item.line, item.translation]),
) as Record<string, string>;
const deepseek141150Translations = Object.fromEntries(
  (deepseek141150 as DeepSeekSentenceNote[]).map(item => [item.line, item.translation]),
) as Record<string, string>;
const deepseek151160Translations = Object.fromEntries(
  (deepseek151160 as DeepSeekSentenceNote[]).map(item => [item.line, item.translation]),
) as Record<string, string>;
const deepseek161170Translations = Object.fromEntries(
  (deepseek161170 as DeepSeekSentenceNote[]).map(item => [item.line, item.translation]),
) as Record<string, string>;
const deepseek171180Translations = Object.fromEntries(
  (deepseek171180 as DeepSeekSentenceNote[]).map(item => [item.line, item.translation]),
) as Record<string, string>;

const isSubheading = (text: string) => /^[0-9０-９]{1,2}[.．、]?(?![0-9０-９])/.test(text)
  && !/^[0-9０-９]+分/.test(text)
  && text.length < 60
  && !/[.!?。！？]$/.test(text);

export default function BusinessJapanesePlayer({ pages }: { pages: Page[] }) {
  const audioPlayer = useRef<HTMLAudioElement | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [segment, setSegment] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [loop, setLoop] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [audioError, setAudioError] = useState("");
  const [activeVoice, setActiveVoice] = useState("");
  const [showImage, setShowImage] = useState(true);
  const [showKana, setShowKana] = useState(true), [showCn, setShowCn] = useState(true), [saved, setSaved] = useState<string[]>([]);
  const [activeLine, setActiveLine] = useState("");
  const [openMemos, setOpenMemos] = useState<string[]>([]);
  const [openNotes, setOpenNotes] = useState<string[]>([]);
  const [personalNotes, setPersonalNotes] = useState<Record<string, string>>({});
  const [sharedNotes, setSharedNotes] = useState<Record<string, string>>({});
  const [githubToken, setGithubToken] = useState("");
  const [syncStatus, setSyncStatus] = useState("");
  const annotations: Record<string, { reading: string; meaning: string }> = {};
  const page = pages[pageIndex];
  const group = page.groups[segment];
  const isEnglishPage = page.page === 5 || (page.page >= 174 && page.page <= 201);
  useEffect(() => {
    const value = getLessonProgress("business-japanese");
    if (value?.position) setPageIndex(Math.min(pages.length - 1, Math.floor(value.position)));
  }, [pages.length]);
  useEffect(() => {
    audioPlayer.current?.pause(); audioPlayer.current = null;
    setPlaying(false); setAudioError(""); setActiveVoice(""); setActiveLine("");
  }, [pageIndex, segment, speed]);
  useEffect(() => () => { audioPlayer.current?.pause(); }, []);
  useEffect(() => {
    try { setPersonalNotes(JSON.parse(localStorage.getItem("hibiki-business-notes") ?? "{}")); } catch { setPersonalNotes({}); }
    setGithubToken(sessionStorage.getItem("hibiki-github-token") ?? "");
    fetch(`https://raw.githubusercontent.com/lacey007/hou-japanese/main/data/shared-notes.json?t=${Date.now()}`, { cache: "no-store" }).then(response => response.ok ? response.json() : {}).then(setSharedNotes).catch(() => setSharedNotes({}));
  }, []);

  const save = (nextPage: number) => saveProgress({ lessonId: "business-japanese", position: nextPage, percent: Math.round((nextPage + 1) / pages.length * 100), completed: nextPage === pages.length - 1 });
  const changePage = (next: number) => { const bounded = Math.max(0, Math.min(pages.length - 1, next)); setPageIndex(bounded); setSegment(0); void save(bounded); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const changeSegment = (next: number) => {
    if (next < 0) return segment > 0 ? setSegment(segment - 1) : changePage(pageIndex - 1);
    if (next >= page.groups.length) return changePage(pageIndex + 1);
    setSegment(next);
  };
  const cleanSpokenText = (text: string) => text.replace(/^.*?[：:]\s*/, "").replace(/[①-⑳㉑-㉟㊱-㊿❶-❿]/g, "").replace(/^\s*[（(]?[0-9０-９]+[）).．、]\s*/, "").trim();
  const pageTranslations = (businessTranslations as Record<string, Record<string, string>>)[String(page.page)] ?? {};
  const stopAudio = () => { audioPlayer.current?.pause(); audioPlayer.current = null; setPlaying(false); setLoading(false); setActiveLine(""); };
  const playEntries = (entries: { key: string; audio: AudioEntry }[], onEnded?: () => void) => {
    stopAudio(); setAudioError("");
    if (!entries.length) { setAudioError("该句暂无神经语音。"); return; }
    let cursor = 0;
    const playNext = () => {
      const item = entries[cursor];
      if (!item) { setPlaying(false); setActiveLine(""); onEnded?.(); return; }
      setLoading(true);
      const player = new Audio(`${audioBasePath}${item.audio.src}?v=20260826-5`);
      audioPlayer.current = player; player.playbackRate = speed; player.preload = "auto";
      player.onplaying = () => {
        setLoading(false); setPlaying(true); setActiveLine(item.key);
        setActiveVoice(item.audio.language === "en"
          ? (item.audio.voice === "female" ? "Aria Neural · 自然英文女声" : "Guy Neural · 自然英文男声")
          : (item.audio.voice === "female" ? "Nanami Neural · 自然日语女声" : "Keita Neural · 自然日语男声"));
      };
      player.onended = () => { cursor += 1; playNext(); };
      player.onerror = () => { setLoading(false); setPlaying(false); setActiveLine(""); setAudioError("神经语音加载失败，请检查网络后重试。"); };
      player.play().catch(() => player.onerror?.(new Event("error")));
    };
    playNext();
  };
  const speak = async () => {
    if (!group) return;
    const entries = group.lines.map((_, index) => { const key = `${page.page}-${segment}-${index}`; return { key, audio: neuralAudio[key] }; }).filter((item): item is { key: string; audio: AudioEntry } => Boolean(item.audio));
    playEntries(entries, () => { if (loop) setTimeout(() => void speak(), 100); else changeSegment(segment + 1); });
  };
  const toggle = () => { if (playing || loading) stopAudio(); else void speak(); };
  const groupWords = group ? [...new Map(group.lines.flatMap(wordsForBusinessLine).map(word => [word.surface, word])).values()] : [];
  const saveWord = async (word: { surface: string; reading: string; meaning: string }) => { saveLocalWord({ lessonId: "business-japanese", ...word }); setSaved(items => [...new Set([...items, word.surface])]); };
  const savePersonalNote = (key: string, value: string) => {
    const next = { ...personalNotes, [key]: value };
    setPersonalNotes(next);
    localStorage.setItem("hibiki-business-notes", JSON.stringify(next));
  };
  const publishPersonalNote = async (key: string) => {
    const value = personalNotes[key]?.trim();
    if (!value) { setSyncStatus("请先填写并保存笔记。"); return; }
    if (!githubToken.trim()) { setSyncStatus("请先输入有 Contents 读写权限的 GitHub Token。"); return; }
    setSyncStatus("正在提交到 GitHub……");
    try {
      sessionStorage.setItem("hibiki-github-token", githubToken.trim());
      const api = "https://api.github.com/repos/lacey007/hou-japanese/contents/data/shared-notes.json";
      const headers = { Authorization: `Bearer ${githubToken.trim()}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };
      const currentResponse = await fetch(`${api}?t=${Date.now()}`, { headers, cache: "no-store" });
      if (!currentResponse.ok) throw new Error("无法读取远程笔记，请检查 Token 权限。");
      const currentFile = await currentResponse.json();
      const decoded = new TextDecoder().decode(Uint8Array.from(atob(currentFile.content.replace(/\n/g, "")), char => char.charCodeAt(0)));
      const next = { ...JSON.parse(decoded), [key]: value };
      const bytes = new TextEncoder().encode(JSON.stringify(next, null, 2) + "\n");
      let binary = ""; bytes.forEach(byte => { binary += String.fromCharCode(byte); });
      const updateResponse = await fetch(api, { method: "PUT", headers: { ...headers, "Content-Type": "application/json" }, body: JSON.stringify({ message: `添加学习笔记：${key}`, content: btoa(binary), sha: currentFile.sha, branch: "main" }) });
      if (!updateResponse.ok) throw new Error("提交失败，请确认 Token 对仓库具有 Contents 读写权限。");
      setSharedNotes(next); setSyncStatus("已提交。其他浏览器重新打开网页后即可看到。GitHub Pages也会自动重新发布。");
    } catch (error) { setSyncStatus(error instanceof Error ? error.message : "笔记提交失败。"); }
  };
  const speakLine = async (_text: string, key: string) => { const audio = neuralAudio[key]; playEntries(audio ? [{ key, audio }] : []); };

  return <div className={`grid gap-6 ${showImage ? "xl:grid-cols-[minmax(360px,.9fr)_minmax(440px,1.1fr)]" : "grid-cols-1"}`}>
    <aside className={`${showImage ? "block" : "hidden"} h-fit overflow-hidden rounded-[1.75rem] border border-[#dedbd1] bg-[#e9e6de] xl:sticky xl:top-24`}>
      <img src={page.image} alt={`実用ビジネス日本語 第${page.page}页`} className="mx-auto max-h-[82vh] w-full object-contain"/>
    </aside>
    <section className="overflow-hidden rounded-[1.75rem] border border-[#dedbd1] bg-white">
      <div className="border-b border-[#e5e2da] bg-[#f0eee7] p-5 md:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold tracking-[.14em] text-sakura">PAGE {String(page.page).padStart(3, "0")} / 203</p><p className="mt-1 text-sm text-[#747c78]">第 {segment + 1} 段，共 {Math.max(page.groups.length, 1)} 段 · 整段连续朗读</p></div><button onClick={() => setShowImage(!showImage)} className="flex items-center gap-2 rounded-full border border-[#d1cec6] bg-white px-3 py-2 text-xs"><ImageIcon size={15}/>{showImage ? "隐藏原页" : "显示原页"}</button></div>
        <div className="mt-5 flex items-center gap-3"><button onClick={toggle} disabled={!page.groups.length || loading} className="grid h-14 w-14 place-items-center rounded-full bg-matcha text-white shadow-lg shadow-matcha/20">{loading ? <LoaderCircle className="animate-spin"/> : playing ? <Pause fill="currentColor"/> : <Play className="ml-1" fill="currentColor"/>}</button><div className="flex flex-1 flex-wrap gap-2"><button onClick={() => changeSegment(segment - 1)} className="flex items-center rounded-full border bg-white px-3 py-2 text-xs"><ChevronLeft size={15}/>上一段</button><button onClick={() => changeSegment(segment + 1)} className="flex items-center rounded-full border bg-white px-3 py-2 text-xs">下一段<ChevronRight size={15}/></button><button onClick={() => setLoop(!loop)} className={`flex items-center gap-1 rounded-full px-3 py-2 text-xs ${loop ? "bg-sakura text-white" : "border bg-white"}`}><Repeat1 size={15}/>整段循环</button></div></div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs"><div className="flex min-w-0 items-center gap-2"><span className="rounded-full border bg-white px-3 py-2">{isEnglishPage ? "Aria · Neural 英文女声" : "Nanami · Neural 日语女声"}</span><span className="rounded-full border bg-white px-3 py-2">{isEnglishPage ? "Guy · Neural 英文男声" : "Keita · Neural 日语男声"}</span></div><div className="flex items-center gap-1"><Gauge size={15}/>{[.5,.75,1,1.25,1.5].map(rate => <button key={rate} onClick={() => setSpeed(rate)} className={`rounded-lg px-2 py-1 ${speed === rate ? "bg-matcha text-white" : "hover:bg-white"}`}>{rate}×</button>)}</div></div>
        <p className="mt-2 text-xs text-[#75807a]">已改用预生成的 Microsoft Neural 自然语音；整段对话会根据说话人自动切换{isEnglishPage ? " Aria 英文女声与 Guy 英文男声" : " Nanami 日语女声与 Keita 日语男声"}。</p>
        {activeVoice && <p className="mt-3 text-xs text-[#75807a]">当前使用：{activeVoice}</p>}
        {audioError && <p className="mt-4 rounded-xl bg-[#f7e4e1] px-4 py-3 text-sm text-[#955b57]">{audioError}</p>}
      </div>
      <div className="p-5 md:p-7"><div className="mb-5 flex items-center justify-between"><button onClick={() => changePage(pageIndex - 1)} disabled={pageIndex === 0} className="rounded-full border px-4 py-2 text-sm disabled:opacity-30">← 上一页</button><select value={pageIndex} onChange={e => changePage(Number(e.target.value))} className="rounded-full border bg-white px-4 py-2 text-sm">{pages.map((item, i) => <option key={item.page} value={i}>第 {item.page} 页</option>)}</select><button onClick={() => changePage(pageIndex + 1)} disabled={pageIndex === pages.length - 1} className="rounded-full border px-4 py-2 text-sm disabled:opacity-30">下一页 →</button></div>
        <div className="mb-5 flex flex-wrap items-center gap-2 text-xs"><Languages size={16} className="mr-1 text-matcha"/><span className="rounded-full bg-matcha px-3 py-1.5 text-white">{isEnglishPage ? "英文" : "日文"}</span>{!isEnglishPage && <button onClick={() => setShowKana(!showKana)} className={`rounded-full px-3 py-1.5 ${showKana ? "bg-[#e1ebe6] text-matcha" : "bg-[#eee] text-[#888]"}`}>假名</button>}<button onClick={() => setShowCn(!showCn)} className={`rounded-full px-3 py-1.5 ${showCn ? "bg-[#f4e5e3] text-[#985f5c]" : "bg-[#eee] text-[#888]"}`}>中文</button></div>
        {page.groups.length ? <div className="space-y-5">{page.groups.map((item, i) => <div key={i} onClick={() => setSegment(i)} className={`block w-full cursor-pointer rounded-2xl border p-5 text-left transition ${i === segment ? "border-matcha bg-[#eef4f1] text-[#26463a]" : "border-[#e4e1d8] hover:bg-[#f7f6f2]"}`}>{item.title && <p className="mb-3 text-lg font-bold leading-8">{item.title}</p>}<div className="space-y-3">{item.lines.map((text, lineIndex) => {
          const lineKey = `${page.page}-${i}-${lineIndex}`;
          const heading = isSubheading(text);
          const annotation = manualBusinessAnnotation(text, page.page) ?? annotations[text];
          const speakerName = text.match(/^[①-㊿❶-❿女男\s]*([^：:]{1,12})[：:]/)?.[1]?.trim() ?? "";
          const nameReading = (businessNameReadings as Record<string, string>)[speakerName];
          const baseReadings = kanjiReadingsForBusinessLine(text);
          const kanjiReadings = nameReading && !baseReadings.some(item => item.surface === speakerName) ? [{ surface: speakerName, reading: nameReading, meaning: "" }, ...baseReadings] : baseReadings;
          const sentenceMeaning = deepseek2030Translations[text] ?? deepseek171180Translations[text] ?? deepseek161170Translations[text] ?? deepseek151160Translations[text] ?? deepseek141150Translations[text] ?? deepseek131140Translations[text] ?? deepseek121130Translations[text] ?? deepseek111120Translations[text] ?? pageTranslations[text] ?? fixedBusinessMeaning(text, page.page) ?? (allBusinessTranslations as Record<string, string>)[text] ?? annotation?.meaning ?? meaningForBusinessLine(text, page.page);
          return <div key={lineIndex} onClick={event => { if (heading) return; event.stopPropagation(); setSegment(i); void speakLine(text, lineKey); }} className={`rounded-xl px-3 py-2 transition ${heading ? "" : "cursor-pointer hover:bg-white/70"} ${activeLine === lineKey ? "bg-white ring-1 ring-matcha" : ""}`}>
            <p className={`text-lg leading-8 ${heading ? "font-bold" : ""}`}>{text}</p>
            {showKana && !heading && kanjiReadings.length > 0 && <div className="mt-1 flex flex-wrap gap-2 text-xs text-[#587467]">{kanjiReadings.map(word => <span key={word.surface} className="rounded-md bg-white/80 px-2 py-1">{word.surface}<span className="mx-1 text-[#9aa6a0]">·</span>{word.reading}</span>)}</div>}
            {showCn && !heading && <p className="mt-1 text-sm leading-6 text-[#7d817f]">{sentenceMeaning}</p>}
            {!heading && <div className="mt-2"><div className="flex flex-wrap gap-2"><button onClick={event => { event.stopPropagation(); setOpenMemos(items => items.includes(lineKey) ? items.filter(key => key !== lineKey) : [...items, lineKey]); }} className="inline-flex items-center gap-1 rounded-full border border-[#d8d5cc] bg-white/80 px-2.5 py-1 text-xs text-[#65736d]"><NotebookPen size={13}/>语法解释</button><button onClick={event => { event.stopPropagation(); setOpenNotes(items => items.includes(lineKey) ? items.filter(key => key !== lineKey) : [...items, lineKey]); }} className="inline-flex items-center gap-1 rounded-full border border-[#d8d5cc] bg-white/80 px-2.5 py-1 text-xs text-[#65736d]"><StickyNote size={13}/>{personalNotes[lineKey] || sharedNotes[lineKey] ? "查看笔记" : "添加笔记"}</button></div>{openMemos.includes(lineKey) && <div className="mt-2 space-y-3 rounded-xl border border-[#e2ded4] bg-[#fffdf8] p-4">{grammarMemoForBusinessLine(text).map(memo => <div key={memo.title} className="border-b border-[#ece8df] pb-3 last:border-0 last:pb-0"><p className="text-sm font-bold text-[#345a4b]">{memo.title}</p><p className="mt-1 text-sm leading-6 text-[#626b66]">{memo.detail}</p></div>)}</div>}{openNotes.includes(lineKey) && <div onClick={event => event.stopPropagation()} className="mt-2 rounded-xl border border-[#e2ded4] bg-white p-3"><textarea value={personalNotes[lineKey] ?? sharedNotes[lineKey] ?? ""} onChange={event => setPersonalNotes(notes => ({ ...notes, [lineKey]: event.target.value }))} placeholder="写下你对这句话的理解、用法或例句……" className="min-h-24 w-full resize-y rounded-lg border border-[#dedbd1] bg-[#fffdf8] p-3 text-sm outline-none focus:border-matcha"/><div className="mt-2 flex flex-wrap gap-2"><button onClick={() => savePersonalNote(lineKey, personalNotes[lineKey] ?? sharedNotes[lineKey] ?? "")} className="inline-flex items-center gap-1 rounded-full bg-matcha px-3 py-1.5 text-xs font-bold text-white"><Save size={13}/>保存到本机</button><button onClick={() => void publishPersonalNote(lineKey)} className="inline-flex items-center gap-1 rounded-full bg-[#313a36] px-3 py-1.5 text-xs font-bold text-white"><CloudUpload size={13}/>提交并同步</button></div><input type="password" value={githubToken} onChange={event => setGithubToken(event.target.value)} placeholder="GitHub Token（仅保存在本次浏览器会话）" className="mt-3 w-full rounded-lg border border-[#dedbd1] px-3 py-2 text-xs outline-none focus:border-matcha"/><p className="mt-2 text-xs leading-5 text-[#8a918d]">提交后笔记会公开保存到本仓库，其他浏览器重新打开网页即可读取。Token不会写入网页或仓库。</p>{syncStatus && <p className="mt-2 rounded-lg bg-[#f1f3ef] px-3 py-2 text-xs text-[#59655f]">{syncStatus}</p>}</div>}</div>}
          </div>;
        })}</div></div>)}</div> : <div className="rounded-2xl bg-cream p-10 text-center text-[#777f7b]">本页没有识别到日文内容，请查看左侧原页。</div>}
        {groupWords.length > 0 && <div className="mt-6 rounded-2xl border border-[#dedbd1] bg-cream p-5"><p className="text-xs font-bold tracking-[.15em] text-sakura">WORDS IN THIS SECTION</p><h2 className="mt-2 text-xl font-bold">本段商务词汇</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{groupWords.map(word => <div key={word.surface} className="rounded-xl bg-white p-4"><div className="flex items-start justify-between"><div><p className="font-bold">{word.surface}</p><p className="mt-1 text-xs text-matcha">{word.reading}</p></div><button onClick={event => { event.stopPropagation(); void saveWord(word); }} className={`grid h-8 w-8 place-items-center rounded-full ${saved.includes(word.surface) ? "bg-matcha text-white" : "bg-cream text-matcha"}`}>{saved.includes(word.surface) ? <Check size={15}/> : <BookmarkPlus size={15}/>}</button></div><p className="mt-3 border-t border-[#dedbd1] pt-3 text-sm text-[#737a76]">{word.meaning}</p></div>)}</div></div>}
      </div>
    </section>
  </div>;
}

"use client";

import { BookmarkPlus, Check, ChevronLeft, ChevronRight, Gauge, Languages, Pause, Play, Repeat1 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Lesson } from "@/lib/content";
import { getLessonProgress, saveProgress, saveWord as saveLocalWord } from "@/lib/local-study";

const fmt = (seconds: number) => `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60).toString().padStart(2, "0")}`;

export default function ListeningPlayer({ lesson }: { lesson: Lesson }) {
  const audio = useRef<HTMLAudioElement>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const playingRef = useRef(false), loopRef = useRef(false), speedRef = useRef(1);
  const [playing, setPlaying] = useState(false), [time, setTime] = useState(0), [index, setIndex] = useState(0), [loop, setLoop] = useState(false), [speed, setSpeed] = useState(1);
  const [voice, setVoice] = useState<"nanami" | "keita">("nanami");
  const [showKana, setShowKana] = useState(true), [showCn, setShowCn] = useState(true), [saved, setSaved] = useState<string[]>([]);
  const sentence = lesson.sentences[index];

  useEffect(() => { const p = getLessonProgress(lesson.id); if (p?.position) { const found = lesson.sentences.findIndex(s => p.position >= s.start && p.position < s.end); if (found >= 0) setIndex(found); setTime(p.position); } }, [lesson]);
  useEffect(() => () => { if (saveTimer.current) clearTimeout(saveTimer.current); }, []);
  useEffect(() => { const el = audio.current; if (!el) return; el.load(); el.playbackRate = speedRef.current; if (playingRef.current) void el.play(); }, [index, voice]);
  const persist = (position: number, completed = false) => { if (saveTimer.current) clearTimeout(saveTimer.current); saveTimer.current = setTimeout(() => saveProgress({ lessonId: lesson.id, position, percent: completed ? 100 : Math.round(position / lesson.duration * 100), completed }), 350); };
  const jump = (next: number) => { const bounded = Math.max(0, Math.min(lesson.sentences.length - 1, next)); setIndex(bounded); setTime(lesson.sentences[bounded].start); };
  const toggle = () => { const el = audio.current; if (!el) return; if (playingRef.current) { playingRef.current = false; setPlaying(false); el.pause(); } else { playingRef.current = true; setPlaying(true); void el.play(); } };
  const setRate = (rate: number) => { speedRef.current = rate; setSpeed(rate); if (audio.current) audio.current.playbackRate = rate; };
  const toggleLoop = () => { loopRef.current = !loopRef.current; setLoop(loopRef.current); };
  const onTime = () => { const el = audio.current; if (!el || !Number.isFinite(el.duration)) return; const item = lesson.sentences[index]; const position = item.start + (item.end - item.start) * (el.currentTime / el.duration); setTime(position); persist(position); };
  const onEnded = () => { const el = audio.current; if (!el || !playingRef.current) return; if (loopRef.current) { el.currentTime = 0; void el.play(); } else if (index < lesson.sentences.length - 1) jump(index + 1); else { playingRef.current = false; setPlaying(false); setTime(lesson.duration); persist(lesson.duration, true); } };
  const saveWord = async (word: { surface: string; reading: string; meaning: string }) => { saveLocalWord({ lessonId: lesson.id, ...word }); setSaved(x => [...new Set([...x, word.surface])]); };

  return <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
    <section className="overflow-hidden rounded-[1.75rem] border border-[#dedbd1] bg-white">
      <audio ref={audio} className="hidden" src={`/audio/neural/${voice}/${lesson.id}-${index}.mp3`} onTimeUpdate={onTime} onEnded={onEnded}/>
      <div className="border-b border-[#e5e2da] bg-[#f0eee7] p-5 md:p-7">
        <div className="flex items-center gap-4"><button onClick={toggle} className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-matcha text-white shadow-lg shadow-matcha/20" aria-label={playing ? "暂停" : "播放日语朗读"}>{playing ? <Pause fill="currentColor"/> : <Play className="ml-1" fill="currentColor"/>}</button><div className="min-w-0 flex-1"><input aria-label="播放进度" className="range w-full" type="range" min="0" max={lesson.duration} step="0.05" value={time} onChange={e => { const value = Number(e.target.value); const found = lesson.sentences.findIndex(s => value >= s.start && value < s.end); if (found >= 0) jump(found); setTime(value); }}/><div className="mt-1 flex justify-between text-xs text-[#7d8480]"><span>{fmt(time)}</span><span>{fmt(lesson.duration)}</span></div></div></div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3"><div className="flex gap-2"><button onClick={() => jump(index - 1)} className="flex items-center gap-1 rounded-full border border-[#d1cec6] bg-white px-3 py-2 text-xs"><ChevronLeft size={15}/>上一句</button><button onClick={() => jump(index + 1)} className="flex items-center gap-1 rounded-full border border-[#d1cec6] bg-white px-3 py-2 text-xs">下一句<ChevronRight size={15}/></button><button onClick={toggleLoop} className={`flex items-center gap-1 rounded-full px-3 py-2 text-xs ${loop ? "bg-sakura text-white" : "border border-[#d1cec6] bg-white"}`}><Repeat1 size={15}/>单句循环</button></div><div className="flex items-center gap-1"><Gauge size={15} className="mr-1 text-[#777f7b]"/>{[.5, .75, 1, 1.25, 1.5].map(rate => <button key={rate} onClick={() => setRate(rate)} className={`rounded-lg px-2 py-1 text-xs ${speed === rate ? "bg-matcha text-white" : "hover:bg-white"}`}>{rate}×</button>)}</div></div>
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#626a66]"><span>自然语音</span><select value={voice} onChange={e => setVoice(e.target.value as "nanami" | "keita")} className="rounded-full border border-[#d1cec6] bg-white px-3 py-1.5 outline-none"><option value="nanami">Nanami · 自然女声</option><option value="keita">Keita · 自然男声</option></select></div>
      </div>
      <div className="p-5 md:p-8"><div className="mb-5 flex flex-wrap items-center gap-2 text-xs"><Languages size={16} className="mr-1 text-matcha"/><button className="rounded-full bg-matcha px-3 py-1.5 text-white">日文</button><button onClick={() => setShowKana(!showKana)} className={`rounded-full px-3 py-1.5 ${showKana ? "bg-[#e1ebe6] text-matcha" : "bg-[#eee] text-[#888]"}`}>假名</button><button onClick={() => setShowCn(!showCn)} className={`rounded-full px-3 py-1.5 ${showCn ? "bg-[#f4e5e3] text-[#985f5c]" : "bg-[#eee] text-[#888]"}`}>中文</button></div>
        <div className="space-y-3">{lesson.sentences.map((item, i) => <button key={item.id} onClick={() => jump(i)} className={`w-full rounded-2xl border p-5 text-left transition ${i === index ? "border-matcha bg-[#eef4f1] shadow-sm" : "border-transparent hover:bg-[#f7f6f2]"}`}><div className="flex gap-4"><span className={`mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] ${i === index ? "bg-matcha text-white" : "bg-[#eceae4] text-[#858b88]"}`}>{String(i + 1).padStart(2, "0")}</span><div><p className={`text-lg font-medium leading-8 md:text-xl ${i === index ? "text-[#26463a]" : ""}`}>{item.jp}</p>{showKana && <p className="mt-1 text-sm leading-6 text-[#70857b]">{item.kana}</p>}{showCn && <p className="mt-1 text-sm leading-6 text-[#7d817f]">{item.cn}</p>}</div></div></button>)}</div>
      </div>
    </section>
    <aside className="h-fit rounded-[1.75rem] border border-[#dedbd1] bg-white p-6 lg:sticky lg:top-24"><p className="text-xs font-bold tracking-[.15em] text-sakura">WORDS IN THIS SENTENCE</p><h2 className="mt-2 text-xl font-bold">本句词汇</h2><div className="mt-5 space-y-3">{sentence.words.map(word => <div key={word.surface} className="rounded-2xl bg-cream p-4"><div className="flex items-start justify-between"><div><p className="font-bold">{word.surface}</p><p className="mt-1 text-xs text-matcha">{word.reading}</p></div><button onClick={() => saveWord(word)} className={`grid h-8 w-8 place-items-center rounded-full ${saved.includes(word.surface) ? "bg-matcha text-white" : "bg-white text-matcha"}`} aria-label="收藏生词">{saved.includes(word.surface) ? <Check size={15}/> : <BookmarkPlus size={15}/>}</button></div><p className="mt-3 border-t border-[#dedbd1] pt-3 text-sm text-[#737a76]">{word.meaning}</p></div>)}</div><p className="mt-5 text-xs leading-5 text-[#929793]">点击字幕可跳到对应句子；自然语音已缓存在本地，播放时无需联网。</p></aside>
  </div>;
}

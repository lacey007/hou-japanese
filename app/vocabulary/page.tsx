"use client";

import { BookOpen, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

type Word = { id: number; lessonId: string; surface: string; reading: string; meaning: string; createdAt: string };
export default function VocabularyPage() {
  const [words, setWords] = useState<Word[]>([]), [query, setQuery] = useState("");
  useEffect(() => { void fetch("/api/vocabulary").then(r => r.json()).then(setWords); }, []);
  const remove = async (id: number) => { await fetch(`/api/vocabulary?id=${id}`, { method: "DELETE" }); setWords(words.filter(w => w.id !== id)); };
  const shown = words.filter(w => [w.surface, w.reading, w.meaning].some(v => v.includes(query)));
  return <div className="mx-auto min-h-[75vh] max-w-5xl px-5 py-14"><p className="text-xs font-bold tracking-[.18em] text-sakura">VOCABULARY</p><div className="mt-2 flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-4xl font-bold">我的生词本</h1><p className="mt-3 text-[#747c78]">收藏 {words.length} 个词，在精听中一点点积累。</p></div><div className="flex items-center gap-2 rounded-full border border-[#d5d2c9] bg-white px-4 py-2.5"><Search size={17} className="text-[#858b87]"/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="搜索生词" className="w-40 bg-transparent text-sm outline-none"/></div></div>
    {shown.length ? <div className="mt-9 grid gap-3 sm:grid-cols-2">{shown.map(word => <div key={word.id} className="group flex items-center justify-between rounded-2xl border border-[#dedbd1] bg-white p-5"><div><div className="flex items-baseline gap-3"><p className="text-xl font-bold">{word.surface}</p><p className="text-sm text-matcha">{word.reading}</p></div><p className="mt-2 text-sm text-[#737a76]">{word.meaning}</p><Link className="mt-3 inline-block text-xs text-[#9a9e9b] hover:text-matcha" href={`/lesson/${word.lessonId}`}>回到原文 →</Link></div><button onClick={() => remove(word.id)} className="rounded-full p-2 text-[#b1b4b2] opacity-60 hover:bg-[#f7e7e5] hover:text-sakura group-hover:opacity-100" aria-label="删除生词"><Trash2 size={17}/></button></div>)}</div> : <div className="mt-10 rounded-[2rem] border border-dashed border-[#cbc8be] py-20 text-center"><BookOpen className="mx-auto mb-4 text-[#a6aaa7]" size={34}/><p className="font-bold">{query ? "没有找到匹配的生词" : "生词本还是空的"}</p><p className="mt-2 text-sm text-[#858b88]">去精听页面收藏遇到的新词吧</p><Link href="/library" className="mt-5 inline-block rounded-full bg-matcha px-5 py-2.5 text-sm font-bold text-white">浏览学习资料</Link></div>}
  </div>;
}

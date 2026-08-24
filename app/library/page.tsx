"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpenText, MoveRight, SlidersHorizontal } from "lucide-react";
import { lessons } from "@/lib/content";
import LessonCard from "@/components/LessonCard";

const businessLabel = "実用ビジネス日本語";
const levels = ["全部", "N5", "N4", "N3", "N2", "N1", businessLabel];

function BusinessCard() {
  return <Link href="/business-japanese" className="group block overflow-hidden rounded-[1.6rem] border border-[#dedbd1] bg-white transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#547565]/10">
    <div className="h-2 bg-[#2f453b]"/>
    <div className="p-5">
      <div className="mb-6 flex items-center justify-between"><span className="rounded-full bg-cream px-3 py-1 text-xs font-bold text-matcha">商务日语 · 203页</span><BookOpenText size={20} className="text-[#98a19d]"/></div>
      <h3 className="mb-2 text-xl font-bold">実用ビジネス日本語</h3>
      <p className="min-h-10 text-sm leading-6 text-[#777f7b]">扫描原页对照、完整对话朗读、自然男声与女声。</p>
      <div className="mt-5 flex items-center justify-end text-xs font-bold text-matcha">开始学习 <MoveRight size={15} className="ml-1 transition group-hover:translate-x-1"/></div>
    </div>
  </Link>;
}

export default function LibraryPage() {
  const [level, setLevel] = useState("全部");
  const isBusiness = level === businessLabel;
  const shown = isBusiness ? [] : lessons.filter(lesson => level === "全部" || lesson.level === level);

  return <div className="mx-auto min-h-[75vh] max-w-6xl px-5 py-14">
    <p className="text-xs font-bold tracking-[.18em] text-sakura">LIBRARY</p>
    <h1 className="mt-2 text-4xl font-bold">学习资料库</h1>
    <p className="mt-3 text-[#747c78]">按 JLPT 等级或专题选择适合你的精听内容。</p>
    <div className="my-9 flex flex-wrap items-center gap-2">
      <SlidersHorizontal size={17} className="mr-2 text-[#777f7b]"/>
      {levels.map(item => <button key={item} onClick={() => setLevel(item)} className={`rounded-full px-4 py-2 text-sm font-bold transition ${level === item ? "bg-matcha text-white" : "border border-[#d7d4cb] bg-white hover:border-matcha"}`}>{item}</button>)}
    </div>
    {(shown.length || isBusiness || level === "全部") ? <div className="grid gap-5 md:grid-cols-3">
      {(level === "全部" || isBusiness) && <BusinessCard/>}
      {shown.map(lesson => <LessonCard key={lesson.id} lesson={lesson}/>)}
    </div> : <div className="rounded-3xl border border-dashed border-[#cbc8be] py-20 text-center text-[#858b88]">这个等级的资料正在准备中</div>}
  </div>;
}

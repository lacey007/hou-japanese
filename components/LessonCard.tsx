import Link from "next/link";
import { Clock3, Headphones, MoveRight } from "lucide-react";
import type { Lesson } from "@/lib/content";

export default function LessonCard({ lesson, progress = 0 }: { lesson: Lesson; progress?: number }) {
  return <Link href={`/lesson/${lesson.id}`} className="group block overflow-hidden rounded-[1.6rem] border border-[#dedbd1] bg-white transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#547565]/10">
    <div className="h-2" style={{ background: lesson.color }}/>
    <div className="p-5">
      <div className="mb-6 flex items-center justify-between"><span className="rounded-full bg-cream px-3 py-1 text-xs font-bold text-matcha">{lesson.level} · {lesson.category}</span><Headphones size={20} className="text-[#98a19d]"/></div>
      <h3 className="mb-2 text-xl font-bold">{lesson.title}</h3><p className="min-h-10 text-sm leading-6 text-[#777f7b]">{lesson.subtitle}</p>
      <div className="mt-5 flex items-center justify-between text-xs text-[#777f7b]"><span className="flex items-center gap-1"><Clock3 size={14}/>{lesson.duration} 秒</span><span className="flex items-center gap-1 font-bold text-matcha">开始精听 <MoveRight size={15} className="transition group-hover:translate-x-1"/></span></div>
      {progress > 0 && <div className="mt-4"><div className="h-1.5 overflow-hidden rounded-full bg-[#ebe9e2]"><div className="h-full rounded-full bg-sakura" style={{ width: `${progress}%` }}/></div><p className="mt-1.5 text-right text-[10px] text-[#909691]">已学习 {progress}%</p></div>}
    </div>
  </Link>;
}

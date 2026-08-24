import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Clock3 } from "lucide-react";
import { getLesson, lessons } from "@/lib/content";
import ListeningPlayer from "@/components/ListeningPlayer";

export function generateStaticParams() { return lessons.map(l => ({ id: l.id })); }
export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const lesson = getLesson((await params).id); if (!lesson) notFound();
  return <div className="mx-auto max-w-6xl px-5 py-10"><Link href="/library" className="mb-7 inline-flex items-center gap-1 text-sm text-[#737a76] hover:text-matcha"><ChevronLeft size={17}/>返回资料库</Link><div className="mb-8"><div className="mb-3 flex items-center gap-3 text-xs"><span className="rounded-full bg-[#e3ebe7] px-3 py-1 font-bold text-matcha">{lesson.level}</span><span>{lesson.category}</span><span className="flex items-center gap-1"><Clock3 size={13}/>{lesson.duration} 秒</span></div><h1 className="text-3xl font-bold md:text-4xl">{lesson.title}</h1><p className="mt-2 text-[#747c78]">{lesson.subtitle}</p></div><ListeningPlayer lesson={lesson}/></div>;
}

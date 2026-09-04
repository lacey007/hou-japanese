import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import recognizedPages from "@/data/n2-grammar-blue-pages.json";
import BusinessJapanesePlayer from "@/components/BusinessJapanesePlayer";

export default function N2GrammarBluePage() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const pages = Array.from({ length: 264 }, (_, index) => {
    const page = index + 1;
    const recognized = recognizedPages.find(item => item.page === page);
    return recognized
      ? { ...recognized, image: `${basePath}/n2-grammar-blue/page-${String(page).padStart(3, "0")}.jpg` }
      : {
          page,
          image: `${basePath}/n2-grammar-blue/page-${String(page).padStart(3, "0")}.jpg`,
          segments: [],
          groups: [],
        };
  });

  return <div className="mx-auto max-w-[1400px] px-5 py-10">
    <Link href="/library" className="mb-7 inline-flex items-center gap-1 text-sm text-[#737a76] hover:text-matcha"><ChevronLeft size={17}/>返回资料库</Link>
    <div className="mb-8">
      <div className="mb-3 flex items-center gap-3 text-xs"><span className="rounded-full bg-[#e3ebe7] px-3 py-1 font-bold text-matcha">JLPT N2 · 文法</span><span>264 页 · 原页对照</span></div>
      <h1 className="text-3xl font-bold md:text-4xl">蓝宝书 新日本语能力考试 N2 文法</h1>
      <p className="mt-2 text-[#747c78]">扫描原页对照、逐页导航、日文识别、点击朗读、假名提示、语法解释与学习笔记。</p>
    </div>
    <BusinessJapanesePlayer pages={pages} lessonId="n2-grammar-blue" bookTitle="蓝宝书 新日本语能力考试 N2 文法" audioKeyPrefix="n2"/>
  </div>;
}

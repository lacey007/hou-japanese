import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import pages from "@/data/business-pages.json";
import corrections from "@/data/business-pages-corrections-92-96.json";
import corrections97110 from "@/data/business-pages-corrections-97-110.json";
import corrections111120 from "@/data/business-pages-corrections-111-120.json";
import corrections121130 from "@/data/business-pages-corrections-121-130.json";
import corrections131140 from "@/data/business-pages-corrections-131-140.json";
import corrections141150 from "@/data/business-pages-corrections-141-150.json";
import corrections818 from "@/data/business-pages-corrections-8-18.json";
import BusinessJapanesePlayer from "@/components/BusinessJapanesePlayer";

export default function BusinessJapanesePage() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const allCorrections = [...corrections, ...corrections97110, ...corrections111120, ...corrections121130, ...corrections131140, ...corrections141150, ...corrections818];
  const staticPages = pages.map(page => ({ ...(allCorrections.find(item => item.page === page.page) ?? page), image: `${basePath}${page.image}` }));
  return <div className="mx-auto max-w-[1400px] px-5 py-10"><Link href="/library" className="mb-7 inline-flex items-center gap-1 text-sm text-[#737a76] hover:text-matcha"><ChevronLeft size={17}/>返回资料库</Link><div className="mb-8"><div className="mb-3 flex items-center gap-3 text-xs"><span className="rounded-full bg-[#e3ebe7] px-3 py-1 font-bold text-matcha">商务日语</span><span>203 页 · 原页对照</span></div><h1 className="text-3xl font-bold md:text-4xl">実用ビジネス日本語</h1><p className="mt-2 text-[#747c78]">逐页阅读扫描原文，点击日文段落即可使用设备内置日语语音朗读。</p></div><BusinessJapanesePlayer pages={staticPages}/></div>;
}

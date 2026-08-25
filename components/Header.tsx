"use client";

import Link from "next/link";
import { BookOpen, House, Languages, Library, Menu, X } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

const nav = [{ href: "/", label: "首页", icon: House }, { href: "/library", label: "资料库", icon: Library }, { href: "/vocabulary", label: "生词本", icon: BookOpen }, { href: "https://www.japanese50sounds.com/chart/", label: "五十音图", icon: Languages, external: true }];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return <header className="sticky top-0 z-40 border-b border-[#dedbd1] bg-cream/95 backdrop-blur">
    <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-5 py-4">
      <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
        <span className="grid h-10 w-10 place-items-center rounded-full bg-matcha text-xl font-bold text-white">ひ</span>
        <div><p className="text-lg font-bold tracking-[.14em]">ひびき</p><p className="text-[10px] tracking-[.2em] text-[#7b817e]">HIBIKI JAPANESE</p></div>
      </Link>
      <nav className="hidden items-center gap-1 md:flex">{nav.map(({ href, label, icon: Icon, external }) => external ? <a key={href} href={href} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-full px-4 py-2 text-sm transition hover:bg-white"><Icon size={16}/>{label}</a> : <Link key={href} href={href} className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${pathname === href ? "bg-matcha text-white" : "hover:bg-white"}`}><Icon size={16}/>{label}</Link>)}</nav>
      <button className="rounded-full p-2 md:hidden" onClick={() => setOpen(!open)} aria-label="展开菜单">{open ? <X/> : <Menu/>}</button>
    </div>
    {open && <nav className="border-t border-[#dedbd1] px-5 py-3 md:hidden">{nav.map(({ href, label, icon: Icon, external }) => external ? <a key={href} href={href} target="_blank" rel="noreferrer" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-3"><Icon size={18}/>{label}</a> : <Link key={href} href={href} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-3"><Icon size={18}/>{label}</Link>)}</nav>}
  </header>;
}

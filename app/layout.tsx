import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = { title: "ひびき · 个人日语精听", description: "本地运行的个人日语学习与精听工具" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="zh-CN"><body><Header/><main>{children}</main><footer className="border-t border-[#dedbd1] py-8 text-center text-xs text-[#8b918e]">ひびき · 你的本地日语学习空间</footer></body></html>; }

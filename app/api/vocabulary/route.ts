import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const words = getDb().prepare("SELECT id, lesson_id as lessonId, surface, reading, meaning, created_at as createdAt FROM vocabulary ORDER BY created_at DESC").all();
  return NextResponse.json(words);
}

export async function POST(request: Request) {
  const { lessonId, surface, reading, meaning } = await request.json();
  if (![lessonId, surface, reading, meaning].every((value) => typeof value === "string" && value.trim())) return NextResponse.json({ error: "数据不完整" }, { status: 400 });
  getDb().prepare("INSERT OR IGNORE INTO vocabulary (lesson_id, surface, reading, meaning) VALUES (?, ?, ?, ?)").run(lessonId, surface, reading, meaning);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const id = new URL(request.url).searchParams.get("id");
  getDb().prepare("DELETE FROM vocabulary WHERE id = ?").run(id);
  return NextResponse.json({ ok: true });
}

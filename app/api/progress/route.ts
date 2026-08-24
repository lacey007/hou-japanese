import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const lessonId = new URL(request.url).searchParams.get("lessonId");
  const db = getDb();
  if (lessonId) return NextResponse.json(db.prepare("SELECT lesson_id as lessonId, position, percent, completed FROM progress WHERE lesson_id = ?").get(lessonId) ?? null);
  return NextResponse.json(db.prepare("SELECT lesson_id as lessonId, position, percent, completed, updated_at as updatedAt FROM progress ORDER BY updated_at DESC").all());
}

export async function POST(request: Request) {
  const { lessonId, position, percent, completed } = await request.json();
  getDb().prepare(`INSERT INTO progress (lesson_id, position, percent, completed, updated_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(lesson_id) DO UPDATE SET position=excluded.position, percent=MAX(progress.percent, excluded.percent), completed=excluded.completed, updated_at=CURRENT_TIMESTAMP`)
    .run(lessonId, Number(position) || 0, Math.min(100, Math.max(0, Number(percent) || 0)), completed ? 1 : 0);
  return NextResponse.json({ ok: true });
}

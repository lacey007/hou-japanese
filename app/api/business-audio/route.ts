import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { Communicate } from "edge-tts.js";
import pages from "@/data/business-pages.json";

export const runtime = "nodejs";
export const maxDuration = 60;

const voices = { nanami: "ja-JP-NanamiNeural", keita: "ja-JP-KeitaNeural" } as const;
type VoiceKey = keyof typeof voices;

async function naturalAudio(text: string, voiceKey: VoiceKey) {
  const target = path.join(os.tmpdir(), `hibiki-${crypto.randomUUID()}.mp3`);
  try {
    await new Communicate(text, voices[voiceKey]).save(target);
    const audio = await fs.readFile(target);
    return new Response(audio, { headers: { "Content-Type": "audio/mpeg", "Cache-Control": "public, max-age=86400" } });
  } catch (error) {
    console.error("Natural TTS failed", error);
    return new Response("Natural voice generation failed", { status: 503 });
  } finally {
    await fs.unlink(target).catch(() => undefined);
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const voiceKey = url.searchParams.get("voice") as VoiceKey;
  const directText = url.searchParams.get("text")?.trim();
  if (directText) {
    if (directText.length > 5000 || !voices[voiceKey]) return new Response("Invalid request", { status: 400 });
    return naturalAudio(directText, voiceKey);
  }

  const pageNumber = Number(url.searchParams.get("page"));
  const segment = Number(url.searchParams.get("segment"));
  const page = pages.find(item => item.page === pageNumber);
  const text = page?.segments[segment];
  if (!text || !voices[voiceKey]) return new Response("Not found", { status: 404 });
  return naturalAudio(text, voiceKey);
}

export async function POST(request: Request) {
  const body = await request.json() as { text?: string; voice?: VoiceKey };
  const text = body.text?.trim();
  if (!text || text.length > 5000 || !body.voice || !voices[body.voice]) return new Response("Invalid request", { status: 400 });
  return naturalAudio(text, body.voice);
}

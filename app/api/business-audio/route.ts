import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import pages from "@/data/business-pages.json";

export const runtime = "nodejs";
const voices = { nanami: "ja-JP-NanamiNeural", keita: "ja-JP-KeitaNeural" } as const;

function pythonCommand() {
  if (process.env.PYTHON_BIN) return process.env.PYTHON_BIN;
  if (process.platform !== "win32") return "python3";
  return "C:\\Users\\bhou\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\python\\python.exe";
}

function dataPath(...parts: string[]) {
  return path.join(process.env.DATA_DIR || path.join(process.cwd(), "data"), ...parts);
}

function run(command: string, args: string[]) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, { windowsHide: true });
    let error = "";
    child.stderr.on("data", chunk => { error += chunk.toString(); });
    child.on("error", reject);
    child.on("close", code => code === 0 ? resolve() : reject(new Error(error || `TTS exited ${code}`)));
  });
}

async function naturalAudio(text: string, voiceKey: keyof typeof voices) {
  const cache = dataPath("audio-cache", voiceKey, "natural-lines");
  fs.mkdirSync(cache, { recursive: true });
  const id = crypto.createHash("sha256").update(text).digest("hex");
  const target = path.join(cache, `${id}.mp3`);
  if (!fs.existsSync(target) || fs.statSync(target).size < 1000) {
    const python = pythonCommand();
    const temporary = `${target}.${process.pid}.tmp.mp3`;
    try {
      await run(python, [path.join(process.cwd(), "scripts", "edge-tts-one.py"), text, voices[voiceKey], temporary]);
      fs.renameSync(temporary, target);
    } catch (error) {
      if (fs.existsSync(temporary)) fs.unlinkSync(temporary);
      console.error("Natural line TTS failed", error);
      return new Response("Natural voice generation failed", { status: 503 });
    }
  }
  return new Response(fs.readFileSync(target), { headers: { "Content-Type": "audio/mpeg", "Cache-Control": "public, max-age=31536000" } });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const directText = url.searchParams.get("text")?.trim();
  const directVoice = url.searchParams.get("voice") as keyof typeof voices;
  if (directText) {
    if (directText.length > 5000 || !voices[directVoice]) return new Response("Invalid request", { status: 400 });
    return naturalAudio(directText, directVoice);
  }
  const pageNumber = Number(url.searchParams.get("page"));
  const segment = Number(url.searchParams.get("segment"));
  const voiceKey = url.searchParams.get("voice") as keyof typeof voices;
  const page = pages.find(item => item.page === pageNumber);
  const text = page?.segments[segment];
  if (!text || !voices[voiceKey]) return new Response("Not found", { status: 404 });

  const cache = dataPath("audio-cache", voiceKey);
  fs.mkdirSync(cache, { recursive: true });
  const target = path.join(cache, `${pageNumber}-${segment}.mp3`);
  if (!fs.existsSync(target) || fs.statSync(target).size < 1000) {
    const python = pythonCommand();
    const temporary = `${target}.${process.pid}.tmp.mp3`;
    try {
      await run(python, [path.join(process.cwd(), "scripts", "edge-tts-one.py"), text, voices[voiceKey], temporary]);
      fs.renameSync(temporary, target);
    } catch (error) {
      if (fs.existsSync(temporary)) fs.unlinkSync(temporary);
      console.error("Business TTS failed", error);
      return new Response("Natural voice generation failed", { status: 503 });
    }
  }
  return new Response(fs.readFileSync(target), { headers: { "Content-Type": "audio/mpeg", "Cache-Control": "public, max-age=31536000" } });
}

export async function POST(request: Request) {
  const body = await request.json() as { text?: string; voice?: keyof typeof voices };
  const text = body.text?.trim();
  const voiceKey = body.voice;
  if (!text || text.length > 5000 || !voiceKey || !voices[voiceKey]) return new Response("Invalid request", { status: 400 });
  return naturalAudio(text, voiceKey);
}

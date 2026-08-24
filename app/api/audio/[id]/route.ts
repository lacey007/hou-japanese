import { getLesson } from "@/lib/content";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lesson = getLesson(id);
  if (!lesson) return new Response("Not found", { status: 404 });
  const sampleRate = 8000;
  const frames = Math.floor(lesson.duration * sampleRate);
  const buffer = new ArrayBuffer(44 + frames * 2);
  const view = new DataView(buffer);
  const write = (offset: number, text: string) => [...text].forEach((char, index) => view.setUint8(offset + index, char.charCodeAt(0)));
  write(0, "RIFF"); view.setUint32(4, 36 + frames * 2, true); write(8, "WAVEfmt "); view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true); view.setUint32(24, sampleRate, true); view.setUint32(28, sampleRate * 2, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true); write(36, "data"); view.setUint32(40, frames * 2, true);
  for (let i = 0; i < frames; i++) {
    const t = i / sampleRate;
    const sentence = lesson.sentences.find((item) => t >= item.start && t < item.end);
    const local = sentence ? t - sentence.start : 0;
    const pulse = sentence && local < 0.18 ? Math.sin(2 * Math.PI * 440 * local) * Math.exp(-local * 14) : 0;
    view.setInt16(44 + i * 2, pulse * 6000, true);
  }
  return new Response(buffer, { headers: { "Content-Type": "audio/wav", "Cache-Control": "public, max-age=31536000" } });
}

import asyncio
import json
import os
import re
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parents[1]
PAGES = json.loads((ROOT / "data" / "business-pages.json").read_text(encoding="utf-8"))
CORRECTION_FILES = [
    "business-pages-corrections-5-30.json",
    "business-pages-corrections-31-40.json",
    "business-pages-corrections-41-50.json",
    "business-pages-corrections-51-70.json",
    "business-pages-corrections-8-18.json",
    "business-pages-corrections-92-96.json",
    "business-pages-corrections-97-110.json",
    "business-pages-corrections-111-120.json",
    "business-pages-corrections-121-130.json",
    "business-pages-corrections-131-140.json",
    "business-pages-corrections-141-150.json",
    "business-pages-corrections-151-160.json",
    "business-pages-corrections-161-170.json",
    "business-pages-corrections-171-180.json",
    "business-pages-corrections-181-190.json",
    "business-pages-corrections-191-203.json",
]
CORRECTIONS = [item for name in CORRECTION_FILES for item in json.loads((ROOT / "data" / name).read_text(encoding="utf-8"))]
PAGES = [next((item for item in CORRECTIONS if item["page"] == page["page"]), page) for page in PAGES]
OUT = ROOT / "public" / "audio" / "business"
MANIFEST = ROOT / "data" / "business-audio-manifest.json"
VOICES = {
    "ja": {"female": "ja-JP-NanamiNeural", "male": "ja-JP-KeitaNeural"},
    "en": {"female": "en-US-AriaNeural", "male": "en-US-GuyNeural"},
}
SUBHEADING = re.compile(r"^[0-9０-９]{1,2}[.．、]?(?![0-9０-９])")
CIRCLED = re.compile(r"[①-⑳㉑-㉟㊱-㊿❶-❿]")


def clean_text(text: str) -> str:
    text = re.sub(r"^.*?[：:]\s*", "", text)
    # K.K. is a written abbreviation for 株式会社 in company names; do not read it aloud.
    text = re.sub(r"[（(]\s*K\.?\s*K\.?\s*[）)]", "", text, flags=re.IGNORECASE)
    text = CIRCLED.sub("", text)
    text = re.sub(r"^\s*[（(]?[0-9０-９]+[）).．、]\s*", "", text)
    text = re.sub(r"[^\u0020-\u007Eぁ-んァ-ヶ一-龯々。、！？…「」『』（）ー]", "", text)
    return text.strip()


def build_jobs():
    jobs = []
    manifest = {}
    ignored_ocr_keys = {"32-0-7", "58-2-13", "178-0-4", "179-0-12", "186-0-18", "189-0-17", "197-0-5"}
    for page in PAGES:
        page_no = page["page"]
        for group_index, group in enumerate(page.get("groups", [])):
            speakers = {}
            for line_index, line in enumerate(group.get("lines", [])):
                key = f"{page_no}-{group_index}-{line_index}"
                if key in ignored_ocr_keys:
                    continue
                is_subheading = bool(SUBHEADING.match(line) and len(line) < 60 and not re.search(r"[.!?。！？]$", line))
                if not line or is_subheading or re.match(r"^[（(].*[）)]$", line):
                    continue
                spoken = clean_text(line)
                if not spoken or "\ufffd" in spoken:
                    continue
                language = "ja" if re.search(r"[ぁ-んァ-ヶ一-龯々]", spoken) else "en" if (page_no == 5 or 174 <= page_no <= 201) and re.search(r"[A-Za-z]{3}", spoken) else ""
                if not language:
                    continue
                match = re.match(r"^([^：:]{1,16})[：:]", line)
                speaker = CIRCLED.sub("", match.group(1)).replace("女", "").replace("男", "") if match else "旁白"
                if speaker == "旁白":
                    gender = "female"
                else:
                    if speaker not in speakers:
                        speakers[speaker] = "female" if len(speakers) % 2 == 0 else "male"
                    gender = speakers[speaker]
                relative = f"audio/business/page-{page_no:03d}/group-{group_index:02d}-line-{line_index:03d}.mp3"
                target = ROOT / "public" / relative
                manifest[key] = {"src": f"/{relative}", "voice": gender, "speaker": speaker, "language": language}
                jobs.append((key, spoken, VOICES[language][gender], target))
    return jobs, manifest


async def generate_one(semaphore, job):
    key, text, voice, target = job
    force_pages = {item.strip() for item in os.environ.get("FORCE_PAGES", "").split(",") if item.strip()}
    if target.exists() and target.stat().st_size > 1000 and key.split("-", 1)[0] not in force_pages:
        return "cached"
    target.parent.mkdir(parents=True, exist_ok=True)
    async with semaphore:
        for attempt in range(4):
            try:
                await edge_tts.Communicate(text, voice, rate="-5%").save(str(target))
                if target.stat().st_size > 1000:
                    return "generated"
            except Exception as error:
                if target.exists():
                    target.unlink(missing_ok=True)
                if attempt == 3:
                    raise RuntimeError(f"{key} | {voice} | {text} | {error}") from error
                await asyncio.sleep(1.5 * (attempt + 1))
    return "failed"


async def main():
    jobs, manifest = build_jobs()
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    semaphore = asyncio.Semaphore(10)
    counts = {"generated": 0, "cached": 0, "failed": 0}
    pending = [asyncio.create_task(generate_one(semaphore, job)) for job in jobs]
    for index, task in enumerate(asyncio.as_completed(pending), 1):
        try:
            result = await task
        except Exception as error:
            result = "failed"
            print(f"ERROR: {error}", flush=True)
        counts[result] += 1
        if index % 50 == 0 or index == len(pending):
            print(f"PROGRESS {index}/{len(pending)} generated={counts['generated']} cached={counts['cached']} failed={counts['failed']}", flush=True)
    if counts["failed"]:
        raise SystemExit(f"Audio generation finished with {counts['failed']} failures")


if __name__ == "__main__":
    asyncio.run(main())

import json
import os
import re
from pathlib import Path

import easyocr

ROOT = Path(__file__).resolve().parents[1]
IMAGE_DIR = ROOT / "public" / "n2-grammar-blue"
OUTPUT = ROOT / "data" / "n2-grammar-blue-pages.json"
MODEL_DIR = ROOT / ".easyocr"
USER_DIR = ROOT / ".easyocr-user"

KANA = re.compile(r"[ぁ-んァ-ヶー]")
KEEP_HEADINGS = ("接続", "説明", "例文", "注意", "参考", "練習", "解答", "索引", "目次")


def useful(text: str) -> bool:
    text = text.strip()
    if len(text) < 2:
        return False
    if KANA.search(text):
        return True
    return any(word in text for word in KEEP_HEADINGS)


def main() -> None:
    reader = easyocr.Reader(
        ["ja", "en"],
        gpu=False,
        model_storage_directory=str(MODEL_DIR),
        user_network_directory=str(USER_DIR),
        download_enabled=False,
        verbose=False,
    )
    all_images = sorted(IMAGE_DIR.glob("page-*.jpg"))
    start_page = max(1, int(os.environ.get("START_PAGE", "1")))
    end_page = min(len(all_images), int(os.environ.get("END_PAGE", str(len(all_images)))))
    images = [
        path for path in all_images
        if start_page <= int(path.stem.split("-")[-1]) <= end_page
    ]
    existing = json.loads(OUTPUT.read_text(encoding="utf-8")) if OUTPUT.exists() else []
    pages_by_number = {int(item["page"]): item for item in existing}

    if not images:
        raise SystemExit(f"No page images found in range {start_page}-{end_page}")

    for start in range(0, len(images), 8):
        batch = images[start : start + 8]
        results = reader.readtext_batched(
            [str(path) for path in batch],
            n_width=1060,
            n_height=1500,
            batch_size=len(batch),
            detail=1,
            paragraph=False,
            workers=0,
        )
        for path, result in zip(batch, results):
            page = int(path.stem.split("-")[-1])
            ordered = sorted(result, key=lambda item: (min(p[1] for p in item[0]), min(p[0] for p in item[0])))
            lines = []
            for _box, text, confidence in ordered:
                clean = re.sub(r"\s+", " ", text).strip()
                if confidence >= 0.22 and useful(clean) and clean not in lines:
                    lines.append(clean)
            pages_by_number[page] = {
                "page": page,
                "image": f"/n2-grammar-blue/{path.name}",
                "segments": lines,
                "groups": [{"title": "", "lines": lines}],
            }
        pages = [pages_by_number[number] for number in sorted(pages_by_number)]
        OUTPUT.write_text(json.dumps(pages, ensure_ascii=False, indent=2), encoding="utf-8")
        print(
            f"PROGRESS {min(start + 8, len(images))}/{len(images)} "
            f"(pages {start_page}-{end_page})",
            flush=True,
        )


if __name__ == "__main__":
    main()

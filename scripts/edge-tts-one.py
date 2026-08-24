import asyncio
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
local_dependencies = ROOT / "runtime-deps" / "python"
if local_dependencies.exists():
    sys.path.insert(0, str(local_dependencies))
import edge_tts

async def main():
    text, voice, output = sys.argv[1], sys.argv[2], sys.argv[3]
    await edge_tts.Communicate(text=text, voice=voice).save(output)

asyncio.run(main())

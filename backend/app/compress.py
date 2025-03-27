# backend/app/compress.py
import subprocess
from pathlib import Path
import shutil

INPUT_DIR = Path("data/images")
OUTPUT_DIR = Path("data/compressed")

def compress_png(input_path: Path, output_path: Path):
    output_path.parent.mkdir(parents=True, exist_ok=True)
    try:
        result = subprocess.run(
            ["pngquant", "--quality=65-80", "--output", str(output_path), "--force", str(input_path)],
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        return True, result.stderr.decode()
    except subprocess.CalledProcessError as e:
        return False, e.stderr.decode()

def scan_and_compress():
    png_files = list(INPUT_DIR.rglob("*.png"))
    results = []

    for file in png_files:
        relative = file.relative_to(INPUT_DIR)
        compressed_path = OUTPUT_DIR / relative
        success, log = compress_png(file, compressed_path)

        if success:
            orig_size = file.stat().st_size
            comp_size = compressed_path.stat().st_size
            results.append({
                "file": str(relative),
                "original_kb": round(orig_size / 1024, 1),
                "compressed_kb": round(comp_size / 1024, 1),
                "savings": f"{100 - (comp_size/orig_size)*100:.1f}%"
            })
        else:
            results.append({
                "file": str(relative),
                "error": log.strip()
            })

    return results

if __name__ == "__main__":
    from pprint import pprint
    pprint(scan_and_compress())

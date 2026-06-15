#!/usr/bin/env python3
"""Pullit 브랜드 에셋 PNG보내기 (cairosvg 필요 시 pip install cairosvg)."""

import os
import subprocess
import sys

BASE = os.path.dirname(os.path.abspath(__file__))
BRAND = os.path.join(BASE, "brand")
OUT = os.path.join(BRAND, "export")
os.makedirs(OUT, exist_ok=True)

EXPORTS = [
    ("logo-mark.svg", [(512, "app-icon-512.png"), (180, "app-icon-180.png"), (120, "logo-mark-120.png")]),
    ("logo-full-ko.svg", [(800, "logo-full-ko-800.png")]),
    ("favicon.svg", [(32, "favicon-32.png"), (16, "favicon-16.png")]),
    ("og-image.svg", [(1200, "og-image-1200.png")]),
]

def export_with_cairosvg():
    import cairosvg
    for svg_name, sizes in EXPORTS:
        svg_path = os.path.join(BRAND, svg_name)
        for width, png_name in sizes:
            out_path = os.path.join(OUT, png_name)
            cairosvg.svg2png(url=svg_path, write_to=out_path, output_width=width)
            print(f"PNG: {out_path}")

def export_with_qlmanage():
    """macOS fallback: qlmanage thumbnail."""
    for svg_name, sizes in EXPORTS:
        svg_path = os.path.join(BRAND, svg_name)
        for width, png_name in sizes:
            out_path = os.path.join(OUT, png_name)
            subprocess.run(["qlmanage", "-t", "-s", str(width), "-o", OUT, svg_path], capture_output=True)
            # qlmanage outputs .svg.png
            generated = os.path.join(OUT, svg_name + ".png")
            if os.path.exists(generated):
                os.rename(generated, out_path)
                print(f"PNG: {out_path}")

if __name__ == "__main__":
    try:
        export_with_cairosvg()
    except ImportError:
        print("cairosvg 없음 — SVG만 사용 가능. PNG 필요 시: pip install cairosvg")
        print(f"SVG 에셋 위치: {BRAND}/")

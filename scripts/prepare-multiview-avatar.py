from __future__ import annotations

from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "public" / "avatar"
OUTPUT_DIR = SOURCE_DIR / "multiview"
SOURCE_INDICES = [*range(24, 32), *range(0, 9)]
OUTPUT_SIZE = (640, 800)
FACE_SIZE_OVERRIDES = {
    24: 340,
    25: 340,
    26: 320,
    27: 260,
    28: 240,
    29: 225,
    30: 215,
    31: 205,
    4: 275,
    5: 265,
    6: 270,
    7: 265,
    8: 260,
}


def detect_face(rgba: np.ndarray) -> tuple[int, int, int, int] | None:
    rgb = rgba[:, :, :3].copy()
    alpha = rgba[:, :, 3]
    rgb[alpha < 20] = 0
    gray = cv2.cvtColor(rgb, cv2.COLOR_RGB2GRAY)

    cascade_root = Path(cv2.data.haarcascades)
    frontal = cv2.CascadeClassifier(str(cascade_root / "haarcascade_frontalface_default.xml"))
    profile = cv2.CascadeClassifier(str(cascade_root / "haarcascade_profileface.xml"))

    candidates: list[tuple[float, tuple[int, int, int, int]]] = []
    for x, y, w, h in frontal.detectMultiScale(gray, 1.05, 3, minSize=(54, 54)):
        candidates.append((w * h * 1.15, (int(x), int(y), int(w), int(h))))
    for x, y, w, h in profile.detectMultiScale(gray, 1.04, 3, minSize=(50, 50)):
        candidates.append((w * h, (int(x), int(y), int(w), int(h))))

    flipped = cv2.flip(gray, 1)
    for x, y, w, h in profile.detectMultiScale(flipped, 1.04, 3, minSize=(50, 50)):
        candidates.append((w * h, (gray.shape[1] - int(x + w), int(y), int(w), int(h))))

    height, width = gray.shape
    plausible = [
        item
        for item in candidates
        if item[1][1] < height * 0.55 and 0 <= item[1][0] < width and item[1][2] < width * 0.72
    ]
    return max(plausible, default=(0, None), key=lambda item: item[0])[1]


def fallback_face(alpha: np.ndarray) -> tuple[int, int, int, int]:
    ys, xs = np.where(alpha > 20)
    if len(xs) == 0:
        return 180, 90, 260, 260

    left, right = int(xs.min()), int(xs.max())
    top, bottom = int(ys.min()), int(ys.max())
    subject_width = right - left + 1
    subject_height = bottom - top + 1
    head_size = int(min(subject_width * 0.48, subject_height * 0.31))
    head_size = max(head_size, 100)

    head_band = alpha[top : min(bottom + 1, top + int(subject_height * 0.42))] > 20
    band_y, band_x = np.where(head_band)
    center_x = int(left + subject_width / 2) if len(band_x) == 0 else int(np.median(band_x))
    return center_x - head_size // 2, top + int(head_size * 0.22), head_size, head_size


def crop_portrait(image: Image.Image, face: tuple[int, int, int, int]) -> Image.Image:
    x, y, w, h = face
    center_x = x + w * 0.5
    crop_height = h * 4.15
    crop_width = crop_height * OUTPUT_SIZE[0] / OUTPUT_SIZE[1]
    top = y - h * 0.72
    left = center_x - crop_width * 0.5

    canvas = Image.new("RGBA", (int(round(crop_width)), int(round(crop_height))), (0, 0, 0, 0))
    source_left = max(0, int(np.floor(left)))
    source_top = max(0, int(np.floor(top)))
    source_right = min(image.width, int(np.ceil(left + crop_width)))
    source_bottom = min(image.height, int(np.ceil(top + crop_height)))
    paste_x = source_left - int(np.floor(left))
    paste_y = source_top - int(np.floor(top))
    canvas.alpha_composite(
        image.crop((source_left, source_top, source_right, source_bottom)),
        (paste_x, paste_y),
    )
    return canvas.resize(OUTPUT_SIZE, Image.Resampling.LANCZOS)


def polish(image: Image.Image) -> Image.Image:
    alpha_array = np.asarray(image.getchannel("A"), dtype=np.float32)
    # The original cut-outs contain a very faint full-width floor fade. It is
    # invisible on black but becomes a rectangular veil in light mode. Remove
    # that low-confidence matte while retaining a short anti-aliased edge.
    alpha_array = np.clip((alpha_array - 96.0) * (255.0 / 159.0), 0, 255).astype(np.uint8)
    alpha = Image.fromarray(alpha_array, mode="L")
    rgb = image.convert("RGB")
    rgb = ImageEnhance.Contrast(rgb).enhance(1.08)
    rgb = ImageEnhance.Color(rgb).enhance(1.035)
    rgb = ImageEnhance.Sharpness(rgb).enhance(1.16)
    result = rgb.convert("RGBA")
    result.putalpha(alpha.filter(ImageFilter.GaussianBlur(0.18)))
    return result


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for output_index, source_index in enumerate(SOURCE_INDICES):
        source = SOURCE_DIR / f"view-{source_index:02d}.webp"
        image = Image.open(source).convert("RGBA")
        rgba = np.asarray(image)
        face = detect_face(rgba) or fallback_face(rgba[:, :, 3])
        if source_index in FACE_SIZE_OVERRIDES:
            x, y, w, h = face
            size = FACE_SIZE_OVERRIDES[source_index]
            center_x = x + w * 0.5
            center_y = y + h * 0.5
            face = (
                int(round(center_x - size * 0.5)),
                int(round(center_y - size * 0.5)),
                size,
                size,
            )
        portrait = polish(crop_portrait(image, face))
        output = OUTPUT_DIR / f"portrait-{output_index:02d}.webp"
        portrait.save(output, "WEBP", quality=90, method=6)
        print(f"{source.name} -> {output.name} face={face} bytes={output.stat().st_size}")


if __name__ == "__main__":
    main()

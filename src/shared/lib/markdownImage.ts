interface SizedImageUrl {
  src: string;
  widthPct: number;
}

export function parseSizedImageUrl(src: string): SizedImageUrl {
  const hashIndex = src.lastIndexOf("#");
  if (hashIndex === -1) {
    return { src, widthPct: 100 };
  }

  const fragment = src.slice(hashIndex + 1);
  if (!/^\d+$/.test(fragment)) {
    return { src, widthPct: 100 };
  }

  const widthPct = Number(fragment);
  if (widthPct < 1 || widthPct > 100) {
    return { src, widthPct: 100 };
  }

  return { src: src.slice(0, hashIndex), widthPct };
}

export function addImageSizeFragment(src: string, widthPct: number) {
  const parsed = parseSizedImageUrl(src);
  return widthPct < 100 ? `${parsed.src}#${widthPct}` : parsed.src;
}
